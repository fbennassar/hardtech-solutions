<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData, PageData } from "./$types";

  let { data, form } = $props<{ data: PageData; form: ActionData }>();

  let loading = $state(false);

  let product = data.product;

  let currentName = $state(product.name);
  let currentSlug = $state(product.slug);
  let currentSku = $state(product.sku);
  let currentPrice = $state(product.price);
  let currentStock = $state(product.stock);
  let currentCategoryId = $state(product.category_id || "");
  let currentIsActive = $state(product.is_active ?? true);
  let currentShortDescription = $state(product.short_description || "");
  let currentLongDescription = $state(product.long_description || "");
</script>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  <div class="flex items-center gap-4 mb-6">
    <a href="/admin/productos" class="btn btn-ghost btn-circle">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        /></svg
      >
    </a>
    <h1 class="text-3xl font-bold">
      Editar <span class="text-primary">Producto</span>
    </h1>
  </div>

  {#if form?.error}
    <div class="alert alert-error mb-4">
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

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="md:col-span-2">
      <form
        method="POST"
        action="?/update"
        enctype="multipart/form-data"
        class="bg-base-300 p-6 rounded-box shadow-xl border border-base-200"
        use:enhance={() => {
          loading = true;
          return async ({ update }) => {
            await update();
            loading = false;
          };
        }}
      >
        <div class="flex flex-col gap-4">
          <h2 class="text-xl font-semibold border-b pb-2">
            Información Básica
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control w-full">
              <label class="label" for="name"
                ><span class="label-text">Nombre del producto *</span></label
              >
              <input
                type="text"
                id="name"
                name="name"
                bind:value={currentName}
                required
                disabled={loading}
                class="input input-bordered w-full"
              />
            </div>

            <div class="form-control w-full">
              <label class="label" for="slug"
                ><span class="label-text">Slug (URL) *</span></label
              >
              <input
                type="text"
                id="slug"
                name="slug"
                bind:value={currentSlug}
                required
                disabled={loading}
                class="input input-bordered w-full font-mono text-sm"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control w-full">
              <label class="label" for="sku"
                ><span class="label-text">SKU *</span></label
              >
              <input
                type="text"
                id="sku"
                name="sku"
                bind:value={currentSku}
                required
                disabled={loading}
                class="input input-bordered w-full font-mono uppercase"
              />
            </div>

            <div class="form-control w-full">
              <label class="label" for="category_id"
                ><span class="label-text">Categoría</span></label
              >
              <select
                id="category_id"
                name="category_id"
                bind:value={currentCategoryId}
                disabled={loading}
                class="select select-bordered w-full"
              >
                <option value="" disabled>Selecciona una categoría</option>
                {#each data.categories as category}
                  <option value={category.id}>{category.name}</option>
                {/each}
              </select>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-4 mt-6">
          <h2 class="text-xl font-semibold border-b pb-2">
            Inventario y Multimedia
          </h2>

          <div class="grid grid-cols-2 gap-4">
            <div class="form-control w-full">
              <label class="label" for="price"
                ><span class="label-text">Precio (USD) *</span></label
              >
              <input
                type="number"
                id="price"
                name="price"
                bind:value={currentPrice}
                step="0.01"
                min="0"
                required
                disabled={loading}
                class="input input-bordered w-full"
              />
            </div>

            <div class="form-control w-full">
              <label class="label" for="stock"
                ><span class="label-text">Stock Actual *</span></label
              >
              <input
                type="number"
                id="stock"
                name="stock"
                bind:value={currentStock}
                min="0"
                required
                disabled={loading}
                class="input input-bordered w-full"
              />
            </div>
          </div>

          <div class="form-control w-full">
            <label class="label" for="images"
              ><span class="label-text">Añadir Nuevas Imágenes</span></label
            >
            <input
              type="file"
              id="images"
              name="images"
              accept="image/*"
              multiple
              disabled={loading}
              class="file-input file-input-bordered file-input-success w-full"
            />
            <label class="label" for="images"
              ><span class="label-text-alt text-base-content/60"
                >Puedes seleccionar múltiples imágenes. Se añadirán a las
                existentes.</span
              ></label
            >
          </div>

          <div class="form-control w-full mt-2">
            <label
              class="label cursor-pointer justify-start gap-4 p-4 bg-base-200 rounded-lg"
            >
              <input
                type="checkbox"
                name="is_active"
                value="true"
                class="toggle toggle-success"
                bind:checked={currentIsActive}
                disabled={loading}
              />
              <div>
                <span class="label-text font-bold block">Producto Activo</span>
                <span class="label-text-alt block"
                  >Visible en la tienda pública</span
                >
              </div>
            </label>
          </div>
        </div>

        <div class="mt-6 flex flex-col gap-4">
          <h2 class="text-xl font-semibold border-b pb-2">Descripciones</h2>

          <div class="form-control w-full">
            <label class="label" for="short_description"
              ><span class="label-text">Descripción Corta</span></label
            >
            <textarea
              id="short_description"
              name="short_description"
              bind:value={currentShortDescription}
              class="textarea textarea-bordered h-20"
              disabled={loading}
            ></textarea>
          </div>

          <div class="form-control w-full">
            <label class="label" for="long_description"
              ><span class="label-text">Descripción Completa</span></label
            >
            <textarea
              id="long_description"
              name="long_description"
              bind:value={currentLongDescription}
              class="textarea textarea-bordered h-40"
              disabled={loading}
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-8">
          <a href="/admin/productos" class="btn" class:btn-disabled={loading}
            >Cancelar</a
          >
          <button type="submit" class="btn btn-success" disabled={loading}>
            {#if loading}
              <span class="loading loading-spinner"></span>
            {/if}
            Actualizar Producto
          </button>
        </div>
      </form>
    </div>

    <!-- Panel lateral de imágenes actuales -->
    <div class="md:col-span-1">
      <div
        class="bg-base-100 p-6 rounded-box shadow-xl border border-base-200 sticky top-4"
      >
        <h2 class="text-xl font-semibold border-b pb-2 mb-4">
          Imágenes Actuales
        </h2>
        {#if !product.images || !Array.isArray(product.images) || product.images.length === 0}
          <p class="text-sm text-base-content/60 italic text-center py-8">
            Este producto no tiene imágenes.
          </p>
        {:else}
          <div class="grid grid-cols-2 lg:grid-cols-1 gap-4">
            {#each product.images as imgPath}
              <div
                class="relative group rounded-lg overflow-hidden border border-base-200 aspect-square"
              >
                <img
                  src={data.supabase.storage
                    .from("products")
                    .getPublicUrl(imgPath).data.publicUrl}
                  alt="Product img"
                  class="w-full h-full object-cover"
                />

                <div
                  class="absolute inset-0 bg-base-300/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <form
                    method="POST"
                    action="?/deleteImage"
                    use:enhance={() => {
                      loading = true;
                      return async ({ update }) => {
                        await update();
                        loading = false;
                      };
                    }}
                  >
                    <input type="hidden" name="imagePath" value={imgPath} />
                    <button
                      type="submit"
                      class="btn btn-error btn-sm"
                      disabled={loading}
                      onclick={(e) => {
                        if (
                          !confirm("¿Eliminar esta imagen de forma permanente?")
                        )
                          e.preventDefault();
                      }}>Eliminar</button
                    >
                  </form>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
