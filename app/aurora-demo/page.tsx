import { Metadata } from 'next';
import { AuroraBackgroundDemoWrapper } from '../components/aceternity-ui/AuroraBackgroundDemoWrapper';

export const metadata: Metadata = {
  title: 'Aurora Background Demo - Immigration Helper AI',
  description: 'Beautiful aurora background animation showcase',
};

export default function AuroraPage() {
  return <AuroraBackgroundDemoWrapper />;
} 