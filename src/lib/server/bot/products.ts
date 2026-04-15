import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "$lib/database.types";

export type SearchParams = {
  query?: string;
  category?: string;
  maxBudget?: number;
};

export async function searchProducts(
  supabase: SupabaseClient<Database>,
  params: SearchParams
) {
  let dbQuery = supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      stock,
      short_description,
      category:categories (name, slug)
    `)
    .eq("is_active", true)
    .gt("stock", 0)
    .limit(20);

  if (params.query) {
    // Split into words, discard common small words, and search all independently
    const stopWords = new Set(["el", "la", "los", "las", "un", "una", "unos", "unas", "de", "para", "con", "que", "mas", "más", "muy", "potente", "barato", "caro", "usado", "nuevo"]);
    const words = params.query
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w))
      .slice(0, 3); // Max 3 words to avoid db crashes

    if (words.length > 0) {
      words.forEach((word) => {
        const q = word.replace(/%/g, "\\%"); // sanitize
        dbQuery = dbQuery.or(`name.ilike.%${q}%,short_description.ilike.%${q}%,slug.ilike.%${q}%`);
      });
    } else {
      // Fallback if all words were stripped out
      const q = params.query.replace(/%/g, "\\%");
      dbQuery = dbQuery.or(`name.ilike.%${q}%,short_description.ilike.%${q}%,slug.ilike.%${q}%`);
    }
  }

  if (params.maxBudget) {
    dbQuery = dbQuery.lte("price", params.maxBudget);
  }

  const { data, error } = await dbQuery;

  if (error || !data || data.length === 0) {
    return {
      message: "No encontré productos que coincidan exactamente con la búsqueda (o no hay stock). Intenta con una búsqueda más general.",
      results: [],
      rawProducts: []
    };
  }

  const results = data.map((item) => {
    // Handle the relationship correctly
    const cat = Array.isArray(item.category) ? item.category[0] : item.category;
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      stock: item.stock,
      description: item.short_description || "",
      category: cat ? cat.name : "Sin categoría"
    };
  });

  const rawProducts = data.map((item) => {
    const cat = Array.isArray(item.category) ? item.category[0] : item.category;
    return {
      ...item,
      category: cat
    };
  });

  return {
    message: `Encontré los siguientes productos que te podrían servir. Usa esta información para asesorar al usuario y VÉNDELE LAS CARACTERÍSTICAS PRINCIPALES O RECOMENDACIÓN.`,
    results,
    rawProducts
  };
}
