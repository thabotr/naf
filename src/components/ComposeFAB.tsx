import { ViewProps } from "react-native";
import { FAB } from "react-native-paper";
import { useTheme } from "../context/theme";

function ComposeFAB({onLongPress, onPress}:{onLongPress:()=>void, onPress:()=>void}){
  const {theme} = useTheme();

  return <FAB
  style={{
    margin: 3,
    borderRadius: 0,
    backgroundColor: theme.color.userSecondary,
  }}
  icon="pencil"
  onLongPress={onLongPress}
  onPress={onPress}
/>
}

export {ComposeFAB};