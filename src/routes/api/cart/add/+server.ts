type CartRequestBody = {
  productId?: string;
  quantity?: number;
};

function toJson(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export const POST = async ({
  request,
  locals: { supabase, safeGetSession },
}: {
  request: Request;
  locals: App.Locals;
}) => {
  const { session, user } = await safeGetSession();

  if (!session || !user) {
    return toJson({ error: "Debes iniciar sesión para agregar al carrito." }, 401);
  }

  const body = (await request.json().catch(() => ({}))) as CartRequestBody;
  const productId = typeof body.productId === "string" ? body.productId : "";
  const quantity =
    Number.isFinite(body.quantity) && (body.quantity as number) > 0
      ? Math.floor(body.quantity as number)
      : 1;

  if (!productId) {
    return toJson({ error: "Producto inválido." }, 400);
  }

  const { data: product } = await supabase
    .from("products")
    .select("stock")
    .eq("id", productId)
    .eq("is_active", true)
    .maybeSingle();

  if (!product) {
    return toJson({ error: "Producto no encontrado." }, 404);
  }

  const { data: existingCartItem } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  const newQuantity = (existingCartItem?.quantity || 0) + quantity;

  if (newQuantity > product.stock) {
    return toJson(
      { error: `No hay suficiente stock. El límite es ${product.stock}.` },
      400,
    );
  }

  if (existingCartItem) {
    const { error: updateError } = await supabase
      .from("cart_items")
      .update({
        quantity: newQuantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingCartItem.id);

    if (updateError) {
      return toJson({ error: "No se pudo actualizar el carrito." }, 500);
    }
  } else {
    const { error: insertError } = await supabase.from("cart_items").insert({
      user_id: user.id,
      product_id: productId,
      quantity,
    });

    if (insertError) {
      return toJson({ error: "No se pudo agregar al carrito." }, 500);
    }
  }

  return toJson({ success: true, message: "Producto agregado al carrito." });
};
