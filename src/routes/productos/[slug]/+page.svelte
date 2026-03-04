<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData, ActionData } from "./$types";

  let { data, form } = $props<{ data: PageData; form: ActionData }>();

  let isAuthModalOpen = $state(false);
  let isAddingToCart = $state(false);
  let quantity = $state(1);

  // Derive the active image to show in the main gallery view
  let activeImageIndex = $state(0);

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  function handleAddClick(e: MouseEvent) {
    if (!data.session) {
      e.preventDefault();
      isAuthModalOpen = true;
      return;
    }
    if (data.product.stock <= 0) {
      e.preventDefault();
      return;
    }
    isAddingToCart = true;
  }

  function incrementQuantity() {
    if (quantity < data.product.stock) quantity++;
  }

  function decrementQuantity() {
    if (quantity > 1) quantity--;
  }
</script>

<svelte:head>
  <title>{data.product.name} | HardTech Solutions</title>
  <meta
    name="description"
    content={data.product.short_description || data.product.name}
  />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="text-sm breadcrumbs mb-6 text-base-content/70">
    <ul>
      <li><a href="/">Inicio</a></li>
      <li><a href="/productos">Productos</a></li>
      {#if data.product.category}
        <li>
          <a href="/categorias/{data.product.category.slug}"
            >{data.product.category.name}</a
          >
        </li>
      {/if}
      <li class="font-medium text-base-content line-clamp-1">
        {data.product.name}
      </li>
    </ul>
  </div>

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
        <span>¡{quantity}x {data.product.name} añadido al carrito!</span>
      </div>
    </div>
  {/if}

  <div class="flex flex-col lg:flex-row gap-10">
    <!-- Image Gallery -->
    <div class="w-full lg:w-1/2 flex flex-col gap-4">
      <div
        class="aspect-square bg-base-200 rounded-3xl overflow-hidden border border-base-300 p-8 flex items-center justify-center relative"
      >
        {#if data.product.images && data.product.images.length > 0}
          <img
            src={data.supabase.storage
              .from("products")
              .getPublicUrl(data.product.images[activeImageIndex]).data
              .publicUrl}
            alt={data.product.name}
            class="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-all duration-300"
          />
        {:else}
          <div class="text-base-content/50 font-medium">
            Este producto no tiene imagen
          </div>
        {/if}

        {#if data.product.stock <= 0}
          <div
            class="absolute top-4 right-4 badge badge-error badge-lg font-bold shadow-sm"
          >
            AGOTADO
          </div>
        {/if}
      </div>

      <!-- Thumbnails -->
      {#if data.product.images && data.product.images.length > 1}
        <div class="flex gap-4 overflow-x-auto pb-2 snap-x">
          {#each data.product.images as image, index}
            <button
              class="w-20 h-20 shrink-0 rounded-xl bg-base-200 border-2 overflow-hidden snap-start transition-all {activeImageIndex ===
              index
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-base-300 hover:border-primary/50'}"
              onclick={() => (activeImageIndex = index)}
            >
              <img
                src={data.supabase.storage.from("products").getPublicUrl(image)
                  .data.publicUrl}
                alt="Thumbnail {index + 1}"
                class="w-full h-full object-contain p-2 mix-blend-multiply dark:mix-blend-normal"
              />
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Product Info -->
    <div class="w-full lg:w-1/2 flex flex-col">
      <div class="mb-2">
        {#if data.product.category}
          <a
            href="/categorias/{data.product.category.slug}"
            class="badge badge-primary badge-outline hover:bg-primary hover:text-primary-content transition-colors"
          >
            {data.product.category.name}
          </a>
        {/if}
        <span class="badge badge-ghost font-mono ml-2 text-xs"
          >SKU: {data.product.sku}</span
        >
      </div>

      <h1
        class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-base-content leading-tight mb-4"
      >
        {data.product.name}
      </h1>

      <p class="text-3xl font-bold text-success mb-6">
        {formatCurrency(data.product.price)}
      </p>

      <div class="divider mt-0"></div>

      <p class="text-base-content/80 text-lg mb-8 leading-relaxed">
        {data.product.long_description ||
          data.product.short_description ||
          "Sin descripción disponible para este producto."}
      </p>

      <div class="bg-base-200 p-6 rounded-2xl border border-base-300 mb-8">
        <div
          class="flex flex-col sm:flex-row gap-6 items-start sm:items-center"
        >
          <div class="flex-1">
            <h4 class="font-semibold text-base-content mb-1">Disponibilidad</h4>
            {#if data.product.stock > 10}
              <div class="flex items-center gap-2 text-success">
                <div
                  class="w-3 h-3 rounded-full bg-success animate-pulse"
                ></div>
                <span class="font-medium"
                  >En stock ({data.product.stock} disponibles)</span
                >
              </div>
            {:else if data.product.stock > 0}
              <div class="flex items-center gap-2 text-warning">
                <div class="w-3 h-3 rounded-full bg-warning"></div>
                <span class="font-medium"
                  >¡Últimas unidades! ({data.product.stock} disponibles)</span
                >
              </div>
            {:else}
              <div class="flex items-center gap-2 text-error">
                <div class="w-3 h-3 rounded-full bg-error"></div>
                <span class="font-medium">Agotado temporalmente</span>
              </div>
            {/if}
          </div>

          <form
            method="POST"
            action="?/addToCart"
            class="flex gap-4 w-full sm:w-auto mt-4 sm:mt-0"
            use:enhance={({ cancel }) => {
              if (!data.session) {
                cancel();
                isAuthModalOpen = true;
                return;
              }
              if (data.product.stock <= 0) {
                cancel();
                return;
              }
              isAddingToCart = true;
              return async ({ update, result }) => {
                await update({ reset: false });
                isAddingToCart = false;
                if (result.type === "success") {
                  quantity = 1;
                }
              };
            }}
          >
            <input type="hidden" name="product_id" value={data.product.id} />
            <input type="hidden" name="quantity" value={quantity} />

            <!-- Quantity Control -->
            <div
              class="join border border-base-300 rounded-xl bg-base-100 h-12"
            >
              <button
                type="button"
                class="btn btn-ghost join-item px-3 disabled:bg-transparent"
                disabled={quantity <= 1 || data.product.stock <= 0}
                onclick={decrementQuantity}
              >
                -
              </button>
              <div
                class="join-item flex items-center justify-center w-12 font-medium text-lg"
              >
                {quantity}
              </div>
              <button
                type="button"
                class="btn btn-ghost join-item px-3 disabled:bg-transparent"
                disabled={quantity >= data.product.stock ||
                  data.product.stock <= 0}
                onclick={incrementQuantity}
              >
                +
              </button>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="btn btn-success h-12 flex-1 sm:flex-none shadow-md"
              disabled={data.product.stock <= 0 || isAddingToCart}
            >
              {#if isAddingToCart}
                <span class="loading loading-spinner"></span>
                Añadiendo...
              {:else}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2"
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
                {data.product.stock <= 0 ? "Sin stock" : "Añadir al carrito"}
              {/if}
            </button>
          </form>
        </div>
      </div>

      <!-- Specifications or Metadata (Optional) -->
      <div class="mt-4">
        <h3 class="text-xl font-bold mb-4">Información adicional</h3>
        <div
          class="bg-base-100 rounded-xl border border-base-200 overflow-hidden"
        >
          <table class="table table-zebra w-full text-sm">
            <tbody>
              <tr>
                <td class="font-medium text-base-content/70 w-1/3">Categoría</td
                >
                <td>{data.product.category?.name || "No clasificado"}</td>
              </tr>
              <tr>
                <td class="font-medium text-base-content/70">Código (SKU)</td>
                <td class="font-mono">{data.product.sku}</td>
              </tr>
              <!-- Example rendering of arbitrary metadata from JSONB -->
              {#if data.product.metadata && typeof data.product.metadata === "object"}
                {#each Object.entries(data.product.metadata) as [key, value]}
                  <tr>
                    <td class="font-medium text-base-content/70 capitalize"
                      >{key.replace(/_/g, " ")}</td
                    >
                    <td>{value}</td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Related Products (if any) -->
  {#if data.relatedProducts && data.relatedProducts.length > 0}
    <div class="mt-24">
      <h2 class="text-2xl font-bold mb-8">Productos Relacionados</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        {#each data.relatedProducts as related}
          <a
            href="/productos/{related.slug}"
            class="card bg-base-100 border border-base-200 hover:shadow-lg transition-shadow"
          >
            <figure class="px-4 pt-4 aspect-square bg-base-200/30">
              {#if related.images && related.images.length > 0}
                <img
                  src={data.supabase.storage
                    .from("products")
                    .getPublicUrl(related.images[0]).data.publicUrl}
                  alt={related.name}
                  class="rounded-lg object-contain w-full h-full mix-blend-multiply dark:mix-blend-normal"
                />
              {:else}
                <div
                  class="bg-base-300 w-full h-full rounded-lg flex items-center justify-center text-xs text-base-content/50"
                >
                  Sin imagen
                </div>
              {/if}
            </figure>
            <div class="card-body p-4">
              <h3 class="card-title text-sm line-clamp-2" title={related.name}>
                {related.name}
              </h3>
              <p class="font-bold text-success">
                {formatCurrency(related.price)}
              </p>
            </div>
          </a>
        {/each}
      </div>
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
