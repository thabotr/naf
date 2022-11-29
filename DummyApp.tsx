import React, { useRef, useEffect } from 'react';
import { Animated, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { FileManager } from './src/services/FileManager';
import { Remote } from './src/services/Remote';

// You can then use your `FadeInView` in place of a `View` in your components:
export default () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <IconButton icon='message' onPress={()=>{
        Remote.getChats('token1', 'w/unodosthreenfour', -1)
        .then(chats=>{
          console.log(chats);
        })
        // FileManager.sendWithFile();
      }}/>
    </View>
  )
}