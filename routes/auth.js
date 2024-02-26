const express = require('express');
const passport = require('passport');
const router = express.Router();

// Initiates the Google OAuth authentication
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback route after Google has authenticated the user
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect to a different page
    res.redirect('/dashboard');
  }
);

module.exports = router;
