import type { InspectionStatus } from '@/app/lib/types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.message ?? `Request failed: ${res.status}`);
  }
  return json.data as T;
}

export const api = {
  // Inspection Requests
  getRequests: (status?: string) =>
    request<InspectionRequest[]>(
      status ? `/inspection-requests?status=${status}` : '/inspection-requests',
    ),
  getRequest: (orderId: string) =>
    request<InspectionRequest>(`/inspection-requests/${orderId}`),
  updateRequest: (orderId: string, body: Partial<InspectionRequest>) =>
    request<InspectionRequest>(`/inspection-requests/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  updateRequestStatus: (orderId: string, status: string, assignedInspectorName?: string) =>
    request<InspectionRequest>(`/inspection-requests/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, assignedInspectorName }),
    }),

  // Invoices
  getInvoices: () => request<Invoice[]>('/invoices'),
  getInvoice: (id: string) => request<Invoice>(`/invoices/${id}`),
  getInvoiceByToken: (token: string) => request<Invoice>(`/invoices/by-token/${token}`),
  getInvoiceByRequest: (requestId: string) =>
    request<Invoice | null>(`/invoices/by-request/${requestId}`),
  createInvoice: (body: CreateInvoicePayload) =>
    request<Invoice>('/invoices', { method: 'POST', body: JSON.stringify(body) }),
  updateInvoiceStatus: (id: string, status: 'paid' | 'unpaid') =>
    request<Invoice>(`/invoices/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Payment
  initiatePayment: (token: string) =>
    request<{ redirectUrl: string }>('/payment/initiate', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),
};

// Local types mirroring the backend shape
export interface InspectionRequest {
  id: string;
  orderId: string;
  status: InspectionStatus;
  productLink?: string;
  itemPrice: number;
  comments?: string;
  screenshotUrl?: string;
  buyerFullName: string;
  buyerWhatsapp: string;
  buyerEmail: string;
  sellerName: string;
  sellerPhone: string;
  sellerAddress: string;
  assignedInspectorName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  token: string;
  invoiceNumber: string;
  requestId: string;
  orderId: string;
  status: 'unpaid' | 'paid';
  inspectionFee: number;
  deliveryFee: number;
  total: number;
  dueDate: string;
  notes?: string | null;
  customerName: string;
  customerEmail?: string | null;
  customerWhatsapp: string;
  createdAt: string;
}

export interface CreateInvoicePayload {
  requestId: string;
  orderId: string;
  inspectionFee: number;
  deliveryFee: number;
  dueDate: string;
  notes?: string;
  customerName: string;
  customerEmail?: string;
  customerWhatsapp: string;
}
