import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import type { Tables } from "$lib/database.types";

export const load: LayoutServerLoad = async ({
  locals: { safeGetSession, supabase },
}) => {
  const { session, user } = await safeGetSession();

  if (!session || !user) {
    throw redirect(303, "/auth/login");
  }

  const { data: userData, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single<Pick<Tables<"users">, "role">>();

  if (error || !userData || userData.role !== "admin") {
    throw redirect(303, "/");
  }

  return {
    userRole: userData.role,
  };
};
