import { TouchableOpacity, View } from "react-native";
import { List, Paragraph } from "react-native-paper";
import { useChats } from "../../context/chat";
import { useTheme } from "../../context/theme";
import { Chat } from "../../types/chat";
import { Lay } from "../Helpers/Lay";
import { Show } from "../Helpers/Show";

function MessagePreviewSection({chat, navigation}:{navigation:any, chat: Chat}){
  const {theme} = useTheme();
  const {saveActiveChat} = useChats();
  const latestMessage = chat.messages.slice(-1).find(_ => true);

  return <TouchableOpacity
    style={{
      width: '100%',
      height: '100%',
    }}
    onPress={() => {
      saveActiveChat(chat);
      navigation.push('Chat');
    }}
    activeOpacity={0.8}
  >
    <Lay
      component={
          <Show
            component={
              <Paragraph
                style={{
                  color: theme.color.textPrimary,
                  textShadowColor: theme.color.textSecondary,
                }}
                numberOfLines={1}>
                {`converse with ${chat.user.handle}`}
              </Paragraph>
            }
            If={!latestMessage}
            ElseShow={
              <List.Item
                style={{width: '100%'}}
                title={
                  !latestMessage?.text
                  ? '<sent a file>'
                  : latestMessage.text
                }
                left={_ => (
                  <List.Icon
                    icon={
                      latestMessage?.draft
                        ? 'content-save-edit'
                        : latestMessage?.text
                        ? 'message-text'
                        : 'attachment'
                    }
                  />
                )}
              />
            }
          />
      }
      over={
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: theme.color.secondary,
            opacity: 0.5,
          }}
        />
      }
    />
  </TouchableOpacity>
}

export {MessagePreviewSection};