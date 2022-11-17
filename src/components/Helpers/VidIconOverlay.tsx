import { IconButton } from "react-native-paper";
import { OverlayedView } from "./OverlayedView";

export const vidIconOverlay= (iconSize: number, blur?:boolean) => <OverlayedView>
  <IconButton size={iconSize} icon="play-circle-outline"  style={{opacity: blur ? 0.4 : 1}}/>
</OverlayedView>