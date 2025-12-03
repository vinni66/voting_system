const Candidate = require('../models/Candidate');
const User = require('../models/User');

// @desc    Cast a vote for a candidate
// @access  Private
exports.vote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { candidateId } = req.params;
    console.log("Vote function hit. candidateId:", candidateId);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.hasVoted) {
      return res.status(400).json({ msg: 'You have already voted' });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }

    // Update records
    candidate.votes += 1;
    user.hasVoted = true;

    await candidate.save();
    await user.save();

    res.json({ msg: 'Vote cast successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: err.message || 'Server Error' });
  }
};

// @desc    Get current user's voting status
// @access  Private
exports.getVoteStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('hasVoted fullName');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ hasVoted: user.hasVoted, fullName: user.fullName });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// @desc    Get voting results
// @access  Private
exports.getResults = async (req, res) => {
  try {
    // Return all candidates sorted by votes descending
    const results = await Candidate.find().sort({ votes: -1 });
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: err.message || 'Server Error' });
  }
};

// @desc    Reset all votes
// @access  Admin
exports.resetVotes = async (req, res) => {
  try {
    // Reset all users' voting status
    await User.updateMany({}, { $set: { hasVoted: false } });
    
    // Reset all candidates' vote counts and winner status
    await Candidate.updateMany({}, { $set: { votes: 0, isWinner: false } });

    res.json({ msg: 'All votes and winner declarations have been reset successfully.' });
  } catch (err) {
    console.log("!!!!!!!!!!!!!! START OF 'RESET VOTES' ERROR !!!!!!!!!!!!!!");
    console.error("The error object is:", err);
    res.status(500).json({ msg: err.message || 'Server Error' });
  }
};

// @desc    Declare election winner
// @access  Admin
exports.declareWinner = async (req, res) => {
  try {
    // 1. Find the highest vote count
    const highestVoteCandidate = await Candidate.findOne().sort({ votes: -1 });

    if (!highestVoteCandidate) {
      return res.status(404).json({ msg: 'No candidates found to declare a winner.' });
    }

    const highestVoteCount = highestVoteCandidate.votes;

    // 2. Mark candidates with the highest vote count as winners
    await Candidate.updateMany(
      { votes: highestVoteCount },
      { $set: { isWinner: true } }
    );

    // 3. Set isWinner to false for all other candidates
    await Candidate.updateMany(
      { votes: { $lt: highestVoteCount } },
      { $set: { isWinner: false } }
    );

    res.json({ msg: 'Winner(s) declared successfully!' });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: err.message || 'Server Error' });
  }
};