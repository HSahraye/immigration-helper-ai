import { Metadata } from 'next';
import { AuroraBackgroundDemoWrapper } from '../components/aceternity-ui/AuroraBackgroundDemoWrapper';

export const metadata: Metadata = {
  title: 'Aurora Background Demo - ZazuGroups',
  description: 'Beautiful aurora background animation showcase',
};

export default function AuroraPage() {
  return <AuroraBackgroundDemoWrapper />;
} 