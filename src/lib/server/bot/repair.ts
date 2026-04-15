import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "$lib/database.types";

export async function checkRepairStatus(
  supabase: SupabaseClient<Database>,
  trackingCode: string
): Promise<string> {
  const { data: repair, error } = await supabase
    .from("repairs")
    .select("status, device_type, issues, total_cost, diagnostico_date, en_progreso_date, lista_retirar_date")
    .eq("tracking_code", trackingCode.toUpperCase())
    .single();

  if (error || !repair) {
    return "No encontré ninguna reparación con esa guía. Por favor verifica que esté escrita correctamente.";
  }

  const { status, device_type, issues, total_cost } = repair;
  
  let statusText = "";
  switch (status) {
    case "diagnostico":
      statusText = "En diagnóstico";
      break;
    case "en_progreso":
      statusText = "En proceso de reparación";
      break;
    case "lista_retirar":
      statusText = "Lista para ser retirada";
      break;
    case "retirada":
      statusText = "Ya fue retirada";
      break;
    default:
      statusText = status;
  }

  return `Reparación encontrada:\n- Dispositivo: ${device_type}\n- Falla reportada: ${issues}\n- Estado actual: ${statusText}\n- Costo total estimado: $${total_cost}`;
}
