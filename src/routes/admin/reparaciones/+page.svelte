<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData, PageData } from "./$types";
  import type { Tables } from "$lib/database.types";
  import { Wrench, Search } from "lucide-svelte";

  let { data, form } = $props<{ data: PageData; form: ActionData }>();

  type Repair = Tables<"repairs">;

  let isModalOpen = $state(false);
  let isEditMode = $state(false);
  let loading = $state(false);
  let hasAccount = $state(false);

  // Form state
  let currentId = $state("");
  let trackingCode = $state("");
  let clientName = $state("");
  let clientEmail = $state("");
  let clientPhone = $state("");
  let deviceType = $state("");
  let issues = $state("");
  let status = $state<'diagnostico' | 'en_progreso' | 'lista_retirar' | 'retirada'>("diagnostico");
  let totalCost = $state(0);

  let customers = $derived(data.customers || []);
  let selectedUser = $derived(
    customers.find((c: any) => c.email.toLowerCase() === clientEmail.toLowerCase().trim())
  );

  $effect(() => {
    if (!isEditMode && hasAccount && selectedUser) {
      if (selectedUser.account_type === "business" && selectedUser.companies) {
        const company = Array.isArray(selectedUser.companies) ? selectedUser.companies[0] : selectedUser.companies;
        clientName = company?.company_name || selectedUser.full_name;
        clientPhone = company?.business_phone || selectedUser.phone || "";
      } else {
        clientName = selectedUser.full_name;
        clientPhone = selectedUser.phone || "";
      }
    }
  });

  function openCreateModal() {
    isEditMode = false;
    currentId = "";
    trackingCode = "";
    clientName = "";
    clientEmail = "";
    clientPhone = "";
    deviceType = "";
    issues = "";
    status = "diagnostico";
    totalCost = 0;
    hasAccount = false;
    isModalOpen = true;
  }

  function openEditModal(repair: Repair) {
    isEditMode = true;
    currentId = repair.id;
    trackingCode = repair.tracking_code;
    clientName = repair.client_name;
    clientEmail = repair.client_email || "";
    clientPhone = repair.client_phone || "";
    deviceType = repair.device_type;
    issues = repair.issues;
    status = repair.status;
    totalCost = Number(repair.total_cost);
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

  const statusMap: Record<string, string> = {
    'diagnostico': 'Diagnóstico',
    'en_progreso': 'En Progreso',
    'lista_retirar': 'Lista para Retirar',
    'retirada': 'Retirada'
  };

  const statusBadge: Record<string, string> = {
    'diagnostico': 'badge-warning',
    'en_progreso': 'badge-info',
    'lista_retirar': 'badge-success',
    'retirada': 'badge-ghost'
  };
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-6">
    <div class="flex items-center gap-3">
      <Wrench class="h-8 w-8 text-success" />
      <h1 class="text-3xl font-bold">
        Gestión de <span class="text-success">Reparaciones</span>
      </h1>
    </div>
    <button onclick={openCreateModal} class="btn btn-success">
      Nueva Reparación
    </button>
  </div>

  <!-- Moved alerts inside modal so they are visible or generally fixed the issue of hidden alerts -->
  {#if form?.error && !isModalOpen}
    <div class="alert alert-error mb-4">
      <span>Error: {form.error}</span>
    </div>
  {/if}

  {#if form?.success}
    <div class="alert alert-success mb-4">
      <span>¡Operación realizada con éxito!</span>
    </div>
  {/if}

  <div class="overflow-x-auto bg-base-300 shadow-xl border border-base-200 rounded-box">
    <table class="table w-full">
      <thead>
        <tr>
          <th>Guía</th>
          <th>Cliente</th>
          <th>Equipo</th>
          <th>Estado</th>
          <th>Costo Total</th>
          <th>Fecha Ingreso</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {#if data.repairs.length === 0}
          <tr>
            <td colspan="7" class="text-center py-4 text-base-content/60">
              No hay reparaciones registradas.
            </td>
          </tr>
        {/if}
        {#each data.repairs as repair (repair.id)}
          <tr class="hover">
            <td>
              <span class="badge badge-accent font-bold tracking-wider">{repair.tracking_code}</span>
            </td>
            <td>
              <div class="font-medium">{repair.client_name}</div>
              <div class="text-xs text-base-content/60">{repair.client_phone || 'Sin télefono'}</div>
            </td>
            <td>{repair.device_type}</td>
            <td>
              <div class="badge {statusBadge[repair.status]}">{statusMap[repair.status]}</div>
            </td>
            <td class="font-semibold text-success">
              ${Number(repair.total_cost).toFixed(2)}
            </td>
            <td class="text-sm">{formatDate(repair.created_at)}</td>
            <td>
              <div class="flex gap-2">
                <button
                  onclick={() => openEditModal(repair)}
                  class="btn btn-sm btn-info btn-square"
                  aria-label="Editar reparación"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
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
                  <input type="hidden" name="id" value={repair.id} />
                  <button
                    type="submit"
                    class="btn btn-sm btn-error btn-square"
                    aria-label="Eliminar reparación"
                    disabled={loading}
                    onclick={(e) => {
                      if (!confirm("¿Deseas eliminar permanentemente esta reparación?")) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
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

<!-- Modal -->
<dialog class="modal modal-bottom sm:modal-middle" class:modal-open={isModalOpen}>
  <div class="modal-box p-6 w-11/12 max-w-3xl">
    <h3 class="font-bold text-xl text-success mb-6 border-b border-base-200 pb-2">
      {isEditMode ? "Taller: Actualizar Reparación" : "Taller: Ingresar Equipo"}
    </h3>
    
    {#if form?.error && isModalOpen}
      <div class="alert alert-error mb-4">
        <span>{form?.message || form?.error}</span>
      </div>
    {/if}

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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Columna 1 -->
        <div class="space-y-4">
          {#if !isEditMode}
            <div class="form-control bg-base-200/50 p-3 rounded-lg mb-2">
              <label class="label cursor-pointer justify-start gap-4 p-0">
                <span class="label-text font-bold text-base">¿Cliente tiene cuenta en la web?</span> 
                <input type="checkbox" class="toggle toggle-success toggle-sm" bind:checked={hasAccount} disabled={loading} />
              </label>
            </div>
          {/if}

          {#if hasAccount && !isEditMode}
            <div class="form-control">
              <label class="label" for="client_email"><span class="label-text">Correo Electrónico de la Cuenta</span></label>
              <input type="email" id="client_email" name="client_email" bind:value={clientEmail} required disabled={loading} placeholder="Ej: cuenta@gmail.com" class="input input-sm input-success w-full" />
              {#if clientEmail.length > 3}
                {#if selectedUser}
                   <span class="text-xs font-semibold text-success mt-1">✓ Encontrado. Datos auto-completados.</span>
                {:else}
                   <span class="text-xs font-semibold text-error mt-1">✗ Correo no registrado.</span>
                {/if}
              {/if}
            </div>
            
            <!-- Hidden email for form submission if selectedUser is found, but we kept the name attribute so it submitts directly -->
          {:else}
            <!-- If no account, they can optionally provide email for simple record or none -->
            <div class="form-control">
              <label class="label" for="client_email"><span class="label-text">Correo Electrónico (Opcional)</span></label>
              <input type="email" id="client_email" name="client_email" bind:value={clientEmail} disabled={loading} placeholder="Email de contacto" class="input input-sm input-bordered w-full" />
            </div>
          {/if}

          <div class="form-control">
            <label class="label" for="client_name"><span class="label-text">Nombre del Cliente</span></label>
            <input type="text" id="client_name" name="client_name" bind:value={clientName} required disabled={loading} readonly={hasAccount && selectedUser !== undefined && !isEditMode} class="input input-sm input-bordered w-full" />
          </div>

          <div class="form-control">
            <label class="label" for="client_phone"><span class="label-text">Teléfono</span></label>
            <input type="text" id="client_phone" name="client_phone" bind:value={clientPhone} disabled={loading} readonly={hasAccount && selectedUser !== undefined && !isEditMode} class="input input-sm input-bordered w-full" />
          </div>
        </div>

        <!-- Columna 2 -->
        <div class="space-y-4">
          <div class="form-control">
            <label class="label" for="device_type"><span class="label-text">Tipo de Equipo</span></label>
            <input type="text" id="device_type" name="device_type" bind:value={deviceType} required disabled={loading} placeholder="Ej: PC, Laptop, Consola" class="input input-sm input-bordered w-full" />
          </div>

          <div class="form-control">
            <label class="label" for="issues"><span class="label-text">Fallas Reportadas / Observaciones</span></label>
            <textarea id="issues" name="issues" bind:value={issues} required disabled={loading} class="textarea textarea-bordered h-20 w-full"></textarea>
          </div>

          {#if isEditMode}
            <div class="grid grid-cols-2 gap-2">
              <div class="form-control">
                <label class="label" for="status"><span class="label-text">Estado de Reparación</span></label>
                <select id="status" name="status" bind:value={status} disabled={loading} class="select select-sm select-bordered w-full">
                  <option value="diagnostico">Diagnóstico</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="lista_retirar">Lista para Retirar</option>
                  <option value="retirada">Retirada</option>
                </select>
              </div>

              <div class="form-control">
                <label class="label" for="total_cost"><span class="label-text">Presupuesto / Total ($)</span></label>
                <input type="number" id="total_cost" name="total_cost" bind:value={totalCost} step="0.01" min="0" disabled={loading} class="input input-sm input-bordered w-full font-bold text-success" />
              </div>
            </div>
            
            <div class="form-control">
              <label class="label" for="tracking_code"><span class="label-text">Código de Guía (Solo lectura)</span></label>
              <input type="text" id="tracking_code" name="tracking_code" bind:value={trackingCode} readonly class="input input-sm input-bordered w-full font-mono text-accent" />
            </div>
          {:else}
            <div class="form-control">
              <label class="label" for="tracking_code"><span class="label-text">Código de Guía (Opcional - Autogenerado si se omite)</span></label>
              <input type="text" id="tracking_code" name="tracking_code" bind:value={trackingCode} disabled={loading} placeholder="GF-XXXX" class="input input-sm input-bordered w-full font-mono" />
            </div>
          {/if}
        </div>
      </div>

      <div class="modal-action mt-8">
        {#if isEditMode}
          <input type="hidden" name="id" value={currentId} />
        {/if}
        <button type="button" class="btn" onclick={closeModal} disabled={loading}>
          Cancelar
        </button>
        <button type="submit" class="btn btn-success px-8" disabled={loading}>
          {#if loading}
            <span class="loading loading-spinner"></span>
          {/if}
          {isEditMode ? "Actualizar Reparación" : "Ingresar Equipo"}
        </button>
      </div>
    </form>
  </div>
</dialog>
