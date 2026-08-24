import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center bg-gray-50">
      <FaExclamationTriangle className="text-red-600 text-7xl mb-6 drop-shadow-md" />
      <h1 className="text-7xl md:text-9xl font-extrabold text-gray-900 tracking-tight mb-2">
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-bold uppercase text-gray-800 tracking-wide mb-4">
        Off the Map
      </h2>
      <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
        Looks like you've driven off the designated route. The page you are looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/" 
        className="bg-gray-900 hover:bg-black text-white font-bold py-3.5 px-8 rounded-sm uppercase tracking-widest transition-colors shadow-lg"
      >
        Return to Homepage
      </Link>
    </div>
  );
}