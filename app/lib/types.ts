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

// `InspectionRequest` and `Invoice` are defined in `./api` (the single source of
// truth, kept in sync with the backend entities) and re-exported here so existing
// `@/app/lib/types` imports keep working.
export type { InspectionRequest, Invoice } from './api';
