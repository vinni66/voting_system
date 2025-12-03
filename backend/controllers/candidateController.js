const Candidate = require('../models/Candidate');

// @desc    Get all candidates
// @access  Public
exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ name: 1 });
    res.json(candidates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Add a new candidate
// @access  Admin
exports.addCandidate = async (req, res) => {
  const { name, party, photo, description } = req.body;

  if (!name) {
    return res.status(400).json({ msg: 'Please provide a name' });
  }

  try {
    let candidate = await Candidate.findOne({ name });
    if (candidate) {
      return res.status(400).json({ msg: 'Candidate already exists' });
    }
    
    const newCandidate = new Candidate({
      name,
      party,
      photo,
      description
    });

    candidate = await newCandidate.save();
    res.status(201).json(candidate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a candidate
// @access  Admin
exports.updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }
    
    res.json(candidate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a candidate
// @access  Admin
exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);

    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }

    res.json({ msg: 'Candidate removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};