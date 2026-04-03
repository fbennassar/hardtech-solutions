<script lang="ts">
  import type { PageData } from './$types';
  import { ShoppingBag, User, Building2, MapPin, Phone, Mail, CreditCard, Calendar, ChevronDown, ChevronUp, Download, Wrench, ExternalLink } from 'lucide-svelte';
  import { generateInvoice } from '$lib/utils/pdfGenerator';

  let { data }: { data: PageData } = $props();

  let profile = $derived(data.profile);
  let company = $derived(data.company);
  let orders = $derived(data.orders);
  let repairs = $derived(data.repairs);

  // Formatear Fecha considerando Svelte 5 rune update
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-VE', {
      timeZone: 'America/Caracas',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };
  
	// Estado para mostrar detalles de una orden
	let expandedOrderIndex = $state<number | null>(null);

	const toggleOrderItems = (index: number) => {
		expandedOrderIndex = expandedOrderIndex === index ? null : index;
	};

	// Función para traducción de status
	const translateStatus = (status: string) => {
		const statuses: Record<string, string> = {
			pending: 'Pendiente',
			paid: 'Pagado',
			shipped: 'Enviado',
			delivered: 'Entregado',
			cancelled: 'Cancelado'
		};
		return statuses[status] || status;
	};
	
	const statusBadgeColor = (status: string) => {
		const colors: Record<string, string> = {
			pending: 'badge-warning',
			paid: 'badge-success',
			shipped: 'badge-info',
			delivered: 'badge-success',
			cancelled: 'badge-error'
		};
		return colors[status] || 'badge-ghost';
	};

	const translateRepairStatus = (status: string) => {
		const statuses: Record<string, string> = {
			'diagnostico': 'Diagnóstico',
			'en_progreso': 'En Progreso',
			'lista_retirar': 'Lista para Retirar',
			'retirada': 'Retirada'
		};
		return statuses[status] || status;
	};
	
	const repairStatusColor = (status: string) => {
		const colors: Record<string, string> = {
			'diagnostico': 'badge-warning',
			'en_progreso': 'badge-info',
			'lista_retirar': 'badge-success',
			'retirada': 'badge-ghost'
		};
		return colors[status] || 'badge-ghost';
	};
</script>

<div class="container mx-auto px-4 py-8 max-w-5xl">
	<div class="flex items-center gap-4 mb-10">
		<div class="p-3 bg-primary/10 rounded-2xl">
			<User class="w-8 h-8 text-primary" />
		</div>
		<div>
			<h1 class="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Mi Perfil</h1>
			<p class="text-base-content/60 text-sm mt-1">Gestiona tu información y visualiza tu historial</p>
		</div>
	</div>

	<!-- Sección Datos Personales / Empresa -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
		<!-- Datos Personales -->
		<div class="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-all duration-300">
			<div class="card-body">
				<div class="flex items-center justify-between mb-6 pb-4 border-b border-base-200">
					<h2 class="card-title text-xl">
						<div class="p-2 bg-secondary/10 rounded-xl mr-2">
							<User class="w-5 h-5 text-secondary" />
						</div>
						Datos Personales
					</h2>
					<span class="badge badge-primary badge-outline shadow-sm">
						{profile?.account_type === 'business' ? 'Empresa' : 'Personal'}
					</span>
				</div>
				
				<div class="flex flex-col gap-5">
					<div class="flex items-center gap-4 group">
						<div class="p-2 bg-base-200 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
							<Mail class="w-5 h-5" />
						</div>
						<div>
							<p class="text-xs text-base-content/50 uppercase tracking-wider font-semibold mb-0.5">Correo Electrónico</p>
							<p class="text-base font-medium">{profile?.email || 'N/A'}</p>
						</div>
					</div>

					<div class="flex items-center gap-4 group">
						<div class="p-2 bg-base-200 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
							<User class="w-5 h-5" />
						</div>
						<div>
							<p class="text-xs text-base-content/50 uppercase tracking-wider font-semibold mb-0.5">Nombre Completo</p>
							<p class="text-base font-medium">{profile?.full_name || 'N/A'}</p>
						</div>
					</div>
					
					<div class="flex items-center gap-4 group">
						<div class="p-2 bg-base-200 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
							<Phone class="w-5 h-5" />
						</div>
						<div>
							<p class="text-xs text-base-content/50 uppercase tracking-wider font-semibold mb-0.5">Teléfono</p>
							<p class="text-base font-medium">{profile?.phone || 'N/A'}</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Datos de Empresa (Solo si es cuenta Business) -->
		{#if profile?.account_type === 'business'}
			<div class="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-all duration-300">
				<div class="card-body">
					<div class="flex items-center justify-between mb-6 pb-4 border-b border-base-200">
						<h2 class="card-title text-xl">
							<div class="p-2 bg-accent/10 rounded-xl mr-2">
								<Building2 class="w-5 h-5 text-accent" />
							</div>
							Datos de Empresa
						</h2>
					</div>
					
					<div class="flex flex-col gap-5">
						<div class="flex items-center gap-4 group">
							<div class="p-2 bg-base-200 rounded-lg group-hover:bg-accent/10 group-hover:text-accent transition-colors">
								<CreditCard class="w-5 h-5" />
							</div>
							<div>
								<p class="text-xs text-base-content/50 uppercase tracking-wider font-semibold mb-0.5">RIF</p>
								<p class="text-base font-medium">{company?.rif || 'N/A'}</p>
							</div>
						</div>

						<div class="flex items-center gap-4 group">
							<div class="p-2 bg-base-200 rounded-lg group-hover:bg-accent/10 group-hover:text-accent transition-colors">
								<Building2 class="w-5 h-5" />
							</div>
							<div>
								<p class="text-xs text-base-content/50 uppercase tracking-wider font-semibold mb-0.5">Razón Social</p>
								<p class="text-base font-medium">{company?.company_name || 'N/A'}</p>
							</div>
						</div>

						<div class="flex items-center gap-4 group">
							<div class="p-2 bg-base-200 rounded-lg group-hover:bg-accent/10 group-hover:text-accent transition-colors">
								<Phone class="w-5 h-5" />
							</div>
							<div>
								<p class="text-xs text-base-content/50 uppercase tracking-wider font-semibold mb-0.5">Teléfono Empresarial</p>
								<p class="text-base font-medium">{company?.business_phone || 'N/A'}</p>
							</div>
						</div>

						<div class="flex items-center gap-4 group">
							<div class="p-2 bg-base-200 rounded-lg group-hover:bg-accent/10 group-hover:text-accent transition-colors">
								<MapPin class="w-5 h-5" />
							</div>
							<div>
								<p class="text-xs text-base-content/50 uppercase tracking-wider font-semibold mb-0.5">Dirección Fiscal</p>
								<p class="text-base font-medium">{company?.address || 'N/A'}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- Historial de Compras -->
	<h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
		<ShoppingBag class="w-6 h-6 text-primary" />
		Historial de Compras
	</h2>

	<div class="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
		{#if !orders || orders.length === 0}
			<div class="p-8 text-center text-base-content/70">
				<ShoppingBag class="w-12 h-12 mx-auto mb-4 opacity-50" />
				<h3 class="text-lg font-semibold">No tienes compras registradas</h3>
				<p class="text-sm">Cuando realices una compra en la tienda, aparecerá aquí.</p>
				<a href="/productos" class="btn btn-primary mt-6">Ir a la tienda</a>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="table table-zebra w-full">
					<thead class="bg-base-200 text-base-content">
						<tr>
							<th>Fecha</th>
							<th>Estado</th>
							<th>Total</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{#each orders as order, index}
							<tr>
								<td>
									<div class="flex items-center gap-2">
										<Calendar class="w-4 h-4 text-base-content/50" />
										<span class="text-sm">{order.created_at ? formatDate(order.created_at) : 'N/A'}</span>
									</div>
								</td>
								<td>
									<span class="badge {statusBadgeColor(order.status)} badge-sm">
										{translateStatus(order.status || 'pending')}
									</span>
								</td>
								<td class="font-bold text-primary">${Number(order.total_amount).toFixed(2)}</td>
								<td class="text-right">
									<button 
										class="btn btn-sm btn-ghost gap-1"
										onclick={() => toggleOrderItems(index)}
										aria-label="Ver detalles"
									>
										Detalles
										{#if expandedOrderIndex === index}
											<ChevronUp class="w-4 h-4" />
										{:else}
											<ChevronDown class="w-4 h-4" />
										{/if}
									</button>
								</td>
							</tr>
							
							<!-- Subtabla para los ítems de la orden seleccionada -->
							{#if expandedOrderIndex === index}
								<tr>
									<td colspan="4" class="bg-base-200/50 p-0 border-b border-base-content/10">
										<div class="p-4">
											<div class="flex items-center justify-between mb-3">
												<h4 class="text-sm font-semibold flex items-center gap-2">
													<ShoppingBag class="w-4 h-4" />
													Detalles de la Orden
												</h4>
												<button 
													class="btn btn-xs btn-outline btn-primary gap-1"
													onclick={() => profile && generateInvoice(order, profile, company)}
													aria-label="Descargar Factura"
												>
													<Download class="w-3 h-3" />
													Factura
												</button>
											</div>
											
											<div class="overflow-x-auto rounded-box border border-base-300">
												<table class="table table-sm w-full bg-base-100">
													<thead class="bg-base-200/50 text-xs">
														<tr>
															<th>Producto</th>
															<th class="text-center">Cantidad</th>
															<th class="text-right">Precio Unitario</th>
															<th class="text-right">Subtotal</th>
														</tr>
													</thead>
													<tbody>
														{#if !order.order_items || order.order_items.length === 0}
															<tr>
																<td colspan="4" class="text-center text-xs py-3 text-base-content/50">
																	Sin detalles disponibles
																</td>
															</tr>
														{:else}
															{#each order.order_items as item}
																{@const products: any = item.products}
																{@const productName = Array.isArray(products) ? products[0]?.name : products?.name}
																<tr>
																	<td class="text-sm">{productName || 'Producto no disponible'}</td>
																	<td class="text-sm text-center font-medium">{item.quantity}</td>
																	<td class="text-sm text-right">${Number(item.price_at_purchase).toFixed(2)}</td>
																	<td class="text-sm text-right font-medium text-secondary">
																		${(item.quantity * Number(item.price_at_purchase)).toFixed(2)}
																	</td>
																</tr>
															{/each}
														{/if}
													</tbody>
													{#if order.total_amount}
														<tfoot class="bg-base-200/30">
															<tr>
																<th colspan="3" class="text-right text-xs uppercase tracking-wider">Total de la Orden:</th>
																<th class="text-right text-sm font-bold text-primary">${Number(order.total_amount).toFixed(2)}</th>
															</tr>
														</tfoot>
													{/if}
												</table>
											</div>
											
											<!-- Resumen inferior del detalle -->
											{#if order.payment_method}
												<div class="mt-4 flex gap-2 justify-end text-sm">
													<span class="text-base-content/60">Pagado con:</span>
													<span class="font-semibold capitalize badge badge-outline">{order.payment_method}</span>
												</div>
											{/if}
										</div>
									</td>
								</tr>
							{/if}
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>

	<!-- Mis Reparaciones -->
	<h2 class="text-2xl font-bold mb-6 mt-12 flex items-center gap-2">
		<Wrench class="w-6 h-6 text-success" />
		Mis Reparaciones
	</h2>

	<div class="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
		{#if !repairs || repairs.length === 0}
			<div class="p-8 text-center text-base-content/70">
				<Wrench class="w-12 h-12 mx-auto mb-4 opacity-50" />
				<h3 class="text-lg font-semibold">No tienes reparaciones registradas</h3>
				<p class="text-sm">Si dejas un equipo en nuestro taller, lo verás aquí.</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="table table-zebra w-full">
					<thead class="bg-base-200 text-base-content">
						<tr>
							<th>Guía</th>
							<th>Equipo</th>
							<th>Estado</th>
							<th>Fecha Ingreso</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{#each repairs as repair}
							<tr>
								<td>
									<span class="font-mono text-sm tracking-wider font-bold text-accent">{repair.tracking_code}</span>
								</td>
								<td class="font-medium">{repair.device_type}</td>
								<td>
									<span class="badge {repairStatusColor(repair.status)} badge-sm">
										{translateRepairStatus(repair.status)}
									</span>
								</td>
								<td>
									<div class="flex items-center gap-2">
										<Calendar class="w-4 h-4 text-base-content/50" />
										<span class="text-sm">{repair.created_at ? formatDate(repair.created_at) : 'N/A'}</span>
									</div>
								</td>
								<td class="text-right">
									<a 
										href={`/reparaciones/${repair.tracking_code}`}
										class="btn btn-sm btn-ghost gap-1"
										aria-label="Ver estado detallado"
									>
										Seguimiento
										<ExternalLink class="w-4 h-4" />
									</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
