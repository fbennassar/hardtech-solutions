import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({
  locals: { safeGetSession, supabase },
  cookies,
}) => {
  const { session, user } = await safeGetSession();
  let role = null;

  if (user) {
    const { data } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    role = data?.role;
  }

  return {
    session,
    user,
    role,
    cookies: cookies.getAll(),
  };
};
