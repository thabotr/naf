import React, {ReactNode} from 'react';

export default function ({
  component,
  If,
  ElseShow,
}: {
  component: ReactNode;
  If: boolean;
  ElseShow: ReactNode;
}) {
  return <>{If ? component ?? null : ElseShow ?? null}</>;
}
