import { useState, useEffect, useContext } from 'react';
import { FaTimes } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

export default function WelcomePopup({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const { setUser } = useContext(AuthContext); 

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // NEW: State to control the smooth open/close animation
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger the "open" animation as soon as the component mounts
  useEffect(() => {
    // A tiny timeout ensures the browser renders the starting state before animating
    const timer = setTimeout(() => setIsAnimating(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // NEW: Custom close function that plays the exit animation BEFORE unmounting
  const handleClose = () => {
    setIsAnimating(false); // Trigger the shrink/fade-out CSS
    setTimeout(() => {
      onClose(); // Actually remove the component after 300ms
    }, 300);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const toastId = toast.loading(
      isLogin ? '🔄 Authenticating credentials...' : '⏳ Creating your Nandi Cars account...'
    );

    const url = isLogin 
      ? 'https://self-drive-rental-car-autoelite.onrender.com/api/users/login' 
      : 'https://self-drive-rental-car-autoelite.onrender.com/api/users';

    const bodyData = isLogin 
      ? { email, password } 
      : { name, email, mobile, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Authentication failed', { id: toastId });
        setLoading(false);
      } else {
        if (isLogin) {
          toast.success('🎉 Welcome back! Successfully logged in.', { id: toastId });
          setUser(data); 
          handleClose(); // Use the animated close here!
        } else {
          toast.success('✨ Account created successfully! Please sign in.', { id: toastId });
          setIsLogin(true);
          setPassword('');
          setLoading(false);
        }
      }
    } catch (error) {
      toast.error('⚠️ Could not connect to the server. Please try again.', { id: toastId });
      setLoading(false);
    }
  };

  return (
    <div 
      // Background overlay with opacity transition
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 p-4 md:p-0 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose} 
    >
      <div 
        // Modal box with scale, transform, and opacity transitions
        className={`relative flex w-full max-w-4xl bg-white shadow-2xl rounded-lg overflow-hidden min-h-[550px] transform transition-all duration-300 ${isAnimating ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'}`}
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* Left Side - Desktop Branding */}
        <div className="hidden md:flex flex-col justify-between w-2/5 bg-gray-900 p-12 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">Welcome to Nandi Cars</h2>
            <p className="text-gray-400 text-base leading-relaxed">
              Experience the pinnacle of automotive excellence. Sign in or create an account to access our exclusive fleet, manage your bookings, and elevate your journey.
            </p>
          </div>
          <div className="relative z-10 mt-auto">
            <h2 className="text-3xl font-bold uppercase tracking-widest">
              <span className="text-red-600">Nandi</span> Cars
            </h2>
          </div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

        {/* Right Side - Form Container */}
        <div className="w-full md:w-3/5 p-8 md:p-14 flex flex-col justify-center bg-white relative">
          
          {/* Close Button - Uses handleClose for the animation */}
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 md:top-5 md:right-5 text-gray-500 hover:text-red-600 transition-colors z-[100] bg-gray-100 hover:bg-red-50 p-2 rounded-full cursor-pointer shadow-md border border-gray-200"
          >
            <FaTimes size={18} />
          </button>

          {/* THE GRID BACKGROUND */}
          <div 
            className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-50" 
            style={{ 
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px)', 
              backgroundSize: '40px 40px' 
            }}
          ></div>

          {/* Form Content Wrapper */}
          <div className="relative z-10 w-full">
            
            {/* Mobile Branding */}
            <div className="md:hidden text-center mb-8 pr-6">
              <h2 className="text-2xl font-extrabold uppercase tracking-widest text-gray-900">
                <span className="text-red-600">Nandi</span> Cars
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {isLogin ? 'Sign in to your account' : 'Create a new account'}
              </p>
            </div>

            <form className="flex flex-col space-y-6" onSubmit={submitHandler}>
              
              {!isLogin && (
                <div className="flex flex-col md:flex-row gap-6 md:gap-4">
                  <div className="relative w-full md:w-1/2">
                    <input type="text" id="name" required value={name} onChange={(e) => setName(e.target.value)}
                      className="block w-full px-0 py-3 text-gray-900 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-red-600 peer transition-colors" placeholder=" " />
                    <label htmlFor="name" className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:left-0 peer-focus:text-red-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 pointer-events-none">Full Name</label>
                  </div>
                  <div className="relative w-full md:w-1/2">
                    <input type="text" id="mobile" required value={mobile} onChange={(e) => setMobile(e.target.value)}
                      className="block w-full px-0 py-3 text-gray-900 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-red-600 peer transition-colors" placeholder=" " />
                    <label htmlFor="mobile" className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:left-0 peer-focus:text-red-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 pointer-events-none">Mobile No.</label>
                  </div>
                </div>
              )}

              <div className="relative">
                <input type="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-0 py-3 text-gray-900 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-red-600 peer transition-colors" placeholder=" " />
                <label htmlFor="email" className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:left-0 peer-focus:text-red-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 pointer-events-none">
                  Email Address
                </label>
              </div>

              <div className="relative">
                <input type="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-0 py-3 text-gray-900 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-red-600 peer transition-colors" placeholder=" " />
                <label htmlFor="password" className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:left-0 peer-focus:text-red-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 pointer-events-none">Password</label>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-4 rounded-sm transition-colors mt-8 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex justify-center items-center"
              >
                {loading ? (
                  <span>⏳ Processing...</span>
                ) : (
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-100 text-center">
              <p className="text-gray-500 text-sm mb-2">
                {isLogin ? "Don't have an account?" : "Already a member?"}
              </p>
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setName(''); setMobile(''); setEmail(''); setPassword('');
                }} 
                className="text-base font-bold text-red-600 hover:text-red-700 transition-colors cursor-pointer"
              >
                {isLogin ? 'Create a Nandi Cars Account' : 'Sign in to your account'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}