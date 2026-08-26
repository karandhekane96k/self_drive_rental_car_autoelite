import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { FaCar, FaUserTie, FaHeadset } from 'react-icons/fa';
import CarCard from '../components/CarCard';
import BookingModal from '../components/BookingModal';
import { AuthContext } from '../context/AuthContext';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function Home() {
  const [dbCars, setDbCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Global Modal State
  const [selectedCar, setSelectedCar] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('https://self-drive-rental-car-autoelite.onrender.com/api/cars');
        const data = await response.json();
        setDbCars(data.slice(0, 3)); 
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch cars', error);
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handleOpenBooking = (car) => {
    if (!user) {
      toast.error('Please log in to reserve a vehicle.');
      return;
    }
    setSelectedCar(car);
    setIsBookingOpen(true);
  };

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2066&auto=format&fit=crop", 
      title: "Drive in Luxury",
      subtitle: "Unleash the power of luxury on every journey."
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format&fit=crop", 
      title: "Premium Fleet",
      subtitle: "Choose from our exclusive collection of high-end vehicles."
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop", 
      title: "Unmatched Power",
      subtitle: "Feel the thrill of engineering mastery."
    }
  ];

  const services = [
    {
      id: 1,
      icon: <FaCar className="text-red-500 mb-6" size={50} />,
      title: "Luxury Rentals",
      desc: "Access an exclusive fleet of world-class vehicles, meticulously maintained for your comfort."
    },
    {
      id: 2,
      icon: <FaUserTie className="text-red-500 mb-6" size={50} />,
      title: "Chauffeur Service",
      desc: "Sit back and relax with our professional, highly trained chauffeurs guiding your journey."
    },
    {
      id: 3,
      icon: <FaHeadset className="text-red-500 mb-6" size={50} />,
      title: "24/7 Support",
      desc: "Enjoy complete peace of mind with our round-the-clock roadside assistance and premium care."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* Custom Styles for the Cinematic Ken Burns Slow Zoom Effect */}
      <style>{`
        @keyframes slowZoom {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.12);
          }
        }
        .swiper-slide-active .hero-bg-zoom {
          animation: slowZoom 6s ease-out forwards;
        }
      `}</style>

      {/* Hero Slider Section */}
      <div className="w-full h-screen relative bg-gray-900 overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect={'fade'}
          fadeEffect={{ crossFade: true }}
          navigation={true}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="w-full h-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                {/* Background Image with Slow Zoom Animation Class */}
                <div 
                  className="absolute inset-0 bg-cover bg-center hero-bg-zoom"
                  style={{ backgroundImage: `url(${slide.image})` }}
                ></div>
                
                <div className="absolute inset-0 bg-black/50"></div>
                
                <div className="relative z-10 text-center px-4 mt-20 md:mt-0">
                  <h1 className="text-4xl md:text-7xl font-extrabold uppercase tracking-tight text-white mb-4 drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-200 mb-8 leading-relaxed drop-shadow-md">
                    {slide.subtitle}
                  </p>
                  <Link to="/fleet" className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-sm uppercase tracking-widest transition-colors inline-block shadow-lg">
                    Explore Fleet
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Dynamic Database Cars Section */}
      <div className="relative py-24 bg-white overflow-hidden">
        
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-50" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px)', 
            backgroundSize: '40px 40px' 
          }}
        ></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold uppercase tracking-widest text-gray-900 mb-4">
              Featured <span className="text-red-600">Vehicles</span>
            </h2>
            <p className="text-gray-500 mb-8">Select your dream ride from our premium collection.</p>
          </div>
          
          {loading ? (
            <div className="text-center font-bold text-xl">Loading featured vehicles...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dbCars.length > 0 ? (
                dbCars.map((car) => (
                  <CarCard key={car._id} car={car} onBookClick={handleOpenBooking} />
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center text-gray-500 italic">
                  No vehicles available at the moment. Add some to the fleet!
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-16">
            <Link to="/fleet" className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-12 rounded-sm uppercase tracking-widest transition-colors shadow-lg">
              Explore Entire Fleet
            </Link>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold uppercase tracking-widest mb-4">
              Our <span className="text-red-500">Services</span>
            </h2>
            <p className="text-gray-400">Experience the pinnacle of automotive excellence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {services.map(service => (
              <div key={service.id} className="flex flex-col items-center text-center p-8 border border-gray-800 hover:border-red-500 transition-colors duration-300">
                {service.icon}
                <h3 className="text-2xl font-bold mb-4 uppercase tracking-wider">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* GLOBAL BOOKING MODAL (Renders safely at the root layer) */}
      {selectedCar && (
        <BookingModal 
          car={selectedCar} 
          isOpen={isBookingOpen} 
          onClose={() => setIsBookingOpen(false)} 
        />
      )}

    </div>
  );
}