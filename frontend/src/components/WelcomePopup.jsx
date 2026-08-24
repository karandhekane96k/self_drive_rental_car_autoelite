import { useState, useContext } from 'react';
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

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const toastId = toast.loading(isLogin ? 'Authenticating...' : 'Creating your account...');

    const url = isLogin 
      ? 'http://localhost:5000/api/users/login' 
      : 'http://localhost:5000/api/users';

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
        toast.success(isLogin ? 'Successfully Logged In!' : 'Account Created Successfully!', { id: toastId });
        
        setUser(data); 
        onClose(); 
      }
    } catch (error) {
      toast.error('Could not connect to the server.', { id: toastId });
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity">
      <div className="relative flex w-full max-w-4xl bg-white shadow-2xl rounded-lg overflow-hidden min-h-[550px]">
        
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-red-600 transition-colors z-10 bg-gray-100 hover:bg-red-50 p-2 rounded-full"
        >
          <FaTimes size={20} />
        </button>

        {/* Left Side - Common Premium Branding */}
        <div className="hidden md:flex flex-col justify-between w-2/5 bg-gray-900 p-12 text-white relative overflow-hidden">
          <div className="relative z-10">
            {/* UPDATED: Universal Welcome Message */}
            <h2 className="text-4xl font-bold mb-6">Welcome to AutoElite</h2>
            <p className="text-gray-400 text-base leading-relaxed">
              Experience the pinnacle of automotive excellence. Sign in or create an account to access our exclusive fleet, manage your bookings, and elevate your journey.
            </p>
          </div>
          <div className="relative z-10 mt-auto">
            <h2 className="text-3xl font-bold uppercase tracking-widest">
              <span className="text-red-600">Auto</span>Elite
            </h2>
          </div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-3/5 p-10 md:p-14 flex flex-col justify-center bg-white">
          
          <form className="flex flex-col space-y-6" onSubmit={submitHandler}>
            
            {!isLogin && (
              <div className="flex gap-4">
                <div className="relative w-1/2">
                  <input type="text" id="name" required value={name} onChange={(e) => setName(e.target.value)}
                    className="block w-full px-0 py-3 text-gray-900 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-red-600 peer transition-colors" placeholder=" " />
                  <label htmlFor="name" className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:left-0 peer-focus:text-red-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 pointer-events-none">Full Name</label>
                </div>
                <div className="relative w-1/2">
                  <input type="text" id="mobile" required value={mobile} onChange={(e) => setMobile(e.target.value)}
                    className="block w-full px-0 py-3 text-gray-900 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-red-600 peer transition-colors" placeholder=" " />
                  <label htmlFor="mobile" className="absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:left-0 peer-focus:text-red-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 pointer-events-none">Mobile No.</label>
                </div>
              </div>
            )}

            <div className="relative">
              <input type="text" id="email" required value={email} onChange={(e) => setEmail(e.target.value)}
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
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-4 rounded-sm transition-colors mt-8 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
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
              className="text-base font-bold text-red-600 hover:text-red-700 transition-colors"
            >
              {isLogin ? 'Create an AutoElite Account' : 'Sign in to your account'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}