import { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { 
  FaTimes, FaCalendarAlt, FaUser, FaPhone, FaCreditCard, 
  FaShieldAlt, FaFileAlt, FaQrcode, FaArrowLeft, FaCheckCircle 
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

export default function BookingModal({ car, isOpen, onClose }) {
  if (!isOpen) return null;

  const { user } = useContext(AuthContext);

  // Load Draft Data
  const savedData = JSON.parse(localStorage.getItem(`booking_draft_${car._id}`)) || {
    customerName: '',
    customerPhone: '',
    startDate: '',
    endDate: '',
    depositType: 'bike'
  };

  const [customerName, setCustomerName] = useState(savedData.customerName);
  const [customerPhone, setCustomerPhone] = useState(savedData.customerPhone);
  const [startDate, setStartDate] = useState(savedData.startDate);
  const [endDate, setEndDate] = useState(savedData.endDate);
  const [depositType, setDepositType] = useState(savedData.depositType);
  
  // Security, Terms, and Flow States
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0 });
  const [captchaInput, setCaptchaInput] = useState('');
  
  // 2-Step Flow States
  const [step, setStep] = useState(1);
  const [utrNumber, setUtrNumber] = useState('');
  
  // NEW: Global QR Code State
  const [globalQrCode, setGlobalQrCode] = useState('');

  const generateCaptcha = () => {
    setCaptcha({
      num1: Math.floor(Math.random() * 10) + 1,
      num2: Math.floor(Math.random() * 10) + 1,
    });
    setCaptchaInput('');
  };

  // Reset modal when opened
  useEffect(() => {
    if (isOpen) {
      generateCaptcha();
      setTermsAccepted(false);
      setStep(1);
      setUtrNumber('');
    }
  }, [isOpen]);

  // Save Drafts
  useEffect(() => {
    const draft = { customerName, customerPhone, startDate, endDate, depositType };
    localStorage.setItem(`booking_draft_${car._id}`, JSON.stringify(draft));
  }, [customerName, customerPhone, startDate, endDate, depositType, car._id]);

  // NEW: Fetch dynamic QR code when step 2 loads
  useEffect(() => {
    if (step === 2) {
      fetch('https://self-drive-rental-car-autoelite.onrender.com/api/settings')
        .then(res => res.json())
        .then(data => setGlobalQrCode(data.qrCodeUrl))
        .catch(err => console.error('Failed to fetch QR'));
    }
  }, [step]);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const rentalDays = calculateDays();
  const totalPrice = rentalDays * car.dailyRate;

  // STEP 1: Validate Form and Move to Payment Screen
  const handleProceedToPayment = (e) => {
    e.preventDefault();

    if (!user || (!user._id && !user.id)) {
      toast.error('Authentication session expired. Please log in again.');
      return;
    }
    if (rentalDays <= 0) {
      toast.error('End date must be after start date.');
      return;
    }
    const nameRegex = /^[A-Za-z\s]{3,50}$/;
    if (!nameRegex.test(customerName.trim())) {
      toast.error('Please enter a valid full name (letters only, min 3 characters).');
      return;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(customerPhone.trim())) {
      toast.error('Please enter a valid 10-digit phone number.');
      return;
    }
    if (parseInt(captchaInput) !== captcha.num1 + captcha.num2) {
      toast.error('Incorrect CAPTCHA answer. Please try again.');
      generateCaptcha();
      return;
    }
    if (!termsAccepted) {
      toast.error('You must accept the Terms & Conditions to proceed.');
      return;
    }

    // If everything is valid, move to Step 2
    setStep(2);
  };

  // STEP 2: Submit Booking with UTR to Backend
  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    if (utrNumber.trim().length < 12) {
      toast.error('Please enter a valid 12-digit UTR/Transaction ID.');
      return;
    }

    const bookingData = {
      carId: car._id,
      userId: user._id || user.id,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      startDate,
      endDate,
      totalPrice,
      depositType,
      utrNumber: utrNumber.trim(), // Sent to backend for admin verification
      paymentStatus: 'Pending Verification' 
    };

    try {
      const response = await fetch('https://self-drive-rental-car-autoelite.onrender.com/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('🎉 Booking request sent! We will verify your ₹500 token shortly.');
        localStorage.removeItem(`booking_draft_${car._id}`);
        onClose();
      } else {
        toast.error(data.message || 'Failed to process booking.');
      }
    } catch (error) {
      toast.error('Server error during booking.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl relative overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="bg-gray-900 p-6 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-white mb-1 flex items-center">
              {step === 2 && (
                <button onClick={() => setStep(1)} className="mr-3 text-gray-400 hover:text-white transition-colors">
                  <FaArrowLeft size={18} />
                </button>
              )}
              Reserve <span className="text-red-500 ml-2">{car.brand} {car.name}</span>
            </h2>
            <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">
              {step === 1 ? 'Step 1: Details & Agreement' : 'Step 2: Token Verification'}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white bg-gray-800 p-2 rounded-full cursor-pointer transition-colors">
            <FaTimes />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-6 overflow-y-auto flex-grow">
          
          {/* ================= STEP 1: BOOKING FORM ================= */}
          {step === 1 && (
            <form onSubmit={handleProceedToPayment} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1"><FaUser className="inline mr-1"/> Full Name</label>
                  <input 
                    type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} 
                    placeholder="e.g. Rahul Sharma" 
                    className="w-full border border-gray-300 p-2.5 rounded-sm focus:ring-red-500 focus:border-red-500 text-sm"
                  />
                  {/* Strict Identity Warning */}
                  <p className="text-[10px] font-bold text-red-600 mt-1.5 leading-tight">
                    * Must exactly match Aadhar/DL. Only this person can take delivery.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1"><FaPhone className="inline mr-1"/> 10-Digit Phone</label>
                  <input 
                    type="tel" maxLength="10" required value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 9876543210" 
                    className="w-full border border-gray-300 p-2.5 rounded-sm focus:ring-red-500 focus:border-red-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1"><FaCalendarAlt className="inline mr-1"/> Start Date</label>
                  <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border border-gray-300 p-2 rounded-sm text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1"><FaCalendarAlt className="inline mr-1"/> End Date</label>
                  <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border border-gray-300 p-2 rounded-sm text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  <FaFileAlt className="inline mr-1 text-red-600"/> Security Deposit Method (Required at Pickup)
                </label>
                <select value={depositType} onChange={(e) => setDepositType(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-sm text-sm font-semibold bg-white cursor-pointer">
                  <option value="bike">Customer 2-Wheeler (Original RC Required)</option>
                  <option value="cash">₹5,000 Cash + Local Address Proof (Light Bill & Rent Agreement)</option>
                </select>
              </div>

              {/* Terms & Conditions Box */}
              <div className="border border-gray-200 bg-gray-50 p-3 rounded-sm">
                <p className="text-xs font-bold uppercase text-gray-800 mb-2">Rental Terms Summary (Required)</p>
                <div className="h-28 overflow-y-auto text-[11px] text-gray-600 space-y-1.5 pr-2 bg-white p-2 border border-gray-200 rounded-sm">
                  <p className="text-red-700 font-bold">• IDENTITY POLICY: Booking name MUST match original Aadhar & DL. Delivery strictly given ONLY to the named person.</p>
                  <p>• <strong>Limit:</strong> 350 km per 24 hrs. Extra: ₹5/km (5-seater), ₹7/km (7-seater).</p>
                  <p>• <strong>Late Charges:</strong> ₹200/hr. Sat/Sun/Holidays calculated from 8 AM to 8 AM (1 day).</p>
                  <p>• <strong>Documents:</strong> Original Aadhar, PAN, and Driving License mandatory at pickup.</p>
                  <p>• <strong>Damages:</strong> Dents, scratches, punctures, clutch/gearbox, and towing costs are customer responsibility.</p>
                  <p>• <strong>Safety:</strong> No drinking and driving. Advance token of ₹500 is non-refundable; cancellations not allowed.</p>
                </div>
              </div>

              {/* Security & Checkbox */}
              <div className="bg-white border border-gray-200 p-3 rounded-sm space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-gray-700"><FaShieldAlt className="inline mr-1 text-green-600"/> Security:</label>
                  <div className="flex items-center space-x-2">
                    <span className="bg-gray-100 text-gray-900 font-bold px-3 py-1 border border-gray-300 rounded-sm text-xs tracking-wider">{captcha.num1} + {captcha.num2} = ?</span>
                    <input type="text" maxLength="2" required value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value.replace(/\D/g, ''))} placeholder="Ans" className="w-16 border border-gray-300 p-1.5 rounded-sm text-xs text-center font-bold" />
                  </div>
                </div>
                <div className="flex items-start pt-2 border-t border-gray-100">
                  <input id="terms" type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded cursor-pointer mt-0.5" required />
                  <label htmlFor="terms" className="ml-2 text-[11px] font-medium text-gray-600 cursor-pointer leading-tight">
                    I agree to the Terms & Conditions, confirm my name matches my official documents, and understand the ₹500 token is non-refundable.
                  </label>
                </div>
              </div>

              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-sm uppercase tracking-widest transition-colors shadow-lg cursor-pointer flex justify-center items-center">
                Proceed to Payment <FaArrowLeft className="ml-2 rotate-180" />
              </button>
            </form>
          )}

          {/* ================= STEP 2: PAYMENT & UTR SUBMISSION ================= */}
          {step === 2 && (
            <form onSubmit={handleFinalSubmit} className="space-y-6">
              
              <div className="text-center">
                <h3 className="text-xl font-extrabold text-gray-900 uppercase">Secure Your Booking</h3>
                <p className="text-gray-500 text-sm mt-1">Pay the token amount to lock in your reservation.</p>
              </div>

              <div className="bg-red-50 border border-red-200 p-4 rounded-sm flex justify-between items-center">
                <div>
                  <p className="text-xs text-red-600 font-bold uppercase">Token Amount</p>
                  <p className="text-sm font-semibold text-gray-900">Non-Refundable</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-extrabold text-red-600">₹500</p>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center bg-gray-50 border border-gray-200 p-6 rounded-sm">
                
                {/* NEW: Displays dynamic image from the Admin upload, or falls back to an icon */}
                {globalQrCode ? (
                  <img src={globalQrCode} alt="UPI QR Code" className="w-40 h-40 object-contain mb-4 border-2 border-gray-200 shadow-sm rounded-sm bg-white p-2" />
                ) : (
                  <FaQrcode className="text-gray-300 mb-4" size={100} />
                )}

                <p className="text-sm font-bold text-gray-800 uppercase tracking-widest">Scan to Pay</p>
                <p className="text-xs text-gray-500 mt-1">Accepts PhonePe, GPay, Paytm, and all UPI apps.</p>
              </div>

              {/* UTR Input */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  <FaCheckCircle className="inline mr-1 text-green-600"/> Enter 12-Digit UTR / Ref Number
                </label>
                <input 
                  type="text" 
                  maxLength="12"
                  required 
                  value={utrNumber} 
                  onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 312345678901" 
                  className="w-full border-2 border-gray-300 p-3.5 rounded-sm focus:ring-green-500 focus:border-green-500 text-center font-bold tracking-widest text-lg"
                />
                <p className="text-[10px] text-gray-500 mt-1 text-center">Found in your UPI app payment history details.</p>
              </div>

              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-sm uppercase tracking-widest transition-colors shadow-lg cursor-pointer">
                Verify Payment & Book Car
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}