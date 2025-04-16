import { Button, Container } from "react-bootstrap";
import { motion } from "framer-motion";
import AnimationTitles from "../components/functions/AnimationTitles";
import "./AboutUs.css"; // Import the CSS file

function AboutUs() {
  return (
    <section id="about" className="about-section">
      <Container className="d-flex justify-content-between flex-wrap flex-md-nowrap">
        <motion.div
          initial={{ x: -200 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 0.8 }}
          className="about-content"
        >
          <AnimationTitles title="What is Renting-Platform?" className="title" />
          <p className="gray-50 mb-5">
            As new technologies like cryptocurrency develop, the real estate
            sector is changing drastically. It is important to understand both
            how these technologies and the traditional real estate market work.
            Governments are unable to comprehend the rapid advancement of
            technology and modify their legal frameworks to accommodate it fast
            enough.
          </p>
          <Button variant="primary ms-0">Read More</Button>
        </motion.div>
        <motion.div
          initial={{ x: 200 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 0.8 }}
          className="about-images"
        >
          <div className="image-row">
            <div className="image-container">
              <img
                src={require("..//images/bohdan-d-fh6o-XkVQG8-unsplash.webp")}
                alt="Modern building"
                className="about-image"
              />
            </div>
            <div className="image-container">
              <img
                src={require("..//images/john-o-nolan-6f_ANCcbj3o-unsplash.webp")}
                alt="City view"
                className="about-image"
              />
            </div>
          </div>
          <div className="image-row">
            <div className="image-container">
              <img
                src={require("..//images/julia-solonina-ci19YINguoc-unsplash.webp")}
                alt="Interior design"
                className="about-image"
              />
            </div>
            <div className="image-container">
              <img
                src={require("..//images/theater-amazonas-manaus.webp")}
                alt="Architecture"
                className="about-image"
              />
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

export default AboutUs;
