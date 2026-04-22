const Setting = require('../models/Setting');

// @desc    Get a setting by key
// @route   GET /api/settings/:key
// @access  Public
const getSetting = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    res.json(setting ? setting.value : null);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching setting' });
  }
};

// @desc    Update a setting by key
// @route   PUT /api/settings/:key
// @access  Private/Admin
const updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    const setting = await Setting.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true } // Upsert: create if doesn't exist
    );
    
    res.json(setting.value);
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating setting' });
  }
};

module.exports = {
  getSetting,
  updateSetting
};
