import { ToastAndroid } from "react-native";
import { IconButton } from "react-native-paper";
import { DeliveryStatusType, Message } from "../../types/message";

const deliveryStatusDetails = new Map<
DeliveryStatusType,
{icon: string; message: string}
>([
[
  DeliveryStatusType.ERROR,
  {icon: 'message-alert', message: 'message delivery failed'},
],
[DeliveryStatusType.SEEN, {icon: 'eye', message: 'message viewed'}],
[DeliveryStatusType.UNSEEN, {icon: 'eye-off', message: 'message delivered'}],
[DeliveryStatusType.NONE, {icon: 'circle-small', message: 'message status'}],
]);

function DeliveryStatus({msg}:{msg: Message}){
  if(!msg.status){
    return <></>;
  }

  const details = deliveryStatusDetails.get(msg.status) ?? {icon: 'circle-small', message: 'message status'};
  const displayMessageStatus = () => {
    details && ToastAndroid.show(
      details.message,
      3000,
    );
  };

  return <IconButton
    size={15}
    onPress={() => {}}
    onLongPress={displayMessageStatus}
    icon={details.message}
    style={{padding: 0, margin: 0, borderRadius: 0}}
  />
}

export {DeliveryStatus};