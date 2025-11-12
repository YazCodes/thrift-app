import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { useIsFocused } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

type Store = {
  id: number;
  name: string;
  description: string;
  address: string;
  opening_hours?: string;
  price_category?: string;
  images?: string[];
  tiktok_url?: string[];
};

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const isFocused = useIsFocused();

  const [fontsLoaded] = useFonts({
    PixelFont: require('../assets/fonts/PressStart2P-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  const loadFavorites = async () => {
    const storedFavs = await AsyncStorage.getItem('@favorites');
    if (storedFavs) setFavorites(JSON.parse(storedFavs));
  };

  const fetchStores = async () => {
    const { data, error } = await supabase.from('stores').select('*');
    if (error) console.error(error);
    else setStores(data || []);
  };

  useEffect(() => {
    if (isFocused) {
      loadFavorites();
      fetchStores();
    }
  }, [isFocused]);

  const favoriteStores = stores.filter(store => favorites.includes(store.id));

  const removeFavorite = async (storeId: number) => {
    const newFavs = favorites.filter(id => id !== storeId);
    setFavorites(newFavs);
    await AsyncStorage.setItem('@favorites', JSON.stringify(newFavs));
  };

  if (!fontsLoaded) return null;

  if (favoriteStores.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>♡ No favourites yet cutie ♡</Text>
      </View>
    );
  }

  return (
      <View style={{ flex: 1, backgroundColor: '#f3d6ff' }}>
    {/* 💖 Header component */}
    <View style={styles.header}>
      <Text style={styles.headerText}>♡ YOUR SAVED SPOTS ♡</Text>
    </View>

    <FlatList
      data={favoriteStores}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.storeName}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
          {item.opening_hours && <Text style={styles.infoText}>🕒 {item.opening_hours}</Text>}
          {item.price_category && <Text style={styles.infoText}>💴 {item.price_category}</Text>}
          <Text style={styles.infoText}>📍 {item.address}</Text>

          {/* 🩷 Image */}
          {item.images && item.images.length > 0 && (
            <Image source={{ uri: item.images[0] }} style={styles.image} />
          )}

          {/* TikTok Button */}
          {item.tiktok_url?.length ? (
          <TouchableOpacity
            onPress={() => Linking.openURL(item.tiktok_url[0])}
            style={styles.tiktokButton}
          >
            <Text style={styles.tiktokText}>₊˚⊹♡ Watch on TikTok ♡₊˚⊹</Text>
          </TouchableOpacity>
        ) : null}

          {/* 💔 Remove Button */}
          <TouchableOpacity onPress={() => removeFavorite(item.id)} style={styles.removeButton}>
            <Text style={styles.removeText}>💔 Remove</Text>
          </TouchableOpacity>
        </View>
      )}
      />
        </View>
  );
}

const styles = StyleSheet.create({
   header: {
    backgroundColor: '#f748bdff',
    borderColor: '#703fc8',
    borderWidth: 4,
    shadowColor: '#3a147a',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    padding: 10,
    marginHorizontal: 20,
    marginTop: 80, 
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'PixelFont',
    fontSize: 12,
    color: '#fff',
    textShadowColor: '#703fc8',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },

  container: {
    paddingTop: 20,
    padding: 20,
    backgroundColor: '#f3d6ff',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#b68bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'PixelFont',
    fontSize: 10,
    color: '#fff',
    textAlign: 'center',
    textShadowColor: '#703fc8',
    textShadowOffset: { width: 2, height: 2 },
  },

  // 💾 Card style
  card: {
    backgroundColor: '#b68bff',
    borderColor: '#703fc8',
    borderWidth: 4,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#3a147a',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },

  storeName: {
    fontFamily: 'PixelFont',
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: '#6A2EBD',
    textShadowOffset: { width: 1, height: 1 },
  },
  description: {
    fontFamily: 'PixelFont',
    fontSize: 10,
    color: '#000',
    textAlign: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontFamily: 'PixelFont',
    fontSize: 8,
    color: '#000',
    textAlign: 'center',
    marginVertical: 2,
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 6,
    marginTop: 10,
    borderWidth: 3,
    borderColor: '#703fc8',
  },

  // 🎀 TikTok button
  tiktokButton: {
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#ea2db4',
    borderWidth: 3,
    borderColor: '#6A2EBD',
    borderRadius: 6,
  },
  tiktokText: {
    fontFamily: 'PixelFont',
    fontSize: 8,
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
  },

  // 💔 Remove button
  removeButton: {
    marginTop: 10,
    backgroundColor: '#f3d6ff',
    borderColor: '#703fc8',
    borderWidth: 3,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  removeText: {
    fontFamily: 'PixelFont',
    fontSize: 8,
    color: '#6A2EBD',
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
  },
});
