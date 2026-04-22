const express = require('express');
const router = express.Router();
const { getSetting, updateSetting } = require('../controllers/settingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/:key')
  .get(getSetting)
  .put(protect, admin, updateSetting);

module.exports = router;
