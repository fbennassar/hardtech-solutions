import { redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({
  locals: { supabase, safeGetSession },
}) => {
  const { session } = await safeGetSession();
  if (!session) {
    throw redirect(303, "/auth/login");
  }

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching categories:", error);
  }

  return {
    categories: categories ?? [],
  };
};

export const actions: Actions = {
  create: async ({ request, locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession();
    if (!session) return fail(401, { message: "Unauthorized" });

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const is_active = formData.get("is_active") === "true";

    if (!name || !slug) {
      return fail(400, { message: "Name and slug are required" });
    }

    const { error } = await supabase.from("categories").insert({
      name,
      slug,
      description,
      is_active,
      updated_by: session.user.id,
    });

    if (error) {
      console.error("Error creating category:", error);
      return fail(500, {
        message: "Failed to create category",
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
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const is_active = formData.get("is_active") === "true";

    if (!id || !name || !slug) {
      return fail(400, { message: "ID, Name and slug are required" });
    }

    const { error } = await supabase
      .from("categories")
      .update({
        name,
        slug,
        description,
        is_active,
        updated_by: session.user.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating category:", error);
      return fail(500, {
        message: "Failed to update category",
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
      return fail(400, { message: "ID is required" });
    }

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      console.error("Error deleting category:", error);
      return fail(500, {
        message: "Failed to delete category",
        error: error.message,
      });
    }

    return { success: true };
  },
};
