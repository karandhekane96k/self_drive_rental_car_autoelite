import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; 

export default function AdminAddCar() {
  const [carData, setCarData] = useState({
    name: '', brand: '', dailyRate: '', transmission: 'Automatic', seats: ''
  });
  
  const [imageFile, setImageFile] = useState(null); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCarData({ ...carData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please select an image file first!");
      return;
    }

    // NEW: Show a loading indicator while uploading
    const loadingToast = toast.loading("Uploading vehicle data...");

    try {
      // PHASE 1: Send the physical image to the backend first
      const imageFormData = new FormData();
      imageFormData.append('image', imageFile);

      const uploadResponse = await fetch('https://self-drive-rental-car-autoelite.onrender.com/api/upload', {
        method: 'POST',
        body: imageFormData, 
      });

      if (!uploadResponse.ok) throw new Error('Image upload failed on the server.');
      
      // Get the final saved URL back from the backend
      const uploadData = await uploadResponse.json(); 
      const finalImageUrl = uploadData.image; 

      // PHASE 2: Save the car details AND the new image URL to the database
      const carPayload = { ...carData, image: finalImageUrl };

      const carResponse = await fetch('https://self-drive-rental-car-autoelite.onrender.com/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carPayload),
      });

      if (carResponse.ok) {
        toast.dismiss(loadingToast); // Clear the loading toast
        toast.success('Vehicle successfully added to the fleet!'); // Success toast
        navigate('/fleet'); 
      } else {
        toast.dismiss(loadingToast);
        toast.error('Failed to save vehicle details to database.'); // Error toast
      }
    } catch (error) {
      console.error('Error:', error);
      toast.dismiss(loadingToast);
      toast.error('An error occurred during submission.'); // Error toast
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Add New Vehicle</h1>
      
      <form onSubmit={submitHandler} className="bg-white p-8 shadow-xl rounded-sm border border-gray-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input type="text" name="brand" required onChange={handleChange} placeholder="e.g. BMW" 
              className="w-full border border-gray-300 p-2 rounded-sm focus:ring-red-500 focus:border-red-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model Name</label>
            <input type="text" name="name" required onChange={handleChange} placeholder="e.g. M5 Competition" 
              className="w-full border border-gray-300 p-2 rounded-sm focus:ring-red-500 focus:border-red-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate (₹)</label>
            <input type="number" name="dailyRate" required onChange={handleChange} placeholder="e.g. 5000" 
              className="w-full border border-gray-300 p-2 rounded-sm focus:ring-red-500 focus:border-red-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Seats</label>
            <input type="number" name="seats" required onChange={handleChange} placeholder="e.g. 5" 
              className="w-full border border-gray-300 p-2 rounded-sm focus:ring-red-500 focus:border-red-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
            <select name="transmission" onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-sm focus:ring-red-500 focus:border-red-500">
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Car Image</label>
            <input type="file" accept="image/*" name="image" required onChange={handleImageChange} 
              className="w-full border border-gray-300 p-2 rounded-sm bg-gray-50 focus:ring-red-500 focus:border-red-500" />
          </div>

        </div>

        <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded-sm hover:bg-gray-800 transition-colors">
          Upload & Save Vehicle
        </button>
      </form>
    </div>
  );
}