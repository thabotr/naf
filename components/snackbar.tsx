import React from 'react';
import { Snackbar as RNPSnackBar } from "react-native-paper";

enum Actions {
  NONE,
  UNDO,
  WARN,
  ERROR,
}

export function ToastySnackbarComponent({children, action=Actions.NONE, restoreState}:{children: React.ReactNode, action?:Actions, restoreState?:()=>void}) {
  const [visible, setVisible] = React.useState(true);
  const [duration, setDuration] = React.useState<number>(3000);

  const dismissSB = ()=> setVisible(false);
  const getAppropriateAction = ( a: Actions) => {
    switch(a){
      case Actions.UNDO:
        return {
          label: 'Undo',
          onPress: (()=>{
            restoreState?.();
            dismissSB();
          }),
        }
      default:
        return undefined;
    }
  }

  return <RNPSnackBar
    visible={visible}
    onDismiss={dismissSB}
    action={getAppropriateAction(action)}
    duration={duration}
  >
    {children}
  </RNPSnackBar>
}

export function ToastySnackbarManager(){
  const child = "hello"
  return <ToastySnackbarComponent>
    {child}
  </ToastySnackbarComponent>
}