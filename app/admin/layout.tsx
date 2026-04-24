import AdminHeader from '@/app/components/admin/AdminHeader';
import AdminNav from '@/app/components/admin/AdminNav';

export const metadata = {
  title: 'BuyPadi Admin',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <AdminHeader />
      <div className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-5 sm:py-7 lg:py-8 flex flex-col gap-5">
        <AdminNav />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
