import { env as public_env } from '$env/dynamic/public';
import { env as private_env } from '$env/dynamic/private';

type PublicEnvKeys = keyof typeof public_env;
/**
 * Función para obtener variables de entorno con validación.
 * En modo profesional, lanzamos un error descriptivo si falta una variable vital.
 */
 function getEnvVar(name: string): string {
   // Usamos aserción de tipo para poder indexar
   // Esto le dice a TS: "Trata este objeto como algo que puede ser indexado por strings"
   const p_env = public_env as Record<string, string | undefined>;
   const priv_env = private_env as Record<string, string | undefined>;
 
   const value = p_env[name] || priv_env[name];
 
   if (!value) {
     throw new Error(`[Config Error]: ${name} is missing`);
   }
 
   return value;
 }

export const config = {
    supabase: {
        url: getEnvVar('PUBLIC_SUPABASE_URL'),
        anonKey: getEnvVar('PUBLIC_SUPABASE_PB_KEY'),
    },
    // Aquí podrías añadir más (Stripe, APIs externas, etc.)
} as const;