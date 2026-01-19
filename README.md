# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

# 📘 Documentación Técnica de Base de Datos
**Proyecto:** Sistema Integral de Gestión (B2B + Ecommerce + Taller)
**Stack:** PostgreSQL (Supabase) | Prisma ORM | TypeScript
**Versión Schema:** 1.0

---

## 🧭 Introducción
Esta base de datos unifica tres modelos de negocio en una sola estructura relacional:
1.  **Taller de Reparaciones:** Gestión de tickets, repuestos y diagnósticos.
2.  **Servicios B2B (Empresas):** Planes de mantenimiento, créditos prepagados y gestión de activos.
3.  **Ecommerce:** Venta de productos y repuestos al público general.

---

## 1. Módulo de Usuarios y Seguridad (Core)

No separamos "Admins" de "Clientes" en tablas distintas. Todos son `User`, pero con permisos diferentes.

### Tabla: `users`
**Propósito:** Almacena a todos los actores del sistema.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID | Vinculado a Supabase Auth. |
| `role` | Enum | `CLIENT` (Normal), `BUSINESS` (Empresa), `ADMIN` (Técnico). |
| `repairCredit` | Decimal | "Billetera virtual" para empresas. Se descuenta al cerrar tickets. |
| `plan` | Enum | Nivel de contrato (`NONE`, `BASIC`, `PYME`, `CORP`). |

> **⚠️ Nota de Seguridad:** El rol `ADMIN` nunca debe asignarse desde el Frontend. Solo mediante SQL directo o Dashboard de Supabase.

---

## 2. Módulo de Operaciones B2B (Finanzas)

Este módulo gestiona la relación a largo plazo con empresas (Retainers).

### Tabla: `credit_transactions`
**Propósito:** Auditoría financiera inmutable.
**Regla:** Nunca editamos `User.repairCredit` manualmente sin insertar un registro aquí que explique el cambio.

* **`type`:** `DEPOSIT` (Pago de plan), `USAGE` (Gasto en reparación).
* **`referenceId`:** ID del Ticket que consumió el saldo.

### Tabla: `maintenance_visits`
**Propósito:** Agenda proactiva. El sistema debe saber cuándo toca la próxima visita técnica.

---

## 3. Módulo de Reparaciones (Ticketing)

Gestión de activos y flujo de trabajo del taller.

### Tabla: `devices` (Activos)
**Propósito:** Hoja de vida del equipo del cliente.
**¿Por qué?** Permite rastrear si una "Laptop Dell" específica ha fallado múltiples veces, independientemente de quién reporte el problema.

### Tabla: `tickets`
**Propósito:** El evento de reparación.

* **`code`:** Código CUID corto (ej: `cl5x...`) para seguimiento público sin login.
* **`status`:** `PENDING` → `DIAGNOSIS` → `WAITING_PARTS` → `READY`.
* **`isPaidByCredit`:** Si es `TRUE`, el costo se cobra del saldo a favor de la empresa.

### Tabla: `ticket_parts`
**Propósito:** Relación M-to-N entre Tickets y Productos. Resta stock del inventario principal al usarse.

---

## 4. Módulo de Ecommerce (Tienda)

Venta de productos finales y repuestos.

### Tabla: `products`
**Propósito:** Catálogo unificado (Tienda + Taller).

* **`slug`:** URL amigable SEO (ej: `memoria-ram-8gb`). **Debe ser único.**
* **`isVisible`:** Permite ocultar repuestos internos (ej: tornillos) de la tienda pública.
* **`compareAtPrice`:** Precio "Tachado" para ofertas visuales.
* **`price`:** Precio real de venta actual.

### Tabla: `orders` y `order_items`
**Propósito:** Registro de ventas.

> **💡 CONCEPTO CLAVE: Histórico de Precios**
> La tabla `order_items` tiene su propio campo `price`.
> * **Product.price:** Es el precio **Presente** (Catálogo).
> * **OrderItem.price:** Es el precio **Pasado** (Histórico).
>
> Si cambiamos el precio de un producto hoy, las órdenes antiguas **NO** deben cambiar. Por eso copiamos el precio al momento de crear la orden.

### Tabla: `carts` (Persistencia)
**Propósito:** Permite que el carrito sobreviva si el usuario cierra el navegador o cambia de dispositivo.

---

## 5. Guía de Relaciones (Cheat Sheet)

Cómo conectar los datos al hacer consultas (`include` en Prisma):

* **Ver historial de compras:**
    `User` → `Order` → `OrderItem` → `Product`
* **Ver qué repuestos se usaron en una reparación:**
    `Ticket` → `TicketPart` → `Product`
* **Ver por qué un cliente tiene saldo a favor:**
    `User` → `CreditTransaction`
* **Ver historial de fallas de una máquina:**
    `Device` → `Ticket`

---

## 6. Buenas Prácticas para el Equipo

1.  **Manejo de Dinero:**
    * Siempre usar tipo `Decimal` en Backend/DB.
    * Nunca confiar en cálculos de precios enviados desde el Frontend. El Backend siempre debe buscar el precio en la BD.

2.  **Slugs:**
    * Formato: `todo-en-minusculas-separado-por-guiones`.
    * No cambiar el slug una vez el producto ha sido compartido en redes sociales (rompe el enlace).

3.  **Estados (Enums):**
    * Respetar estrictamente los estados definidos en `schema.prisma`. No usar strings mágicos como "Terminado" si el enum es `DELIVERED`.

---
*Generado para el equipo de desarrollo - Enero 2026*
