import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

type Store = {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  price_min?: number;
  price_max?: number;
  price_category?: string;
  tags?: string[];
  address: string;
  opening_hours?: string;
  images?: string[];
  tiktok_url?: string[];
};

const cities = {
  tokyo: { latitude: 35.6762, longitude: 139.6503, label: 'Tokyo, Japan' },
  taipei: { latitude: 25.0330, longitude: 121.5654, label: 'Taipei, Taiwan' },
  hochiminh: { latitude: 10.7626, longitude: 106.6602, label: 'Ho Chi Minh, Vietnam' },
};

export default function MapScreen() {
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedCity, setSelectedCity] = useState<'tokyo' | 'taipei' | 'hochiminh'>('tokyo');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [fontsLoaded] = useFonts({
    PixelFont: require('../../assets/fonts/PressStart2P-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('stores').select('*');
      if (error) console.error('Error fetching stores:', error);
      else setStores(data || []);
      setLoading(false);
    };
    fetchStores();
  }, []);

  useEffect(() => {
    const loadFavorites = async () => {
      const storedFavs = await AsyncStorage.getItem('@favorites');
      if (storedFavs) setFavorites(JSON.parse(storedFavs));
    };
    loadFavorites();
  }, []);

  const saveFavorites = async (newFavs: number[]) => {
    setFavorites(newFavs);
    await AsyncStorage.setItem('@favorites', JSON.stringify(newFavs));
  };

  const toggleFavorite = (storeId: number) => {
    const isFavorited = favorites.includes(storeId);
    if (isFavorited) saveFavorites(favorites.filter(id => id !== storeId));
    else saveFavorites([...favorites, storeId]);
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff69b4" />
      </View>
    );
  }

  const region = {
    ...cities[selectedCity],
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  return (
    <View style={styles.container}>
      {/* 🎮 Pixel-style dropdown */}
      <View style={styles.dropdownWrapper}>
        <Text style={styles.dropdownLabel}>♡ CHOOSE YOUR CITY BABE :</Text>

        <TouchableOpacity
          onPress={() => setDropdownOpen(!dropdownOpen)}
          style={styles.dropdownBox}
          activeOpacity={0.7}
        >
          <Text style={styles.dropdownText}>{cities[selectedCity].label} ▼</Text>
        </TouchableOpacity>

        {dropdownOpen && (
          <View style={styles.dropdownList}>
            {Object.entries(cities).map(([key, city]) => (
              <TouchableOpacity
                key={key}
                onPress={() => {
                  setSelectedCity(key as any);
                  setDropdownOpen(false);
                }}
                style={styles.dropdownItem}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    selectedCity === key && { fontWeight: 'bold' },
                  ]}
                >
                  {city.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* 🗾 Map */}
      <MapView style={styles.map} region={region}>
        {stores.map(store => (
          <Marker
            key={store.id}
            coordinate={{ latitude: store.latitude, longitude: store.longitude }}
            title={store.name}
            onPress={() => setSelectedStore(store)}
          />
        ))}
      </MapView>

      {/* 💖 Modal popup */}
      <Modal visible={!!selectedStore} transparent animationType="slide" onRequestClose={() => setSelectedStore(null)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            {selectedStore && (
              <>
                <Text style={styles.storeName}>{selectedStore.name}</Text>
                <Text style={styles.description}>{selectedStore.description}</Text>
                {selectedStore.opening_hours && <Text style={styles.opening}>🕒 {selectedStore.opening_hours}</Text>}
                {selectedStore.price_category && <Text style={styles.price}>💴 {selectedStore.price_category}</Text>}
                <Text style={styles.address}>📍 {selectedStore.address}</Text>

                {selectedStore.tiktok_url && selectedStore.tiktok_url.length > 0 && (
                  <TouchableOpacity
                    style={[styles.favoriteButton, { backgroundColor: '#ff66c4', marginTop: 10 }]}
                    onPress={() => Linking.openURL(selectedStore.tiktok_url![0])}
                  >
                    <Text style={{ color: 'white', fontSize: 16 }}>🎀 Watch on TikTok 🎀</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => toggleFavorite(selectedStore.id)} style={styles.favoriteButton}>
                  <Text style={{ fontSize: 20 }}>
                    {favorites.includes(selectedStore.id) ? '💔 Remove' : '❤️ Save'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setSelectedStore(null)} style={styles.closeButton}>
                  <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  // 🌆 Pixel dropdown styling
  dropdownWrapper: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: '#b68bff',
    borderColor: '#703fc8',
    borderWidth: 4,
    shadowColor: '#3a147a',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    padding: 10,
    width: 280,
    zIndex: 10,
  },
  dropdownLabel: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'PixelFont',
    marginBottom: 8,
    textShadowColor: '#703fc8',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  dropdownBox: {
    backgroundColor: '#f3d6ff',
    borderColor: '#703fc8',
    borderWidth: 4,
    padding: 10,
    justifyContent: 'center',
  },
  dropdownText: {
    fontFamily: 'PixelFont',
    color: '#000',
    fontSize: 10,
  },
  dropdownList: {
    backgroundColor: '#d5b6ff',
    borderColor: '#703fc8',
    borderWidth: 4,
    marginTop: 4,
  },
  dropdownItem: {
    padding: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#703fc8',
  },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { width: '85%', backgroundColor: 'white', borderRadius: 16, padding: 20 },
  storeName: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  description: { marginTop: 10, fontSize: 14, color: '#555' },
  opening: { marginTop: 10, fontSize: 14, color: '#444' },
  price: { marginTop: 5, fontSize: 14, color: '#444' },
  address: { marginTop: 10, fontSize: 13, color: '#666' },
  favoriteButton: { marginTop: 15, alignItems: 'center', paddingVertical: 10, backgroundColor: '#ffe4e1', borderRadius: 10 },
  closeButton: { marginTop: 20, backgroundColor: '#ff69b4', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  closeText: { color: 'white', fontWeight: 'bold' },
});


// learning notes 

         
    
         // this creates a default callout 
          // <Marker
          //   key={store.id}
          //   coordinate={{
          //     latitude: store.latitude,
          //     longitude: store.longitude,
          //   }}
          //   title={store.name}
          //   description={store.description}
          // /> // self-closing tag. we will use </marker> when i want to nest something inside here 
   


