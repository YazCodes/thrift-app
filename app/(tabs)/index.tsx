import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Video, ResizeMode } from 'expo-av';   // need to update - look at docs! 

export default function Home() {
  return (
    <View style={styles.container}>
      <Video
        source={require('../../assets/videos/homepage.mp4')}
        style={StyleSheet.absoluteFillObject}
        resizeMode={ResizeMode.COVER} 
        shouldPlay
        isLooping
        isMuted
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
