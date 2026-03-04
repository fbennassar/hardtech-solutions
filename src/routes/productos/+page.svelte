<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData, ActionData } from "./$types";

  let { data, form } = $props<{ data: PageData; form: ActionData }>();

  let isAuthModalOpen = $state(false);
  let loadingProductId = $state<string | null>(null);

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  function handleAddClick(
    e: MouseEvent,
    productStock: number,
    productId: string,
  ) {
    if (!data.session) {
      e.preventDefault();
      isAuthModalOpen = true;
      return;
    }

    if (productStock <= 0) {
      e.preventDefault();
      return;
    }

    loadingProductId = productId;
  }
</script>

<svelte:head>
  <title>Productos | HardTech Solutions</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="mb-8 text-center sm:text-left">
    <h1 class="text-4xl font-extrabold tracking-tight text-base-content">
      Nuestros <span class="text-primary">Productos</span>
    </h1>
    <p class="mt-2 text-lg text-base-content/80 max-w-2xl">
      Descubre nuestro catálogo de componentes de hardware al mejor precio.
    </p>
  </div>

  {#if data.categories && data.categories.length > 0}
    <div class="flex overflow-x-auto gap-2 pb-4 mb-4 hide-scrollbar snap-x">
      <a
        href="/productos"
        class="badge badge-success badge-lg whitespace-nowrap snap-start shrink-0 font-semibold"
      >
        Todos
      </a>
      {#each data.categories as cat}
        <a
          href="/categorias/{cat.slug}"
          class="badge badge-outline badge-lg whitespace-nowrap snap-start shrink-0 hover:badge-primary transition-colors cursor-pointer"
        >
          {cat.name}
        </a>
      {/each}
    </div>
  {/if}

  {#if form?.error}
    <div class="alert alert-error mb-8 shadow-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>Error: {form.error}</span>
    </div>
  {/if}

  {#if form?.success}
    <div class="toast toast-end toast-bottom z-50">
      <div class="alert alert-success shadow-lg">
        <span>¡Producto añadido al carrito!</span>
      </div>
    </div>
  {/if}

  {#if data.products.length === 0}
    <div
      class="text-center py-20 bg-base-200 rounded-box border border-base-300"
    >
      <h3 class="text-2xl font-bold mb-2">No hay productos disponibles</h3>
      <p class="text-base-content/70">
        Vuelve pronto para ver el nuevo inventario.
      </p>
    </div>
  {:else}
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      {#each data.products as product (product.id)}
        <div
          class="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
        >
          <figure class="px-4 pt-4 aspect-square bg-base-200/50">
            {#if product.images && product.images.length > 0}
              <img
                src={data.supabase.storage
                  .from("products")
                  .getPublicUrl(product.images[0]).data.publicUrl}
                alt={product.name}
                class="rounded-xl object-contain w-full h-full mix-blend-multiply dark:mix-blend-normal"
                loading="lazy"
              />
            {:else}
              <div
                class="bg-base-300 w-full h-full rounded-xl flex items-center justify-center text-sm font-medium text-base-content/50"
              >
                Sin imagen
              </div>
            {/if}
          </figure>
          <div class="card-body p-5 flex flex-col justify-between grow">
            <div>
              <div class="flex items-start justify-between gap-2 mb-2">
                <a
                  href="/productos/{product.slug}"
                  class="hover:text-primary transition-colors"
                >
                  <h2
                    class="card-title text-lg leading-tight line-clamp-2"
                    title={product.name}
                  >
                    {product.name}
                  </h2>
                </a>
              </div>

              {#if product.category}
                <a href="/categorias/{product.category.slug}">
                  <span
                    class="badge badge-outline badge-sm mb-3 hover:badge-primary transition-colors cursor-pointer"
                  >
                    {product.category.name}
                  </span>
                </a>
              {/if}

              <p class="text-xs text-base-content/70 line-clamp-2 mb-4">
                {product.short_description || "Sin descripción corta"}
              </p>
            </div>

            <div
              class="flex items-center justify-between mt-auto pt-4 border-t border-base-200/50"
            >
              <span class="text-xl font-bold text-success"
                >{formatCurrency(product.price)}</span
              >

              <form
                method="POST"
                action="?/addToCart"
                use:enhance={() => {
                  loadingProductId = product.id;
                  return async ({ update, result }) => {
                    await update({ reset: false });
                    loadingProductId = null;
                  };
                }}
              >
                <input type="hidden" name="product_id" value={product.id} />
                <input type="hidden" name="quantity" value="1" />
                <button
                  type="submit"
                  class="btn btn-success btn-sm btn-circle"
                  disabled={product.stock <= 0 ||
                    loadingProductId === product.id}
                  onclick={(e) => handleAddClick(e, product.stock, product.id)}
                  aria-label="Añadir al carrito"
                  title="Añadir al carrito"
                >
                  {#if loadingProductId === product.id}
                    <span class="loading loading-spinner loading-xs"></span>
                  {:else}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
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
                  {/if}
                </button>
              </form>
            </div>

            {#if product.stock <= 0}
              <span
                class="text-error text-xs font-semibold text-right mt-1 block"
                >Agotado</span
              >
            {:else if product.stock < 5}
              <span
                class="text-warning text-xs font-semibold text-right mt-1 block"
                >¡Últimas {product.stock} unidades!</span
              >
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- Modal require authentication -->
<dialog
  class="modal modal-bottom sm:modal-middle"
  class:modal-open={isAuthModalOpen}
>
  <div class="modal-box p-6 sm:p-8">
    <div class="flex flex-col items-center text-center">
      <div class="bg-warning/20 p-4 rounded-full mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-10 w-10 text-warning"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 class="font-bold text-2xl mb-2">¡Inicia sesión!</h3>
      <p class="py-4 text-base-content/80 text-lg">
        Debes tener una cuenta y estar logueado para añadir productos a tu
        carrito. ¡Regístrate ahora, toma solo 1 minuto!
      </p>
    </div>

    <div class="modal-action flex-col sm:flex-row gap-3 mt-6">
      <button
        class="btn btn-ghost w-full sm:w-auto order-last sm:order-first"
        onclick={() => (isAuthModalOpen = false)}>Cerrar</button
      >
      <a href="/auth/login" class="btn btn-outline w-full sm:w-auto">Ingresar</a
      >
      <a href="/auth/registro" class="btn btn-primary w-full sm:w-auto"
        >Registrarse</a
      >
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button onclick={() => (isAuthModalOpen = false)}>Cerrar</button>
  </form>
</dialog>
