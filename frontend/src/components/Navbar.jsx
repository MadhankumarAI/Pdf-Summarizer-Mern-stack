import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 pointer-events-none">
      <div className="glass-panel rounded-full px-6 py-3 flex items-center space-x-8 pointer-events-auto shadow-2xl">
        <Link to="/" className="text-xl font-bold tracking-tighter hover:text-[#ccff00] transition-colors font-syne">
          SCRIBE<span className="text-[#ccff00]">.AI</span>
        </Link>
        
        <div className="h-4 w-px bg-gray-700"></div>

        <div className="flex space-x-6 text-sm">
          <Link 
            to="/" 
            className={`${isActive('/') ? 'text-[#ccff00]' : 'text-gray-400'} hover:text-white transition-colors uppercase tracking-widest text-xs font-medium`}
          >
            Terminal
          </Link>
          <Link 
            to="/history" 
            className={`${isActive('/history') ? 'text-[#ccff00]' : 'text-gray-400'} hover:text-white transition-colors uppercase tracking-widest text-xs font-medium`}
          >
            Archives
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;