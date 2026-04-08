<script lang="ts">
  import { tick } from "svelte";

  type Suggestion = {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    short_description: string | null;
    category?: {
      name: string;
      slug: string;
    } | null;
  };

  type ChatMessage = {
    role: "user" | "assistant";
    text: string;
    recommendations?: Suggestion[];
  };

  let { canAddToCart = false } = $props<{ canAddToCart?: boolean }>();

  let open = $state(false);
  let input = $state("");
  let loading = $state(false);
  let cartLoadingByProductId = $state<Record<string, boolean>>({});
  let messagesContainer = $state<HTMLDivElement | null>(null);
  let messages = $state<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hola, soy tu asistente. Puedo recomendarte productos según lo que necesitas y tu presupuesto.",
    },
  ]);

  async function scrollToBottom() {
    await tick();
    if (!messagesContainer) return;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    input = "";
    messages = [...messages, { role: "user", text }];
    void scrollToBottom();
    loading = true;

    const historyPayload = messages
      .slice(-8)
      .map((message) => ({ role: message.role, text: message.text }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text, history: historyPayload }),
      });

      const payload = await response.json();

      if (!response.ok) {
        messages = [
          ...messages,
          {
            role: "assistant",
            text: payload?.error || "No pude responder en este momento.",
          },
        ];
        void scrollToBottom();
        return;
      }

      messages = [
        ...messages,
        {
          role: "assistant",
          text: payload.reply,
          recommendations: payload.recommendations,
        },
      ];
      void scrollToBottom();
    } catch {
      messages = [
        ...messages,
        {
          role: "assistant",
          text: "Hubo un error de conexión. Intenta nuevamente.",
        },
      ];
      void scrollToBottom();
    } finally {
      loading = false;
      void scrollToBottom();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  async function addToCart(productId: string) {
    if (cartLoadingByProductId[productId]) return;

    cartLoadingByProductId = { ...cartLoadingByProductId, [productId]: true };

    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      const payload = await response.json();

      if (!response.ok) {
        messages = [
          ...messages,
          {
            role: "assistant",
            text:
              payload?.error ||
              "No pude agregar el producto al carrito en este momento.",
          },
        ];
        void scrollToBottom();
        return;
      }

      messages = [
        ...messages,
        {
          role: "assistant",
          text: "Listo, agregué el producto al carrito.",
        },
      ];
      void scrollToBottom();
    } catch {
      messages = [
        ...messages,
        {
          role: "assistant",
          text: "Error de conexión al agregar al carrito.",
        },
      ];
      void scrollToBottom();
    } finally {
      cartLoadingByProductId = { ...cartLoadingByProductId, [productId]: false };
    }
  }

  $effect(() => {
    if (open) {
      void scrollToBottom();
    }
  });
</script>

<div class="fixed bottom-4 right-4 z-[60]">
  {#if open}
    <div class="card w-[22rem] max-w-[calc(100vw-2rem)] bg-base-100 shadow-2xl border border-base-300">
      <div class="card-body p-4 gap-3">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">Asistente de compra</h3>
          <button class="btn btn-xs btn-ghost" onclick={() => (open = false)}>Cerrar</button>
        </div>

        <div bind:this={messagesContainer} class="h-80 overflow-y-auto rounded-lg border border-base-300 p-3 space-y-3 bg-base-200/40">
          {#each messages as message}
            <div class={message.role === "user" ? "chat chat-end" : "chat chat-start"}>
              <div class={message.role === "user" ? "chat-bubble chat-bubble-primary" : "chat-bubble"}>
                {message.text}
              </div>
            </div>

            {#if message.recommendations && message.recommendations.length > 0}
              <div class="grid gap-2">
                {#each message.recommendations as item}
                  <div class="card bg-base-100 border border-base-300 hover:border-primary transition-colors">
                    <div class="card-body p-3">
                      <a href={`/productos/${item.slug}`} class="text-sm font-semibold link link-hover">
                        {item.name}
                      </a>
                      <div class="text-xs opacity-70">{item.category?.name || "Sin categoría"}</div>
                      <div class="text-xs mt-1">${item.price.toFixed(2)} | Stock: {item.stock}</div>
                      {#if canAddToCart}
                        <button
                          class="btn btn-xs btn-primary mt-2 w-fit"
                          onclick={() => addToCart(item.id)}
                          disabled={cartLoadingByProductId[item.id]}
                        >
                          {cartLoadingByProductId[item.id] ? "Agregando..." : "Agregar al carrito"}
                        </button>
                      {/if}
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          {/each}

          {#if loading}
            <div class="chat chat-start">
              <div class="chat-bubble">Pensando...</div>
            </div>
          {/if}
        </div>

        <div class="join w-full">
          <textarea
            class="textarea textarea-bordered join-item w-full min-h-12"
            placeholder="Ej: Quiero una GPU para gaming con presupuesto 400"
            bind:value={input}
            onkeydown={handleKeydown}
            disabled={loading}
          ></textarea>
          <button class="btn btn-primary join-item" onclick={sendMessage} disabled={loading || !input.trim()}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  {:else}
    <button class="btn btn-primary shadow-lg" onclick={() => (open = true)}>
      Chat
    </button>
  {/if}
</div>
