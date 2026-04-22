import AdminHeader from '@/app/components/admin/AdminHeader';

export const metadata = {
  title: 'BuyPadi Admin',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <AdminHeader />

      <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}
