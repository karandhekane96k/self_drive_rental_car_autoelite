import Car from '../models/Car.js';

// @desc    Fetch cars based on user role
// @route   GET /api/cars
// @access  Public
export const getCars = async (req, res) => {
  try {
    const isAdminRequest = req.query.admin === 'true';
    const query = isAdminRequest ? {} : { isVisible: true };

    const cars = await Car.find(query);
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// @desc    Add a new car to the fleet (with Cloudinary Image Upload)
// @route   POST /api/cars
// @access  Public (Admin only in production)
export const createCar = async (req, res) => {
  try {
    const { name, brand, dailyRate, transmission, seats, image } = req.body;

    // Grab permanent Cloudinary URL if a file was uploaded, otherwise fall back to string URL
    const imageUrl = req.file ? req.file.path : image;

    if (!imageUrl) {
      return res.status(400).json({ message: 'Car image is required' });
    }

    const car = await Car.create({
      name,
      brand,
      image: imageUrl,
      dailyRate: Number(dailyRate),
      transmission,
      seats: Number(seats),
    });

    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// @desc    Fetch single car by ID
// @route   GET /api/cars/:id
// @access  Public
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (car) {
      res.json(car);
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// @desc    Toggle Visibility or Availability
// @route   PATCH /api/cars/:id/status
// @access  Public (Admin only in production)
export const updateCarStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCar = await Car.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.status(200).json(updatedCar);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
};

// @desc    Update car details (with optional new Cloudinary Image)
// @route   PUT /api/cars/:id
// @access  Public (Admin only in production)
export const updateCar = async (req, res) => {
  try {
    const { name, brand, dailyRate, transmission, seats, image } = req.body;

    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    car.name = name || car.name;
    car.brand = brand || car.brand;
    car.dailyRate = dailyRate !== undefined ? Number(dailyRate) : car.dailyRate;
    car.transmission = transmission || car.transmission;
    car.seats = seats !== undefined ? Number(seats) : car.seats;

    // Update with new Cloudinary URL if a new image file was uploaded
    if (req.file) {
      car.image = req.file.path;
    } else if (image) {
      car.image = image;
    }

    const updatedCar = await car.save();
    res.status(200).json(updatedCar);
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// @desc    Delete a car
// @route   DELETE /api/cars/:id
// @access  Public (Admin only in production)
export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};