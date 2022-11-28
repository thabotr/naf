import {ToastAndroid} from 'react-native';
import {IconButton} from 'react-native-paper';
import { useTheme } from '../../context/theme';
import {Message} from '../../types/message';

const deliveryStatusDetails = {
  NONE: {icon: 'circle-outline', message: 'message status'},
  SENT: {icon: 'circle-slice-2', message: 'message sent'},
  DELIVERED: {icon: 'circle-slice-4', message: 'message delivered'},
  SEEN: {icon: 'circle-slice-6', message: 'message viewed'},
  REPLIED: {icon: 'circle-slice-8', message: 'message responded'},
  ERROR: {icon: 'circle-alert-outline', message: 'message failed'},
};

function DeliveryStatus({msg}: {msg: Message}) {
  const {theme} = useTheme();
  const details =
    deliveryStatusDetails[msg.status ?? 'NONE'] ??
    deliveryStatusDetails['NONE'];
  const displayMessageStatus = () => {
    details && ToastAndroid.show(details.message, 3000);
  };

  return (
    <IconButton
      size={15}
      onPress={() => {}}
      onLongPress={displayMessageStatus}
      color={theme.color.textPrimary}
      icon={details.icon}
      style={{padding: 0, margin: 0, borderRadius: 0}}
    />
  );
}

export {DeliveryStatus};
