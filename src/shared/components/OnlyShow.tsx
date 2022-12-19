import React from 'react';

export function OnlyShow({
  If,
  children,
}: {
  If?: boolean;
  children: React.ReactNode;
}) {
  return If ? <>{children}</> : null;
}
