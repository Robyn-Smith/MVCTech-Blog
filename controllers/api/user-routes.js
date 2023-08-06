const router = require('express').Router();
const { User } = require('../../models');

// CREATE new user - handling signup
router.post('/signup', async (req, res) => {
  try {

    await console.log(req.body);  
    const userInfoDB = await User.create({
      username: req.body.username,
      password: req.body.password,
    });
    console.log(userInfoDB)
    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.username = req.body.username;

      // redirect back to / after signup successfully
      res.redirect('/');        

    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Login path - for user login
router.post('/login', async (req, res) => {
  try {
    const userInfoDB = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!userInfoDB) {
      res
        .status(400)
        .json({ message: 'Unable to login' });
      return;
    }

    const validPassword = await userInfoDB.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Unable to login' });
      return;
    }

    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.username = req.body.username;

      // redirect to / on successful login
      res.redirect('/');        
      
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Logout 
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;