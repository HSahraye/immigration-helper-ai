import { Metadata } from 'next';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DocumentEditor from './DocumentEditor';

export const metadata: Metadata = {
  title: 'Edit Document | Immigration Helper AI',
  description: 'Edit your immigration document.',
};

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

interface Params {
  id: string;
}

interface Props {
  params: Promise<Params>;
}

export default async function EditDocumentPage({ params }: Props) {
  const { id } = await params;
  const session = await getAuthSession();

  // Redirect unauthenticated users
  if (!session?.user) {
    redirect(`/api/auth/signin?callbackUrl=/documents/${id}/edit`);
  }

  return <DocumentEditor id={id} />;
} 