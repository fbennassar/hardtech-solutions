import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface OrderItem {
  quantity: number;
  price_at_purchase: number;
  products: {
    name: string;
  } | { name: string }[];
}

interface OrderData {
  id: string;
  created_at: string;
  total_amount: number;
  payment_method?: string;
  order_items: OrderItem[];
}

interface ProfileData {
  full_name: string;
  email: string;
  phone?: string;
}

interface CompanyData {
  company_name: string;
  rif: string;
  address?: string;
  business_phone?: string;
}

export const generateInvoice = (
  order: OrderData,
  profile: ProfileData,
  company?: CompanyData | null
) => {
  // Crear documento PDF
  const doc = new jsPDF();

  // Color primario oscuro (similar al diseño)
  const primaryColor = [20, 25, 35] as [number, number, number];
  const accentColor = [16, 185, 129] as [number, number, number]; // Verde success

  // ---- CABECERA ----
  // Título: HardTech Solutions
  doc.setFontSize(24);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("HardTech Solutions", 14, 22);

  // Subtítulo: Factura Comercial
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  doc.text("Soluciones Tecnológicas de Alta Calidad", 14, 28);

  // Detalles de la Orden alineados a la derecha
  const invoiceId = `FAC-${String(order.id).substring(0, 8).toUpperCase()}`;
  
  // Date in America/Caracas timezone
  const dateObj = new Date(order.created_at);
  const formatter = new Intl.DateTimeFormat("es-VE", {
    timeZone: "America/Caracas",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
  const dateStr = formatter.format(dateObj);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text(`FACTURA N°:`, 140, 22);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(invoiceId, 172, 22);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Fecha:", 140, 28);
  doc.setFont("helvetica", "normal");
  doc.text(dateStr, 155, 28);

  // Línea separadora
  doc.setDrawColor(220, 220, 220);
  doc.line(14, 34, 196, 34);

  // ---- INFORMACIÓN DEL CLIENTE ----
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Facturar a:", 14, 42);

  let currentY = 48;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  if (company) {
    doc.setFont("helvetica", "bold");
    doc.text(company.company_name, 14, currentY);
    doc.setFont("helvetica", "normal");
    currentY += 6;
    doc.text(`RIF: ${company.rif}`, 14, currentY);
    currentY += 6;
    if (company.address) {
      doc.text(`Dirección: ${company.address}`, 14, currentY);
      currentY += 6;
    }
    if (company.business_phone) {
      doc.text(`Teléfono: ${company.business_phone}`, 14, currentY);
      currentY += 6;
    }
    doc.text(`Ate. ${profile.full_name}`, 14, currentY);
  } else {
    doc.setFont("helvetica", "bold");
    doc.text(profile.full_name, 14, currentY);
    doc.setFont("helvetica", "normal");
    currentY += 6;
    doc.text(`Email: ${profile.email}`, 14, currentY);
    currentY += 6;
    if (profile.phone) {
      doc.text(`Teléfono: ${profile.phone}`, 14, currentY);
      currentY += 6;
    }
  }

  // Información de Pago
  if (order.payment_method) {
    const methodTranslate: Record<string, string> = {
      pago_movil: "Pago Móvil C2P",
      tarjeta: "Tarjeta de Crédito / Débito",
      paypal: "PayPal",
      zelle: "Zelle",
      transferencia: "Transferencia Bancaria"
    };
    
    doc.setFont("helvetica", "bold");
    doc.text("Método de Pago:", 140, 48);
    doc.setFont("helvetica", "normal");
    const methodStr = methodTranslate[order.payment_method] || order.payment_method;
    doc.text(methodStr.toUpperCase(), 140, 54);
  }

  currentY += 6;

  // ---- TABLA DE PRODUCTOS ----
  const tableData = (order.order_items || []).map(item => {
    const productsArray = Array.isArray(item.products) ? item.products : [item.products];
    const productName = productsArray[0]?.name || "Producto no especificado";
    const price = Number(item.price_at_purchase) || 0;
    const qty = item.quantity || 0;
    const subtotal = price * qty;
    
    return [
      productName,
      qty.toString(),
      `$${price.toFixed(2)}`,
      `$${subtotal.toFixed(2)}`
    ];
  });

  autoTable(doc, {
    startY: currentY + 4,
    head: [["Descripción", "Cantidad", "Precio Unitario", "Subtotal"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 30, halign: "center" },
      2: { cellWidth: 40, halign: "right" },
      3: { cellWidth: 40, halign: "right" },
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // ---- TOTALES ----
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("TOTAL:", 150, finalY);
  
  doc.setFontSize(14);
  doc.setTextColor(...accentColor);
  doc.text(`$${Number(order.total_amount).toFixed(2)}`, 196, finalY, { align: "right" });

  // ---- POLÍTICAS DE GARANTÍA ----
  const warrantyY = finalY + 25;
  doc.setFillColor(245, 245, 245);
  doc.rect(14, warrantyY - 6, 182, 24, "F");
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("Términos de Garantía:", 18, warrantyY);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("• Se otorga (1) un mes de garantía por cada artículo adquirido.", 18, warrantyY + 6);
  doc.text("• La garantía debe ser procesada directamente en nuestra tienda física presentando esta factura.", 18, warrantyY + 11);
  doc.text("• No aplica por daños de mal uso, golpes estructurales o daños por fluctuaciones eléctricas.", 18, warrantyY + 16);

  // Pie de página
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("www.hardtechsolutions.com | Soporte Técnico: contacto@hardtech.com", 105, 285, { align: "center" });

  // Guardar documento
  doc.save(`${invoiceId}.pdf`);
};
