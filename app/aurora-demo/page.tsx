import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aurora Background Demo - Immigration Helper AI',
  description: 'Beautiful aurora background animation showcase',
};

export default function AuroraPage() {
  return (
    <div>
      {/* We'll use dynamic import in the client component */}
      <ClientAuroraDemo />
    </div>
  );
}

// This is a server component, so we need to use a client component to render the Aurora background
import dynamic from 'next/dynamic';

const ClientAuroraDemo = dynamic(
  () => import('../components/aceternity-ui/AuroraBackgroundDemo').then(mod => ({ default: mod.AuroraBackgroundDemo })),
  { ssr: false }
); 