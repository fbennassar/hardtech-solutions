import { env } from "$env/dynamic/private";

type ProductSuggestion = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  short_description: string | null;
  long_description?: string | null;
  metadata?: Record<string, unknown> | null;
  category?: {
    name: string;
    slug: string;
  } | null;
};

type RawProduct = Omit<ProductSuggestion, "category"> & {
  category?:
    | {
        name: string;
        slug: string;
      }
    | {
        name: string;
        slug: string;
      }[]
    | null;
};

const STOPWORDS = new Set([
  "hola",
  "quiero",
  "necesito",
  "busco",
  "para",
  "con",
  "por",
  "una",
  "uno",
  "unos",
  "unas",
  "the",
  "and",
  "que",
  "como",
  "de",
  "del",
  "la",
  "el",
  "los",
  "las",
  "un",
  "mi",
  "me",
  "ayuda",
  "favor",
  "recomienda",
  "recomendacion",
]);

type SearchIntent = {
  rawLabel: string;
  isServerLike: boolean;
  isPowerIntent: boolean;
  preferredTerms: string[];
  complementTerms: string[];
};

type ChatHistoryTurn = {
  role: "user" | "assistant";
  text: string;
};

type GuidedBuildContext = {
  enabled: boolean;
  usage: string | null;
  budget: number | null;
};

type ProductRole =
  | "cpu"
  | "motherboard"
  | "ram"
  | "storage"
  | "psu"
  | "case"
  | "gpu"
  | "peripheral"
  | "other";

function extractBudget(message: string): number | null {
  const budgetMatch = message.match(/(\d+[\.,]?\d*)/);
  if (!budgetMatch) return null;
  const normalized = budgetMatch[1].replace(",", ".");
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? value : null;
}

function tokenize(message: string): string[] {
  return message
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúñ\s]/gi, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3)
    .filter((token) => !STOPWORDS.has(token));
}

function detectIntent(message: string): SearchIntent {
  const normalized = message.toLowerCase();
  const isServerLike = /xeon|epyc|threadripper|servidor|server|workstation|rack|datacenter|hpc|ecc/.test(
    normalized,
  );
  const isPowerIntent = /potente|maximo|máximo|tope|gama alta|high end|alto rendimiento/.test(
    normalized,
  );

  if (isServerLike) {
    return {
      rawLabel: "servidor / workstation",
      isServerLike: true,
      isPowerIntent,
      preferredTerms: [
        "procesador",
        "cpu",
        "motherboard",
        "placa",
        "ram",
        "memoria",
        "ecc",
        "ssd",
        "nvme",
        "fuente",
        "gabinete",
        "workstation",
        "server",
      ],
      complementTerms: ["ram", "motherboard", "ssd", "fuente"],
    };
  }

  if (/gaming|juegos|fps|stream|video/.test(normalized)) {
    return {
      rawLabel: "gaming / alto rendimiento",
      isServerLike: false,
      isPowerIntent: true,
      preferredTerms: ["gpu", "video", "procesador", "ram", "ssd"],
      complementTerms: ["ram", "ssd", "fuente"],
    };
  }

  if (/oficina|estudio|trabajo|productividad/.test(normalized)) {
    return {
      rawLabel: "oficina / productividad",
      isServerLike: false,
      isPowerIntent,
      preferredTerms: ["cpu", "procesador", "ram", "ssd", "monitor"],
      complementTerms: ["ram", "ssd"],
    };
  }

  return {
    rawLabel: "general",
    isServerLike: false,
    isPowerIntent,
    preferredTerms: [],
    complementTerms: [],
  };
}

function extractUsage(text: string): string | null {
  const normalized = text.toLowerCase();

  if (/(virtualizacion|virtualización|proxmox|vmware|hyper-v|homelab|contenedores|docker|kubernetes)/.test(normalized)) {
    return "virtualización / homelab";
  }
  if (/(base de datos|database|postgres|mysql|sql|backend|api|servicios)/.test(normalized)) {
    return "servicios / base de datos";
  }
  if (/(render|3d|after effects|premiere|blender|edicion|edición|video)/.test(normalized)) {
    return "render / edición";
  }
  if (/(gaming|juegos|fps|stream)/.test(normalized)) {
    return "gaming";
  }
  if (/(oficina|estudio|universidad|productividad)/.test(normalized)) {
    return "oficina / productividad";
  }

  return null;
}

function extractBudgetFromText(text: string): number | null {
  const matches = [...text.matchAll(/(\d+[\.,]?\d*)/g)];
  if (matches.length === 0) return null;

  for (let i = matches.length - 1; i >= 0; i -= 1) {
    const raw = matches[i][1].replace(",", ".");
    const value = Number.parseFloat(raw);
    if (Number.isFinite(value) && value >= 50 && value <= 30000) {
      return value;
    }
  }

  return null;
}

function getGuidedBuildContext(
  message: string,
  history: ChatHistoryTurn[],
  intent: SearchIntent,
): GuidedBuildContext {
  const userMessages = history
    .filter((turn) => turn.role === "user")
    .map((turn) => turn.text);
  const corpus = [...userMessages, message].join(" ");
  const normalized = corpus.toLowerCase();

  const enabled = intent.isServerLike || /(armado|configuracion|configuración|build|arma|ensamble|equilibrado|calidad-precio)/.test(normalized);
  if (!enabled) {
    return { enabled: false, usage: null, budget: null };
  }

  return {
    enabled: true,
    usage: extractUsage(corpus),
    budget: extractBudgetFromText(corpus),
  };
}

function getUsageTerms(usage: string | null): string[] {
  if (!usage) return [];

  switch (usage) {
    case "virtualización / homelab":
      return ["cpu", "ram", "ecc", "nvme", "ssd", "motherboard"];
    case "servicios / base de datos":
      return ["cpu", "ram", "ssd", "nvme", "reliability"];
    case "render / edición":
      return ["cpu", "ram", "ssd", "gpu"];
    case "gaming":
      return ["gpu", "cpu", "ram", "ssd"];
    case "oficina / productividad":
      return ["cpu", "ram", "ssd"];
    default:
      return [];
  }
}

function determineRecommendationLimit(
  message: string,
  tokens: string[],
  budget: number | null,
  intent: SearchIntent,
): number {
  const normalized = message.toLowerCase();
  const specificKeywords = [
    "gpu",
    "tarjeta grafica",
    "grafica",
    "ram",
    "memoria",
    "ssd",
    "hdd",
    "cpu",
    "procesador",
    "motherboard",
    "placa",
    "fuente",
    "gabinete",
    "case",
    "monitor",
    "teclado",
    "mouse",
    "audifonos",
    "auriculares",
  ];

  const hasSpecificKeyword = specificKeywords.some((keyword) => normalized.includes(keyword));

  if (intent.isServerLike || budget !== null || hasSpecificKeyword || tokens.length <= 2) {
    return 1;
  }

  return 3;
}

function scoreProduct(
  product: ProductSuggestion,
  tokens: string[],
  budget: number | null,
  intent: SearchIntent,
  usage: string | null,
): number {
  const haystack = [
    product.name,
    product.short_description ?? "",
    product.long_description ?? "",
    product.category?.name ?? "",
    product.category?.slug ?? "",
    product.metadata ? JSON.stringify(product.metadata) : "",
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;

  for (const token of tokens) {
    if (haystack.includes(token)) score += 4;
  }

  for (const term of intent.preferredTerms) {
    if (haystack.includes(term)) score += intent.isServerLike ? 6 : 3;
  }

  for (const term of getUsageTerms(usage)) {
    if (haystack.includes(term)) score += 3;
  }

  if (intent.isServerLike) {
    if (/(ecc|workstation|server|rack|datacenter)/.test(haystack)) score += 8;
    if (/(procesador|cpu|motherboard|placa|ram|memoria|ssd|nvme|fuente|gabinete)/.test(haystack)) {
      score += 4;
    }
    if (/(gpu|video|grafica)/.test(haystack)) score -= 2;
  }

  if (budget !== null) {
    if (product.price <= budget) score += 3;
    else score -= 2;
  }

  // Preferencia simple: tener más stock para no recomendar productos al límite.
  if (product.stock >= 5) score += 1;

  return score;
}

function buildResponseText(
  message: string,
  recommendations: ProductSuggestion[],
  budget: number | null,
  intent: SearchIntent,
): string {
  const normalized = message.toLowerCase();

  if (/hola|buenas|hello/.test(normalized)) {
    return "Hola, te puedo recomendar componentes según tu uso y presupuesto. Cuéntame qué estás armando.";
  }

  if (recommendations.length === 0) {
    return "No encontré productos claros para esa búsqueda. Prueba con categoría (ej: GPU, RAM, SSD) y presupuesto aproximado.";
  }

  const budgetText = budget !== null ? ` dentro de un presupuesto cercano a $${budget}` : "";
  return `Te recomiendo estas opciones${budgetText}. Si quieres, te ayudo a elegir la mejor relación precio/rendimiento.`;
}

function buildComplementText(recommendations: ProductSuggestion[]): string {
  const complements = recommendations.slice(1, 3);
  if (complements.length === 0) return "";

  const names = complements.map((item) => item.name).join(", ");
  return `Complementos sugeridos: ${names}.`;
}

function inferProductRole(product: ProductSuggestion): ProductRole {
  const haystack = [
    product.name,
    product.short_description ?? "",
    product.long_description ?? "",
    product.category?.name ?? "",
    product.category?.slug ?? "",
    product.metadata ? JSON.stringify(product.metadata) : "",
  ]
    .join(" ")
    .toLowerCase();

  if (/(cpu|procesador|ryzen|intel core|threadripper|xeon|epyc)/.test(haystack)) return "cpu";
  if (/(motherboard|placa madre|mainboard|chipset)/.test(haystack)) return "motherboard";
  if (/(ram|memoria|ddr4|ddr5|ecc)/.test(haystack)) return "ram";
  if (/(ssd|nvme|hdd|m\.2|disco)/.test(haystack)) return "storage";
  if (/(fuente|power supply|psu|80\+|bronze|gold)/.test(haystack)) return "psu";
  if (/(gabinete|case|chasis)/.test(haystack)) return "case";
  if (/(gpu|rtx|radeon|tarjeta grafica|video)/.test(haystack)) return "gpu";
  if (/(teclado|mouse|audifono|auricular|monitor|periferico)/.test(haystack)) return "peripheral";
  return "other";
}

function isLikelyHardwareProduct(product: ProductSuggestion): boolean {
  const role = inferProductRole(product);
  if (role !== "other") return true;

  const haystack = [
    product.name,
    product.short_description ?? "",
    product.long_description ?? "",
    product.category?.name ?? "",
    product.category?.slug ?? "",
  ]
    .join(" ")
    .toLowerCase();

  if (/(fresas con crema|fresa con crema|fresas|crema)/.test(haystack)) {
    return true;
  }

  return /(pc|hardware|componente|computadora|ordenador|tecnologia|tecnología)/.test(
    haystack,
  );
}

function buildThreeBlockReply(
  mainRecommendation: ProductSuggestion | null,
  whyText: string,
  complements: ProductSuggestion[],
): string {
  const mainBlock = mainRecommendation
    ? `${mainRecommendation.name} (${mainRecommendation.category?.name ?? "Sin categoría"})`
    : "No hay una recomendación principal clara con el inventario actual.";

  const complementBlock = complements.length > 0
    ? complements.map((item) => item.name).join(", ")
    : "Sin complementos por ahora. Si quieres, te pregunto uso y presupuesto para afinar.";

  return [
    "Recomendación principal:",
    mainBlock,
    "",
    "Por qué:",
    whyText,
    "",
    "Complementos compatibles:",
    complementBlock,
  ].join("\n");
}

function getServerRoleWeight(role: ProductRole): number {
  switch (role) {
    case "cpu":
      return 10;
    case "motherboard":
      return 8;
    case "ram":
      return 6;
    case "storage":
      return 5;
    case "psu":
      return 4;
    case "case":
      return 3;
    case "gpu":
      return 1;
    case "peripheral":
      return -1;
    default:
      return 0;
  }
}

function getPowerRoleWeight(role: ProductRole): number {
  switch (role) {
    case "cpu":
      return 10;
    case "gpu":
      return 9;
    case "ram":
      return 6;
    case "storage":
      return 5;
    case "motherboard":
      return 4;
    case "psu":
      return 3;
    case "case":
      return 2;
    case "peripheral":
      return 1;
    default:
      return -3;
  }
}

function buildConversationContext(history: ChatHistoryTurn[]): string {
  if (history.length === 0) return "Sin historial previo.";
  return history
    .slice(-6)
    .map((turn) => `${turn.role === "user" ? "Usuario" : "Asistente"}: ${turn.text}`)
    .join("\n");
}

async function buildGroqResponse(
  message: string,
  recommendations: ProductSuggestion[],
  intent: SearchIntent,
  history: ChatHistoryTurn[],
): Promise<string | null> {
  const apiKey = env.GROQ_API_KEY;
  if (!apiKey) return null;

  const simplified = recommendations.map((item) => ({
    name: item.name,
    price: item.price,
    stock: item.stock,
    category: item.category?.name ?? "Sin categoría",
  }));
  const conversationContext = buildConversationContext(history);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "Eres un asesor de hardware de e-commerce. Responde en espanol conversacional (tono humano), maximo 3 frases. No inventes productos fuera de la lista entregada ni menciones modelos no listados. No digas que un producto es ideal para servidor si no esta etiquetado explicitamente como servidor/workstation.",
          },
          {
            role: "user",
            content: `Contexto reciente:\n${conversationContext}\n\nConsulta del cliente: ${message}\nIntencion detectada: ${intent.rawLabel}\n\nProductos sugeridos: ${JSON.stringify(simplified)}`,
          },
        ],
      }),
      signal: controller.signal,
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content?.trim();
    return content || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function toJson(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function isServerCatalogMatch(product: ProductSuggestion): boolean {
  const haystack = [
    product.name,
    product.short_description ?? "",
    product.long_description ?? "",
    product.category?.name ?? "",
    product.category?.slug ?? "",
    product.metadata ? JSON.stringify(product.metadata) : "",
  ]
    .join(" ")
    .toLowerCase();

  return /(xeon|epyc|threadripper|ecc|workstation|server|rack|datacenter)/.test(haystack);
}

export const POST = async ({
  request,
  locals: { supabase },
}: {
  request: Request;
  locals: App.Locals;
}) => {
  const body = await request.json().catch(() => null);
  const rawMessage = typeof body?.message === "string" ? body.message.trim() : "";
  const history: ChatHistoryTurn[] = Array.isArray(body?.history)
    ? body.history
        .filter((item: unknown) => typeof item === "object" && item !== null)
        .map((item: { role?: unknown; text?: unknown }) => ({
          role: item.role === "assistant" ? "assistant" : "user",
          text: typeof item.text === "string" ? item.text.trim() : "",
        }))
        .filter((item: ChatHistoryTurn) => item.text.length > 0)
        .slice(-8)
    : [];

  if (!rawMessage) {
    return toJson({ error: "El mensaje es requerido." }, 400);
  }

  const budget = extractBudget(rawMessage);
  const tokens = tokenize(rawMessage);
  const intent = detectIntent(rawMessage);
  const guided = getGuidedBuildContext(rawMessage, history, intent);

  if (guided.enabled && !guided.usage) {
    return toJson({
      reply:
        "Perfecto, para proponerte un armado guiado dime primero el uso principal: virtualización/homelab, base de datos/servicios, render/edición, gaming u oficina.",
      recommendations: [],
    });
  }

  if (guided.enabled && guided.budget === null) {
    return toJson({
      reply:
        "Buenísimo. Ahora dime tu presupuesto aproximado (en USD) y te propongo un armado equilibrado con lo más cercano disponible en inventario.",
      recommendations: [],
    });
  }

  const effectiveBudget = guided.budget ?? budget;

  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      price,
      stock,
      short_description,
      long_description,
      metadata,
      category:categories(name, slug)
    `,
    )
    .eq("is_active", true)
    .gt("stock", 0)
    .limit(80);

  if (error) {
    return toJson({ error: "No se pudieron obtener recomendaciones." }, 500);
  }

  const safeProducts: ProductSuggestion[] = ((products ?? []) as RawProduct[]).map(
    (product) => {
      const category = Array.isArray(product.category)
        ? (product.category[0] ?? null)
        : (product.category ?? null);

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        stock: product.stock,
        short_description: product.short_description,
        long_description: product.long_description,
        metadata: product.metadata,
        category,
      };
    },
  );

  const ranked = safeProducts
    .map((product) => ({
      product,
      score: scoreProduct(product, tokens, effectiveBudget, intent, guided.usage),
    }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((row) => row.product);

  const hasServerComponentsInCatalog = safeProducts.some((product) =>
    isServerCatalogMatch(product),
  );

  const fallback = [...safeProducts]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 4);

  const recommendationLimit = determineRecommendationLimit(rawMessage, tokens, effectiveBudget, intent);
  const baseSource = ranked.length > 0 ? ranked : fallback;
  const source = intent.isServerLike
    ? [...baseSource].sort((a, b) => {
        const roleDelta = getServerRoleWeight(inferProductRole(b)) - getServerRoleWeight(inferProductRole(a));
        if (roleDelta !== 0) return roleDelta;
        if (intent.isPowerIntent && b.price !== a.price) return b.price - a.price;
        return b.stock - a.stock;
      })
    : intent.isPowerIntent
      ? [...baseSource].sort((a, b) => {
          const roleDelta = getPowerRoleWeight(inferProductRole(b)) - getPowerRoleWeight(inferProductRole(a));
          if (roleDelta !== 0) return roleDelta;
          if (b.price !== a.price) return b.price - a.price;
          return b.stock - a.stock;
        })
    : baseSource;

  const recommendations = source.filter((item, index, array) => {
    if (!isLikelyHardwareProduct(item)) return false;
    const categoryKey = item.category?.slug ?? item.category?.name ?? item.id;
    return index === array.findIndex((candidate) => {
      const candidateKey = candidate.category?.slug ?? candidate.category?.name ?? candidate.id;
      return candidateKey === categoryKey;
    });
  }).slice(0, recommendationLimit);

  const companionSuggestions = source
    .filter((item) => isLikelyHardwareProduct(item))
    .filter((item) => item.id !== recommendations[0]?.id)
    .filter((item, index, array) => index === array.findIndex((candidate) => candidate.id === item.id))
    .sort((a, b) => {
      const aRole = inferProductRole(a);
      const bRole = inferProductRole(b);

      if (intent.isServerLike) {
        return getServerRoleWeight(bRole) - getServerRoleWeight(aRole);
      }

      return b.stock - a.stock;
    })
    .slice(0, 2);

  const mainRecommendations = recommendations.slice(0, 1);
  let baseReply = "";

  if (intent.isServerLike) {
    if (mainRecommendations.length === 0) {
      baseReply = "No tenemos componentes de servidor en inventario actualmente. Si quieres, te muestro alternativas de escritorio con mejor relación calidad-precio dentro de lo disponible.";
    } else if (!hasServerComponentsInCatalog) {
      const budgetText = effectiveBudget !== null ? ` dentro de un presupuesto cercano a $${effectiveBudget}` : "";
      baseReply = `Entiendo lo que buscas: hoy no tenemos componentes de servidor usados (Xeon/EPYC) en inventario. Lo más cercano para empezar un armado similar es ${mainRecommendations[0].name}${budgetText}.`;
    } else {
      baseReply = `Para un enfoque de servidor o workstation, la opción más cercana que tenemos es ${mainRecommendations[0].name}.`;
    }
    if (guided.usage) {
      baseReply = `${baseReply} Con el uso que indicaste (${guided.usage}), puedo afinarlo aún más si me dices prioridad entre rendimiento, consumo eléctrico o capacidad de expansión.`;
    } else {
      baseReply = `${baseReply} Si me dices el uso (virtualización, base de datos, render o homelab), te lo ajusto mejor.`;
    }
  } else {
    if (intent.isPowerIntent && mainRecommendations.length > 0) {
      const usageHint = guided.usage
        ? ` Según lo que comentaste (${guided.usage}), esta opción prioriza rendimiento.`
        : " Si me dices si lo quieres para gaming, render o productividad, te lo afino más.";
      baseReply = `Si buscas lo más potente disponible en nuestro inventario, te recomiendo empezar por ${mainRecommendations[0].name}.${usageHint}`;
    } else {
      const groqReply = await buildGroqResponse(rawMessage, mainRecommendations, intent, history);
      baseReply = groqReply ?? buildResponseText(rawMessage, mainRecommendations, effectiveBudget, intent);
    }
  }

  const reply = buildThreeBlockReply(
    mainRecommendations[0] ?? null,
    baseReply,
    companionSuggestions,
  );

  return toJson({
    reply,
    recommendations: mainRecommendations,
  });
};
