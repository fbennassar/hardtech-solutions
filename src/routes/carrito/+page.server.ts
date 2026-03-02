import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({
  locals: { safeGetSession, supabase },
}) => {
  const { session, user } = await safeGetSession();

  if (!session || !user) {
    throw redirect(303, "/auth/login");
  }

  const { data: cartItems, error } = await supabase
    .from("cart_items")
    .select(
      `
      id,
      quantity,
      products (
        id,
        name,
        slug,
        price,
        stock,
        images
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching cart items:", error);
    return {
      cartItems: [],
    };
  }

  return {
    cartItems: cartItems || [],
  };
};

export const actions: Actions = {
  updateQuantity: async ({ request, locals: { safeGetSession, supabase } }) => {
    const { session, user } = await safeGetSession();

    if (!session || !user) {
      return fail(401, { error: "No autorizado" });
    }

    const formData = await request.formData();
    const cartItemId = formData.get("cartItemId") as string;
    const action = formData.get("action") as "increment" | "decrement";

    if (!cartItemId || !action) {
      return fail(400, { error: "Datos inválidos" });
    }

    // Obtener la cantidad actual y el stock disponible
    const { data: currentItem } = await supabase
      .from("cart_items")
      .select(
        `
            id, 
            quantity,
            product_id,
            products ( stock )
        `,
      )
      .eq("id", cartItemId)
      .eq("user_id", user.id)
      .single();

    if (!currentItem) {
      return fail(404, { error: "Item no encontrado" });
    }

    let newQuantity = currentItem.quantity;
    const stockProducts = Array.isArray(currentItem.products)
      ? currentItem.products[0]
      : currentItem.products;
    const stock = (stockProducts as any)?.stock;

    if (action === "increment") {
      if (newQuantity < stock) {
        newQuantity += 1;
      } else {
        return fail(400, { error: "No hay suficiente stock" });
      }
    } else if (action === "decrement") {
      if (newQuantity > 1) {
        newQuantity -= 1;
      } else {
        return fail(400, { error: "La cantidad no puede ser menor a 1" });
      }
    }

    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
      .eq("id", cartItemId);

    if (updateError) {
      return fail(500, { error: "Error al actualizar la cantidad" });
    }

    return { success: true };
  },

  removeItem: async ({ request, locals: { safeGetSession, supabase } }) => {
    const { session, user } = await safeGetSession();

    if (!session || !user) {
      return fail(401, { error: "No autorizado" });
    }

    const formData = await request.formData();
    const cartItemId = formData.get("cartItemId") as string;

    if (!cartItemId) {
      return fail(400, { error: "ID de item inválido" });
    }

    const { error: deleteError } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId)
      .eq("user_id", user.id); // Asegura que solo pueda borrar sus propios items

    if (deleteError) {
      return fail(500, { error: "Error al eliminar el producto del carrito" });
    }

    return { success: true };
  },
};
