const express = require('express');
const router = express.Router();
const SeedService = require('../services/seedService');

// Seed admin user
router.post('/admin', async (req, res) => {
  try {
    console.log('POST /api/seed/admin - Seeding admin user');
    const result = await SeedService.seedAdminUser();
    
    res.status(200).json({
      success: true,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    console.error('Error in POST /api/seed/admin:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Seed regular users
router.post('/users', async (req, res) => {
  try {
    console.log('POST /api/seed/users - Seeding regular users');
    const result = await SeedService.seedRegularUsers();
    
    res.status(200).json({
      success: true,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    console.error('Error in POST /api/seed/users:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Seed infrastructure data
router.post('/infrastructure', async (req, res) => {
  try {
    console.log('POST /api/seed/infrastructure - Seeding infrastructure data');
    const result = await SeedService.seedInfrastructureData();
    
    res.status(200).json({
      success: true,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    console.error('Error in POST /api/seed/infrastructure:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;