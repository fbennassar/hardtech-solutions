<script lang="ts">
  import { Search, Wrench, RefreshCw, CheckCircle, Smartphone, Monitor, HardDrive, ShieldCheck } from "lucide-svelte";
  
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

  const steps = [
    {
      step: "01",
      title: "Recepción",
      desc: "Registramos tu equipo en sistema y generamos un código único para que puedas rastrearlo 24/7.",
      icon: Search
    },
    {
      step: "02",
      title: "Diagnóstico",
      desc: "Nuestros técnicos evalúan exhaustivamente el problema para ofrecerte un presupuesto claro.",
      icon: Wrench
    },
    {
      step: "03",
      title: "Reparación",
      desc: "Usamos componentes de alta calidad y actualizamos el estado de tu guía en tiempo real.",
      icon: RefreshCw
    },
    {
      step: "04",
      title: "Pruebas",
      desc: "Realizamos test de estrés para confirmar estabilidad antes de notificarte para la entrega.",
      icon: CheckCircle
    }
  ];
</script>

<svelte:head>
  <title>Reparaciones y Servicios | HardTech Solutions</title>
  <meta name="description" content="Así funciona nuestro servicio de reparación técnica en HardTech Solutions. Procesos transparentes y de alta confiabilidad." />
</svelte:head>

<div class="flex flex-col gap-16 md:gap-24 mb-20 animate-fade-in-up border-transparent">
  <!-- Hero -->
  <div class="bg-base-300 py-16 md:py-28 relative overflow-hidden">
    <div class="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-base-300 to-base-300 pointer-events-none"></div>
    <div class="container mx-auto px-4 text-center relative z-10">
      <div class="inline-flex items-center gap-2 px-5 py-2 bg-base-100 rounded-full mb-8 border border-base-200 shadow-md text-sm font-bold uppercase tracking-wider text-base-content/80">
        <Wrench class="w-4 h-4 text-primary" /> Especialistas en Hardware
      </div>
      <h1 class="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight">
        Servicio Técnico <br/><span class="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Transparente</span>
      </h1>
      <p class="text-lg md:text-2xl text-base-content/70 max-w-4xl mx-auto font-medium">
        Porque sabemos cuánto valoras tus equipos, hemos diseñado un proceso donde en todo momento sabrás qué está pasando y cuánto va a costar. Sin sorpresas.
      </p>
    </div>
  </div>

  <!-- El Proceso -->
  <div class="container mx-auto px-4">
    <div class="text-center mb-16">
      <h2 class="text-3xl font-bold">¿Cómo Funciona?</h2>
      <p class="text-base-content/70 mt-4 text-lg max-w-2xl mx-auto">Una guía paso a paso de lo que ocurre cuando nos confías tu computadora, consola o periférico.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {#each steps as step, index}
        <div use:reveal class="reveal-hidden relative group" style="transition-delay: {index * 150}ms">
          <!-- Line connector for lg screens -->
          {#if index < steps.length - 1}
            <div class="hidden lg:block absolute top-12 left-[60%] w-full h-[2px] bg-base-300 group-hover:bg-primary/50 transition-colors duration-500 -z-10"></div>
          {/if}
          
          <div class="flex flex-col items-center text-center">
            <div class="w-24 h-24 rounded-3xl bg-base-100 border border-base-200 shadow-xl flex items-center justify-center mb-6 relative group-hover:border-primary group-hover:shadow-primary/20 group-hover:-translate-y-2 transition-all duration-300">
              <svelte:component this={step.icon} class="w-10 h-10 text-base-content/50 group-hover:text-primary transition-colors duration-300" />
              <div class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-base-300 border border-base-200 group-hover:bg-primary group-hover:text-primary-content flex items-center justify-center font-bold text-sm shadow-md transition-colors duration-300">
                {step.step}
              </div>
            </div>
            <h3 class="text-xl font-bold mb-3">{step.title}</h3>
            <p class="text-base-content/70 leading-relaxed">{step.desc}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Especialidades -->
  <div class="bg-base-200 py-24 border-y border-base-300">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
         <h2 class="text-3xl font-bold">Nuestras Especialidades</h2>
         <p class="text-lg text-base-content/70 mt-4 max-w-2xl mx-auto">Nuestros laboratorios están equipados para resolver desde problemas lógicos hasta fallas a nivel de micro-componente.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="card bg-base-100 shadow-xl border border-base-200 flex flex-col items-center text-center hover:border-info hover:shadow-2xl hover:shadow-info/10 transition-all duration-300 p-10">
          <div class="p-4 bg-info/10 rounded-2xl mb-6 text-info">
            <Monitor class="w-10 h-10" />
          </div>
          <h3 class="text-xl font-bold mb-4">PCs y Laptops Gamer</h3>
          <p class="text-base-content/70 leading-relaxed">Mantenimiento preventivo, cambio de pasta térmica (liquid metal si es requerido), reflow de GPUs y reparación de placas madre a nivel componente.</p>
        </div>
        
        <div class="card bg-base-100 shadow-xl border border-base-200 flex flex-col items-center text-center hover:border-success hover:shadow-2xl hover:shadow-success/10 transition-all duration-300 p-10">
          <div class="p-4 bg-success/10 rounded-2xl mb-6 text-success">
            <HardDrive class="w-10 h-10" />
          </div>
          <h3 class="text-xl font-bold mb-4">Recuperación de Datos</h3>
          <p class="text-base-content/70 leading-relaxed">Rescate de información de discos duros mecánicos con sectores dañados, cabezales atascados y arreglos RAID caídos con técnicas forenses avanzadas.</p>
        </div>
        
        <div class="card bg-base-100 shadow-xl border border-base-200 flex flex-col items-center text-center hover:border-warning hover:shadow-2xl hover:shadow-warning/10 transition-all duration-300 p-10">
          <div class="p-4 bg-warning/10 rounded-2xl mb-6 text-warning">
            <Smartphone class="w-10 h-10" />
          </div>
          <h3 class="text-xl font-bold mb-4">Dispositivos y Consolas</h3>
          <p class="text-base-content/70 leading-relaxed">Reparación de luces rojas/azules, limpieza de consolas, reemplazo de puertos HDMI soldados a la placa y reparación de controles (drift de joysticks).</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Garantía -->
  <div class="container mx-auto px-4">
    <div class="bg-base-100 rounded-4xl p-8 md:p-12 border border-base-200 shadow-xl flex flex-col md:flex-row items-center gap-8 md:gap-12">
      <div class="w-24 h-24 md:w-32 md:h-32 shrink-0 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
        <ShieldCheck class="w-12 h-12 md:w-16 md:h-16" />
      </div>
      <div class="text-center md:text-left">
        <h2 class="text-3xl font-bold mb-4">Garantía Asegurada</h2>
        <p class="text-lg text-base-content/80 max-w-3xl">
          Todas nuestras reparaciones y mantenimientos llevan un sello de calidad y cuentan con garantía firmada. Si el mismo problema vuelve a ocurrir dentro del periodo establecido, la revisión y mano de obra es gratuita.
        </p>
      </div>
    </div>
  </div>

  <!-- CTA -->
  <div class="container mx-auto px-4 text-center mt-4">
    <div class="bg-success rounded-4xl p-10 md:p-16 text-success-content shadow-2xl relative overflow-hidden">
      <!-- Decoración de fondo -->
      <div class="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      
      <div class="relative z-10 text-center">
        <h2 class="text-3xl md:text-5xl font-bold mb-6">¿Tienes un equipo que requiere atención?</h2>
        <p class="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90 font-medium">Tráelo hoy mismo a nuestro taller o contáctanos para agendar una recolección asegurada. Diagnóstico preciso desde el primer día.</p>
        <div class="flex flex-col sm:flex-row gap-5 justify-center mt-6">
          <a href="/contacto" class="btn btn-outline border-success-content text-success-content hover:bg-success-content hover:text-success btn-lg border-2">Agendar Diagnóstico</a>
          <a href="/" class="btn bg-success-content text-success hover:bg-success-content/90 border-none btn-lg">Rastrear Equipo</a>
        </div>
      </div>
    </div>
  </div>
</div>
