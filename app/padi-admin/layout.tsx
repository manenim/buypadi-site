import AdminChrome from './AdminChrome';

export const metadata = {
  title: 'BuyPadi Admin',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminChrome>{children}</AdminChrome>;
}
