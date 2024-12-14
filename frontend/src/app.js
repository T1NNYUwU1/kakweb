import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProjectPage } from './pages/ProjectPage';

const Navbar = () => (
  <nav className="bg-white shadow-sm">
    <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
      <div className="text-orange-500 font-bold text-2xl">OrangeGive</div>
      <div className="flex gap-4">
        <button className="px-4 py-2 rounded hover:bg-gray-100">Home</button>
        <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
          Projects
        </button>
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="bg-gray-50 mt-12">
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold mb-4">About Us</h3>
          <ul className="space-y-2">
            <li>Our Mission</li>
            <li>How It Works</li>
            <li>Team</li>
            <li>Careers</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Support</h3>
          <ul className="space-y-2">
            <li>Help Center</li>
            <li>Contact Us</li>
            <li>FAQs</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Legal</h3>
          <ul className="space-y-2">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Cookie Policy</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Connect</h3>
          <ul className="space-y-2">
            <li>Facebook</li>
            <li>Twitter</li>
            <li>Instagram</li>
            <li>LinkedIn</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t text-center text-gray-600">
        © 2024 OrangeGive. All rights reserved.
      </div>
    </div>
  </footer>
);

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/project/:id" element={<ProjectPage />} />
            {/* Add more routes as needed */}
            <Route path="/" element={<ProjectPage />} /> {/* Temporary default route */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;