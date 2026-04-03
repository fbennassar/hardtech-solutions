import { redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({
  locals: { supabase, safeGetSession },
}) => {
  const { session } = await safeGetSession();
  if (!session) {
    throw redirect(303, "/auth/login");
  }

  const { data: repairs, error } = await supabase
    .from("repairs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching repairs:", error);
  }

  const { data: users, error: usersError } = await supabase
    .from("users")
    .select(`
      id, 
      email, 
      full_name, 
      phone,
      account_type,
      companies (
        company_name,
        business_phone
      )
    `);

  if (usersError) {
    console.error("Error fetching users:", usersError);
  }

  return {
    repairs: repairs ?? [],
    customers: users ?? [],
  };
};

export const actions: Actions = {
  create: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession();
    if (!session) return fail(401, { message: "Unauthorized" });

    const formData = await request.formData();
    const tracking_code = formData.get("tracking_code") as string;
    const client_name = formData.get("client_name") as string;
    const client_email = formData.get("client_email") as string;
    const client_phone = formData.get("client_phone") as string;
    const device_type = formData.get("device_type") as string;
    const issues = formData.get("issues") as string;
    
    let finalUserId: string | null = null;
    if (client_email) {
      const { data: matchedUser } = await supabase.from("users").select("id").eq("email", client_email.toLowerCase().trim()).maybeSingle();
      if (matchedUser) {
        finalUserId = matchedUser.id;
      }
    }
    const generateCode = () => 'GF-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const finalTracking = tracking_code || generateCode();

    if (!client_name || !device_type || !issues) {
      return fail(400, { message: "Nombre, tipo de dispositivo y fallas son requeridos." });
    }

    const { error } = await supabase.from("repairs").insert({
      tracking_code: finalTracking,
      client_name,
      client_email: client_email || null,
      client_phone: client_phone || null,
      device_type,
      issues,
      user_id: finalUserId,
      status: "diagnostico",
      diagnostico_date: new Date().toISOString()
    });

    if (error) {
      console.error("Error creating repair:", error);
      return fail(500, {
        message: "Error al crear la reparación",
        error: error.message,
      });
    }

    return { success: true };
  },

  update: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession();
    if (!session) return fail(401, { message: "Unauthorized" });

    const formData = await request.formData();
    const id = formData.get("id") as string;
    const client_name = formData.get("client_name") as string;
    const client_email = formData.get("client_email") as string;
    const client_phone = formData.get("client_phone") as string;
    const device_type = formData.get("device_type") as string;
    const issues = formData.get("issues") as string;
    const status = formData.get("status") as 'diagnostico'|'en_progreso'|'lista_retirar'|'retirada';
    const total_cost = Number(formData.get("total_cost") || 0);

    let finalUserId: string | null = null;
    if (client_email) {
      const { data: matchedUser } = await supabase.from("users").select("id").eq("email", client_email.toLowerCase().trim()).maybeSingle();
      if (matchedUser) {
        finalUserId = matchedUser.id;
      }
    }

    if (!id || !status) {
      return fail(400, { message: "ID y Estado son requeridos" });
    }

    // Check previous status
    const { data: currentRecord } = await supabase.from("repairs").select("*").eq("id", id).single();
    if (!currentRecord) return fail(404, { message: "Reparación no encontrada" });

    const updates: any = {
      client_name,
      client_email: client_email || null,
      client_phone: client_phone || null,
      device_type,
      issues,
      user_id: finalUserId,
      status,
      total_cost,
      updated_at: new Date().toISOString(),
    };

    // Si cambia el estado, actualizamos la fecha de entrada a ese estado
    if (status !== currentRecord.status) {
      const now = new Date().toISOString();
      if (status === 'diagnostico') updates.diagnostico_date = now;
      if (status === 'en_progreso') updates.en_progreso_date = now;
      if (status === 'lista_retirar') updates.lista_retirar_date = now;
      if (status === 'retirada') updates.retirada_date = now;
    }

    const { error } = await supabase.from("repairs").update(updates).eq("id", id);

    if (error) {
      console.error("Error updating repair:", error);
      return fail(500, {
        message: "Error al actualizar la reparación",
        error: error.message,
      });
    }

    return { success: true };
  },

  delete: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession();
    if (!session) return fail(401, { message: "Unauthorized" });

    const formData = await request.formData();
    const id = formData.get("id") as string;

    if (!id) {
      return fail(400, { message: "ID no válido" });
    }

    const { error } = await supabase.from("repairs").delete().eq("id", id);

    if (error) {
      console.error("Error deleting repair:", error);
      return fail(500, {
        message: "Error al eliminar la reparación",
        error: error.message,
      });
    }

    return { success: true };
  },
};
