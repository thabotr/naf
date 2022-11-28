import {IconButton} from 'react-native-paper';
import {Animated, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import {useMutex} from '../../providers/MutexProvider';
import {useTheme} from '../../context/theme';

const AsyncIconButton = ({
  icon,
  color,
  style,
  onPress,
  disabled,
  size,
  onLongPress,
}: {
  icon: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => Promise<void>;
  disabled?: boolean;
  size?: number;
  onLongPress?: () => Promise<void>;
}) => {
  const fadePulse = useRef(new Animated.Value(1.0)).current;
  const [state, setState] = useState<'loading' | 'error' | 'idle'>('idle');
  const {slots, saveSlots} = useMutex();
  const {theme} = useTheme();

  useEffect(() => {
    Animated.loop(
      Animated.timing(fadePulse, {
        toValue: 0.5,
        duration: 1000,
        useNativeDriver: true,
      }),
    ).start();
  }, [fadePulse]);

  const styles = StyleSheet.create({
    squareButton: {
      borderRadius: 0,
    },
    errorButton:
      state === 'error'
        ? {
            borderWidth: 1,
            borderColor: 'red',
          }
        : {},
  });

  return (
    <Animated.View style={{opacity: state === 'loading' ? fadePulse : 1}}>
      <IconButton
        icon={icon}
        color={color ?? theme.color.textPrimary}
        size={size}
        style={[styles.squareButton, style, styles.errorButton]}
        disabled={state === 'loading' || slots === 0 || disabled}
        onLongPress={() => {
          saveSlots(0);
          setState('loading');
          onLongPress?.()
            .then(_ => setState('idle'))
            .catch(_ => setState('error'))
            .finally(() => saveSlots(1));
        }}
        onPress={() => {
          saveSlots(0);
          setState('loading');
          onPress()
            .then(_ => setState('idle'))
            .catch(_ => setState('error'))
            .finally(() => saveSlots(1));
        }}
      />
    </Animated.View>
  );
};

export {AsyncIconButton};
