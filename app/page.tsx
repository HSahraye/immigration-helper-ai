import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { HomeContent } from './components/HomeContent';

export default function HomePage() {
  return <HomeContent />;
} 