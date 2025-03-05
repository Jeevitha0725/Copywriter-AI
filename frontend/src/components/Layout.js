import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const Sidebar = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/landing-page-ai", label: "Landing Page AI", icon: "🤖" },
    {
      label: "AIDA Formula",
      path: "/aida-formula",
      icon: "📝",
    },
    { label: "Pain Agitate Solution", path: "/pas-formula", icon: "📝" },
    { label: "Quest Formula", path: "/quest-formula", icon: "📝" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 rounded-xl bg-background/80 backdrop-blur-md shadow-custom text-foreground hover:scale-105 transition-all duration-300"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 transition-transform duration-300 
          w-64 bg-background/80 backdrop-blur-md h-screen fixed left-0 top-0 
          border-r border-foreground/10 z-40 glass-effect
        `}
      >
        <div className="p-6">
          <div className="text-2xl font-bold animate-fade-in">
            <Link
              href="/"
              className="gradient-text hover:opacity-80 transition-all duration-300"
            >
              Copywriter AI
            </Link>
          </div>
        </div>
        <nav className="mt-6 space-y-1">
          {links.map((link, index) => (
            <Link
              key={link.path}
              href={link.path}
              className={`
                flex items-center px-6 py-3 text-foreground-light
                hover:text-foreground hover:bg-foreground/5
                transition-all duration-300 hover:scale-[1.02] transform
                ${
                  router.pathname === link.path
                    ? "bg-primary/10 text-primary border-r-4 border-primary"
                    : ""
                }
              `}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="mr-3 text-xl">{link.icon}</span>
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/5 to-transparent" />
      </div>

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 lg:ml-64 relative">
        {/* Background decorative elements */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_var(--primary-light)_0%,_transparent_40%)] opacity-10" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--secondary-light)_0%,_transparent_40%)] opacity-10" />

        {/* Content */}
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
