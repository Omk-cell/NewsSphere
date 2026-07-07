import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-3">NewsSphere</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Stay informed. Anytime. Anywhere. Your trusted source for global news.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/categories" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Categories</Link></li>
              <li><Link to="/bookmarks" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Bookmarks</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/?category=technology" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Technology</Link></li>
              <li><Link to="/?category=business" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Business</Link></li>
              <li><Link to="/?category=sports" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Sports</Link></li>
              <li><Link to="/?category=health" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Health</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                <FaGithub size={20} />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} NewsSphere. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;