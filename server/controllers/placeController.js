const Place = require('../models/Place');
const { validationResult } = require('express-validator');

const getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(places);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPlacesByLocation = async (req, res) => {
  try {
    const { country, city } = req.query;
    let query = { user: req.user._id };
    
    if (country) query.country = country;
    if (city) query.city = city;
    
    const places = await Place.find(query).sort({ createdAt: -1 });
    res.json(places);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }
    
    res.json(place);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPlace = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, category, description, country, city, latitude, longitude } = req.body;
    
    // Handle photo upload (if implemented)
    const photo = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;
    
    const place = new Place({
      name,
      category,
      description,
      country,
      city,
      latitude,
      longitude,
      photo,
      user: req.user._id
    });
    
    await place.save();
    res.status(201).json(place);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePlace = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, category, description, country, city, latitude, longitude, visited, favorite } = req.body;
    
    const place = await Place.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        name,
        category,
        description,
        country,
        city,
        latitude,
        longitude,
        visited,
        favorite
      },
      { new: true, runValidators: true }
    );
    
    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }
    
    res.json(place);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePlace = async (req, res) => {
  try {
    const place = await Place.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    
    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }
    
    res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const place = await Place.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }
    
    place.favorite = !place.favorite;
    await place.save();
    
    res.json(place);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const toggleVisited = async (req, res) => {
  try {
    const place = await Place.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }
    
    place.visited = !place.visited;
    await place.save();
    
    res.json(place);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllPlaces,
  getPlacesByLocation,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  toggleFavorite,
  toggleVisited
};