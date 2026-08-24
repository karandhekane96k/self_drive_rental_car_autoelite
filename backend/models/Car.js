import mongoose from 'mongoose';

const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    image: { type: String, required: true },
    dailyRate: { type: Number, required: true },
    transmission: { type: String, required: true }, 
    seats: { type: Number, required: true },
    
    // Status to check if the car is currently rented out (Taken vs Available)
    isAvailable: { type: Boolean, required: true, default: true },
    
    // NEW: Status to control if the public can see this car on the website
    isVisible: { type: Boolean, required: true, default: false }, 
  },
  {
    timestamps: true,
  }
);

const Car = mongoose.model('Car', carSchema);
export default Car;