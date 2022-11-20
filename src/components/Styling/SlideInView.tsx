import { useRef, useEffect } from 'react';
import { Animated, Easing} from 'react-native';

const SlideInView = (props: any) => {
  const slideAnim = useRef(new Animated.Value(props.reverse ? 0 : -350)).current  // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(
      slideAnim,
      {
        toValue: props.reverse ? -350 : 0 ,
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.bounce
      },
    ).start();
  }, [slideAnim])

  return (
    <Animated.View
      style={{
        ...props.style,
        transform : [{
          translateX: slideAnim,
        }],
      }}
    >
      {props.children}
    </Animated.View>
  );
}

export {SlideInView};