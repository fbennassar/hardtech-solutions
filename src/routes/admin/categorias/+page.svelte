<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData, PageData } from "./$types";
  import type { Tables } from "$lib/database.types";

  let { data, form } = $props<{ data: PageData; form: ActionData }>();

  type Category = Tables<"categories">;

  let isModalOpen = $state(false);
  let isEditMode = $state(false);
  let loading = $state(false);

  // Form state
  let currentId = $state("");
  let currentName = $state("");
  let currentSlug = $state("");
  let currentDescription = $state("");
  let currentIsActive = $state(true);

  $effect(() => {
    // Auto-generate slug from name if in create mode and slug is empty
    if (!isEditMode && currentName && !currentSlug) {
      currentSlug = currentName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }
  });

  function openCreateModal() {
    isEditMode = false;
    currentId = "";
    currentName = "";
    currentSlug = "";
    currentDescription = "";
    currentIsActive = true;
    isModalOpen = true;
  }

  function openEditModal(category: Category) {
    isEditMode = true;
    currentId = category.id;
    currentName = category.name;
    currentSlug = category.slug;
    currentDescription = category.description || "";
    currentIsActive = category.is_active ?? true;
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
  }

  function formatDate(isoDate: string) {
    return new Date(isoDate).toLocaleString("es-VE", {
      timeZone: "America/Caracas",
    });
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">
      Gestión de <span class="text-primary">Categorías</span>
    </h1>
    <button onclick={openCreateModal} class="btn btn-primary">
      Nueva Categoría
    </button>
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
    class="overflow-x-auto bg-base-100 shadow-xl border border-base-200 rounded-box"
  >
    <table class="table w-full">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Slug</th>
          <th>Estado</th>
          <th>Creado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {#if data.categories.length === 0}
          <tr>
            <td colspan="5" class="text-center py-4 text-base-content/60">
              No hay categorías registradas.
            </td>
          </tr>
        {/if}
        {#each data.categories as category (category.id)}
          <tr class="hover">
            <td class="font-medium">{category.name}</td>
            <td
              ><span class="badge badge-ghost text-xs">{category.slug}</span
              ></td
            >
            <td>
              {#if category.is_active}
                <div class="badge badge-success gap-1">Activo</div>
              {:else}
                <div class="badge badge-error gap-1">Inactivo</div>
              {/if}
            </td>
            <td class="text-sm">{formatDate(category.created_at)}</td>
            <td>
              <div class="flex gap-2">
                <button
                  onclick={() => openEditModal(category)}
                  class="btn btn-sm btn-info btn-square"
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
                </button>
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
                  <input type="hidden" name="id" value={category.id} />
                  <button
                    type="submit"
                    class="btn btn-sm btn-error btn-square"
                    disabled={loading}
                    onclick={(e) => {
                      if (
                        !confirm(
                          "¿Estás seguro de que deseas eliminar esta categoría?",
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

<!-- Modal para Crear/Editar -->
<dialog
  class="modal modal-bottom sm:modal-middle"
  class:modal-open={isModalOpen}
>
  <div class="modal-box">
    <h3 class="font-bold text-lg mb-4">
      {isEditMode ? "Editar Categoría" : "Nueva Categoría"}
    </h3>
    <form
      method="POST"
      action={isEditMode ? "?/update" : "?/create"}
      use:enhance={() => {
        loading = true;
        return async ({ update, result }) => {
          await update();
          loading = false;
          if (result.type === "success") {
            closeModal();
          }
        };
      }}
    >
      <div class="form-control w-full mb-4">
        <label class="label" for="name">
          <span class="label-text">Nombre de la categoría</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Ej. Tarjetas Gráficas"
          bind:value={currentName}
          required
          disabled={loading}
          class="input input-bordered w-full"
        />
      </div>

      <div class="form-control w-full mb-4">
        <label class="label" for="slug">
          <span class="label-text">Slug (URL amigable)</span>
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          placeholder="tarjetas-graficas"
          bind:value={currentSlug}
          required
          disabled={loading}
          class="input input-bordered w-full"
        />
      </div>

      <div class="form-control w-full mb-4">
        <label class="label" for="description">
          <span class="label-text">Descripción</span>
        </label>
        <textarea
          id="description"
          name="description"
          class="textarea textarea-bordered h-24"
          placeholder="Breve descripción de la categoría..."
          bind:value={currentDescription}
          disabled={loading}
        ></textarea>
      </div>

      <div class="form-control w-full mb-6">
        <label class="label cursor-pointer justify-start gap-4">
          <input
            type="checkbox"
            name="is_active"
            value="true"
            class="toggle toggle-success"
            bind:checked={currentIsActive}
            disabled={loading}
          />
          <span class="label-text text-base"
            >La categoría está Activa visible al público</span
          >
        </label>
      </div>

      <div class="modal-action">
        {#if isEditMode}
          <input type="hidden" name="id" value={currentId} />
        {/if}
        <button
          type="button"
          class="btn"
          onclick={closeModal}
          disabled={loading}
        >
          Cancelar
        </button>
        <button type="submit" class="btn btn-primary" disabled={loading}>
          {#if loading}
            <span class="loading loading-spinner"></span>
          {/if}
          {isEditMode ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </form>
  </div>
</dialog>
