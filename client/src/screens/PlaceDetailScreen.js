import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlaceDetailScreen = ({ route, navigation }) => {
  const { place } = route.params;
  const [isFavorite, setIsFavorite] = useState(place.favorite);
  const [isVisited, setIsVisited] = useState(place.visited);

  const toggleFavorite = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/places/${place._id}/favorite`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setIsFavorite(!isFavorite);
      } else {
        Alert.alert('Error', 'Failed to update favorite status');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to server');
    }
  };

  const toggleVisited = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/places/${place._id}/visited`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setIsVisited(!isVisited);
      } else {
        Alert.alert('Error', 'Failed to update visited status');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to server');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Place',
      'Are you sure you want to delete this place?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const response = await fetch(
                `http://localhost:5000/api/places/${place._id}`,
                {
                  method: 'DELETE',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                  },
                }
              );

              if (response.ok) {
                Alert.alert('Success', 'Place deleted successfully', [
                  { text: 'OK', onPress: () => navigation.goBack() },
                ]);
              } else {
                Alert.alert('Error', 'Failed to delete place');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to connect to server');
            }
          },
        },
      ]
    );
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

  const getCategoryColor = (category) => {
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(place.category) },
          ]}
        >
          <Icon
            name={getCategoryIcon(place.category)}
            size={16}
            color="white"
          />
          <Text style={styles.categoryText}>
            {place.category.charAt(0).toUpperCase() + place.category.slice(1)}
          </Text>
        </View>

        <Text style={styles.placeName}>{place.name}</Text>
        <Text style={styles.placeLocation}>
          {place.city}, {place.country}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{place.description}</Text>

        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.locationInfo}>
          <Icon name="location" size={20} color="#666" />
          <Text style={styles.locationText}>
            Lat: {place.latitude}, Lng: {place.longitude}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              isFavorite && styles.favoriteButton,
            ]}
            onPress={toggleFavorite}
          >
            <Icon
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? 'white' : '#333'}
            />
            <Text
              style={[
                styles.actionText,
                isFavorite && styles.favoriteText,
              ]}
            >
              {isFavorite ? 'Favorited' : 'Favorite'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              isVisited && styles.visitedButton,
            ]}
            onPress={toggleVisited}
          >
            <Icon
              name={isVisited ? 'checkmark-circle' : 'checkmark-circle-outline'}
              size={24}
              color={isVisited ? 'white' : '#333'}
            />
            <Text
              style={[
                styles.actionText,
                isVisited && styles.visitedText,
              ]}
            >
              {isVisited ? 'Visited' : 'Mark as Visited'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={[styles.bottomButton, styles.editButton]}
            onPress={() => Alert.alert('Edit', 'Edit functionality to be implemented')}
          >
            <Icon name="pencil" size={20} color="white" />
            <Text style={styles.bottomButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.bottomButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Icon name="trash" size={20} color="white" />
            <Text style={styles.bottomButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  categoryText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
    textTransform: 'capitalize',
  },
  placeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  placeLocation: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 20,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 1,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
  },
  favoriteButton: {
    backgroundColor: '#FF5252',
  },
  visitedButton: {
    backgroundColor: '#4CAF50',
  },
  actionText: {
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  favoriteText: {
    color: 'white',
  },
  visitedText: {
    color: 'white',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#FF5252',
  },
  bottomButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default PlaceDetailScreen;