import PublicInvoiceClient from '@/app/components/invoice/PublicInvoiceClient';

export const metadata = {
  title: 'Invoice — BuyPadi',
};

export default async function PublicInvoicePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return <PublicInvoiceClient token={token} />;
}
