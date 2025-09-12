const express = require('express');
const session = require('express-session');
const cors = require('cors');

// Import all routes
const loginRoute = require('./routes/login');
const logoutRoute = require('./routes/logout');
const getAllPostsRoute = require('./routes/get_all_posts');
const createPostRoute = require('./routes/create_post');
const likePostRoute = require('./routes/like_unlike_post');
const unlikePostRoute = require('./routes/like_unlike_post');
const sharePostRoute = require('./routes/share_post');
const unsharePostRoute = require('./routes/unshare_post');
const getSharedPostsRoute = require('./routes/get_shared_posts');
const getUserRoute = require('./routes/get_user');
const deleteUserRoute = require('./routes/delete_user');
const addUserRoute = require('./routes/add_user');
const updatePostRoute = require('./routes/update_post');
const userStatsRoute = require('./routes/user_stats');
const app = express();

// Middleware setup
app.use(cors({
    origin: 'http://localhost:3001',  // React app's URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
  }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Mount routes
app.use('/api/auth', loginRoute);      // POST /api/auth/login
app.use('/api/auth', logoutRoute);     // POST /api/auth/logout

app.use('/api/posts', getAllPostsRoute);    // GET /api/posts
app.use('/api/posts', createPostRoute);     // POST /api/posts
app.use('/api/posts', likePostRoute);       // POST /api/posts/:postId/like
app.use('/api/posts', unlikePostRoute);     // DELETE /api/posts/:postId/like
app.use('/api/posts', sharePostRoute);      // POST /api/posts/:postId/share
app.use('/api/posts', getSharedPostsRoute); // GET /api/posts/shared-with-me

app.use('/api/shares', unsharePostRoute);   // DELETE /api/shares/:shareId
app.use('/api/users', getUserRoute);         // GET /api/users/me
app.use('/api/users', deleteUserRoute);      // DELETE /api/users/:userId
app.use('/api/users', addUserRoute);         // POST /api/users/create
app.use('/api/posts', updatePostRoute);     // PUT /api/posts/:postId
app.use('/api/users', userStatsRoute);      // GET /api/users/stats

module.exports = app;