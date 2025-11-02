import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';

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
};

const cities = {
  tokyo: { latitude: 35.6762, longitude: 139.6503 },
  taipei: { latitude: 25.0330, longitude: 121.5654 },
  hochiminh: { latitude: 10.7626, longitude: 106.6602 },
};

export default function MapScreen() {
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedCity, setSelectedCity] = useState<'tokyo' | 'taipei' | 'hochiminh'>('tokyo');

  // Fetch stores from Supabase
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

  // Load favorites from AsyncStorage
  useEffect(() => {
    const loadFavorites = async () => {
      const storedFavs = await AsyncStorage.getItem('@favorites');
      if (storedFavs) setFavorites(JSON.parse(storedFavs));
    };
    loadFavorites();
  }, []);

  // Save favorites to AsyncStorage
  const saveFavorites = async (newFavs: number[]) => {
    setFavorites(newFavs);
    await AsyncStorage.setItem('@favorites', JSON.stringify(newFavs));
  };

  // Toggle favorite
  const toggleFavorite = (storeId: number) => {
    const isFavorited = favorites.includes(storeId);
    if (isFavorited) {
      saveFavorites(favorites.filter(id => id !== storeId));
    } else {
      saveFavorites([...favorites, storeId]);
    }
  };

  if (loading) {
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
      {/* 🌸 City Dropdown */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.dropdownLabel}>Choose City:</Text>
        <Picker
          selectedValue={selectedCity}
          onValueChange={(itemValue) => setSelectedCity(itemValue)}
          style={styles.dropdown}
        >
          <Picker.Item label="Tokyo, Japan" value="tokyo" />
          <Picker.Item label="Taipei, Taiwan" value="taipei" />
          <Picker.Item label="Ho Chi Minh, Vietnam" value="hochiminh" />
        </Picker>
      </View>

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

      {/* 🩷 Modal popup */}
      <Modal
        visible={!!selectedStore}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedStore(null)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            {selectedStore && (
              <>
                <Text style={styles.storeName}>{selectedStore.name}</Text>
                <Text style={styles.description}>{selectedStore.description}</Text>
                {selectedStore.opening_hours && <Text style={styles.opening}>🕒 {selectedStore.opening_hours}</Text>}
                {selectedStore.price_category && <Text style={styles.price}>💴 {selectedStore.price_category}</Text>}
                <Text style={styles.address}>📍 {selectedStore.address}</Text>

                <TouchableOpacity
                  onPress={() => toggleFavorite(selectedStore.id)}
                  style={styles.favoriteButton}
                >
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
  dropdownContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    elevation: 5,
  },
  dropdownLabel: { fontWeight: 'bold', marginBottom: 5, color: '#222' },
  dropdown: { width: '100%' },
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
   


