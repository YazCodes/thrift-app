import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Video, ResizeMode } from 'expo-av';   // need to update - look at docs! 
import VirtualCharacter from '@/components/VirtualCharacter';



export default function Home() {
  return (
    <View style={styles.container}>
      <Video
        source={require('../../assets/videos/homepage.mp4')}
         style={[
    StyleSheet.absoluteFillObject,
    { top: -130, left: -40 } // moves video up 100px and left 50px
  ]}
        resizeMode={ResizeMode.COVER} 
        shouldPlay
        // isLooping
        isMuted
      />

       {/* Pixel dropdown */}
    

      {/* Mimi */}
      <VirtualCharacter fullText="hello welcome to tokyo thrift your global thrifting bestie" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // fallback in case video doesn't load
    justifyContent: 'center',
    alignItems: 'center',
  },
});
