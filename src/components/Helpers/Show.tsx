export function Show({
  component,
  If,
  ElseShow,
}: {
  component: React.ReactNode;
  If: boolean;
  ElseShow: React.ReactNode;
}): JSX.Element {
  return <>{If ? component : ElseShow}</>;
}
