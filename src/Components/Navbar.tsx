"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, createContext, useContext, useEffect } from 'react';

// Create context for sidebar state
const SidebarContext = createContext({
  isSidebarVisible: true,
  toggleSidebar: () => {}
});

export const useSidebar = () => useContext(SidebarContext);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarVisible, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const { isSidebarVisible, toggleSidebar } = useSidebar();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/data-analysis', label: 'Attendance View' },
  ];

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  const handleToggleClick = () => {
    if (isDesktop) {
      toggleSidebar();
    } else {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
  };

  return (
    <>
      {/* Toggle button - fixed position */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={handleToggleClick}
          className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {(isMobileMenuOpen || (isDesktop && isSidebarVisible)) ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav className={`
        fixed top-0 left-0 h-full w-64 bg-blue-600 text-white transform transition-transform duration-300 ease-in-out z-40
        ${isDesktop 
          ? (isSidebarVisible ? 'translate-x-0' : '-translate-x-full')
          : (isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full')
        }
      `}>
        <div className="p-6 pt-16">
          <Link href="/" className="text-2xl font-bold mb-8 block">
            Beta Squad
          </Link>
          
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </nav>
    </>
  );
}
