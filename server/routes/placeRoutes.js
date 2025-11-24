const express = require('express');
const { body } = require('express-validator');
const placeController = require('../controllers/placeController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation rules
const placeValidation = [
  body('name').notEmpty().trim().escape(),
  body('category').notEmpty().isIn(['restaurant', 'cafe', 'viewpoint', 'activity', 'accommodation', 'other']),
  body('description').notEmpty().trim(),
  body('country').notEmpty().trim(),
  body('city').notEmpty().trim(),
  body('latitude').isFloat({ min: -90, max: 90 }),
  body('longitude').isFloat({ min: -180, max: 180 })
];

// Get all places for user
router.get('/', auth, placeController.getAllPlaces);

// Get places by location
router.get('/location', auth, placeController.getPlacesByLocation);

// Get place by ID
router.get('/:id', auth, placeController.getPlaceById);

// Create new place
router.post('/', auth, placeValidation, placeController.createPlace);

// Update place
router.put('/:id', auth, placeValidation, placeController.updatePlace);

// Delete place
router.delete('/:id', auth, placeController.deletePlace);

// Toggle favorite status
router.patch('/:id/favorite', auth, placeController.toggleFavorite);

// Toggle visited status
router.patch('/:id/visited', auth, placeController.toggleVisited);

module.exports = router;