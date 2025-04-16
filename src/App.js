import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AboutUs from "./pages/AboutUs";
import NavBar from "./components/navbar/Navbar";
import Developers from "./pages/Developers";
import Footer from "./pages/Footer";
import Join from "./pages/Join";
import Loading from "./pages/Header";
import Partners from "./pages/Partners";
import Properties from "./pages/Properties";
import Subscribe from "./pages/Subscribe";
import PropertyManagement from './pages/PropertyManagement';

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer />
        <NavBar />
        <Routes>
          <Route path="/admin/properties" element={<PropertyManagement />} />
          <Route path="/*" element={
            <>
              <Loading />
              <Partners />
              <Properties />
              <AboutUs />
              <Developers />
              <Join />
              <Subscribe />
            </>
          } />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
