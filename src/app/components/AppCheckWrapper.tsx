import { useAppCheck } from '@//components/AppCheckContext';
import { ReactNode } from 'react';

export default function AppCheckWrapper({
  children,
}: {
  children: (token: string) => ReactNode;
}) {
  const { token } = useAppCheck();

  if (!token) return <div>Loading AppCheck...</div>;

  return <>{children(token)}</>;
}
