import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListScreen = ({ navigation }) => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'restaurant', label: 'Restaurants' },
    { key: 'cafe', label: 'Cafes' },
    { key: 'viewpoint', label: 'Viewpoints' },
    { key: 'activity', label: 'Activities' },
    { key: 'accommodation', label: 'Accommodations' },
  ];

  useEffect(() => {
    loadPlaces();
  }, []);

  useEffect(() => {
    filterPlaces();
  }, [places, searchQuery, selectedCategory]);

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

  const filterPlaces = () => {
    let result = places;

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(place => place.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        place =>
          place.name.toLowerCase().includes(query) ||
          place.description.toLowerCase().includes(query) ||
          place.city.toLowerCase().includes(query) ||
          place.country.toLowerCase().includes(query)
      );
    }

    setFilteredPlaces(result);
  };

  const renderPlaceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.placeItem}
      onPress={() => navigation.navigate('PlaceDetail', { place: item })}
    >
      <View style={styles.placeInfo}>
        <Text style={styles.placeName}>{item.name}</Text>
        <Text style={styles.placeLocation}>
          {item.city}, {item.country}
        </Text>
        <Text style={styles.placeDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
      <View style={styles.placeCategoryContainer}>
        <Text style={styles.placeCategory}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryButton = (category) => (
    <TouchableOpacity
      key={category.key}
      style={[
        styles.categoryButton,
        selectedCategory === category.key && styles.selectedCategoryButton,
      ]}
      onPress={() => setSelectedCategory(category.key)}
    >
      <Text
        style={[
          styles.categoryButtonText,
          selectedCategory === category.key && styles.selectedCategoryButtonText,
        ]}
      >
        {category.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search places..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddPlace')}
        >
          <Icon name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={categories}
          renderItem={({ item }) => renderCategoryButton(item)}
          keyExtractor={item => item.key}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <FlatList
        data={filteredPlaces}
        renderItem={renderPlaceItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No places found</Text>
            <Text style={styles.emptySubtext}>
              Add your first place to get started
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  selectedCategoryButton: {
    backgroundColor: '#4CAF50',
  },
  categoryButtonText: {
    color: '#333',
  },
  selectedCategoryButtonText: {
    color: 'white',
  },
  listContent: {
    padding: 16,
  },
  placeItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  placeLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  placeDescription: {
    fontSize: 14,
    color: '#333',
  },
  placeCategoryContainer: {
    justifyContent: 'center',
  },
  placeCategory: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    textTransform: 'capitalize',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});

export default ListScreen;