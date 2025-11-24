import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Picker,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddPlaceScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('restaurant');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    { key: 'restaurant', label: 'Restaurant' },
    { key: 'cafe', label: 'Cafe' },
    { key: 'viewpoint', label: 'Viewpoint' },
    { key: 'activity', label: 'Activity' },
    { key: 'accommodation', label: 'Accommodation' },
    { key: 'other', label: 'Other' },
  ];

  const handleSubmit = async () => {
    if (!name || !description || !country || !city || !latitude || !longitude) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Validate coordinates
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || lat < -90 || lat > 90) {
      Alert.alert('Error', 'Please enter a valid latitude (-90 to 90)');
      return;
    }
    
    if (isNaN(lng) || lng < -180 || lng > 180) {
      Alert.alert('Error', 'Please enter a valid longitude (-180 to 180)');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          category,
          description,
          country,
          city,
          latitude: lat,
          longitude: lng,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Place added successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        const data = await response.json();
        Alert.alert('Error', data.error || 'Failed to add place');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Place Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter place name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={setCategory}
            style={styles.picker}
          >
            {categories.map((cat) => (
              <Picker.Item key={cat.key} label={cat.label} value={cat.key} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Country *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter country"
          value={country}
          onChangeText={setCountry}
        />

        <Text style={styles.label}>City *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter city"
          value={city}
          onChangeText={setCity}
        />

        <Text style={styles.label}>Latitude *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter latitude"
          value={latitude}
          onChangeText={setLatitude}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Longitude *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter longitude"
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Adding Place...' : 'Add Place'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: '#4CAF50',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddPlaceScreen;