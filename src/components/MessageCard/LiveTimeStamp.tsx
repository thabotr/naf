import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Paragraph} from 'react-native-paper';
import {useTheme} from '../../context/theme';
import {verboseTime} from '../../helper';
import {OnlyShow} from '../Helpers/OnlyShow';

const LiveTimeStamp = ({
  timestamp,
  sender,
}: {
  timestamp?: number;
  sender?: boolean;
}) => {
  const {theme} = useTheme();
  const [ticker, setTicker] = useState(true);

  useEffect(() => {
    if (!timestamp) {
      return;
    }

    const min = 1000 * 60;
    const hour = min * 60;
    const day = hour * 24;
    const timeDiff = new Date().getTime() - timestamp;

    if (timeDiff > 7 * day) {
      return;
    }

    let refreshInterval = min;
    if (timeDiff < hour) {
      refreshInterval = timeDiff % min;
    } else if (timeDiff < day) {
      refreshInterval = timeDiff % hour;
    } else {
      refreshInterval = timeDiff % day;
    }

    setTimeout(() => {
      setTicker(tcker => !tcker);
    }, refreshInterval);
  }, [ticker, timestamp]);

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
    },
  });
  return (
    <OnlyShow If={!!timestamp}>
      <Paragraph style={styles.paragraph}>{verboseTime(timestamp)}</Paragraph>
    </OnlyShow>
  );
};

export {LiveTimeStamp};
