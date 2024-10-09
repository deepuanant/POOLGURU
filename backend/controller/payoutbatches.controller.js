const Batches = require('../models/payoutBatches.model');
const User = require('../models/user.model');

// Create and Save a new Payout
exports.create = async (req, res) => {
    try {
      const { status, phases } = req.body;
      const userId = req.user._id; // Changed from req.params.id.userId
  
      // Input validation
      if (!status || !userId) {
        return res.status(400).json({ message: 'Status and userId are required' });
      }
  
      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Create a new payout document
      const newPayout = new Batches({
        status,
        userId,
        phases: {
          batchCreated: phases?.batchCreated ?? 'pending',
          validated: phases?.validated ?? 'pending',
          processed: phases?.processed ?? 'pending',
          reportGen: phases?.reportGen ?? 'pending',
          batchCompleted: phases?.batchCompleted ?? 'pending'
        }
      });
  
      // Save the new payout to the database
      const savedPayout = await newPayout.save();
  
      // Update user's payoutMonitor
      user.payoutMonitor.push(savedPayout._id);
      await user.save();
  
      // Send a success response
      res.status(201).json({
        message: 'Payout created successfully',
        payout: savedPayout
      });
    } catch (error) {
      // If there's an error, send an error response
      res.status(500).json({
        message: 'Error creating payout',
        error: error.message
      });
    }
  };
  

// Retrieve all Payouts from the database.
exports.findAll = async(req, res) => {
    try {
      const userId = req.user._id;
      const payouts = await Batches.find({ userId });
        res.status(200).json(payouts);
      } catch (error) {
        res.status(500).json({
          message: 'Error fetching payouts',
          error: error.message
        });
      }
};

// Find a single Payout with an id
exports.findOne = async(req, res) => {
    const id = req.params.id;
    try {
        const payout = await Batches.findById(id);
        if (!payout) {
          return res.status(404).json({ message: 'Payout not found' });
        }
        res.status(200).json(payout);
      } catch (error) {
        res.status(500).json({
          message: 'Error fetching payout',
          error: error.message
        });
      }
}




// Delete a Payout with the specified id in the request
exports.deleteById = async(req, res) => {
    const id = req.params.id;
    try {
        const payout = await Batches.findByIdAndDelete(id);
        if (!payout) {
          return res.status(404).json({ message: 'Payout not found' });
        }
        res.status(200).json({ message: 'Payout deleted successfully', payout });
      } catch (error) {
        res.status(500).json({
          message: 'Error deleting payout',
          error: error.message
        });
      }
}

// Delete all Payouts from the database.
exports.deleteAll = async(req, res) => {
    try {
        await Batches.deleteMany({});
        res.status(200).json({ message: 'All payouts deleted successfully' });
      } catch (error) {
        res.status(500).json({
          message: 'Error deleting payouts',
          error: error.message
        });
      }
};