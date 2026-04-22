'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { InspectionRequest } from '@/app/lib/types';
import { RequestStatusBadge } from '@/app/components/admin/StatusBadge';
import { getAllRequests, seedIfEmpty } from '@/app/lib/mock-store';

function formatNaira(n: number) {
  return `₦${n.toLocaleString('en-NG')}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminDashboard() {
  const [requests] = useState<InspectionRequest[]>(() => {
    if (typeof window === 'undefined') return [];
    seedIfEmpty();
    return getAllRequests();
  });

  const total = requests.length;
  const pending = requests.filter((r) => r.status === 'pending').length;
  const inProgress = requests.filter(
    (r) => r.status === 'scheduled' || r.status === 'inspector_en_route' || r.status === 'payment_confirmed'
  ).length;
  const completed = requests.filter((r) => r.status === 'completed').length;

  const recent = useMemo(
    () =>
      [...requests]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10),
    [requests]
  );

  const stats = [
    {
      label: 'Total Requests',
      value: total,
      description: 'All submissions in the queue',
      tone: 'bg-primary/10 text-primary',
      dot: 'bg-primary',
    },
    {
      label: 'Pending',
      value: pending,
      description: 'Waiting for the next admin action',
      tone: 'bg-yellow-50 text-yellow-700',
      dot: 'bg-yellow-500',
    },
    {
      label: 'In Progress',
      value: inProgress,
      description: 'Currently moving through inspection',
      tone: 'bg-blue-50 text-blue-700',
      dot: 'bg-blue-500',
    },
    {
      label: 'Completed',
      value: completed,
      description: 'Finished requests ready for archive',
      tone: 'bg-lime-light text-primary',
      dot: 'bg-lime',
    },
  ];

  return (
  
    <div>Admin</div>
  );
}



  // <div className="flex flex-col gap-6 sm:gap-8">
    //   <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    //     <div>
    //       <h1 className="font-display text-2xl font-bold text-heading sm:text-3xl">
    //         Dashboard
    //       </h1>
    //       <p className="mt-1 max-w-2xl text-sm text-muted sm:text-base">
    //         Keep an eye on incoming inspection activity and jump into the newest requests quickly.
    //       </p>
    //     </div>

    //     <Link
    //       href="/admin/requests"
    //       className="inline-flex min-h-11 items-center justify-center rounded-full border border-surface-alt bg-white px-5 text-sm font-semibold text-copy transition-colors hover:border-primary/20 hover:text-primary"
    //     >
    //       Open request queue
    //     </Link>
    //   </div>

    //   {/* <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
    //     {stats.map((stat) => (
    //       <div key={stat.label} className="rounded-3xl border border-surface-alt bg-white p-4 shadow-sm sm:p-5">
    //         <div className="flex items-start justify-between gap-3">
    //           <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${stat.tone}`}>
    //             {stat.label}
    //           </span>
    //           <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${stat.dot}`} />
    //         </div>
    //         <p className="mt-5 font-display text-3xl font-black leading-none text-heading sm:text-[2.1rem]">
    //           {stat.value}
    //         </p>
    //         <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
    //           {stat.description}
    //         </p>
    //       </div>
    //     ))}
    //   </div> */}

    //   <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-sm">
    //     <div className="flex flex-col gap-3 border-b border-surface-alt px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
    //       <div>
    //         <h2 className="font-display text-base font-bold text-heading sm:text-lg">
    //           Recent requests
    //         </h2>
    //         <p className="mt-1 text-xs text-muted sm:text-sm">
    //           Most recent submissions across the inspection queue.
    //         </p>
    //       </div>
    //       <Link href="/admin/requests" className="text-xs font-semibold text-lime-dark hover:underline sm:text-sm">
    //         View all →
    //       </Link>
    //     </div>

    //     <div className="divide-y divide-surface-alt lg:hidden">
    //       {recent.map((request) => (
    //         <Link
    //           key={request.id}
    //           href={`/admin/requests/${request.id}`}
    //           className="block px-4 py-4 transition-colors hover:bg-surface/50"
    //         >
    //           <div className="flex items-start justify-between gap-3">
    //             <div className="min-w-0">
    //               <p className="font-mono text-xs font-bold text-primary">{request.orderId}</p>
    //               <p className="mt-1 text-sm font-semibold text-heading">{request.buyerFullName}</p>
    //             </div>
    //             <RequestStatusBadge status={request.status} />
    //           </div>

    //           <p className="mt-3 text-sm font-medium text-copy">{request.itemDescription}</p>

    //           <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-muted">
    //             <div>
    //               <p className="uppercase tracking-wide text-subtle">Price</p>
    //               <p className="mt-1 font-medium text-heading">{formatNaira(request.itemPrice)}</p>
    //             </div>
    //             <div>
    //               <p className="uppercase tracking-wide text-subtle">Submitted</p>
    //               <p className="mt-1 font-medium text-heading">{formatDate(request.createdAt)}</p>
    //             </div>
    //           </div>
    //         </Link>
    //       ))}
    //     </div>

    //     <div className="hidden overflow-x-auto lg:block">
    //       <table className="w-full text-sm">
    //         <thead className="bg-surface text-left">
    //           <tr>
    //             {['Order ID', 'Customer', 'Item', 'Price', 'Date', 'Status'].map((heading) => (
    //               <th key={heading} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted whitespace-nowrap">
    //                 {heading}
    //               </th>
    //             ))}
    //           </tr>
    //         </thead>
    //         <tbody className="divide-y divide-surface-alt">
    //           {recent.map((request) => (
    //             <tr key={request.id} className="transition-colors hover:bg-surface/50">
    //               <td className="px-4 py-3 whitespace-nowrap">
    //                 <Link href={`/admin/requests/${request.id}`} className="font-mono text-xs font-bold text-primary hover:underline">
    //                   {request.orderId}
    //                 </Link>
    //               </td>
    //               <td className="px-4 py-3 whitespace-nowrap font-medium text-heading">
    //                 {request.buyerFullName}
    //               </td>
    //               <td className="px-4 py-3 max-w-[180px] truncate text-copy">
    //                 {request.itemDescription}
    //               </td>
    //               <td className="px-4 py-3 whitespace-nowrap text-copy">
    //                 {formatNaira(request.itemPrice)}
    //               </td>
    //               <td className="px-4 py-3 whitespace-nowrap text-xs text-muted">
    //                 {formatDate(request.createdAt)}
    //               </td>
    //               <td className="px-4 py-3 whitespace-nowrap">
    //                 <RequestStatusBadge status={request.status} />
    //               </td>
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>
    //     </div>
    //   </div>
    // </div>