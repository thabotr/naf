import React, { useRef, useEffect } from 'react';
import { Animated, Text, View } from 'react-native';

const SlideInView = (props: any) => {
  const slideAnim = useRef(new Animated.Value(-30)).current  // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(
      slideAnim,
      {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      },
    ).start();
  }, [slideAnim])

  return (
    <Animated.View
      style={{
        ...props.style,
        transform : [{
          translateX: slideAnim,
        }]
      }}
    >
      {props.children}
    </Animated.View>
  );
}

// You can then use your `FadeInView` in place of a `View` in your components:
export default () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <SlideInView style={{width: 250, height: 50, backgroundColor: 'powderblue'}}>
        <Text style={{fontSize: 28, textAlign: 'center', margin: 10}}>Fading in</Text>
      </SlideInView>
    </View>
  )
}