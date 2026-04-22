"use client";

// TODO: Replace all functions in this module with Supabase client calls.
// Each function maps 1:1 to a table operation (select, update, insert).

import type { InspectionRequest, Invoice, InspectionStatus } from "./types";
import { MOCK_REQUESTS, MOCK_INVOICES } from "./mock-data";

const REQUESTS_KEY = "buypady_mock_requests";
const INVOICES_KEY = "buypady_mock_invoices";

let cachedInvoices: Invoice[] | null = null;

function loadRequests(): InspectionRequest[] {
  try {
    const raw = localStorage.getItem(REQUESTS_KEY);
    if (raw) return JSON.parse(raw) as InspectionRequest[];
  } catch {}
  return MOCK_REQUESTS;
}

function loadInvoices(): Invoice[] {
  if (cachedInvoices) return cachedInvoices;
  try {
    const raw = localStorage.getItem(INVOICES_KEY);
    if (raw) {
      cachedInvoices = JSON.parse(raw) as Invoice[];
      return cachedInvoices;
    }
  } catch {}
  cachedInvoices = MOCK_INVOICES;
  return cachedInvoices;
}

function saveRequests(data: InspectionRequest[]) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(data));
}

function saveInvoices(data: Invoice[]) {
  cachedInvoices = data;
  localStorage.setItem(INVOICES_KEY, JSON.stringify(data));
}

export function seedIfEmpty() {
  if (!localStorage.getItem(REQUESTS_KEY)) saveRequests(MOCK_REQUESTS);
  if (!localStorage.getItem(INVOICES_KEY)) saveInvoices(MOCK_INVOICES);
}

// ── Requests ────────────────────────────────────────────────────────────────

export function getAllRequests(): InspectionRequest[] {
  return loadRequests();
}

export function getRequest(id: string): InspectionRequest | undefined {
  return loadRequests().find((r) => r.id === id || r.orderId === id);
}

export function updateRequest(
  id: string,
  updates: Partial<InspectionRequest>,
): InspectionRequest | undefined {
  const requests = loadRequests();
  const idx = requests.findIndex((r) => r.id === id || r.orderId === id);
  if (idx === -1) return undefined;
  requests[idx] = { ...requests[idx], ...updates };
  saveRequests(requests);
  return requests[idx];
}

export function updateStatus(id: string, status: InspectionStatus): void {
  updateRequest(id, { status });
}

// ── Invoices ────────────────────────────────────────────────────────────────

export function getAllInvoices(): Invoice[] {
  return loadInvoices();
}

export function getInvoice(id: string): Invoice | undefined {
  return loadInvoices().find((i) => i.id === id);
}

export function getInvoiceByToken(token: string): Invoice | undefined {
  return loadInvoices().find((i) => i.token === token);
}

export function createInvoice(
  invoice: Omit<Invoice, "id" | "invoiceNumber" | "createdAt">,
): Invoice {
  const invoices = loadInvoices();
  const nextNum = String(invoices.length + 1).padStart(3, "0");
  const year = new Date().getFullYear();
  const newInvoice: Invoice = {
    ...invoice,
    id: `inv-${crypto.randomUUID().slice(0, 8)}`,
    invoiceNumber: `INV-${year}-${nextNum}`,
    createdAt: new Date().toISOString(),
  };
  invoices.push(newInvoice);
  saveInvoices(invoices);
  // Link invoice back to request
  updateRequest(invoice.requestId, { invoiceId: newInvoice.id });
  return newInvoice;
}

export function updateInvoiceStatus(
  id: string,
  status: "unpaid" | "paid",
): void {
  const invoices = loadInvoices();
  const idx = invoices.findIndex((i) => i.id === id);
  if (idx === -1) return;
  invoices[idx] = { ...invoices[idx], status };
  saveInvoices(invoices);
}
