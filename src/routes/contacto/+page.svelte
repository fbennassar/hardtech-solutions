<script lang="ts">
  import { MapPin, Phone, Mail, Clock, Send } from "lucide-svelte";
  
  let isLoading = $state(false);
  let formSuccess = $state(false);
  
  function handleSubmit(e: Event) {
    e.preventDefault();
    isLoading = true;
    setTimeout(() => {
      isLoading = false;
      formSuccess = true;
      (e.target as HTMLFormElement).reset();
      setTimeout(() => formSuccess = false, 5000);
    }, 1500);
  }
</script>

<svelte:head>
  <title>Contacto | HardTech Solutions</title>
  <meta name="description" content="Ponte en contacto con HardTech Solutions. Resolveremos tus dudas en el menor tiempo posible." />
</svelte:head>

<div class="container mx-auto px-4 py-12 md:py-20 animate-fade-in-up">
  <div class="text-center mb-16">
    <h1 class="text-4xl md:text-5xl font-extrabold mb-4">
      Contáctanos
    </h1>
    <p class="text-lg text-base-content/70 max-w-2xl mx-auto">
      Estamos aquí para ayudarte. Si tienes preguntas sobre repuestos, estado de reparaciones o consultas empresariales, escríbenos.
    </p>
  </div>

  <div class="flex flex-col lg:flex-row gap-0 bg-base-200 rounded-4xl overflow-hidden shadow-2xl border border-base-300">
    <!-- Información de Contacto -->
    <div class="lg:w-2/5 bg-success text-success-content p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
      <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      
      <div class="relative z-10">
        <h2 class="text-3xl font-bold mb-10">Información de Contacto</h2>
        
        <div class="flex flex-col gap-8">
          <div class="flex items-start gap-4 hover:-translate-y-1 transition-transform">
            <div class="bg-black/20 p-3 rounded-xl shrink-0"><MapPin class="w-6 h-6" /></div>
            <div>
              <h3 class="font-bold text-xl mb-1">Dirección Principal</h3>
              <p class="text-success-content/80">Av. Gamers 101, Torre Central</p>
              <p class="text-success-content/80">Ciudad Tecnológica, 10101</p>
            </div>
          </div>
          <div class="flex items-start gap-4 hover:-translate-y-1 transition-transform">
            <div class="bg-black/20 p-3 rounded-xl shrink-0"><Phone class="w-6 h-6" /></div>
            <div>
              <h3 class="font-bold text-xl mb-1">Teléfono</h3>
              <p class="text-success-content/80">+1 (555) 123-4567</p>
            </div>
          </div>
          <div class="flex items-start gap-4 hover:-translate-y-1 transition-transform">
            <div class="bg-black/20 p-3 rounded-xl shrink-0"><Mail class="w-6 h-6" /></div>
            <div>
              <h3 class="font-bold text-xl mb-1">Correo Electrónico</h3>
              <p class="text-success-content/80">soporte@gamerfix.com</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-12 bg-black/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 relative z-10">
        <div class="flex items-center gap-3 mb-3">
          <Clock class="w-6 h-6" />
          <h3 class="font-bold text-xl">Horario</h3>
        </div>
        <p class="text-success-content/80 font-medium">Lunes - Viernes: 9am - 6pm</p>
        <p class="text-success-content/80 font-medium">Sábados: 10am - 2pm</p>
      </div>
    </div>

    <!-- Formulario -->
    <div class="lg:w-3/5 p-8 md:p-12 lg:p-16 bg-base-100 flex items-center justify-center">
      <div class="w-full max-w-lg">
        <h2 class="text-3xl font-bold mb-8">Envíanos un Mensaje</h2>
        
        {#if formSuccess}
          <div class="alert alert-success shadow-lg mb-8" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span class="font-semibold">¡Mensaje enviado con éxito! Te contactaremos pronto.</span>
          </div>
        {/if}

        <form class="flex flex-col gap-5" onsubmit={handleSubmit}>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="form-control">
              <label class="label"><span class="label-text font-bold">Nombre</span></label>
              <input type="text" required placeholder="Juan Pérez" class="input input-bordered focus:border-primary focus:outline-none transition-colors" />
            </div>
            
            <div class="form-control">
              <label class="label"><span class="label-text font-bold">Email</span></label>
              <input type="email" required placeholder="tu@email.com" class="input input-bordered focus:border-primary focus:outline-none transition-colors" />
            </div>
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text font-bold">Asunto</span></label>
            <select class="select select-bordered focus:border-primary focus:outline-none transition-colors" required>
              <option value="" disabled selected>Selecciona un tema</option>
              <option value="Soporte Técnico">Soporte Técnico</option>
              <option value="Consultas de Ventas">Consultas de Ventas</option>
              <option value="Información Empresarial">Información Empresarial</option>
              <option value="Sugerencias">Sugerencias</option>
            </select>
          </div>
          
          <div class="form-control">
            <label class="label"><span class="label-text font-bold">Mensaje</span></label>
            <textarea required placeholder="¿En qué te podemos ayudar?" class="textarea textarea-bordered min-h-[150px] focus:border-primary focus:outline-none transition-colors"></textarea>
          </div>
          
          <button type="submit" class="btn btn-success btn-lg mt-4 group" disabled={isLoading}>
            {#if isLoading}
              <span class="loading loading-spinner loading-md"></span>
            {:else}
              Enviar Mensaje
              <Send class="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            {/if}
          </button>
        </form>
      </div>
    </div>
  </div>
</div>
