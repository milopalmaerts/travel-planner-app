import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MapScreen = ({ navigation }) => {
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [region, setRegion] = useState({
    latitude: 52.3676,
    longitude: 4.9041,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    loadPlaces();
  }, []);

  const loadPlaces = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/places', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPlaces(data);
      } else {
        Alert.alert('Error', 'Failed to load places');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to server');
    }
  };

  const getMarkerColor = (category) => {
    switch (category) {
      case 'restaurant':
        return '#FF5722';
      case 'cafe':
        return '#795548';
      case 'viewpoint':
        return '#2196F3';
      case 'activity':
        return '#FF9800';
      case 'accommodation':
        return '#9C27B0';
      default:
        return '#4CAF50';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'restaurant':
        return 'restaurant';
      case 'cafe':
        return 'cafe';
      case 'viewpoint':
        return 'eye';
      case 'activity':
        return 'bicycle';
      case 'accommodation':
        return 'bed';
      default:
        return 'location';
    }
  };

  const handleMarkerPress = (place) => {
    setSelectedPlace(place);
  };

  const handleCalloutPress = (place) => {
    navigation.navigate('PlaceDetail', { place });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {places.map((place) => (
          <Marker
            key={place._id}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            pinColor={getMarkerColor(place.category)}
            onPress={() => handleMarkerPress(place)}
          >
            <Callout onPress={() => handleCalloutPress(place)}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{place.name}</Text>
                <Text style={styles.calloutCategory}>{place.category}</Text>
                <Text style={styles.calloutDescription}>
                  {place.description.substring(0, 50)}...
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddPlace')}
      >
        <Icon name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  map: {
    flex: 1,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  callout: {
    width: 200,
    padding: 10,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  calloutCategory: {
    fontStyle: 'italic',
    color: '#666',
    marginVertical: 2,
  },
  calloutDescription: {
    fontSize: 14,
    color: '#333',
  },
});

export default MapScreen;