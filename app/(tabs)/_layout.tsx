import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';



export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#cdb4ff',
          borderTopWidth: 4,
          borderTopColor: '#7746ff',
          shadowColor: '#000',
          shadowOffset: { width: 3, height: 3 },
          shadowOpacity: 0.6,
          shadowRadius: 0,
          elevation: 8,
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'PixelFont',
          fontSize: 10,
          color: '#3b0086',
          textShadowColor: '#fff',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 0,
        },
        tabBarActiveTintColor: '#3b0086',
        tabBarInactiveTintColor: '#7b5bff',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={18} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <Ionicons name="map-outline" size={18} color={color} />,
        }}
      />
      <Tabs.Screen
       name="favourites"
       options={{
          title: 'Faves',
          tabBarIcon: ({ color, size }) => (
            <Fontisto name="heart-eyes" size={24} color="black" /> 
          ),
        }}
      />
       <Tabs.Screen
       name="random"
       options={{
          title: 'Random',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="nintendo-game-boy" size={24} color="black" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabLabel: {
    fontFamily: 'PixelFont',
    fontSize: 10,
  },
});
