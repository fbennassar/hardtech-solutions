<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData, PageData } from "./$types";

  let { data, form } = $props<{ data: PageData; form: ActionData }>();

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  let cartItems = $derived(data.cartItems || []);

  let subtotal = $derived(
    cartItems.reduce((acc: number, item: any) => {
      const product = Array.isArray(item.products)
        ? item.products[0]
        : item.products;
      return acc + item.quantity * (Number(product?.price) || 0);
    }, 0),
  );

  let itemCount = $derived(
    cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0),
  );

  let isLoading = $state<string | null>(null);
</script>

<svelte:head>
  <title>Mi Carrito | HardTech Solutions</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-extrabold tracking-tight mb-8">
    Tu <span class="text-primary">Carrito</span>
  </h1>

  {#if form?.error}
    <div class="alert alert-error mb-6 shadow-sm">
      <span>Error: {form.error}</span>
    </div>
  {/if}

  {#if cartItems.length === 0}
    <div
      class="text-center py-20 bg-base-200 rounded-box border border-base-300"
    >
      <div class="bg-base-300/50 p-6 rounded-full inline-block mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 text-base-content/50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
      <h3 class="text-2xl font-bold mb-2">Tu carrito está vacío</h3>
      <p class="text-base-content/70 mb-6">
        Parece que aún no has agregado nada.
      </p>
      <a href="/productos" class="btn btn-primary">Ver Productos</a>
    </div>
  {:else}
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Cart Items List -->
      <div class="flex-grow space-y-4">
        {#each cartItems as item (item.id)}
          {@const product = Array.isArray(item.products)
            ? item.products[0]
            : item.products}
          {@const productPrice = Number(product?.price) || 0}
          <div
            class="card sm:card-side bg-base-100 shadow-md border border-base-200 p-4 gap-4 items-center sm:items-stretch"
          >
            <figure class="w-32 h-32 bg-base-200 rounded-xl shrink-0">
              {#if product?.images && product.images.length > 0}
                <img
                  src={data.supabase.storage
                    .from("products")
                    .getPublicUrl(product.images[0]).data.publicUrl}
                  alt={product.name}
                  class="object-contain w-full h-full mix-blend-multiply dark:mix-blend-normal"
                />
              {:else}
                <span class="text-xs text-base-content/50">Sin imagen</span>
              {/if}
            </figure>

            <div
              class="flex-grow flex flex-col justify-between w-full sm:w-auto text-center sm:text-left"
            >
              <div>
                <a
                  href="/productos/{product?.slug}"
                  class="hover:text-primary transition-colors"
                >
                  <h2 class="card-title text-lg leading-tight mb-1">
                    {product?.name}
                  </h2>
                </a>
                <p class="text-success font-bold text-lg">
                  {formatCurrency(productPrice)}
                </p>
              </div>

              <div
                class="flex items-center justify-between sm:justify-start gap-4 mt-4 w-full"
              >
                <!-- Quantity Controls -->
                <div class="join border border-base-300 rounded-xl">
                  <form
                    method="POST"
                    action="?/updateQuantity"
                    use:enhance={() => {
                      isLoading = `dec-${item.id}`;
                      return async ({ update }) => {
                        await update({ reset: false });
                        isLoading = null;
                      };
                    }}
                  >
                    <input type="hidden" name="cartItemId" value={item.id} />
                    <input type="hidden" name="action" value="decrement" />
                    <button
                      type="submit"
                      class="btn btn-sm join-item bg-base-100 hover:bg-base-200"
                      disabled={item.quantity <= 1 || isLoading !== null}
                      aria-label="Reducir cantidad"
                    >
                      -
                    </button>
                  </form>

                  <div
                    class="btn btn-sm join-item bg-base-100 no-animation w-12 cursor-default pointer-events-none"
                  >
                    {item.quantity}
                  </div>

                  <form
                    method="POST"
                    action="?/updateQuantity"
                    use:enhance={() => {
                      isLoading = `inc-${item.id}`;
                      return async ({ update }) => {
                        await update({ reset: false });
                        isLoading = null;
                      };
                    }}
                  >
                    <input type="hidden" name="cartItemId" value={item.id} />
                    <input type="hidden" name="action" value="increment" />
                    <button
                      type="submit"
                      class="btn btn-sm join-item bg-base-100 hover:bg-base-200"
                      disabled={(product
                        ? item.quantity >= product.stock
                        : false) || isLoading !== null}
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </form>
                </div>

                <!-- Remove Button -->
                <form
                  method="POST"
                  action="?/removeItem"
                  use:enhance={() => {
                    isLoading = `rem-${item.id}`;
                    return async ({ update }) => {
                      await update({ reset: false });
                      isLoading = null;
                    };
                  }}
                >
                  <input type="hidden" name="cartItemId" value={item.id} />
                  <button
                    type="submit"
                    class="btn btn-ghost btn-circle text-error ml-auto"
                    disabled={isLoading !== null}
                    title="Eliminar producto"
                    aria-label="Eliminar del carrito"
                  >
                    {#if isLoading === `rem-${item.id}`}
                      <span class="loading loading-spinner loading-sm"></span>
                    {:else}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        ><path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        /></svg
                      >
                    {/if}
                  </button>
                </form>
              </div>
            </div>

            <!-- Per item total -->
            <div
              class="hidden sm:flex flex-col items-end justify-center ml-auto font-semibold min-w-[100px]"
            >
              <span class="text-sm text-base-content/60 mb-1">Total</span>
              {formatCurrency(productPrice * item.quantity)}
            </div>
          </div>
        {/each}
      </div>

      <!-- Checkout Summary Sidebar -->
      <div class="lg:w-80 shrink-0">
        <div
          class="card bg-base-100 shadow-xl border border-base-200 sticky top-24"
        >
          <div class="card-body">
            <h2 class="card-title text-xl mb-4">Resumen de compra</h2>

            <div class="flex justify-between mb-2">
              <span class="text-base-content/70">Productos ({itemCount})</span>
              <span class="font-medium">{formatCurrency(subtotal)}</span>
            </div>

            <div class="flex justify-between mb-4">
              <span class="text-base-content/70">Costo de envío</span>
              <span class="font-medium">Calculado en el checkout</span>
            </div>

            <div class="divider my-2"></div>

            <div class="flex justify-between items-center mb-6">
              <span class="font-bold text-lg">Subtotal</span>
              <span class="font-bold text-xl text-primary"
                >{formatCurrency(subtotal)}</span
              >
            </div>

            <button class="btn btn-primary w-full"> Proceder al Pago </button>
            <a href="/productos" class="btn btn-ghost w-full mt-2 text-sm">
              Seguir comprando
            </a>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
