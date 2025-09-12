import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Feed from './pages/Feed';
import Register from './pages/Register';
import SharedPosts from './pages/SharedPosts';  // Add this import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shared-posts" element={<SharedPosts />} />  {/* */}
      </Routes>
    </Router>
  );
}

export default App;