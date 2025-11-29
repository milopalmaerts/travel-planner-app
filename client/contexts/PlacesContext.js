import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const PlacesContext = createContext();

export function PlacesProvider({ children }) {
  const [places, setPlaces] = useState([]);
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [demoUsers, setDemoUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Handle Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          let userData = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Traveler',
          };

          if (userDoc.exists()) {
            userData = { ...userData, ...userDoc.data() };
          } else {
            // Create new user document
            await setDoc(doc(db, 'users', firebaseUser.uid), userData);
          }

          setUser(userData);
          
          // Load user's places
          const placesDoc = await getDoc(doc(db, 'places', firebaseUser.uid));
          if (placesDoc.exists()) {
            setPlaces(placesDoc.data().places || []);
          }
          
          // Load user's friends
          const friendsDoc = await getDoc(doc(db, 'friends', firebaseUser.uid));
          if (friendsDoc.exists()) {
            setFriends(friendsDoc.data().friends || []);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      } else {
        // User is signed out
        setUser(null);
        setPlaces([]);
        setFriends([]);
      }
      setLoading(false);
    });

    // Initialize demo users with Eva
    const storedDemoUsers = localStorage.getItem('travelDemoUsers');
    if (storedDemoUsers) {
      setDemoUsers(JSON.parse(storedDemoUsers));
    } else {
      // Create Eva demo user with places
      const eva = {
        id: 'demo-eva',
        username: 'eva_adventures',
        email: 'eva@travel.com',
        profilePhoto: null,
        bio: 'Travel enthusiast 🌍 | Food lover 🍴 | Adventure seeker ⛰️',
      };
      
      const evaPlaces = [
        {
          id: 'eva-1',
          userId: 'demo-eva',
          name: 'Eiffel Tower',
          category: 'viewpoint',
          address: 'Champ de Mars',
          postcode: '75007',
          city: 'Paris',
          country: 'Frankrijk',
          description: 'Amazing views from the top! Must visit at sunset.',
          isPublic: true,
          visited: true,
          favorite: true,
          photo: null,
          likes: [],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'eva-2',
          userId: 'demo-eva',
          name: 'Le Jules Verne',
          category: 'restaurant',
          address: 'Avenue Gustave Eiffel',
          postcode: '75007',
          city: 'Paris',
          country: 'Frankrijk',
          description: 'Fine dining restaurant in the Eiffel Tower. Expensive but worth it!',
          isPublic: true,
          visited: true,
          favorite: true,
          photo: null,
          likes: [],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'eva-3',
          userId: 'demo-eva',
          name: 'La Galeries Lafayette',
          category: 'shopping',
          address: '40 Boulevard Haussmann',
          postcode: '75009',
          city: 'Paris',
          country: 'Frankrijk',
          description: 'Beautiful department store with amazing rooftop views.',
          isPublic: true,
          visited: true,
          favorite: false,
          photo: null,
          likes: [],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'eva-4',
          userId: 'demo-eva',
          name: 'Colosseum',
          category: 'museum',
          address: 'Piazza del Colosseo',
          postcode: '00184',
          city: 'Rome',
          country: 'Italië',
          description: 'Incredible history! Book tickets in advance to skip the line.',
          isPublic: true,
          visited: true,
          favorite: true,
          photo: null,
          likes: [],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'eva-5',
          userId: 'demo-eva',
          name: 'Trevi Fountain',
          category: 'viewpoint',
          address: 'Piazza di Trevi',
          postcode: '00187',
          city: 'Rome',
          country: 'Italië',
          description: "Don't forget to throw a coin! Very crowded but magical at night.",
          isPublic: true,
          visited: true,
          favorite: false,
          photo: null,
          likes: [],
          createdAt: new Date().toISOString(),
        },
      ];
      
      setDemoUsers([{ ...eva, places: evaPlaces }]);
      localStorage.setItem('travelDemoUsers', JSON.stringify([{ ...eva, places: evaPlaces }]));
    }

    return () => unsubscribe();
  }, []);

  // Save places to Firestore whenever they change
  useEffect(() => {
    if (user && places.length > 0) {
      const savePlaces = async () => {
        try {
          await setDoc(doc(db, 'places', user.id), { places });
        } catch (error) {
          console.error('Error saving places:', error);
        }
      };
      savePlaces();
    }
  }, [places, user]);

  const addPlace = async (place) => {
    const newPlace = {
      ...place,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      visited: false,
      favorite: false,
    };
    
    const updatedPlaces = [...places, newPlace];
    setPlaces(updatedPlaces);
    
    // Save to Firestore
    if (user) {
      try {
        await setDoc(doc(db, 'places', user.id), { places: updatedPlaces });
      } catch (error) {
        console.error('Error saving place:', error);
      }
    }
    
    return newPlace;
  };

  const updatePlace = async (id, updates) => {
    const updatedPlaces = places.map(place => 
      place.id === id ? { ...place, ...updates } : place
    );
    setPlaces(updatedPlaces);
    
    // Save to Firestore
    if (user) {
      try {
        await setDoc(doc(db, 'places', user.id), { places: updatedPlaces });
      } catch (error) {
        console.error('Error updating place:', error);
      }
    }
  };

  const deletePlace = async (id) => {
    const updatedPlaces = places.filter(place => place.id !== id);
    setPlaces(updatedPlaces);
    
    // Save to Firestore
    if (user) {
      try {
        await setDoc(doc(db, 'places', user.id), { places: updatedPlaces });
      } catch (error) {
        console.error('Error deleting place:', error);
      }
    }
  };

  const toggleVisited = async (id) => {
    const updatedPlaces = places.map(place =>
      place.id === id ? { ...place, visited: !place.visited } : place
    );
    setPlaces(updatedPlaces);
    
    // Save to Firestore
    if (user) {
      try {
        await setDoc(doc(db, 'places', user.id), { places: updatedPlaces });
      } catch (error) {
        console.error('Error toggling visited:', error);
      }
    }
  };

  const toggleFavorite = async (id) => {
    const updatedPlaces = places.map(place =>
      place.id === id ? { ...place, favorite: !place.favorite } : place
    );
    setPlaces(updatedPlaces);
    
    // Save to Firestore
    if (user) {
      try {
        await setDoc(doc(db, 'places', user.id), { places: updatedPlaces });
      } catch (error) {
        console.error('Error toggling favorite:', error);
      }
    }
  };

  const login = async (userData) => {
    setUser(userData);
    // Note: Actual Firebase login should be handled in login/register pages
  };

  const updateUserProfile = async (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    
    // Save to Firestore
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.id), updatedUser);
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  const addFriend = async (friendId) => {
    if (!friends.includes(friendId)) {
      const newFriends = [...friends, friendId];
      setFriends(newFriends);
      
      // Save to Firestore
      if (user) {
        try {
          await setDoc(doc(db, 'friends', user.id), { friends: newFriends });
        } catch (error) {
          console.error('Error adding friend:', error);
        }
      }
    }
  };

  const removeFriend = async (friendId) => {
    const newFriends = friends.filter(id => id !== friendId);
    setFriends(newFriends);
    
    // Save to Firestore
    if (user) {
      try {
        await setDoc(doc(db, 'friends', user.id), { friends: newFriends });
      } catch (error) {
        console.error('Error removing friend:', error);
      }
    }
  };

  const toggleLikePlace = (placeId, userId) => {
    const currentUserId = user?.id || user?.email;
    
    // Update demo user's places
    const updatedDemoUsers = demoUsers.map(demoUser => {
      if (demoUser.id === userId) {
        const updatedPlaces = demoUser.places.map(place => {
          if (place.id === placeId) {
            const likes = place.likes || [];
            const hasLiked = likes.includes(currentUserId);
            return {
              ...place,
              likes: hasLiked 
                ? likes.filter(id => id !== currentUserId)
                : [...likes, currentUserId]
            };
          }
          return place;
        });
        return { ...demoUser, places: updatedPlaces };
      }
      return demoUser;
    });
    
    setDemoUsers(updatedDemoUsers);
    localStorage.setItem('travelDemoUsers', JSON.stringify(updatedDemoUsers));
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setPlaces([]);
      setFriends([]);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <PlacesContext.Provider value={{
      places,
      user,
      friends,
      demoUsers,
      loading,
      addPlace,
      updatePlace,
      deletePlace,
      toggleVisited,
      toggleFavorite,
      login,
      logout,
      updateUserProfile,
      addFriend,
      removeFriend,
      toggleLikePlace,
    }}>
      {children}
    </PlacesContext.Provider>
  );
}

export function usePlaces() {
  const context = useContext(PlacesContext);
  if (!context) {
    throw new Error('usePlaces must be used within a PlacesProvider');
  }
  return context;
}
