import { Badge } from "react-native-paper";
import { useTheme } from "../../context/theme";
import { OnlyShow } from "../Helpers/OnlyShow";

function UnreadMessageCountBadge({count}:{count: number}){
  const {theme} = useTheme();
  return <OnlyShow If={!!count}>
    <Badge
    style={{
      position: 'absolute',
      bottom: -1,
      right: -1,
      borderRadius: 0,
      backgroundColor: theme.color.friendSecondary,
      borderWidth: 1,
      borderColor: theme.color.friendPrimary,
      borderStyle: 'solid',
    }}
    size={33}>
    {count}
    </Badge>
  </OnlyShow>
}

export {UnreadMessageCountBadge};