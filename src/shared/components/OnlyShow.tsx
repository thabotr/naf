import React, {ReactNode} from 'react';

export default function OnlyShow({
  If,
  children,
}: {
  If?: boolean;
  children: ReactNode;
}): JSX.Element {
  return If ? <>{children}</> : <></>;
}
