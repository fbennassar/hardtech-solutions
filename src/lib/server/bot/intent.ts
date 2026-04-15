import type { ChatHistory, ProductCard } from "./types";

export function normalizeText(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function parseBudget(text: string): number | undefined {
  const match = text.match(/\b(\d{2,6})\b/);
  if (!match) return undefined;

  const value = Number(match[1]);
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

export function extractRepairCode(message: string): string | null {
  const candidates = message.match(/\b[A-Z0-9]{2,}(?:-[A-Z0-9]{2,})*\b/gi);
  if (!candidates || candidates.length === 0) return null;

  const best = candidates.sort((a, b) => b.length - a.length)[0];
  return best ?? null;
}

export function inferQueries(message: string, history: ChatHistory[]): string[] {
  const normalized = normalizeText(`${history.map((h) => h.text).join(" ")} ${message}`);
  const wantsRam = /\bram\b|memoria|ddr4|ddr5/.test(normalized);
  const wantsBoard = /motherboard|placa|placa madre|tarjeta madre|mainboard/.test(normalized);
  const wantsCpu = /\bcpu\b|procesador|proce|ryzen|intel|core i|xeon|epyc/.test(normalized);
  const wantsServer = /servidor|server|workstation|homelab|virtualizacion/.test(normalized);
  const wantsOffice = /oficina|productividad|estudio|trabajo|escritorio|universidad/.test(normalized);
  const wantsPower = /potente|gama alta|alto rendimiento|maximo|tope/.test(normalized);

  if (wantsRam) return ["memoria ram ddr5", "memoria ram ddr4", "ram"];
  if (wantsBoard && /ryzen|amd|am4|am5/.test(normalized)) return ["motherboard am5", "motherboard am4", "placa madre amd"];
  if (wantsBoard) return ["motherboard", "placa madre"];
  if (wantsCpu && wantsPower) return ["ryzen 9", "core i9", "threadripper", "procesador"];
  if (wantsCpu) return ["procesador", "ryzen", "intel core"];
  if (wantsServer) return ["xeon", "epyc", "workstation", "ryzen 9"];
  if (wantsOffice) return ["procesador", "memoria ram", "ssd"];

  return [message.trim()];
}

export function isLaptop(product: ProductCard): boolean {
  const text = normalizeText(`${product.name} ${product.short_description ?? ""} ${product.category?.name ?? ""}`);
  return /laptop|portatil|notebook/.test(text) || product.category?.slug === "laptops";
}

export function isRelevantForMessage(product: ProductCard, message: string): boolean {
  const normalized = normalizeText(message);
  const haystack = normalizeText(`${product.name} ${product.short_description ?? ""} ${product.category?.name ?? ""} ${product.category?.slug ?? ""}`);

  if (/\bram\b|memoria|ddr4|ddr5/.test(normalized)) {
    const looksLikeRam = /\bram\b|memoria|ddr4|ddr5/.test(haystack) || /memoria ram|ddr4|ddr5/.test(product.name.toLowerCase());
    const looksLikeGpuMemoryOnly = /geforce|radeon|rtx|gtx|graphics|grafica|tarjetas graficas/.test(haystack);
    return looksLikeRam && !looksLikeGpuMemoryOnly && !isLaptop(product);
  }

  if (/motherboard|placa|placa madre|tarjeta madre|mainboard/.test(normalized)) {
    return /motherboard|placa|chipset|mainboard/.test(haystack) && !isLaptop(product);
  }

  if (/\bcpu\b|procesador|proce|ryzen|intel|core i|xeon|epyc/.test(normalized)) {
    return /\bcpu\b|procesador|ryzen|intel|core i|xeon|epyc|threadripper/.test(haystack) && !isLaptop(product);
  }

  if (/oficina|productividad|estudio|trabajo|escritorio|universidad/.test(normalized)) {
    return /procesador|cpu|ram|memoria|ssd|almacenamiento/.test(haystack) && !isLaptop(product);
  }

  return true;
}

export function dedupeProducts(products: ProductCard[]): ProductCard[] {
  return Array.from(new Map(products.map((item) => [item.id, item])).values());
}

export function rankProducts(products: ProductCard[], message: string): ProductCard[] {
  const normalized = normalizeText(message);

  return [...products].sort((a, b) => {
    const aText = normalizeText(`${a.name} ${a.short_description ?? ""} ${a.category?.name ?? ""}`);
    const bText = normalizeText(`${b.name} ${b.short_description ?? ""} ${b.category?.name ?? ""}`);

    let scoreA = 0;
    let scoreB = 0;

    if (/\bram\b|memoria|ddr4|ddr5/.test(normalized)) {
      if (/\bram\b|memoria|ddr4|ddr5/.test(aText)) scoreA += 10;
      if (/\bram\b|memoria|ddr4|ddr5/.test(bText)) scoreB += 10;
      if (/geforce|radeon|rtx|gtx|graphics|grafica|tarjetas graficas/.test(aText)) scoreA -= 8;
      if (/geforce|radeon|rtx|gtx|graphics|grafica|tarjetas graficas/.test(bText)) scoreB -= 8;
    }

    if (/oficina|productividad|estudio|trabajo|escritorio|universidad/.test(normalized)) {
      if (/procesador|cpu/.test(aText)) scoreA += 6;
      if (/procesador|cpu/.test(bText)) scoreB += 6;
      if (/ram|memoria/.test(aText)) scoreA += 4;
      if (/ram|memoria/.test(bText)) scoreB += 4;
      if (/ssd|almacenamiento/.test(aText)) scoreA += 4;
      if (/ssd|almacenamiento/.test(bText)) scoreB += 4;
    }

    if (/potente|gama alta|alto rendimiento|maximo|tope/.test(normalized)) {
      scoreA += a.price;
      scoreB += b.price;
    }

    scoreA += Math.min(a.stock, 25);
    scoreB += Math.min(b.stock, 25);

    if (scoreA !== scoreB) return scoreB - scoreA;

    return b.price - a.price;
  });
}

export function fallbackReply(message: string, products: ProductCard[]): string {
  if (products.length === 0) {
    return "No encontré una coincidencia exacta en inventario ahora mismo. Si quieres, te propongo una alternativa por presupuesto o por uso.";
  }

  const top = products[0];
  const extras = products.slice(1, 3).map((p) => p.name).join(", ");
  const complement = extras ? ` Complementos que también te podrían servir: ${extras}.` : "";

  return `Te recomiendo ${top.name} por rendimiento y disponibilidad (stock: ${top.stock}, precio: $${top.price}).${complement}`;
}
