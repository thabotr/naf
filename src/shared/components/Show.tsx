import React, {ReactNode} from 'react';

export default function ({
  component,
  If,
  ElseShow,
}: {
  component: ReactNode;
  If: boolean;
  ElseShow: ReactNode;
}): JSX.Element {
  return <>{If ? component : ElseShow}</>;
}
