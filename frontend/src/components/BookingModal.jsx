import { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { 
  FaTimes, FaCalendarAlt, FaUser, FaPhone, FaCreditCard, 
  FaShieldAlt, FaFileAlt, FaQrcode, FaArrowLeft, FaCheckCircle, FaExternalLinkAlt 
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
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0 });
  const [captchaInput, setCaptchaInput] = useState('');
  
  // 2-Step Flow States
  const [step, setStep] = useState(1);
  const [utrNumber, setUtrNumber] = useState('');
  
  // QR Code & Loading States
  const [globalQrCode, setGlobalQrCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      setShowTermsModal(false);
      setStep(1);
      setUtrNumber('');
      setSubmitting(false);
    }
  }, [isOpen]);

  // Save Drafts
  useEffect(() => {
    const draft = { customerName, customerPhone, startDate, endDate, depositType };
    localStorage.setItem(`booking_draft_${car._id}`, JSON.stringify(draft));
  }, [customerName, customerPhone, startDate, endDate, depositType, car._id]);

  // Fetch dynamic QR code when step 2 loads
  useEffect(() => {
    if (step === 2) {
      fetch('https://self-drive-rental-car-Nandi Cars.onrender.com/api/settings')
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

    setStep(2);
  };

  // STEP 2: Submit Booking with UTR to Backend + Redirect to WhatsApp
  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    if (utrNumber.trim().length < 12) {
      toast.error('Please enter a valid 12-digit UTR/Transaction ID.');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading('🚗 Processing your reservation & verifying payment...');

    const bookingData = {
      carId: car._id,
      userId: user._id || user.id,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      startDate,
      endDate,
      totalPrice,
      depositType,
      utrNumber: utrNumber.trim(),
      paymentStatus: 'Pending Verification' 
    };

    try {
      const response = await fetch('https://self-drive-rental-car-Nandi Cars.onrender.com/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('🎉 Token received! Verification takes 10-15 mins. Redirecting to WhatsApp...', { 
          id: toastId,
          duration: 4000 
        });
        
        localStorage.removeItem(`booking_draft_${car._id}`);

        // --- FREE WHATSAPP CLICK-TO-CHAT INTEGRATION ---
        const adminWhatsAppNumber = "918625881282";

        const messageText = 
          `🚗 *NEW BOOKING REQUEST - NANDI CARS*\n\n` +
          `👤 *Customer Name:* ${customerName.trim()}\n` +
          `📞 *Phone:* ${customerPhone.trim()}\n` +
          `🚘 *Vehicle:* ${car.brand} ${car.name}\n` +
          `📅 *Dates:* ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}\n` +
          `💰 *Total Amount:* ₹${totalPrice}\n` +
          `💳 *Token Paid:* ₹500\n` +
          `🔢 *UTR / Ref No:* ${utrNumber.trim()}\n\n` +
          `Hello Nandi Cars, I have completed the ₹500 token payment. Please verify and confirm my reservation!`;

        const encodedMessage = encodeURIComponent(messageText);
        const whatsappUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodedMessage}`;

        // THE FIX: Use window.location.href to safely redirect without popup blockers!
        setTimeout(() => {
          window.location.href = whatsappUrl;
        }, 1500);
        // ----------------------------------------------

        // Close the modal while the redirect happens
        onClose();
      } else {
        toast.error(data.message || 'Failed to process booking.', { id: toastId });
        setSubmitting(false);
      }
    } catch (error) {
      toast.error('⚠️ Server error during booking.', { id: toastId });
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl relative overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="bg-gray-900 p-6 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-white mb-1 flex items-center">
              {step === 2 && (
                <button onClick={() => setStep(1)} className="mr-3 text-gray-400 hover:text-white transition-colors cursor-pointer">
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
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <FaUser size={14} />
                    </span>
                    <input 
                      type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} 
                      placeholder="Full Name (As per Aadhar/DL)" 
                      className="w-full border border-gray-300 pl-10 pr-3 py-3 rounded-sm focus:ring-red-500 focus:border-red-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <FaPhone size={14} />
                    </span>
                    <input 
                      type="tel" maxLength="10" required value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-Digit Mobile Number" 
                      className="w-full border border-gray-300 pl-10 pr-3 py-3 rounded-sm focus:ring-red-500 focus:border-red-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Start & End Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1"><FaCalendarAlt className="inline mr-1"/> Start Date</label>
                  <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-sm text-sm" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1"><FaCalendarAlt className="inline mr-1"/> End Date</label>
                  <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-sm text-sm" />
                </div>
              </div>

              {/* Security Deposit Method */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                  <FaFileAlt className="inline mr-1 text-red-600"/> Security Deposit Method (Required at Pickup)
                </label>
                <select value={depositType} onChange={(e) => setDepositType(e.target.value)} className="w-full border border-gray-300 p-3 rounded-sm text-sm font-semibold bg-white cursor-pointer">
                  <option value="bike">Customer 2-Wheeler (Original RC Required)</option>
                  <option value="cash">₹5,000 Cash + Local Address Proof (Light Bill & Rent Agreement)</option>
                </select>
              </div>

              {/* Security & Checkbox with Terms Popup Link */}
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-sm space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-gray-700"><FaShieldAlt className="inline mr-1 text-green-600"/> Security Verification:</label>
                  <div className="flex items-center space-x-2">
                    <span className="bg-white text-gray-900 font-bold px-3 py-1.5 border border-gray-300 rounded-sm text-xs tracking-wider shadow-sm">{captcha.num1} + {captcha.num2} = ?</span>
                    <input type="text" maxLength="2" required value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value.replace(/\D/g, ''))} placeholder="Ans" className="w-16 border border-gray-300 p-2 rounded-sm text-xs text-center font-bold bg-white" />
                  </div>
                </div>

                <div className="flex items-start pt-2 border-t border-gray-200">
                  <input id="terms" type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="w-4 h-4 text-red-600 bg-white border-gray-300 rounded cursor-pointer mt-0.5" required />
                  <label htmlFor="terms" className="ml-2 text-xs font-medium text-gray-700 leading-relaxed">
                    I agree to the{' '}
                    <button 
                      type="button" 
                      onClick={() => setShowTermsModal(true)} 
                      className="text-red-600 font-bold underline hover:text-red-700 cursor-pointer inline-flex items-center"
                    >
                      Terms & Conditions <FaExternalLinkAlt className="ml-1 text-[10px]" />
                    </button>
                    , confirm my name matches my official documents, and understand the ₹500 token is non-refundable.
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

              {/* SUBMIT BUTTON WITH LOADING STATE */}
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-sm uppercase tracking-widest transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex justify-center items-center"
              >
                {submitting ? (
                  <span>⏳ Confirming Booking with Server...</span>
                ) : (
                  <span>Verify Payment & Book Car</span>
                )}
              </button>
            </form>
          )}

        </div>
      </div>

      {/* ================= TERMS & CONDITIONS POPUP MODAL ================= */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] animate-fadeIn">
            
            <div className="bg-gray-900 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold uppercase tracking-wider text-sm">Rental Terms & Conditions</h3>
              <button onClick={() => setShowTermsModal(false)} className="text-gray-400 hover:text-white bg-gray-800 p-1.5 rounded-full cursor-pointer">
                <FaTimes size={14} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto text-xs text-gray-700 space-y-4 leading-relaxed">
              <div className="bg-red-50 border-l-4 border-red-600 p-3 text-red-800 font-bold">
                IDENTITY POLICY: Booking name MUST match original Aadhar & DL. Delivery strictly given ONLY to the named person.
              </div>
              
              <ul className="space-y-3 pl-1">
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2">•</span>
                  <span><strong>Distance Limit:</strong> 350 km per 24 hrs. Extra mileage fee: ₹5/km (5-seater), ₹7/km (7-seater).</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2">•</span>
                  <span><strong>Late Charges:</strong> ₹200/hr. Full day calculated from 8 AM to 8 AM.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2">•</span>
                  <span><strong>Mandatory Documents:</strong> Original Aadhar, PAN, and valid Driving License must be presented at the time of vehicle pickup.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2">•</span>
                  <span><strong>Damages & Responsibility:</strong> Any dents, scratches, punctures, or mechanical issues caused due to negligence are the customer's sole responsibility.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-2">•</span>
                  <span><strong>Zero Tolerance:</strong> No drinking and driving under any circumstances. Advance token of ₹500 is strictly non-refundable.</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-100 p-3 text-right border-t border-gray-200">
              <button 
                onClick={() => {
                  setTermsAccepted(true);
                  setShowTermsModal(false);
                }}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase px-5 py-2 rounded-sm cursor-pointer transition-colors"
              >
                Accept & Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}