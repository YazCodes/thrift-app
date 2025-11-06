import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const cities = ['Tokyo, Japan', 'Taipei, Taiwan', 'Ho Chi Minh, Vietnam'];

export default function PixelCitySelector({ selectedCity, onSelect }: any) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>CHOOSE CITY:</Text>

      <TouchableOpacity
        style={styles.selector}
        onPress={() => setOpen(!open)}
        activeOpacity={0.8}
      >
        <Text style={styles.selectedText}>{selectedCity}</Text>
        <Ionicons name="chevron-down" size={14} color="#3A1469" />
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdown}>
          {cities.map((city) => (
            <TouchableOpacity
              key={city}
              style={styles.option}
              onPress={() => {
                onSelect(city);
                setOpen(false);
              }}
            >
              <Text style={styles.optionText}>{city}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    backgroundColor: '#C7A9FF',
    borderWidth: 4,
    borderColor: '#6A2EBD',
    padding: 10,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  label: {
    fontFamily: 'PixelFont',
    color: '#FFFFFF',
    fontSize: 10,
    marginBottom: 8,
    textShadowColor: '#6A2EBD',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  selector: {
    backgroundColor: '#F3DFFF',
    borderWidth: 3,
    borderColor: '#6A2EBD',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  selectedText: {
    fontFamily: 'PixelFont',
    fontSize: 8,
    color: '#000',
  },
  dropdown: {
    marginTop: 6,
    borderWidth: 3,
    borderColor: '#6A2EBD',
    backgroundColor: '#EAD2FF',
  },
  option: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  optionText: {
    fontFamily: 'PixelFont',
    fontSize: 8,
    color: '#000',
  },
});

