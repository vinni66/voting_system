const express = require('express');
const router = express.Router();
const { vote, getResults, resetVotes, declareWinner, getVoteStatus } = require('../controllers/voteController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// @route   GET api/vote/status
// @desc    Get current user's voting status
// @access  Private
router.get('/status', authMiddleware, getVoteStatus);

// @route   GET api/vote/results
// @desc    Get voting results
// @access  Private
router.get('/results', authMiddleware, getResults);

// @route   POST api/vote/reset
// @desc    Reset all votes
// @access  Admin
router.post('/reset', [authMiddleware, adminMiddleware], resetVotes);

// @route   POST api/vote/declare-winner
// @desc    Declare election winner
// @access  Admin
router.post('/declare-winner', [authMiddleware, adminMiddleware], declareWinner);

// @route   POST api/vote/:candidateId - This must be the last POST route
// @desc    Cast a vote for a specific candidate
// @access  Private - for logged-in users
router.post('/:candidateId', authMiddleware, vote); 

module.exports = router;
