import type { Actions, PageServerLoad } from "./$types";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(name, slug)
    `,
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return {
      products: [],
    };
  }

  return {
    products: products || [],
  };
};

export const actions: Actions = {
  addToCart: async ({ request, locals: { safeGetSession, supabase } }) => {
    const { session, user } = await safeGetSession();

    if (!session || !user) {
      return fail(401, { error: "No autorizado" });
    }

    const formData = await request.formData();
    const productId = formData.get("product_id") as string;
    const quantityStr = formData.get("quantity") as string;
    const quantity = parseInt(quantityStr, 10) || 1;

    if (!productId) {
      return fail(400, { error: "ID de producto inválido" });
    }

    // Verify product exists and get stock
    const { data: product } = await supabase
      .from("products")
      .select("stock")
      .eq("id", productId)
      .eq("is_active", true)
      .maybeSingle();

    if (!product) {
      return fail(404, { error: "Producto no encontrado" });
    }

    // Check if item is already in cart
    const { data: existingCartItem } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .maybeSingle();

    const newQuantity = (existingCartItem?.quantity || 0) + quantity;

    if (newQuantity > product.stock) {
      return fail(400, {
        error: `No hay suficiente stock. El límite es ${product.stock}.`,
      });
    }

    if (existingCartItem) {
      // Update quantity
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({
          quantity: newQuantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingCartItem.id);

      if (updateError) {
        return fail(500, { error: "Error al actualizar el carrito" });
      }
    } else {
      // Insert new item
      const { error: insertError } = await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: productId,
        quantity,
      });

      if (insertError) {
        return fail(500, { error: "Error al agregar al carrito" });
      }
    }

    return {
      success: true,
      message: "Producto añadido al carrito exitosamente",
    };
  },
};
