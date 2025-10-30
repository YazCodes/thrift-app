import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

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

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [stores, setStores] = useState<Store[]>([]);

  // Load favorite store IDs from AsyncStorage
  useEffect(() => {
    const loadFavorites = async () => {
      const storedFavs = await AsyncStorage.getItem('@favorites');
      if (storedFavs) setFavorites(JSON.parse(storedFavs));
    };
    loadFavorites();
  }, []);

  // Fetch all stores from Supabase
  useEffect(() => {
    const fetchStores = async () => {
      const { data, error } = await supabase.from('stores').select('*');
      if (error) console.error(error);
      else setStores(data || []);
    };
    fetchStores();
  }, []);

  // Filter only favorite stores
  const favoriteStores = stores.filter(store => favorites.includes(store.id));

  const removeFavorite = async (storeId: number) => {
    const newFavs = favorites.filter(id => id !== storeId);
    setFavorites(newFavs);
    await AsyncStorage.setItem('@favorites', JSON.stringify(newFavs));
  };

  if (favoriteStores.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No favorites yet! ❤️</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favoriteStores}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.storeCard}>
          <Text style={styles.storeName}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
          {item.opening_hours && <Text style={styles.opening}>🕒 {item.opening_hours}</Text>}
          {item.price_category && <Text style={styles.price}>💴 {item.price_category}</Text>}
          <Text style={styles.address}>📍 {item.address}</Text>

          <TouchableOpacity
            onPress={() => removeFavorite(item.id)}
            style={styles.removeButton}
          >
            <Text style={styles.removeText}>💔 Remove</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#666' },
  storeCard: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  storeName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  description: { marginTop: 5, fontSize: 14, color: '#555' },
  opening: { marginTop: 5, fontSize: 13, color: '#444' },
  price: { marginTop: 5, fontSize: 13, color: '#444' },
  address: { marginTop: 5, fontSize: 12, color: '#666' },
  removeButton: { marginTop: 10, backgroundColor: '#ffe4e1', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  removeText: { fontWeight: 'bold', color: '#ff69b4' },
});
