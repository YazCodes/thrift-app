import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator, Linking, Image } from 'react-native';
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

  // useEffect(() => {
  //   const fetchStores = async () => {

  //     setLoading(true);
  //     const { data, error } = await supabase.from('stores').select('*');
  //     if (error) console.error('Error fetching stores:', error);
  //     else setStores(data || []);
  //     setLoading(false);


  //   };
  //   fetchStores();
  // }, []);

// LOADS ALL MY STORES FROM THE DATABASE FOR DEBUGGING
  // useEffect(() => {
  // const fetchStores = async () => {
  //   console.log("Fetching stores...");

  //   const { data, error } = await supabase
  //     .from("stores")
  //     .select("*");

  //   if (error) {
  //     console.log("Supabase error:", error);
  //     return;
  //   }

  //   console.log("Loaded stores:", data.length);
  //   data.forEach((s) => {
  //     console.log(
  //       `${s.name} → lat:${s.latitude}, lng:${s.longitude}`
  //     );
  //   });

  //   setStores(data);
  // };

  //   fetchStores();
  // }, []);


  useEffect(() => {
  const fetchStores = async () => {
    console.log("Fetching stores...");
    const { data, error } = await supabase.from("stores").select("*");

    if (error) {
      console.error("Error fetching stores:", error);
      setLoading(false);
      return;
    }

    console.log("Loaded stores:", data.length);

    data.forEach((item) => {
      console.log(`${item.name} → lat:${item.latitude}, lng:${item.longitude}`);
    });

    setStores(data);
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
                    style={styles.tiktokButton}
                    onPress={() => Linking.openURL(selectedStore.tiktok_url![0])}
                  >
                    <Text style={styles.tiktokText}> ₊˚⊹♡Watch on TikTok♡₊˚⊹♡</Text>
                  </TouchableOpacity>
                )}

                {/* 🐶 Character + Save/Remove Image */}
                <View style={styles.characterContainer}>
                  <Image source={require('../../assets/images/hellokitty.png')} style={styles.character} />
                  <TouchableOpacity
                    onPress={() => toggleFavorite(selectedStore.id)}
                    style={styles.saveButtonWrapper}
                  >
                    <Image
                      source={
                        favorites.includes(selectedStore.id)
                          ? require('../../assets/images/removeButton.png')
                          : require('../../assets/images/saveButton.png')
                      }
                        style={[{ width: 300, height: 300 }, styles.saveButton]}
                    />
                  </TouchableOpacity>
                </View>

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
  modalBox: { width: '85%', backgroundColor: '#b68bff', borderRadius: 16, padding: 20, borderColor: '#703fc8',borderWidth: 4, shadowColor: '#3a147a',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,},
  storeName: {
    fontFamily: 'PixelFont',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
    textShadowColor: '#6A2EBD',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  description: {
    fontFamily: 'PixelFont',
    fontSize: 12,
    color: '#000', 
    textAlign: 'center',
    marginVertical: 4,
    textShadowColor: '#d5b6ff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  opening: {
    fontFamily: 'PixelFont',
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
    marginVertical: 2,
    textShadowColor: '#d5b6ff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  price: {
    fontFamily: 'PixelFont',
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
    marginVertical: 2,
    textShadowColor: '#d5b6ff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  address: {
    fontFamily: 'PixelFont',
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
    marginVertical: 2,
    textShadowColor: '#d5b6ff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  tiktokButton: {
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#ea2db4ff',
    borderWidth: 3,
    borderColor: '#6A2EBD',
    borderRadius: 6,
  },
  tiktokText: {
    fontFamily: 'PixelFont',
    fontSize: 11,
    color: '#ffffffff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#6A2EBD',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeText: {
    fontFamily: 'PixelFont',
    fontSize: 8,
    color: '#FFFFFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  characterContainer: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  character: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  saveButtonWrapper: {
    position: 'absolute',
    top: -100,
    right: 50,
  },
  saveButton: {
    width: 300,
    height: 250,
    resizeMode: 'contain',
  },
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
   


