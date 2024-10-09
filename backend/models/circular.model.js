const mongoose = require("mongoose");

const CircularSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  pdfurl: { type: String },
  url: { type: String },
  users: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      read: { type: Boolean, default: false },
      readtime: { type: Date, default: null },
    },
  ],
  date: { type: Date, },
  createdAt: { type: Date, default: Date.now, },
});

const Circular = mongoose.model('Circular', CircularSchema);
module.exports = Circular;
