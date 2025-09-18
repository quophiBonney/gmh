import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";

import { EffectCoverflow, Navigation, Autoplay } from "swiper/modules";

const Beauty = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSites = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://gmh-backend.vercel.app/api/sites"
      );
      setPlaces(response.data);
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  return (
    <div className="px-5 md:px-10 mt-16">
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 text-black">
          Explore Beautiful Places
        </h2>
        <p className="text-gray-600">
          Discover some of the most beautiful places around the world.
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading tourist sites...
          </p>
        </div>
      ) : (
        <>
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            initialSlide={3}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            speed={1000}
            coverflowEffect={{
              rotate: -10,
              stretch: 0,
              depth: 200,
              modifier: 1.5,
              slideShadows: true,
            }}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 10 },
              640: { slidesPerView: 2, spaceBetween: 10 },
              1024: { slidesPerView: 3, spaceBetween: 10 },
            }}
            modules={[EffectCoverflow, Navigation, Autoplay]}
            className="mySwiper"
          >
            {places.map((place, index) => (
              <SwiperSlide key={index}>
                <div className="h-96 md:h-[400px] w-full overflow-hidden rounded-xl">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full"
                    loading="lazy"
                  />
                </div>
                <p className="text-black uppercase text-lg font-bold text-center">
                  {place.name}
                </p>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom navigation buttons */}
          <div className="flex justify-center gap-5 items-center mt-10">
            <div className="custom-prev border-gray-700 border-2 p-4 font-bold text-2xl rounded-full text-gray-700 cursor-pointer hover:bg-gray-100">
              ←
            </div>
            <div className="custom-next border-gray-700 border-2 p-4 font-bold text-2xl rounded-full text-gray-700 cursor-pointer hover:bg-gray-100">
              →
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Beauty;
