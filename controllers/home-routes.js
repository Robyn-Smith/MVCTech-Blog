const router = require('express').Router();
const { Blog, Comment, User } = require('../models');
const withAuth = require('../utils/auth');

// Home Page - Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogsDB = await Blog.findAll({
      include: [
        { model: Comment },
        { model: User }
      ],
      order: [['createdAt', 'DESC']]
    });

    const blogs = blogsDB.map(blog => blog.get({ plain: true }));
    res.render('homepage', { blogs, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// View Single Blog Post
router.get('/blog/:id', withAuth, async (req, res) => {
  try {
    const blogDB = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['username']
            }
          ]
        }
      ]
    });

    if (blogDB) {
      const blog = blogDB.get({ plain: true });
      res.render('blog', { blog, loggedIn: req.session.loggedIn });
    } else {
      res.status(404).json({ message: 'No Blog found with that id!' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Add Comment to Blog Post
router.post('/api/blog/:id', withAuth, async (req, res) => {
  try {
    const userInfoDB = await User.findOne({
      where: {
        username: req.session.username
      }
    });

    if (userInfoDB.id) {
      const commentDB = await Comment.create({
        blog_id: req.params.id,
        description: req.body.comment,
        user_id: userInfoDB.id
      });

      req.session.save(() => {
        req.session.loggedIn = true;
        req.session.username = req.session.username;
        res.status(200).json(commentDB);
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Dashboard
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const userInfoDB = await User.findOne({
      where: {
        username: req.session.username
      }
    });

    if (userInfoDB.id) {
      const blogDB = await Blog.findAll({
        where: {
          user_id: userInfoDB.id
        },
        order: [['createdAt', 'DESC']]
      });

      const blogs = blogDB.map(blog => blog.get({ plain: true }));
      res.render('dashboard', { blogs, loggedIn: req.session.loggedIn });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Create Blog Post
router.post('/dashboard', withAuth, async (req, res) => {
  try {
    const userInfoDB = await User.findOne({
      where: {
        username: req.session.username
      }
    });

    if (userInfoDB.id) {
      const blogDB = await Blog.create({
        title: req.body.title,
        description: req.body.description,
        user_id: userInfoDB.id
      });

      req.session.save(() => {
        req.session.loggedIn = true;
        req.session.username = req.session.username;
        res.status(200).json(blogDB);
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// View Own Blog Post
router.get('/myblog/:id', withAuth, async (req, res) => {
  try {
    const blogDB = await Blog.findByPk(req.params.id);

    if (blogDB) {
      const blog = blogDB.get({ plain: true });
      res.render('myblog', { blog, loggedIn: req.session.loggedIn });
    } else {
      res.status(404).json({ message: 'No Blog found with that id!' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Delete Own Blog Post
router.delete('/myblog/:id', withAuth, async (req, res) => {
  try {
    const blogDB = await Blog.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!blogDB) {
      res.status(404).json({ message: 'No Blog found with that id!' });
    } else {
      res.status(200).json(blogDB);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update Own Blog Post
router.put('/myblog/:id', withAuth, async (req, res) => {
  try {
    const blogDB = await Blog.update(req.body, {
      where: {
        id: req.params.id
      }
    });

    if (!blogDB[0]) {
      res.status(404).json({ message: 'No Blog with this id!' });
    } else {
      res.status(200).json(blogDB);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login Page
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
  } else {
    res.render('login');
  }
});

// Signup Page
router.get('/signup', (req, res) => {
  res.render('signup');
});

module.exports = router;