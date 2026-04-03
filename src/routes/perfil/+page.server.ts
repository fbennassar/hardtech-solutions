import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({
  locals: { safeGetSession, supabase },
}) => {
  const { session, user } = await safeGetSession();

  if (!session || !user) {
    throw redirect(303, "/auth/login");
  }

  // 1. Obtener datos del usuario
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id, full_name, email, phone, account_type, address, dni")
    .eq("id", user.id)
    .single();

  if (userError) {
    console.error("Error fetching user data:", userError);
  }

  // 2. Si es empresa, obtener datos de la compañía
  let companyData = null;
  if (userData?.account_type === "business") {
    const { data: cData, error: cError } = await supabase
      .from("companies")
      .select("rif, company_name, address, business_phone")
      .eq("user_id", user.id)
      .single();

    if (cError) {
      console.error("Error fetching company data:", cError);
    } else {
      companyData = cData;
    }
  }

  // 3. Obtener el historial de órdenes del usuario con artículos
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(`
      id,
      created_at,
      total_amount,
      status,
      payment_method,
      order_items (
        id,
        quantity,
        price_at_purchase,
        products (
          name
        )
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("Error fetching orders:", ordersError);
  }

  // 4. Obtener las reparaciones del usuario
  const { data: repairs, error: repairsError } = await supabase
    .from("repairs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (repairsError) {
    console.error("Error fetching repairs:", repairsError);
  }

  return {
    profile: userData,
    company: companyData,
    orders: orders || [],
    repairs: repairs || [],
  };
};
