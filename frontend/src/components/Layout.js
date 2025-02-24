import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Sidebar = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const links = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/design", label: "Designs", icon: "🎨" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-white shadow-lg text-gray-900"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200 z-40`}>
        <div className="p-6">
          <div className="text-2xl font-bold text-gray-900">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Syncner
            </Link>
          </div>
        </div>
        <nav className="mt-6">
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 ${
                router.pathname === link.path
                  ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                  : ""
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="mr-3">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        {children}
      </div>
    </div>
  );
};

export default Layout; 