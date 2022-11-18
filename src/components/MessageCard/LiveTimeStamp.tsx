import { StyleSheet } from "react-native";
import { Paragraph } from "react-native-paper";
import { useTheme } from "../../context/theme";
import { verboseTime } from "../../helper";
import { OnlyShow } from "../Helpers/OnlyShow";

const LiveTimeStamp = ({
  timestamp,
  sender,
}: {
  timestamp?: number;
  sender?: boolean;
}) => {
  const {theme} = useTheme();
  const styles = StyleSheet.create({
    paragraph: {
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      color: theme.color.textPrimary,
      textShadowColor: theme.color.textSecondary,
      backgroundColor: sender
        ? theme.color.userSecondary
        : theme.color.friendSecondary,
      borderRadius: 5,
      marginTop: 2,
      opacity: 0.5,
    }
  })
  return (
    <OnlyShow If={!!timestamp}>
      <Paragraph style={styles.paragraph}>
        {verboseTime(timestamp)}
      </Paragraph>
    </OnlyShow>
  );
};

export {LiveTimeStamp};