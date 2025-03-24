const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'passwors$password';
const fetchuser = require('../middleware/fetchuser');

// ROUTE 1: Create a user
router.post('/createuser', [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('fullname').isLength({ min: 3 }).withMessage('Full name must be at least 3 characters'),
  body('password')
    .isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
    .matches(/\d/).withMessage('Password must contain a number')
    .notEmpty().withMessage("Password cannot be blank")
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Sorry, user with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    user = await User.create({
      fullname: req.body.fullname,
      password: secPass,
      email: req.body.email,
    });

    const data = {
      user: {
        id: user.id,
      }
    };
    const authToken = jwt.sign(data, JWT_SECRET);
    res.json({ authToken });

  } catch (error) {
    console.log(error.message);
    res.status(500).send("Some error occurred");
  }
});

// ROUTE 2: Login
router.post('/login', [
  body('email').isEmail().withMessage('Enter a valid email'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Please try to login with correct credentials" });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(404).json({ error: "Please try to login with correct credentials" });
    }
    const data = {
      user: {
        id: user.id,
      }
    };
    const authToken = jwt.sign(data, JWT_SECRET);
    res.json({ authToken });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 3: Get Logged-in User Details
router.post('/getuser', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 4: Get All Users
router.get('/getalluser', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Cannot get all users");
  }
});

// ROUTE 5: Update Password
router.post('/updatepassword', fetchuser, [
  body('oldPassword', 'Old password cannot be blank').notEmpty(),
  body('newPassword', 'New password must be at least 5 characters long').isLength({ min: 5 })
], async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const passwordCompare = await bcrypt.compare(oldPassword, user.password);
    if (!passwordCompare) {
      return res.status(401).json({ error: "Incorrect old password" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 6: Update User Details
router.put('/updateuser', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const fields = [
      'fullname', 'email', 'alternateemail', 'phoneno', 'role_id',
      'date_of_joining', 'profileImage', 'devRole', 'reportingperson',
      'panNumber', 'alternatephone', 'isAdmin', 'parent', 'children'
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    });

    user = await user.save();
    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
