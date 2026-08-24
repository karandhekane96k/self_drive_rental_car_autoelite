import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaTimes, FaUpload, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ManageCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Edit Modal States
  const [editingCar, setEditingCar] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    dailyRate: '',
    transmission: 'Manual',
    seats: 5,
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cars?admin=true');
      const data = await response.json();
      setCars(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load fleet');
      setLoading(false);
    }
  };

  // Open Edit Modal and pre-fill data
  const handleEditClick = (car) => {
    setEditingCar(car);
    setFormData({
      name: car.name,
      brand: car.brand,
      dailyRate: car.dailyRate,
      transmission: car.transmission,
      seats: car.seats,
      image: car.image
    });
    setImageFile(null);
  };

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Local Image File Selection & Preview
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  // Submit Updated Car Details
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image;

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);

        const uploadRes = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: uploadData,
        });
        const uploadResult = await uploadRes.json();
        
        const returnedPath = uploadResult.image || uploadResult.imageUrl || uploadResult.url;

        if (uploadRes.ok && returnedPath) {
          imageUrl = returnedPath.startsWith('http') 
            ? returnedPath 
            : `http://localhost:5000${returnedPath}`;
        } else {
          throw new Error(uploadResult.message || 'Image upload failed');
        }
      }

      const response = await fetch(`http://localhost:5000/api/cars/${editingCar._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, image: imageUrl })
      });

      if (response.ok) {
        toast.success('Car updated successfully!');
        setEditingCar(null);
        fetchCars();
      } else {
        toast.error('Failed to update car details.');
      }
    } catch (error) {
      toast.error(error.message || 'Server error during update.');
    }
  };

  // Toggle Public Visibility (Hidden / Published)
  const handleToggleVisibility = async (car) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cars/${car._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !car.isVisible })
      });

      if (response.ok) {
        toast.success(`Car visibility updated!`);
        fetchCars();
      } else {
        toast.error('Failed to update visibility');
      }
    } catch (error) {
      toast.error('Server error');
    }
  };

  // Toggle Rental Status (Available / Taken)
  const handleToggleAvailability = async (car) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cars/${car._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !car.isAvailable })
      });

      if (response.ok) {
        toast.success(`Rental status changed to ${!car.isAvailable ? 'Available' : 'Taken'}!`);
        fetchCars();
      } else {
        toast.error('Failed to update rental status');
      }
    } catch (error) {
      toast.error('Server error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/cars/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Vehicle deleted');
        fetchCars();
      } else {
        toast.error('Failed to delete vehicle');
      }
    } catch (error) {
      toast.error('Server error');
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">Loading Fleet Management...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold uppercase tracking-tight mb-8">Manage <span className="text-red-600">Fleet</span></h1>

      <div className="bg-white shadow-md rounded-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 text-white text-sm uppercase">
              <th className="p-4">Vehicle</th>
              <th className="p-4">Specs</th>
              <th className="p-4">Rate</th>
              <th className="p-4 text-center">Public Visibility</th>
              <th className="p-4 text-center">Rental Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {cars.map((car) => (
              <tr key={car._id} className="hover:bg-gray-50">
                <td className="p-4 flex items-center space-x-4">
                  <img src={car.image} alt={car.name} className="w-16 h-12 object-cover rounded-sm border" />
                  <span className="font-bold">{car.brand} {car.name}</span>
                </td>
                <td className="p-4 text-sm text-gray-600">{car.transmission} | {car.seats} Seats</td>
                <td className="p-4 font-bold text-red-600">₹{car.dailyRate}/day</td>
                
                {/* Visibility Toggle Column */}
                <td className="p-4 text-center">
                  <button 
                    onClick={() => handleToggleVisibility(car)}
                    className={`px-3 py-1 rounded-sm text-xs font-bold uppercase inline-flex items-center transition-colors cursor-pointer ${
                      car.isVisible !== false 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {car.isVisible !== false ? <FaEye className="mr-1.5" /> : <FaEyeSlash className="mr-1.5" />}
                    {car.isVisible !== false ? 'Published' : 'Hidden'}
                  </button>
                </td>

                {/* Clickable Rental Status Toggle Column */}
                <td className="p-4 text-center">
                  <button 
                    onClick={() => handleToggleAvailability(car)}
                    className={`px-3 py-1 rounded-sm text-xs font-bold uppercase inline-block transition-colors cursor-pointer shadow-sm ${
                      car.isAvailable 
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {car.isAvailable ? 'Available' : 'Taken'}
                  </button>
                </td>

                <td className="p-4 text-center space-x-2">
                  <button onClick={() => handleEditClick(car)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-sm text-xs font-bold uppercase transition-colors cursor-pointer">
                    <FaEdit className="inline mr-1" /> Edit
                  </button>
                  <button onClick={() => handleDelete(car._id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-sm text-xs font-bold uppercase transition-colors cursor-pointer">
                    <FaTrash className="inline mr-1" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editingCar && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-sm max-w-lg w-full p-6 shadow-2xl relative">
            <button onClick={() => setEditingCar(null)} className="absolute top-4 right-4 text-gray-500 hover:text-black">
              <FaTimes size={20} />
            </button>
            <h2 className="text-xl font-bold uppercase mb-4 text-gray-900">Edit Vehicle Details</h2>
            
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Brand</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleChange} required className="w-full border p-2.5 rounded-sm text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Model Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border p-2.5 rounded-sm text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Daily Rate (₹)</label>
                  <input type="number" name="dailyRate" value={formData.dailyRate} onChange={handleChange} required className="w-full border p-2.5 rounded-sm text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Transmission</label>
                  <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full border p-2.5 rounded-sm text-sm bg-white font-bold">
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Vehicle Image</label>
                <div className="flex items-center space-x-4">
                  <img 
                    src={imageFile ? URL.createObjectURL(imageFile) : formData.image} 
                    alt="Preview" 
                    className="w-20 h-14 object-cover rounded-sm border bg-gray-100" 
                  />
                  <div className="flex-grow">
                    <label className="cursor-pointer bg-gray-900 hover:bg-black text-white text-xs font-bold py-2.5 px-4 rounded-sm uppercase tracking-wide inline-flex items-center transition-colors">
                      <FaUpload className="mr-2" /> Choose New Image File
                      <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                    </label>
                    <p className="text-[11px] text-gray-500 mt-1">Leave blank to keep current image.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setEditingCar(null)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-sm text-xs font-bold uppercase">Cancel</button>
                <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-sm text-xs font-bold uppercase transition-colors shadow-md">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}