// routes/index.js

const express = require('express');
const router = express.Router();

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = function (passport) {
  // Root route - Render index.ejs
  router.get('/', (req, res) => {
    res.render('index', { message: req.flash('error') });
  });

  // Login route
  router.post('/', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err); }
      if (!user) {
        // Log the error message
        console.log(info.message);
        req.flash('error', info.message);  // Use req.flash to set the flash message
        return res.redirect('/');
      }
      // Login successful, redirect to dashboard
      req.logIn(user, (loginErr) => {
        if (loginErr) { return next(loginErr); }
        return res.redirect('/dashboard');
      });
    })(req, res, next);
  });

  router.get('/register', (req, res) => {
    res.render('register', { message: req.flash('error') });
  });

  // Registration route
  router.post('/register', (req, res, next) => {
    passport.authenticate('local-signup', (err, user, info) => {
      if (err) { return next(err); }
      if (!user) {
        // Log the error message
        console.log(info.message);
        req.flash('error', info.message);  // Use req.flash to set the flash message
        return res.redirect('/register');
      }
      // Registration successful, redirect to dashboard
      req.logIn(user, (loginErr) => {
        if (loginErr) { return next(loginErr); }
        return res.redirect('/dashboard');
      });
    })(req, res, next);
  });

  // Logout route
  router.get('/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  });
  router.get('/views/money_donations.ejs', (req, res) => {
    res.render('money_donations'); // Assuming "money_donations" is your EJS file name
  });
  router.get('/views/clothes-donation.ejs', (req, res) => {
    res.render('clothes-donation'); // Assuming "clothes-donation" is your EJS file name
  });
  router.get('/views/books.ejs', (req, res) => {
    res.render('books'); // Assuming "clothes-donation" is your EJS file name
  });
  router.get('/views/food.ejs', (req, res) => {
    res.render('food'); // Assuming "clothes-donation" is your EJS file name
  });
  router.get('/views/blood.ejs', (req, res) => {
    res.render('blood'); // Assuming "clothes-donation" is your EJS file name
  });
  router.get('/views/miscellaneous.ejs', (req, res) => {
    res.render('miscellaneous'); // Assuming "clothes-donation" is your EJS file name
  });
  // Dashboard route (protected)
  router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', { user: req.user });
  });

  return router;
};
