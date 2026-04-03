<script lang="ts">
  import type { PageData } from "./$types";
  import { ShieldCheck, Cpu, ArrowLeft, CheckCircle2, Clock } from "lucide-svelte";

  let { data } = $props<{ data: PageData }>();
  let repair = $derived(data.repair);

  function formatDate(iso: string | null) {
    if (!iso) return null;
    return new Date(iso).toLocaleDateString("es-VE", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Caracas",
    });
  }

  // Steps verification logic
  let hasDiagnostico = $derived(!!repair.diagnostico_date);
  let hasEnProgreso = $derived(!!repair.en_progreso_date);
  let hasListaRetirar = $derived(!!repair.lista_retirar_date);
  let hasRetirada = $derived(!!repair.retirada_date);
</script>

<div class="container mx-auto px-4 py-12 max-w-4xl">
  <div class="mb-8">
    <a href="/" class="btn btn-ghost btn-sm gap-2 mb-4">
      <ArrowLeft class="w-4 h-4" /> Volver al Inicio
    </a>
    <div class="flex items-center gap-4">
      <div class="p-3 bg-success/10 rounded-2xl">
        <ShieldCheck class="w-8 h-8 text-success" />
      </div>
      <div>
        <h1 class="text-3xl font-bold text-success">
          Rastreo de Reparación
        </h1>
        <p class="text-base-content/60 text-sm mt-1">Guía: <span class="font-bold text-base-content tracking-wider">{repair.tracking_code}</span></p>
      </div>
    </div>
  </div>

  <div class="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-all duration-300 mb-12">
    <div class="card-body">
      <h2 class="card-title text-xl mb-4 border-b border-base-200 pb-4">
        <Cpu class="w-5 h-5 text-secondary" />
        Detalles del Equipo
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p class="text-xs text-base-content/50 uppercase tracking-wider font-semibold mb-1">Cliente</p>
          <p class="text-lg font-medium">{repair.client_name}</p>
        </div>
        <div>
          <p class="text-xs text-base-content/50 uppercase tracking-wider font-semibold mb-1">Equipo Ingresado</p>
          <p class="text-lg font-medium">{repair.device_type}</p>
        </div>
        <div class="md:col-span-2">
          <p class="text-xs text-base-content/50 uppercase tracking-wider font-semibold mb-1">Fallas Reportadas</p>
          <p class="text-base bg-base-200/50 p-4 rounded-xl">{repair.issues}</p>
        </div>
        {#if hasRetirada || hasListaRetirar}
          <div class="md:col-span-2 mt-4 flex items-center justify-between bg-success/5 p-4 rounded-xl border border-success/20">
            <span class="font-semibold text-success">Costo Total Asociado:</span>
            <span class="text-xl font-bold">${Number(repair.total_cost).toFixed(2)}</span>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <h2 class="text-2xl font-bold mb-8 text-center">Estado de tu Reparación</h2>

  <div class="w-full flex justify-center pb-8 overflow-x-auto">
    <ul class="timeline timeline-vertical lg:timeline-horizontal">
      <!-- Diagnostico -->
      <li>
        <div class="timeline-start timeline-box shadow-sm border-base-200" class:bg-success={hasDiagnostico} class:text-success-content={hasDiagnostico}>
          <div class="font-bold mb-1">Diagnóstico</div>
          <div class="text-xs opacity-80">{hasDiagnostico ? formatDate(repair.diagnostico_date) : 'Pendiente'}</div>
        </div>
        <div class="timeline-middle">
          {#if hasDiagnostico}
            <CheckCircle2 class="w-6 h-6 text-success drop-shadow-md" />
          {:else}
            <Clock class="w-6 h-6 text-base-content/30" />
          {/if}
        </div>
        <hr class:bg-success={hasEnProgreso} class="transition-colors duration-500" />
      </li>
      
      <!-- En Progreso -->
      <li>
        <hr class:bg-success={hasEnProgreso} class="transition-colors duration-500" />
        <div class="timeline-end timeline-box shadow-sm border-base-200" class:bg-success={hasEnProgreso} class:text-success-content={hasEnProgreso}>
          <div class="font-bold mb-1">En Reparación</div>
          <div class="text-xs opacity-80">{hasEnProgreso ? formatDate(repair.en_progreso_date) : 'Pendiente'}</div>
        </div>
        <div class="timeline-middle">
          {#if hasEnProgreso}
            <CheckCircle2 class="w-6 h-6 text-success drop-shadow-md" />
          {:else}
            <Clock class="w-6 h-6 text-base-content/30" />
          {/if}
        </div>
        <hr class:bg-success={hasListaRetirar} class="transition-colors duration-500" />
      </li>

      <!-- Lista para Retirar -->
      <li>
        <hr class:bg-success={hasListaRetirar} class="transition-colors duration-500" />
        <div class="timeline-start timeline-box shadow-sm border-base-200" class:bg-success={hasListaRetirar} class:text-success-content={hasListaRetirar}>
          <div class="font-bold mb-1">Lista para Retirar</div>
          <div class="text-xs opacity-80">{hasListaRetirar ? formatDate(repair.lista_retirar_date) : 'Pendiente'}</div>
        </div>
        <div class="timeline-middle">
          {#if hasListaRetirar}
            <CheckCircle2 class="w-6 h-6 text-success drop-shadow-md" />
          {:else}
            <Clock class="w-6 h-6 text-base-content/30" />
          {/if}
        </div>
        <hr class:bg-success={hasRetirada} class="transition-colors duration-500" />
      </li>

      <!-- Retirada -->
      <li>
        <hr class:bg-success={hasRetirada} class="transition-colors duration-500" />
        <div class="timeline-end timeline-box shadow-sm border-base-200" class:bg-success={hasRetirada} class:text-success-content={hasRetirada}>
          <div class="font-bold mb-1">Retirado</div>
          <div class="text-xs opacity-80">{hasRetirada ? formatDate(repair.retirada_date) : 'Pendiente'}</div>
        </div>
        <div class="timeline-middle">
          {#if hasRetirada}
            <CheckCircle2 class="w-6 h-6 text-success drop-shadow-md" />
          {:else}
            <Clock class="w-6 h-6 text-base-content/30" />
          {/if}
        </div>
      </li>
    </ul>
  </div>
</div>
