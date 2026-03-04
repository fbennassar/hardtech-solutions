import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({
  params,
  locals: { supabase },
}) => {
  const { slug } = params;

  // Fetch category
  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id, name, description, slug")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (categoryError || !category) {
    throw error(404, { message: "Categoría no encontrada" });
  }

  // Fetch products in category
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(name, slug)
    `,
    )
    .eq("category_id", category.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (productsError) {
    console.error("Error fetching category products:", productsError);
  }

  return {
    category,
    products: products || [],
  };
};
