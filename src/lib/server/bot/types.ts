export type ProductCard = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  short_description: string | null;
  category?: {
    name: string;
    slug: string;
  } | null;
};

export type ChatHistory = {
  role: "user" | "assistant";
  text: string;
};
