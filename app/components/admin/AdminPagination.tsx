'use client';

type AdminPaginationProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  itemLabel: string;
  onPageChange: (page: number) => void;
};

export default function AdminPagination({
  page,
  pageSize,
  totalItems,
  itemLabel,
  onPageChange,
}: AdminPaginationProps) {
  if (totalItems <= pageSize) return null;

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(totalItems, page * pageSize);

  return (
    <div className="flex flex-col gap-3 border-t border-surface-alt px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p className="text-sm text-muted">
        Showing <span className="font-semibold text-heading">{start}-{end}</span>{' '}
        of <span className="font-semibold text-heading">{totalItems}</span>{' '}
        {itemLabel}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-surface-alt bg-white px-4 text-sm font-semibold text-copy transition-colors hover:border-primary/20 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <span className="inline-flex min-h-10 items-center justify-center rounded-lg bg-surface px-4 text-sm font-semibold text-heading">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-surface-alt bg-white px-4 text-sm font-semibold text-copy transition-colors hover:border-primary/20 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
