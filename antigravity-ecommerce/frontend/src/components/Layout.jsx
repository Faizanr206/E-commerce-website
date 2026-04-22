import React from 'react';
import GlowNavbar from './GlowNavbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg text-text">
      <GlowNavbar />
      <main className="pt-20 pb-10 px-4 container mx-auto">
        {children}
      </main>
      <footer className="py-10 border-t border-glass-border">
        <div className="container mx-auto px-4 text-center text-muted text-sm">
          <p>© 2026 ANTIGRAVITY E-Commerce. Defying the status quo.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
