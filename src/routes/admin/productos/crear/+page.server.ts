import { redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({
  locals: { supabase, safeGetSession },
}) => {
  const { session } = await safeGetSession();
  if (!session) {
    throw redirect(303, "/auth/login");
  }

  // Fetch categories for the select dropdown
  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name")
    .eq("is_active", true)
    .order("name");

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
    const sku = formData.get("sku") as string;
    const priceStr = formData.get("price") as string;
    const stockStr = formData.get("stock") as string;
    const category_id = formData.get("category_id") as string;
    const short_description = formData.get("short_description") as string;
    const long_description = formData.get("long_description") as string;
    const is_active = formData.get("is_active") === "true";

    if (!name || !slug || !sku || !priceStr || !stockStr) {
      return fail(400, { message: "Required fields are missing" });
    }

    const price = parseFloat(priceStr);
    const stock = parseInt(stockStr, 10);

    if (isNaN(price) || isNaN(stock)) {
      return fail(400, { message: "Price and stock must be numbers" });
    }

    // Handle file uploads
    const files = formData.getAll("images") as File[];
    const uploadedImagePaths: string[] = [];

    for (const file of files) {
      if (file.size > 0 && file.name) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          return fail(500, {
            message: "Failed to upload image",
            error: uploadError.message,
          });
        }

        uploadedImagePaths.push(filePath);
      }
    }

    // Insert into database
    const { error: insertError } = await supabase.from("products").insert({
      name,
      slug,
      sku,
      price,
      stock,
      category_id: category_id || null, // Handle empty category_id from select
      short_description,
      long_description,
      is_active,
      images: uploadedImagePaths.length > 0 ? uploadedImagePaths : null,
      updated_by: session.user.id,
    });

    if (insertError) {
      console.error("Error inserting product:", insertError);
      return fail(500, {
        message: "Failed to create product",
        error: insertError.message,
      });
    }

    throw redirect(303, "/admin/productos");
  },
};
