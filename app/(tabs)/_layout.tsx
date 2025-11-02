import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => (
            <Feather name="map-pin" size={24} color="black" /> 
          ),
        }}
        />
      <Tabs.Screen
       name="favourites"
       options={{
          title: 'Favourites',
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
