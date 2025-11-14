// components/Footer.jsx
import { Link } from 'react-router-dom';
import { useApp } from '../context/AuthContext';

const Footer = () => {
  const { user } = useApp();

  const currentYear = new Date().getFullYear();

  // Footer links data
  const footerLinks = {
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Careers', path: '/careers' },
      { name: 'Press', path: '/press' },
      { name: 'Blog', path: '/blog' },
      { name: 'Investor Relations', path: '/investors' }
    ],
    support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Trust & Safety', path: '/trust' }
    ],
    discover: [
      { name: 'Popular Cities', path: '/cities' },
      { name: 'Luxury Stays', path: '/luxury' },
      { name: 'Budget Hotels', path: '/budget' },
      { name: 'Beach Resorts', path: '/beach' },
      { name: 'Mountain Getaways', path: '/mountain' }
    ],
    partners: [
      { name: 'List Your Property', path: '/partner' },
      { name: 'Affiliate Program', path: '/affiliate' },
      { name: 'Travel Agents', path: '/agents' },
      { name: 'Corporate Travel', path: '/corporate' },
      { name: 'API Documentation', path: '/api' }
    ]
  };

  // Trust badges
  const trustBadges = [
    { name: 'SSL Secure', icon: '🔒' },
    { name: '24/7 Support', icon: '🎧' },
    { name: 'Best Price', icon: '💰' },
    { name: 'Free Cancellation', icon: '✅' }
  ];

  // Payment methods
  const paymentMethods = [
    'visa', 'razorpay', 'upi', 
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 13h1v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7h1c.6 0 1-.4 1-1s-.4-1-1-1h-1V4c0-1.1-.9-2-2-2H6C4.9 2 4 2.9 4 4v7H3c-.6 0-1 .4-1 1s.4 1 1 1zm4-9h10v7H7V4zm1 9h2v5H8v-5zm6 0h2v5h-2v-5z"/>
                </svg>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  StayEase
                </span>
                <p className="text-sm text-gray-400 -mt-1">Find Your Perfect Stay</p>
              </div>
            </Link>
            
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              Discover amazing hotels, luxury resorts, and unique stays at unbeatable prices. 
              Book with confidence and create unforgettable memories with StayEase.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { name: 'Facebook', icon: '📘', url: '#' },
                { name: 'Twitter', icon: '🐦', url: '#' },
                { name: 'Instagram', icon: '📷', url: '#' },
                { name: 'LinkedIn', icon: '💼', url: '#' }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-blue-600 transition duration-200 hover:scale-110 transform"
                  title={social.name}
                >
                  <span className="text-sm">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-white transition duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-white transition duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Discover Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Discover</h3>
            <ul className="space-y-3">
              {footerLinks.discover.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-white transition duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partners Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Partners</h3>
            <ul className="space-y-3">
              {footerLinks.partners.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-white transition duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge) => (
              <div key={badge.name} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-lg">{badge.icon}</span>
                </div>
                <div>
                  <p className="font-semibold text-white">{badge.name}</p>
                  <p className="text-sm text-gray-400">Guaranteed</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        {/* <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 mb-8 border border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
              <p className="text-gray-300">
                Get exclusive deals and travel tips delivered to your inbox
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 flex-1 min-w-0"
              />
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Subscribe
              </button>
            </div>
          </div>
        </div> */}

        {/* Payment Methods */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <h4 className="text-lg font-semibold mb-4 text-center text-gray-300">
            We Accept
          </h4>
          <div className="flex flex-wrap justify-center gap-4">
            {paymentMethods.map((method) => (
              <div 
                key={method}
                className="w-16 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition duration-200"
              >
                <span className="text-xs font-semibold text-gray-300 uppercase">
                  {method}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              <p>
                © {currentYear} StayEase. All rights reserved. | 
                Made with <span className="text-red-500">❤️</span> for travelers
              </p>
            </div>

            {/* Additional Links */}
            <div className="flex flex-wrap gap-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition duration-200">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white transition duration-200">
                Cookie Policy
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-white transition duration-200">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      {user && (
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <Link
            to="/my-bookings"
            className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </Link>
        </div>
      )}
    </footer>
  );
};

export default Footer;