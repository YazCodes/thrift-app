import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground } from 'react-native';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';

const VirtualCharacter = ({ fullText }: { fullText: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });

  useEffect(() => {
    if (!fontsLoaded) return;

    let currentIndex = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + fullText[currentIndex]);
      currentIndex++;
      if (currentIndex >= fullText.length) clearInterval(intervalId);
    }, 80);

    return () => clearInterval(intervalId);
  }, [fullText, fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      {/* Speech Bubble above */}
      <ImageBackground
            source={require('../assets/images/speechbubble.png')}
            style={styles.speechBubble}
            imageStyle={styles.bubbleImage}
            resizeMode="contain"
        >
  <Text style={styles.speechText}>{displayedText}</Text>
</ImageBackground>


      {/* Cherry below */}
      <Image source={require('../assets/images/cherry.gif')} style={styles.character} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 5,
    right: 60,
    alignItems: 'center', // Centers bubble above character
  },
  bubbleImage: {
    width: '100%',
    height: '100%',
  },

  character: {
    width: 110,
    height: 110,
    marginRight: 200,
  },
  speechBubble: {
  width: 220,
  height: 130,
  justifyContent: 'flex-start', // aligns children to the top
  alignItems: 'center',
  paddingHorizontal: 14,
  paddingTop: 12, // moves text slightly down from top edge
  paddingBottom: 10,
  marginBottom: -60, // optional: overlaps with Cherry
},
speechText: {
  fontSize: 8,
  color: '#f37dcaff',
  textAlign: 'center',
  fontFamily: 'PressStart2P_400Regular',
  lineHeight: 12,
  flexWrap: 'wrap', // ensures text wraps
  width: '90%', // text stays within bubble width
},

});

export default VirtualCharacter;
