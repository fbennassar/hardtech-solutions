import { createBrowserClient, isBrowser, parse } from "@supabase/ssr";
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_PB_KEY,
} from "$env/static/public";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
  depends("supabase:auth");

  const supabase = createBrowserClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_PB_KEY,
    {
      global: {
        fetch,
      },
    },
  );

  const { session, user, role, categories, cartCount, cartTotal } = data;

  return { supabase, session, user, role, categories, cartCount, cartTotal };
};
