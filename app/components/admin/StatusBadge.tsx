import type { InspectionStatus, InvoiceStatus } from '@/app/lib/types';

const REQUEST_STYLES: Record<InspectionStatus, string> = {
  pending:             'bg-yellow-50 text-yellow-700 border-yellow-200',
  payment_confirmed:   'bg-blue-50 text-blue-700 border-blue-200',
  scheduled:           'bg-indigo-50 text-indigo-700 border-indigo-200',
  inspector_en_route:  'bg-orange-50 text-orange-700 border-orange-200',
  completed:           'bg-green-50 text-green-700 border-green-200',
  cancelled:           'bg-red-50 text-red-600 border-red-200',
};

const REQUEST_LABELS: Record<InspectionStatus, string> = {
  pending:             'Pending',
  payment_confirmed:   'Payment Confirmed',
  scheduled:           'Scheduled',
  inspector_en_route:  'En Route',
  completed:           'Completed',
  cancelled:           'Cancelled',
};

const INVOICE_STYLES: Record<InvoiceStatus, string> = {
  unpaid: 'bg-orange-50 text-orange-700 border-orange-200',
  paid:   'bg-green-50 text-green-700 border-green-200',
};

interface RequestBadgeProps { status: InspectionStatus; }
interface InvoiceBadgeProps { status: InvoiceStatus; }

export function RequestStatusBadge({ status }: RequestBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${REQUEST_STYLES[status]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {REQUEST_LABELS[status]}
    </span>
  );
}

export function InvoiceStatusBadge({ status }: InvoiceBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${INVOICE_STYLES[status]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {status === 'paid' ? 'Paid' : 'Unpaid'}
    </span>
  );
}
