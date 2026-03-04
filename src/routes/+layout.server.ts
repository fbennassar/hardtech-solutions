import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({
  locals: { safeGetSession, supabase },
  cookies,
}) => {
  const { session, user } = await safeGetSession();
  let role = null;
  let cartCount = 0;
  let cartTotal = 0;

  if (user) {
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    role = userData?.role;

    const { data: cartData } = await supabase
      .from("cart_items")
      .select(
        `
        quantity,
        products ( price )
      `,
      )
      .eq("user_id", user.id);

    if (cartData) {
      cartCount = cartData.reduce((acc, item) => acc + item.quantity, 0);
      cartTotal = cartData.reduce((acc, item) => {
        // Handle Supabase join array or object
        const productData = Array.isArray(item.products)
          ? item.products[0]
          : item.products;
        return acc + item.quantity * (Number(productData?.price) || 0);
      }, 0);
    }
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("slug, name")
    .eq("is_active", true)
    .order("name");

  return {
    session,
    user,
    role,
    cartCount,
    cartTotal,
    categories: categories || [],
    cookies: cookies.getAll(),
  };
};
