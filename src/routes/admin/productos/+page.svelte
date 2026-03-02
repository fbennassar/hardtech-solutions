<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData, PageData } from "./$types";
  import { ExternalLink } from "lucide-svelte";

  let { data, form } = $props<{ data: PageData; form: ActionData }>();

  let loading = $state(false);

  function formatDate(isoDate: string) {
    return new Date(isoDate).toLocaleString("es-VE", {
      timeZone: "America/Caracas",
    });
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">
      Gestión de <span class="text-primary">Productos</span>
    </h1>
    <a href="/admin/productos/crear" class="btn btn-success">
      Nuevo Producto
    </a>
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

  {#if form?.success}
    <div class="alert alert-success mb-4">
      <span>¡Operación realizada con éxito!</span>
    </div>
  {/if}

  <div
    class="overflow-x-auto bg-base-300 shadow-xl border border-base-200 rounded-box"
  >
    <table class="table w-full">
      <thead>
        <tr>
          <th>Imagen</th>
          <th>SKU</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {#if data.products.length === 0}
          <tr>
            <td colspan="8" class="text-center py-4 text-base-content/60">
              No hay productos registrados. <a
                href="/admin/productos/crear"
                class="link link-primary">Crea el primero</a
              >.
            </td>
          </tr>
        {/if}
        {#each data.products as product (product.id)}
          <tr class="hover">
            <td>
              <div class="avatar">
                <div class="w-12 h-12 rounded">
                  <!-- Assuming product.images is an array of strings indicating paths -->
                  {#if product.images && Array.isArray(product.images) && product.images.length > 0}
                    <img
                      src={data.supabase.storage
                        .from("products")
                        .getPublicUrl(product.images[0]).data.publicUrl}
                      alt={product.name}
                      class="object-cover"
                    />
                  {:else}
                    <div
                      class="bg-base-300 w-full h-full flex items-center justify-center text-xs"
                    >
                      Sin img
                    </div>
                  {/if}
                </div>
              </div>
            </td>
            <td
              ><span class="badge badge-outline badge-sm font-mono"
                >{product.sku}</span
              ></td
            >
            <td class="font-medium max-w-xs truncate" title={product.name}
              >{product.name}</td
            >
            <td
              ><span class="badge badge-info badge-sm"
                >{product.category?.name || "N/A"}</span
              ></td
            >
            <td class="font-semibold text-success"
              >{formatCurrency(product.price)}</td
            >
            <td>
              <div
                class="badge {product.stock > 10
                  ? 'badge-neutral'
                  : product.stock > 0
                    ? 'badge-warning'
                    : 'badge-error'}"
              >
                {product.stock}
              </div>
            </td>
            <td>
              {#if product.is_active}
                <div class="badge badge-success gap-1">Activo</div>
              {:else}
                <div class="badge badge-error gap-1">Inactivo</div>
              {/if}
            </td>
            <td>
              <div class="flex gap-2">
                <a
                  href="/admin/productos/{product.id}/editar"
                  class="btn btn-sm btn-info btn-square"
                  title="Editar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    ><path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    /></svg
                  >
                </a>
                <form
                  method="POST"
                  action="?/delete"
                  use:enhance={() => {
                    loading = true;
                    return async ({ update }) => {
                      await update();
                      loading = false;
                    };
                  }}
                >
                  <input type="hidden" name="id" value={product.id} />
                  <button
                    type="submit"
                    class="btn btn-sm btn-error btn-square"
                    disabled={loading}
                    title="Eliminar"
                    onclick={(e) => {
                      if (
                        !confirm(
                          `¿Estás seguro de que deseas eliminar "${product.name}"?`,
                        )
                      ) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
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
                  </button>
                </form>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
