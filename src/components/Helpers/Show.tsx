import React from 'react';

export function Show({
  component,
  If,
  ElseShow,
}: {
  component: React.ReactNode;
  If: boolean;
  ElseShow: React.ReactNode;
}) {
  return <>{If ? component ?? null : ElseShow ?? null}</>;
}
