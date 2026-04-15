import { json } from "@sveltejs/kit";
import { processChatConversation } from "../../../lib/server/bot/agent";

export const POST = async ({ request, locals: { supabase } }: { request: Request, locals: App.Locals }) => {
  try {
    const body = await request.json().catch(() => null);
    const rawMessage = typeof body?.message === "string" ? body.message.trim() : "";
    const history = Array.isArray(body?.history) // keep history in simple format
      ? body.history
          .filter((item: any) => typeof item === "object" && item !== null)
          .map((item: any) => ({
            role: item.role === "assistant" ? "assistant" : "user",
            text: typeof item.text === "string" ? item.text.trim() : "",
          }))
          .filter((item: any) => item.text.length > 0)
          .slice(-8)
      : [];

    if (!rawMessage) {
      return json({ error: "El mensaje es requerido." }, { status: 400 });
    }

    // Agent processing utilizing tools seamlessly!
    const { reply, recommendations } = await processChatConversation(supabase, rawMessage, history);

    return json({
      reply,
      recommendations,
    });

  } catch (error) {
    console.error("Chat API Critical Error:", error);
    return json({ error: "Error procesando tu petición." }, { status: 500 });
  }
};