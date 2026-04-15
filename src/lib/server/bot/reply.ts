import { env } from "$env/dynamic/private";
import type { ChatHistory, ProductCard } from "./types";
import { fallbackReply } from "./intent";

const SALES_SYSTEM_PROMPT = `Eres asesor comercial de HardTech Solutions.
Responde SOLO en español, tono humano, claro y persuasivo sin exagerar.
Reglas:
- No inventes especificaciones ni precios.
- Si no hay producto exacto, ofrece alternativa real disponible.
- Si piden RAM suelta, no intentes vender laptops como sustituto.
- Mantén respuestas concisas (4-7 líneas).`;

export async function buildSalesReply(
  userMessage: string,
  history: ChatHistory[],
  products: ProductCard[],
): Promise<string> {
  const apiKey = env.GROQ_API_KEY;
  if (!apiKey) return fallbackReply(userMessage, products);

  const context = products.slice(0, 4).map((p) => ({
    name: p.name,
    price: p.price,
    stock: p.stock,
    category: p.category?.name ?? "Sin categoría",
  }));

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      messages: [
        { role: "system", content: SALES_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Historial reciente:\n${history
            .slice(-6)
            .map((h) => `${h.role}: ${h.text}`)
            .join("\n")}\n\nConsulta actual: ${userMessage}\n\nProductos disponibles para responder: ${JSON.stringify(context)}`,
        },
      ],
    }),
  });

  if (!response.ok) return fallbackReply(userMessage, products);

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return data.choices?.[0]?.message?.content?.trim() || fallbackReply(userMessage, products);
}
