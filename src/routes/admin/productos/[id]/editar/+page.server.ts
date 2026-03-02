import { redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({
  params,
  locals: { supabase, safeGetSession },
}) => {
  const { session } = await safeGetSession();
  if (!session) {
    throw redirect(303, "/auth/login");
  }

  const id = params.id;

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (productError || !product) {
    throw redirect(303, "/admin/productos");
  }

  // Fetch categories for the select dropdown
  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("id, name")
    .eq("is_active", true)
    .order("name");

  if (categoriesError) {
    console.error("Error fetching categories:", categoriesError);
  }

  return {
    product,
    categories: categories ?? [],
  };
};

export const actions: Actions = {
  update: async ({ request, params, locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession();
    if (!session) return fail(401, { message: "Unauthorized" });

    const id = params.id;
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
    let uploadedImagePaths: string[] = [];
    const newImages = files.filter((f) => f.size > 0 && f.name);

    if (newImages.length > 0) {
      for (const file of newImages) {
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

    // Fetch existing images if no new images are uploaded (simplistic approach for now)
    // Or append to existing. Let's fetch existing and append new ones.
    const { data: existingData } = await supabase
      .from("products")
      .select("images")
      .eq("id", id)
      .single();
    let currentImages = Array.isArray(existingData?.images)
      ? existingData.images
      : [];

    const finalImages =
      uploadedImagePaths.length > 0
        ? [...currentImages, ...uploadedImagePaths]
        : currentImages;

    // Update database
    const { error: updateError } = await supabase
      .from("products")
      .update({
        name,
        slug,
        sku,
        price,
        stock,
        category_id: category_id || null, // Handle empty category_id from select
        short_description,
        long_description,
        is_active,
        images: finalImages.length > 0 ? finalImages : null,
        updated_by: session.user.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      console.error("Error updating product:", updateError);
      return fail(500, {
        message: "Failed to update product",
        error: updateError.message,
      });
    }

    throw redirect(303, "/admin/productos");
  },

  deleteImage: async ({
    request,
    params,
    locals: { supabase, safeGetSession },
  }) => {
    const { session } = await safeGetSession();
    if (!session) return fail(401, { message: "Unauthorized" });

    const id = params.id;
    const formData = await request.formData();
    const imagePath = formData.get("imagePath") as string;

    if (!imagePath) return fail(400, { message: "Image path required" });

    // 1. Fetch current images
    const { data: product } = await supabase
      .from("products")
      .select("images")
      .eq("id", id)
      .single();
    if (!product || !Array.isArray(product.images))
      return fail(400, { message: "Product has no images" });

    // 2. Remove from DB array
    const updatedImages = product.images.filter(
      (img: string) => img !== imagePath,
    );

    const { error: dbError } = await supabase
      .from("products")
      .update({ images: updatedImages.length > 0 ? updatedImages : null })
      .eq("id", id);

    if (dbError)
      return fail(500, { message: "Failed to update product images" });

    // 3. Remove from storage
    const { error: storageError } = await supabase.storage
      .from("products")
      .remove([imagePath]);
    if (storageError)
      console.error("Failed to delete from storage:", storageError.message);

    return { success: true };
  },
};
