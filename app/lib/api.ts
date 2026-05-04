import type { InspectionStatus } from './types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export function getErrorMessage(err: unknown, fallback: string) {
  return err instanceof Error && err.message ? err.message : fallback;
}

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

  // Upload
  uploadFile: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${BASE}/upload`, { method: 'POST', body: formData });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.message ?? 'Upload failed');
    return json.data as { url: string };
  },

  // Submit inspection request
  submitRequest: (body: SubmitRequestPayload) =>
    request<{ orderId: string }>('/inspection-requests', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  // Payment
  initiatePayment: (token: string) =>
    request<{ redirectUrl: string }>('/payment/initiate', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  // Questionnaire
  submitQuestionnaire: (body: QuestionnairePayload) =>
    request<QuestionnaireResponse>('/questionnaire-responses', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  getQuestionnaireResponses: () =>
    request<QuestionnaireResponse[]>('/questionnaire-responses'),
  getQuestionnaireResponse: (id: string) =>
    request<QuestionnaireResponse>(`/questionnaire-responses/${id}`),
  updateQuestionnaireResponse: (id: string, body: QuestionnaireAdminUpdatePayload) =>
    request<QuestionnaireResponse>(`/questionnaire-responses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  // Waitlist
  joinWaitlist: (body: WaitlistPayload) =>
    request<WaitlistEntry>('/waitlist', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  getWaitlistEntries: () => request<WaitlistEntry[]>('/waitlist'),
  updateWaitlistEntry: (id: string, body: WaitlistAdminUpdatePayload) =>
    request<WaitlistEntry>(`/waitlist/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
};

export interface SubmitRequestPayload {
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
}

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

export type QuestionnaireLeadStatus = 'new' | 'contacted' | 'converted' | 'not_interested';
export type UserType = 'buyer' | 'seller' | 'both';
export type TernaryAnswer = 'yes' | 'maybe' | 'no';
export type ScamExperience = 'yes' | 'no' | 'almost';

export interface QuestionnairePayload {
  userType: UserType;
  tradeCategories: string[];
  tradeCategoryOther?: string;
  currentPlatform: string;
  currentPlatformOther?: string;
  platformPreferenceReason: string;
  scamExperience: ScamExperience;
  lossAmount?: string;
  biggestIssue: string;
  biggestIssueOther?: string;
  biggestFear: string;
  escrowInterest: TernaryAnswer;
  maxFee: string;
  deliveryTime: string;
  deliveryFrustration: string;
  transactionCompletionTime: string;
  transactionSlowdown: string;
  trustFeatures: string[];
  payExtraForInspection: TernaryAnswer;
  likelihoodToUse: string;
  immediateUseReason: string;
  fullName: string;
  phoneNumber: string;
  city: string;
}

export interface QuestionnaireResponse extends QuestionnairePayload {
  id: string;
  leadStatus: QuestionnaireLeadStatus;
  freeInspectionCredits: number;
  freeDeliveryCredits: number;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionnaireAdminUpdatePayload {
  leadStatus?: QuestionnaireLeadStatus;
  freeInspectionCredits?: number;
  freeDeliveryCredits?: number;
  adminNotes?: string;
}

export type WaitlistStatus = 'new' | 'contacted' | 'invited';

export interface WaitlistPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface WaitlistEntry extends WaitlistPayload {
  id: string;
  status: WaitlistStatus;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WaitlistAdminUpdatePayload {
  status?: WaitlistStatus;
  adminNotes?: string;
}
