import React from 'react';
import {OverlayedView} from './OverlayedView';

export function Lay({
  component,
  over,
}: {
  component: React.ReactNode;
  over: React.ReactNode;
}) {
  return (
    <>
      {over}
      {<OverlayedView>{component}</OverlayedView>}
    </>
  );
}
