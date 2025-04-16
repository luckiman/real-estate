// Import bootstrap react components
import { Button, Card, Container } from "react-bootstrap";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
// import required modules
import { Pagination, Navigation } from "swiper/modules";
import CountDown from "../components/functions/CountDown";
// import framer motion
import { motion } from "framer-motion";
import AnimationTitles from "../components/functions/AnimationTitles";
// Import API service
import { getAllProperties } from "../services/api";
import { useEffect, useState } from "react";

function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await getAllProperties();
      setProperties(response.products);
      setError(null);
    } catch (err) {
      setError("Failed to fetch properties");
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  // Active on select a tab
  function active(category) {
    setActiveCategory(category);
  }

  // Like button of properties
  function like(e) {
    return e.target.classList.value === "fa-regular fa-heart like"
      ? (e.target.classList.value = "fa-solid fa-heart like text-danger")
      : (e.target.classList.value = "fa-regular fa-heart like");
  }

  // Filter properties by category
  const filteredProperties = activeCategory === "All" 
    ? properties 
    : properties.filter(property => property.category === activeCategory);

  if (loading) {
    return (
      <div className="properties">
        <Container>
          <div className="text-center text-white">Loading...</div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="properties">
        <Container>
          <div className="text-center text-white">{error}</div>
        </Container>
      </div>
    );
  }

  return (
    <section id="marketplace" className="properties-section">
      <Container>
        <AnimationTitles
          className="title mx-auto"
          title="Discover more properties"
        />
        {/* Start tabs */}
        <div className="tabs d-flex justify-content-start justify-content-sm-center align-items-center flex-nowrap w-lg-50">
          <Swiper
            className="mySwiper overflow-none"
            grabCursor={true}
            spaceBetween={15}
            slidesPerView={6}
            breakpoints={{
              0: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 6,
              },
            }}
          >
            <SwiperSlide>
              <Button 
                className={`ms-0 bg-black-100 border-0 ${activeCategory === "All" ? "active" : ""}`} 
                onClick={() => active("All")}
              >
                All
              </Button>
            </SwiperSlide>
            <SwiperSlide>
              <Button
                className={`ms-0 bg-black-100 border-0 ${activeCategory === "Villa" ? "active" : ""}`}
                onClick={() => active("Villa")}
              >
                Villa
              </Button>
            </SwiperSlide>
            <SwiperSlide>
              <Button 
                className={`ms-0 bg-black-100 border-0 ${activeCategory === "Apartment" ? "active" : ""}`} 
                onClick={() => active("Apartment")}
              >
                Apartment
              </Button>
            </SwiperSlide>
            <SwiperSlide>
              <Button 
                className={`ms-0 bg-black-100 border-0 ${activeCategory === "Condo" ? "active" : ""}`} 
                onClick={() => active("Condo")}
              >
                Condo
              </Button>
            </SwiperSlide>
          </Swiper>
        </div>
        {/* End tabs */}
        {/* Start cards */}
        <motion.div
          initial={{ x: -80 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Swiper
            slidesPerView={4}
            spaceBetween={15}
            grabCursor={true}
            loop={true}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              520: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              992: {
                slidesPerView: 4,
              },
              1198: {
                slidesPerView: 5,
              },
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper mt-4"
          >
            {filteredProperties.map((property) => (
              <SwiperSlide key={property._id}>
                <Card className="bg-black-100 rounded">
                  <Card.Body className="p-2">
                    <div className="rounded overflow-hidden position-relative">
                      <Card.Img
                        variant="top"
                        alt={property.name}
                        src={property.images[0]?.url || require("../images/properties/default-property.webp")}
                      />
                      <i className="fa-regular fa-heart like" onClick={like}></i>
                    </div>
                    <h5 className="mt-2 text-white fw-normal">
                      {property.name}
                    </h5>
                    <p className="gray-90">@{property.brand?.name || "Unknown"}</p>
                    <div className="d-flex">
                      <div className="me-3">
                        <CountDown h={9} m={45} s={8} />
                        <span className="gray-90">Remaining Time</span>
                      </div>
                      <div>
                        <h6 className="text-white">{property.price} ETH</h6>
                        <span className="gray-90">Current Bid</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
        {/* End cards */}
      </Container>
    </section>
  );
}

export default Properties;
