
import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
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

export default function MapScreen() {

  const [loading, setLoading] = useState(true); // loading state
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null); // store data for the callout popup


  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('stores').select('*');
      if (error) console.error('Error fetching stores:', error);
      else setStores(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff69b4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🗾 Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 35.6762,
          longitude: 139.6503,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {stores.map((store) => (
          <Marker
            key={store.id}
            coordinate={{
              latitude: store.latitude,
              longitude: store.longitude,
            }}
            title={store.name}
            onPress={() => setSelectedStore(store)} // when pin tapped
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
                {selectedStore.opening_hours && (
                  <Text style={styles.opening}>🕒 {selectedStore.opening_hours}</Text>
                )}
                {selectedStore.price_category && (
                  <Text style={styles.price}>💴 {selectedStore.price_category}</Text>
                )}
                <Text style={styles.address}>📍 {selectedStore.address}</Text>

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
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
  },
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
  },
  opening: {
    marginTop: 10,
    fontSize: 14,
    color: '#444',
  },
  price: {
    marginTop: 5,
    fontSize: 14,
    color: '#444',
  },
  address: {
    marginTop: 10,
    fontSize: 13,
    color: '#666',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#ff69b4',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
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
   


