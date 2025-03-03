import React from 'react';

const Footer = ({ companyName, links }) => {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <h3 className="text-white text-lg font-semibold">{companyName}</h3>
            <p className="mt-2 text-gray-400 text-sm">
              Empowering businesses with innovative solutions
            </p>
          </div>

          {/* Navigation Links */}
          {links.map((link, index) => (
            <div key={index} className="col-span-1">
              <h3 className="text-white text-lg font-semibold">{link.label}</h3>
              {link.dropdown ? (
                <ul className="mt-4 space-y-2">
                  {link.dropdown.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white text-sm"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <a
                  href="#"
                  className="mt-4 text-gray-400 hover:text-white text-sm block"
                >
                  {link.label}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 