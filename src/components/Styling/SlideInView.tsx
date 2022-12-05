import React, {useRef, useEffect} from 'react';
import {Animated, Easing} from 'react-native';

const SlideInView = (props: any) => {
  const slideAnim = useRef(new Animated.Value(-500)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
      easing: Easing.bounce,
    }).start();
    if (props.reverseAfter) {
      setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -550,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, props.reverseAfter);
    }
  }, [slideAnim, props.reverseAfter]);

  return (
    <Animated.View
      style={{
        ...props.style,
        transform: [
          {
            translateX: slideAnim,
          },
        ],
      }}>
      {props.children}
    </Animated.View>
  );
};

export {SlideInView};
