export type InspectionStatus =
  | 'pending'
  | 'payment_confirmed'
  | 'scheduled'
  | 'inspector_en_route'
  | 'completed'
  | 'cancelled';

export type InvoiceStatus = 'unpaid' | 'paid';

export interface Inspector {
  id: string;
  name: string;
  phone: string;
  location: string;
}

export interface InspectionRequest {
  id: string;           // UUID — backend will own this later
  orderId: string;      // BP-XXXXXX display ID
  status: InspectionStatus;
  createdAt: string;    // ISO string
  // Item
  productLink?: string;
  itemDescription: string;
  itemPrice: number;
  comments?: string;
  screenshotUrl?: string;
  // Buyer
  buyerFullName: string;
  buyerWhatsapp: string;
  buyerEmail: string;
  // Seller
  sellerName: string;
  sellerPhone: string;
  sellerAddress: string;
  // Assignment
  assignedInspectorId?: string;
  // Internal
  internalNotes?: string;
  // Invoice link
  invoiceId?: string;
}

export interface Invoice {
  id: string;
  token: string;          // UUID used in public /invoice/[token] URL
  invoiceNumber: string;  // INV-2025-001
  requestId: string;
  orderId: string;
  status: InvoiceStatus;
  inspectionFee: number;
  deliveryFee: number;
  total: number;
  dueDate: string;        // ISO string
  notes?: string;
  createdAt: string;
  // Customer (inherited from request at creation time)
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
}
