import React from 'react';
import GlowNavbar from './GlowNavbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <GlowNavbar />
      <main className="flex-1 pt-28 pb-16 px-4 w-full">
        {children}
      </main>
      <footer className="py-12 border-t border-[var(--border-color)] mt-auto">
        <div className="container mx-auto px-6 text-center text-[var(--muted)] text-sm font-medium">
          <p>© 2026 LittleLegends. Designed with minimalist aesthetics.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
