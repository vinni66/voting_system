const express = require('express');
const router = express.Router();
const { getCandidates, addCandidate, updateCandidate, deleteCandidate } = require('../controllers/candidateController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// @route   GET api/candidates
// @desc    Get all candidates
// @access  Private (for logged-in users)
router.get('/', authMiddleware, getCandidates);

// @route   POST api/candidates
// @desc    Add a new candidate
// @access  Admin
router.post('/', [authMiddleware, adminMiddleware], addCandidate);

// @route   PUT api/candidates/:id
// @desc    Update a candidate
// @access  Admin
router.put('/:id', [authMiddleware, adminMiddleware], updateCandidate);

// @route   DELETE api/candidates/:id
// @desc    Delete a candidate
// @access  Admin
router.delete('/:id', [authMiddleware, adminMiddleware], deleteCandidate);

module.exports = router;
