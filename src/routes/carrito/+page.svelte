<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData, PageData } from "./$types";

  let { data, form } = $props<{ data: PageData; form: ActionData }>();

  import { generateInvoice } from '$lib/utils/pdfGenerator';
  import { FileText, CheckCircle2 } from 'lucide-svelte';

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  let cartItems = $derived(data.cartItems || []);

  let subtotal = $derived(
    cartItems.reduce((acc: number, item: any) => {
      const product = Array.isArray(item.products)
        ? item.products[0]
        : item.products;
      return acc + item.quantity * (Number(product?.price) || 0);
    }, 0),
  );

  let itemCount = $derived(
    cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0),
  );

  let isLoading = $state<string | null>(null);
  let isPaymentModalOpen = $state(false);
  let selectedPaymentMethod = $state("transferencia");
  let isCheckingOut = $state(false);
  let isGeneratingInvoice = $state(false);

  async function downloadCurrentInvoice() {
    if (!form?.orderId) return;
    try {
      isGeneratingInvoice = true;
      const { data: userData } = await data.supabase.auth.getUser();
      const user = userData.user;
      if (!user) return;
      
      const { data: profile } = await data.supabase.from("users").select("id, full_name, email, phone, account_type").eq("id", user.id).single();
      let company = null;
      if (profile?.account_type === "business") {
        const { data: companyData } = await data.supabase.from("companies").select("company_name, rif, address, business_phone").eq("user_id", user.id).single();
        company = companyData;
      }
      const { data: order } = await data.supabase.from("orders").select(`
        id, created_at, total_amount, payment_method,
        order_items ( quantity, price_at_purchase, products ( name ) )
      `).eq("id", form.orderId).single();
      
      if (profile && order) {
        generateInvoice(order, profile, company);
      }
    } catch (e) {
      console.error(e);
    } finally {
      isGeneratingInvoice = false;
    }
  }
</script>

<svelte:head>
  <title>Mi Carrito | HardTech Solutions</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-extrabold tracking-tight mb-8">
    Tu <span class="text-primary">Carrito</span>
  </h1>

  {#if form?.error}
    <div class="alert alert-error mb-8 shadow-md">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span><strong class="font-bold">Error en el pago:</strong> {form.error}</span>
    </div>
  {/if}

  {#if form?.checkoutSuccess}
    <div
      class="text-center py-20 bg-base-200 rounded-box border border-success/30 max-w-2xl mx-auto shadow-lg"
    >
      <div class="bg-success text-success-content p-6 rounded-full inline-block mb-4 shadow-sm">
        <CheckCircle2 class="w-16 h-16" />
      </div>
      <h3 class="text-3xl font-bold mb-4">{form.message || "¡Compra realizada con éxito!"}</h3>
      <p class="text-base-content/70 mb-8 text-lg">
        Tu pedido ha sido procesado correctamente. Gracias por confiar en HardTech Solutions.
      </p>
      
      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <button 
          class="btn btn-primary gap-2 hover:scale-105 transition-transform"
          onclick={downloadCurrentInvoice}
          disabled={isGeneratingInvoice}
        >
          {#if isGeneratingInvoice}
            <span class="loading loading-spinner loading-sm"></span>
            Generando...
          {:else}
            <FileText class="w-5 h-5" />
            Descargar Factura
          {/if}
        </button>
        <a href="/perfil" class="btn btn-outline btn-neutral">
          Ir a mis compras
        </a>
      </div>
    </div>
  {:else if cartItems.length === 0}
    <div
      class="text-center py-20 bg-base-200 rounded-box border border-base-300"
    >
      <div class="bg-base-300/50 p-6 rounded-full inline-block mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 text-base-content/50"
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
      </div>
      <h3 class="text-2xl font-bold mb-2">Tu carrito está vacío</h3>
      <p class="text-base-content/70 mb-6">
        Parece que aún no has agregado nada.
      </p>
      <a href="/productos" class="btn btn-primary">Ver Productos</a>
    </div>
  {:else}
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Cart Items List -->
      <div class="grow space-y-4">
        {#each cartItems as item (item.id)}
          {@const product = Array.isArray(item.products)
            ? item.products[0]
            : item.products}
          {@const productPrice = Number(product?.price) || 0}
          <div
            class="card sm:card-side bg-base-100 shadow-md border border-base-200 p-4 gap-4 items-center sm:items-stretch"
          >
            <figure class="w-32 h-32 bg-base-200 rounded-xl shrink-0">
              {#if product?.images && product.images.length > 0}
                <img
                  src={data.supabase.storage
                    .from("products")
                    .getPublicUrl(product.images[0]).data.publicUrl}
                  alt={product.name}
                  class="object-contain w-full h-full mix-blend-multiply dark:mix-blend-normal"
                />
              {:else}
                <span class="text-xs text-base-content/50">Sin imagen</span>
              {/if}
            </figure>

            <div
              class="grow flex flex-col justify-between w-full sm:w-auto text-center sm:text-left"
            >
              <div>
                <a
                  href="/productos/{product?.slug}"
                  class="hover:text-primary transition-colors"
                >
                  <h2 class="card-title text-lg leading-tight mb-1">
                    {product?.name}
                  </h2>
                </a>
                <p class="text-success font-bold text-lg">
                  {formatCurrency(productPrice)}
                </p>
              </div>

              <div
                class="flex items-center justify-between sm:justify-start gap-4 mt-4 w-full"
              >
                <!-- Quantity Controls -->
                <div class="join border border-base-300 rounded-xl">
                  <form
                    method="POST"
                    action="?/updateQuantity"
                    use:enhance={() => {
                      isLoading = `dec-${item.id}`;
                      return async ({ update }) => {
                        await update({ reset: false });
                        isLoading = null;
                      };
                    }}
                  >
                    <input type="hidden" name="cartItemId" value={item.id} />
                    <input type="hidden" name="action" value="decrement" />
                    <button
                      type="submit"
                      class="btn btn-sm join-item bg-base-100 hover:bg-base-200"
                      disabled={item.quantity <= 1 || isLoading !== null}
                      aria-label="Reducir cantidad"
                    >
                      -
                    </button>
                  </form>

                  <div
                    class="btn btn-sm join-item bg-base-100 no-animation w-12 cursor-default pointer-events-none"
                  >
                    {item.quantity}
                  </div>

                  <form
                    method="POST"
                    action="?/updateQuantity"
                    use:enhance={() => {
                      isLoading = `inc-${item.id}`;
                      return async ({ update }) => {
                        await update({ reset: false });
                        isLoading = null;
                      };
                    }}
                  >
                    <input type="hidden" name="cartItemId" value={item.id} />
                    <input type="hidden" name="action" value="increment" />
                    <button
                      type="submit"
                      class="btn btn-sm join-item bg-base-100 hover:bg-base-200"
                      disabled={(product
                        ? item.quantity >= product.stock
                        : false) || isLoading !== null}
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </form>
                </div>

                <!-- Remove Button -->
                <form
                  method="POST"
                  action="?/removeItem"
                  use:enhance={() => {
                    isLoading = `rem-${item.id}`;
                    return async ({ update }) => {
                      await update({ reset: false });
                      isLoading = null;
                    };
                  }}
                >
                  <input type="hidden" name="cartItemId" value={item.id} />
                  <button
                    type="submit"
                    class="btn btn-ghost btn-circle text-error ml-auto"
                    disabled={isLoading !== null}
                    title="Eliminar producto"
                    aria-label="Eliminar del carrito"
                  >
                    {#if isLoading === `rem-${item.id}`}
                      <span class="loading loading-spinner loading-sm"></span>
                    {:else}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
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
                    {/if}
                  </button>
                </form>
              </div>
            </div>

            <!-- Per item total -->
            <div
              class="hidden sm:flex flex-col items-end justify-center ml-auto font-semibold min-w-25"
            >
              <span class="text-sm text-base-content/60 mb-1">Total</span>
              {formatCurrency(productPrice * item.quantity)}
            </div>
          </div>
        {/each}
      </div>

      <!-- Checkout Summary Sidebar -->
      <div class="lg:w-80 shrink-0">
        <div
          class="card bg-base-100 shadow-xl border border-base-200 sticky top-24"
        >
          <div class="card-body">
            <h2 class="card-title text-xl mb-4">Resumen de compra</h2>

            <div class="flex justify-between mb-2">
              <span class="text-base-content/70">Productos ({itemCount})</span>
              <span class="font-medium">{formatCurrency(subtotal)}</span>
            </div>

            <div class="flex justify-between mb-4">
              <span class="text-base-content/70">Costo de envío</span>
              <span class="font-medium">Calculado en el checkout</span>
            </div>

            <div class="divider my-2"></div>

            <div class="flex justify-between items-center mb-6">
              <span class="font-bold text-lg">Subtotal</span>
              <span class="font-bold text-xl text-success"
                >{formatCurrency(subtotal)}</span
              >
            </div>

            <button
              class="btn btn-success w-full"
              onclick={() => (isPaymentModalOpen = true)}
            >
              Proceder al Pago
            </button>
            <a href="/productos" class="btn btn-ghost w-full mt-2 text-sm">
              Seguir comprando
            </a>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<!-- Modal de Pasarela de Pago Segura -->
<dialog
  class="modal modal-bottom sm:modal-middle"
  class:modal-open={isPaymentModalOpen}
>
  <div class="modal-box p-0 sm:max-w-lg max-h-[90vh] bg-base-100 overflow-hidden shadow-2xl flex flex-col">
    <div class="bg-success p-6 text-success-content text-center">
      <div class="flex justify-center mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-10 h-10 opacity-90"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
      </div>
      <h3 class="font-bold text-2xl mb-1 mt-2">Pasarela de Pago Segura</h3>
      <p class="text-sm font-medium opacity-90">
        Total a pagar: <span class="text-xl ml-1 font-extrabold">{formatCurrency(subtotal)}</span>
      </p>
    </div>

    <form
      method="POST"
      action="?/checkout"
      class="p-6 flex flex-col flex-1 min-h-0"
      use:enhance={() => {
        isCheckingOut = true;
        return async ({ update, result }) => {
          await update({ reset: false });
          isCheckingOut = false;
          // Si es éxito o falla, cerramos el modal para que pueda ver el toast/alerta
          isPaymentModalOpen = false;
        };
      }}
    >
      <div class="mb-5 flex-1 min-h-0 flex flex-col">
        <p class="text-base-content/70 text-xs font-bold mb-3 uppercase tracking-wider">
          Selecciona tu método de pago
        </p>
        
        <div class="space-y-3 flex-1 min-h-0 overflow-y-auto pr-1">
          <!-- Transferencia Bancaria -->
          <label class="flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all hover:bg-base-200 {selectedPaymentMethod === 'transferencia' ? 'border-success ring-1 ring-success bg-success/5' : 'border-base-300'}">
            <input
              type="radio"
              name="paymentMethod"
              value="transferencia"
              class="radio radio-success radio-sm"
              bind:group={selectedPaymentMethod}
            />
            <div class="grow">
              <span class="font-bold flex items-center gap-2">
                Transferencia Bancaria
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-success"><path d="M3 10h18"/><path d="M5 6h14"/><path d="M6 14h12"/><path d="M5 18h14"/></svg>
              </span>
              <p class="text-xs text-base-content/60 mt-0.5">Ideal si prefieres confirmar el pago por cuenta bancaria</p>
            </div>
          </label>

          <!-- Pago Movil C2P -->
          <label class="flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all hover:bg-base-200 {selectedPaymentMethod === 'pago_movil' ? 'border-success ring-1 ring-success bg-success/5' : 'border-base-300'}">
            <input
              type="radio"
              name="paymentMethod"
              value="pago_movil"
              class="radio radio-success radio-sm"
              bind:group={selectedPaymentMethod}
            />
            <div class="grow">
              <span class="font-bold flex items-center gap-2">
                Pago Móvil C2P
                <!-- Bandera VZLA SVG Minimal -->
                <span class="text-xs w-5 h-3.5 relative overflow-hidden inline-block rounded-sm shadow-sm" title="Venezuela">
                  <span class="absolute top-0 w-full h-1/3 bg-[#FFCC00]"></span>
                  <span class="absolute top-1/3 w-full h-1/3 bg-[#00247D]"></span>
                  <span class="absolute bottom-0 w-full h-1/3 bg-[#CF142B]"></span>
                </span>
              </span>
              <p class="text-xs text-base-content/60 mt-0.5">Aprobación instantánea con tu banco</p>
            </div>
          </label>

          <!-- Tarjeta de Crédito/Débito -->
          <label class="flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all hover:bg-base-200 {selectedPaymentMethod === 'tarjeta' ? 'border-success ring-1 ring-success bg-success/5' : 'border-base-300'}">
            <input
              type="radio"
              name="paymentMethod"
              value="tarjeta"
              class="radio radio-success radio-sm"
              bind:group={selectedPaymentMethod}
            />
            <div class="grow">
              <span class="font-bold flex items-center gap-2">
                Tarjeta Mastercard / Visa
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-blue-500"><circle cx="15.5" cy="12" r="4.5"/><circle cx="8.5" cy="12" r="4.5"/></svg>
              </span>
              <p class="text-xs text-base-content/60 mt-0.5">Paga de forma encriptada y segura</p>
            </div>
          </label>

          <!-- Paypal -->
          <label class="flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all hover:bg-base-200 {selectedPaymentMethod === 'paypal' ? 'border-success ring-1 ring-success bg-success/5' : 'border-base-300'}">
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              class="radio radio-success radio-sm"
              bind:group={selectedPaymentMethod}
            />
            <div class="grow">
              <span class="font-bold flex items-center gap-2">
                PayPal
                <span class="italic text-[#00457C] font-extrabold text-sm ml-1">Pay</span><span class="italic text-[#0079C1] font-extrabold text-sm">Pal</span>
              </span>
              <p class="text-xs text-base-content/60 mt-0.5">Protección integral al comprador</p>
            </div>
          </label>

          <!-- Zelle -->
          <label class="flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all hover:bg-base-200 {selectedPaymentMethod === 'zelle' ? 'border-success ring-1 ring-success bg-success/5' : 'border-base-300'}">
            <input
              type="radio"
              name="paymentMethod"
              value="zelle"
              class="radio radio-success radio-sm"
              bind:group={selectedPaymentMethod}
            />
            <div class="grow">
              <span class="font-bold flex items-center gap-2">
                Zelle
                <span class="bg-[#753BBD] text-white px-1.5 py-0.5 rounded-sm font-extrabold text-[10px] tracking-wide ml-1">Zelle</span>
              </span>
              <p class="text-xs text-base-content/60 mt-0.5">Transferencias fluidas sin comisiones</p>
            </div>
          </label>
        </div>
      </div>

      <div class="modal-action flex items-center justify-between mt-6 border-t border-base-200 pt-5">
        <button
          type="button"
          class="btn btn-ghost hover:bg-base-200"
          onclick={() => (isPaymentModalOpen = false)}
          disabled={isCheckingOut}
        >
          Regresar
        </button>
        <button type="submit" class="btn btn-success px-8 shadow-md" disabled={isCheckingOut}>
          {#if isCheckingOut}
            <span class="loading loading-spinner"></span>
            Procesando...
          {:else}
            Pagar {formatCurrency(subtotal)}
          {/if}
        </button>
      </div>
    </form>
  </div>
  <form method="dialog" class="modal-backdrop bg-base-300/70 backdrop-blur-[2px]">
    <button onclick={() => (isPaymentModalOpen = false)} disabled={isCheckingOut}>
      Cerrar
    </button>
  </form>
</dialog>
