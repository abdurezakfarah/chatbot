import Dashboard from '@/components/dashboard';
import { Metadata } from 'next';

export const metadata = {
  title: 'Chatbot',
} satisfies Metadata;

export default function Home() {
  return (
    <div className="container p-0">
      <Dashboard />
    </div>
  );
}
