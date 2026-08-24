import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaList, FaQrcode, FaTimes, FaUpload } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [qrFile, setQrFile] = useState(null);
  const [currentQr, setCurrentQr] = useState('');

  // Fetch current QR code on load
  useEffect(() => {
    fetch('https://self-drive-rental-car-autoelite.onrender.com/api/settings')
      .then(res => res.json())
      .then(data => setCurrentQr(data.qrCodeUrl))
      .catch(err => console.error(err));
  }, []);

  const handleQrUpload = async (e) => {
    e.preventDefault();
    if (!qrFile) return toast.error('Please select an image first.');

    try {
      // 1. Upload image to server
      const formData = new FormData();
      formData.append('image', qrFile);

      const uploadRes = await fetch('https://self-drive-rental-car-autoelite.onrender.com/api/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();
      
      let imageUrl = uploadData.image || uploadData.imageUrl || uploadData.url;
      if (uploadRes.ok && imageUrl) {
        imageUrl = imageUrl.startsWith('http') ? imageUrl : `https://self-drive-rental-car-autoelite.onrender.com${imageUrl}`;
        
        // 2. Save image URL to Settings Database
        const settingsRes = await fetch('https://self-drive-rental-car-autoelite.onrender.com/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ qrCodeUrl: imageUrl })
        });

        if (settingsRes.ok) {
          toast.success('Payment QR Code updated globally!');
          setCurrentQr(imageUrl);
          setIsSettingsOpen(false);
          setQrFile(null);
        }
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      toast.error('Failed to update QR code.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 min-h-screen">
      
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold uppercase tracking-tight text-gray-900 mb-2">
          Admin <span className="text-red-600">Control Panel</span>
        </h1>
        <p className="text-gray-500">Manage your fleet, update pricing, and handle reservations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-8 rounded-sm shadow-md border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
          <div className="bg-gray-900 text-white p-5 rounded-full mb-6"><FaPlus size={24} /></div>
          <h3 className="text-lg font-bold mb-3 text-gray-900">Add Vehicle</h3>
          <p className="text-gray-500 text-xs mb-8 flex-grow">Upload new cars with specs and rates.</p>
          <Link to="/admin/add-car" className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-sm text-xs uppercase tracking-widest transition-colors">Create Vehicle</Link>
        </div>

        <div className="bg-white p-8 rounded-sm shadow-md border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
          <div className="bg-gray-900 text-white p-5 rounded-full mb-6"><FaEdit size={24} /></div>
          <h3 className="text-lg font-bold mb-3 text-gray-900">Manage Fleet</h3>
          <p className="text-gray-500 text-xs mb-8 flex-grow">Update visibility or edit car details.</p>
          <Link to="/admin/manage-cars" className="w-full bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-50 font-bold py-2.5 rounded-sm text-xs uppercase tracking-widest transition-colors">Manage Cars</Link>
        </div>

        <div className="bg-white p-8 rounded-sm shadow-md border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
          <div className="bg-gray-900 text-white p-5 rounded-full mb-6"><FaList size={24} /></div>
          <h3 className="text-lg font-bold mb-3 text-gray-900">Reservations</h3>
          <p className="text-gray-500 text-xs mb-8 flex-grow">Verify customer UTR payments and schedules.</p>
          <Link to="/admin/manage-bookings" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-sm text-xs uppercase tracking-widest transition-colors shadow-md">Manage Bookings</Link>
        </div>

        {/* NEW SETTINGS CARD */}
        <div className="bg-white p-8 rounded-sm shadow-md border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
          <div className="bg-gray-900 text-white p-5 rounded-full mb-6"><FaQrcode size={24} /></div>
          <h3 className="text-lg font-bold mb-3 text-gray-900">Payment QR</h3>
          <p className="text-gray-500 text-xs mb-8 flex-grow">Update the global UPI QR for customer tokens.</p>
          <button onClick={() => setIsSettingsOpen(true)} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-sm text-xs uppercase tracking-widest transition-colors shadow-md cursor-pointer">Update QR Code</button>
        </div>

      </div>

      {/* QR UPLOAD MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-sm max-w-sm w-full p-6 shadow-2xl relative">
            <button onClick={() => setIsSettingsOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-black"><FaTimes size={20} /></button>
            <h2 className="text-xl font-bold uppercase mb-4 text-gray-900">Payment Settings</h2>
            
            <form onSubmit={handleQrUpload} className="space-y-4">
              <div className="flex justify-center mb-4">
                {qrFile ? (
                  <img src={URL.createObjectURL(qrFile)} alt="Preview" className="w-32 h-32 object-contain border-2 border-dashed border-gray-300 p-2 rounded-sm" />
                ) : currentQr ? (
                  <img src={currentQr} alt="Current QR" className="w-32 h-32 object-contain border border-gray-200 p-2 rounded-sm" />
                ) : (
                  <div className="w-32 h-32 bg-gray-100 flex items-center justify-center text-gray-400 text-xs text-center border-2 border-dashed border-gray-300">No QR Code Set</div>
                )}
              </div>
              
              <label className="cursor-pointer bg-gray-900 hover:bg-black text-white font-bold py-2.5 px-4 rounded-sm uppercase text-xs tracking-widest flex items-center justify-center transition-colors">
                <FaUpload className="mr-2" /> Choose New Image
                <input type="file" accept="image/*" onChange={(e) => setQrFile(e.target.files[0])} className="hidden" />
              </label>

              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-sm uppercase text-xs tracking-widest transition-colors shadow-md mt-2">
                Save QR Code
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}