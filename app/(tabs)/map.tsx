import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function MapScreen() {
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('stores').select('*');
      if (error) console.error(error);
      else console.log('Fetched stores:', data);
    };
    fetchData();
  }, []);

  return (
    <View>
      <Text>🗺️ Map Screen</Text>
    </View>
  );
}
