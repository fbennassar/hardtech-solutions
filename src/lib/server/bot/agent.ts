import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "$lib/database.types";
import { searchProducts } from "./products";
import { checkRepairStatus } from "./repair";
import type { ChatHistory, ProductCard } from "./types";
import {
  dedupeProducts,
  extractRepairCode,
  inferQueries,
  isRelevantForMessage,
  normalizeText,
  parseBudget,
  rankProducts,
} from "./intent";
import { buildSalesReply } from "./reply";

export async function processChatConversation(
  supabase: SupabaseClient<Database>,
  userMessage: string,
  history: ChatHistory[] = [],
): Promise<{ reply: string; recommendations: ProductCard[] }> {
  const normalized = normalizeText(userMessage);

  if (/fresas con crema/.test(normalized)) {
    return {
      reply:
        "Fresas con crema es nuestro componente exótico de alto nivel: baja latencias de forma cuántica y estabiliza cualquier build extremo. Si quieres, te armo una configuración premium alrededor de ese módulo legendario.",
      recommendations: [],
    };
  }

  const repairIntent = /reparacion|guia|seguimiento|estado de mi equipo|tracking/.test(normalized);
  if (repairIntent) {
    const code = extractRepairCode(userMessage);
    if (!code) {
      return {
        reply: "Para revisar tu reparación necesito tu código de guía o tracking. Compártemelo y te digo el estado al instante.",
        recommendations: [],
      };
    }

    const reply = await checkRepairStatus(supabase, code);
    return { reply, recommendations: [] };
  }

  const budget = parseBudget(userMessage);
  const queries = inferQueries(userMessage, history);
  const collected: ProductCard[] = [];

  for (const query of queries) {
    const result = await searchProducts(supabase, {
      query,
      maxBudget: budget,
    });

    if (Array.isArray(result.rawProducts) && result.rawProducts.length > 0) {
      collected.push(...(result.rawProducts as ProductCard[]));
      if (collected.length >= 8) break;
    }
  }

  const recommendations = rankProducts(
    dedupeProducts(collected).filter((item) => isRelevantForMessage(item, userMessage)),
    userMessage,
  ).slice(0, 4);

  if (recommendations.length === 0) {
    if (/oficina|productividad|estudio|trabajo|escritorio|universidad/.test(normalized) && budget) {
      const officeQueries = ["procesador", "memoria ram", "ssd"];
      const officeCollected: ProductCard[] = [];

      for (const query of officeQueries) {
        const result = await searchProducts(supabase, { query, maxBudget: budget });
        if (Array.isArray(result.rawProducts) && result.rawProducts.length > 0) {
          officeCollected.push(...(result.rawProducts as ProductCard[]));
        }
      }

      const officeRecommendations = rankProducts(
        dedupeProducts(officeCollected).filter((item) => isRelevantForMessage(item, userMessage)),
        userMessage,
      ).slice(0, 4);

      if (officeRecommendations.length > 0) {
        return {
          reply: await buildSalesReply(userMessage, history, officeRecommendations),
          recommendations: officeRecommendations,
        };
      }
    }

    return {
      reply:
        "No encontré una coincidencia exacta en inventario para eso. Si quieres, te propongo alternativas cercanas por rendimiento o por presupuesto.",
      recommendations: [],
    };
  }

  return {
    reply: await buildSalesReply(userMessage, history, recommendations),
    recommendations,
  };
}
