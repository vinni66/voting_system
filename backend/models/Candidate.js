const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  party: {
    type: String
  },
  photo: {
    type: String
  },
  description: {
    type: String
  },
  votes: {
    type: Number,
    default: 0
  },
  isWinner: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Candidate', CandidateSchema);