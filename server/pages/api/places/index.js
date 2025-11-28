import { db } from '../../../lib/firebase';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const placesRef = db.collection('places');
        const snapshot = await placesRef.get();
        
        const places = [];
        snapshot.forEach(doc => {
          places.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        res.status(200).json(places);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'POST':
      try {
        const { name, category, description, country, city, latitude, longitude, userId } = req.body;
        
        const newPlace = {
          name,
          category,
          description,
          country,
          city,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          userId,
          createdAt: new Date().toISOString(),
          visited: false,
          favorite: false
        };
        
        const docRef = await db.collection('places').add(newPlace);
        
        res.status(201).json({
          id: docRef.id,
          ...newPlace
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}