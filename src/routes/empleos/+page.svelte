<script lang="ts">
  import { Briefcase, Code, Cpu, ShieldCheck, Mail } from "lucide-svelte";

  function reveal(node: Element) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          node.classList.add("animate-enter");
          observer.unobserve(node);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(node);
    return { destroy() { observer.disconnect(); } };
  }

  const jobs = [
    {
      title: "Técnico Especialista en Hardware",
      type: "Tiempo Completo",
      location: "Presencial - Sede",
      icon: Cpu,
      description: "Buscamos un experto en diagnóstico y reparación de placas base, GPUs y ensamblaje avanzado."
    },
    {
      title: "Desarrollador Web Full Stack",
      type: "Remoto / Híbrido",
      location: "Remoto",
      icon: Code,
      description: "Únete a nuestro equipo de software para mantener y escalar nuestras plataformas internas y tienda."
    },
    {
      title: "Atención al Cliente (Gaming)",
      type: "Tiempo Medio",
      location: "Presencial",
      icon: ShieldCheck,
      description: "Asiste a la comunidad de gamers para elegir los componentes ideales para sus builds."
    }
  ];
</script>

<svelte:head>
  <title>Empleos | HardTech Solutions</title>
  <meta name="description" content="Únete al equipo de HardTech Solutions. Buscamos talento apasionado por la tecnología." />
</svelte:head>

<div class="flex flex-col gap-16 md:gap-24 mb-20 animate-fade-in-up">
  <div class="bg-base-200 py-16 md:py-24">
    <div class="container mx-auto px-4 text-center">
      <h1 class="text-4xl md:text-6xl font-extrabold mb-6">
        Trabaja con <span class="text-primary">Nosotros</span>
      </h1>
      <p class="text-lg md:text-xl text-base-content/70 max-w-2xl mx-auto">
        ¿Te apasiona el gaming, el hardware y construir experiencias increíbles? Estamos buscando mentes brillantes para unirse a nuestra revolución tecnológica en <strong>HardTech Solutions</strong>.
      </p>
    </div>
  </div>

  <div class="container mx-auto px-4">
    <div class="flex flex-col gap-12">
      <div class="text-center mb-4">
        <h2 class="text-3xl font-bold mb-4">Posiciones Abiertas</h2>
        <p class="text-base-content/70 max-w-xl mx-auto">Si crees que tienes lo necesario para aportar al equipo, revisa nuestras vacantes y no dudes en aplicar.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each jobs as job, index}
          <div use:reveal class="reveal-hidden card bg-base-100 shadow-xl border border-base-200 hover:border-primary hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" style="transition-delay: {index * 100}ms">
            <div class="card-body">
              <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                <svelte:component this={job.icon} size={24} />
              </div>
              <h3 class="card-title text-xl mb-1">{job.title}</h3>
              <div class="flex flex-wrap gap-2 text-xs font-semibold text-base-content/60 mb-4 uppercase tracking-wider">
                <span class="badge badge-lg border-base-300">{job.type}</span>
                <span class="badge badge-lg border-base-300">{job.location}</span>
              </div>
              <p class="text-sm text-base-content/80 flex-grow">{job.description}</p>
              <div class="card-actions justify-end mt-6">
                <button 
                  class="btn btn-success btn-block" 
                  onclick={() => (document.getElementById('apply_modal') as HTMLDialogElement).showModal()}
                >
                  Aplicar Ahora
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <div class="mt-8 md:mt-16 bg-base-200 rounded-4xl p-8 md:p-16 text-center border border-base-300 transition-all hover:border-secondary/50">
        <Briefcase class="w-16 h-16 text-secondary mx-auto mb-6" />
        <h2 class="text-2xl md:text-3xl font-bold mb-4">¿No encuentras un perfil para ti?</h2>
        <p class="text-lg text-base-content/70 mb-8 max-w-xl mx-auto">
          Siempre estamos atentos al talento excepcional. Envíanos tu portafolio o CV y cuéntanos por qué deberías estar en nuestro equipo.
        </p>
        <button 
          class="btn btn-outline btn-secondary btn-lg"
          onclick={() => (document.getElementById('apply_modal') as HTMLDialogElement).showModal()}
        >
          Candidatura Espontánea
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Modal de Aplicación -->
<dialog id="apply_modal" class="modal modal-bottom sm:modal-middle">
  <div class="modal-box border border-base-300 shadow-2xl">
    <div class="flex items-center gap-3 mb-6">
      <div class="p-3 bg-success/10 rounded-2xl text-success">
        <Mail class="w-6 h-6" />
      </div>
      <h3 class="text-2xl font-bold">¡Aplica hoy mismo!</h3>
    </div>
    
    <p class="text-base-content/70 mb-6">
      Para postularte a cualquiera de nuestras vacantes o enviarnos tu candidatura espontánea, envía tu CV actualizado y portafolio a nuestra dirección de Recursos Humanos:
    </p>
    
    <div class="bg-base-200 p-5 rounded-2xl border border-base-300 flex items-center justify-between gap-4 mb-2">
      <span class="font-mono font-bold text-success text-sm sm:text-base break-all">rrhh@hardtechsolutions.com</span>
    </div>
    <p class="text-xs text-base-content/50 mb-6 pl-1 font-medium italic">
      * Recuerda indicar el cargo al que aplicas en el asunto del correo.
    </p>

    <div class="modal-action">
      <form method="dialog">
        <button class="btn btn-ghost">Cerrar</button>
        <a href="mailto:rrhh@hardtechsolutions.com" class="btn btn-success">Redactar Correo</a>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
