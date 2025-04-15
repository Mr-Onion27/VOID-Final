import React, { useState, useEffect } from 'react';
import '../css/styles.css'; // Ensure the path is correct

const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css";
document.head.appendChild(link);



// Custom Floating Label Input Component
const FloatingInput = ({ id, type, placeholder, required }) => {
  return (
    <div className="form-floating mb-3">
      <input 
        className="form-control" 
        id={id} 
        type={type} 
        placeholder=" " // Changed to a space instead of using the placeholder text
        required={required} 
      />
      <label htmlFor={id}>{placeholder}</label>
    </div>
  );
};

// Custom Floating Label Textarea Component
const FloatingTextarea = ({ id, placeholder, required }) => {
  return (
    <div className="form-floating mb-3">
      <textarea 
        className="form-control" 
        id={id} 
        placeholder=" " // Changed to a space instead of using the placeholder text
        required={required}
      ></textarea>
      <label htmlFor={id}>{placeholder}</label>
    </div>
  );
};

const Home = () => {
  // State to track scroll position for navbar
  const [scrolled, setScrolled] = useState(false);
  // State to track mobile menu open/closed
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Effect for handling scroll events
  useEffect(() => {
    const handleScroll = () => {
      // Check if page is scrolled beyond 100px
      const isScrolled = window.scrollY > 100;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Function to toggle mobile menu
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  // Function to close mobile menu when a link is clicked
  const closeNav = () => {
    if (isNavOpen) setIsNavOpen(false);
  };

  return (
    <>
      {/* Navigation with dynamic class based on scroll */}
      <nav className={`navbar navbar-expand-lg navbar-light ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
        <button 
  className="navbar-toggler" 
  type="button" 
  onClick={toggleNav}
  aria-controls="navbarNav" 
  aria-expanded={isNavOpen ? "true" : "false"}
  aria-label="Toggle navigation"
>
  <img src="/assets/menus.png" alt="menu" className="menu-icon"  />
</button>

          <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#page-top" onClick={closeNav}>Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about" onClick={closeNav}>About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#services" onClick={closeNav}>Services</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#portfolio" onClick={closeNav}>Our Team</a>
              </li>
              
            </ul>
          </div>
        </div>
      </nav>

      {/* Masthead */}
      <header className="masthead" id="page-top">
      <div className="masthead-container h-100">
      <div className="row gx-4 gx-lg-5 h-100 align-items-center justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="text-white font-weight-bold display-4">Welcome to VoidClass!</h1>
              <hr className="divider" />
              <p className="text-white-75 mb-4">Streamlining classroom booking for students and faculty</p>
            </div>
            <div className="col-lg-8 align-self-baseline">
              <div className="login-buttons d-flex justify-content-center">
                <a className="btn btn-primary me-3" href="/std_log">
                  <img src="/assets/graduation-hat.png" alt="student" width="45px" height="45px" className="me-2" /> Student Login
                </a>
                <a className="btn btn-primary me-3" href="/fac_log">
                  <img src="/assets/university.png" alt="faculty" width="45px" height="45px" className="me-2" /> Faculty Login
                </a>
                <a className="btn btn-primary" href="/admin-login">
                  <img src="/assets/administrator.png" alt="admin" width="45px" height="45px" className="me-2" /> Admin Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Rest of component stays the same */}
      {/* About Section */}
<section className="page-section" id="about">
  <div className="container px-4 px-lg-5">
    <div className="row gx-4 gx-lg-5 justify-content-center">
      <div className="col-lg-8 text-center">
        <h2 className="text-white mt-0">What We Offer!</h2>
        <hr className="divider divider-light" />
        <p className="text-white-75 mb-4">
          "VoidClass: A comprehensive, cloud-based classroom management system to facilitate easy and secure booking for all users."
        </p>
        {/* Adding a div with button-container class for better centering */}
        <div className="button-container">
          <a className="btn btn-light btn-xl" href="#page-top">Get Started</a>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Services Section with Icons */}
      <section id="services">
        <div className="container">
          <h2>Our Services</h2>
          <div className="divider"></div>
          <div className="row">
            <div className="col-lg-3 col-md-6 text-center">
                        <div class="mt-5">
                            <div className="mb-2"><i className="bi-gem fs-1 text-primary"></i></div>
                            <h3 className="h4 mb-2">Sturdy Datas</h3>
                            <p className="text-muted mb-0">Classroom availability are updated regularly to keep them bug free!</p>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 text-center">
                        <div className="mt-5">
                            <div className="mb-2"><i className="bi-laptop fs-1 text-primary"></i></div>
                            <h3 className="h4 mb-2">Up to Date</h3>
                            <p className="text-muted mb-0">All dependencies are kept current to keep things fresh.</p>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 text-center">
                        <div className="mt-5">
                            <div className="mb-2"><i className="bi-globe fs-1 text-primary"></i></div>
                            <h3 className="h4 mb-2">Ready to Use</h3>
                            <p className="text-muted mb-0">You can use this page to find your free class!</p>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 text-center">
                        <div className="mt-5">
                            <div className="mb-2"><i className="bi-heart fs-1 text-primary"></i></div>
                            <h3 className="h4 mb-2">Made with Love</h3>
                            <p className="text-muted mb-0">Is it really open source if it's not made with love?</p>
                        </div>
                    </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="page-section bg-dark text-white" id="portfolio">
        <div className="container px-4 px-lg-5 text-center">
          <h2 className="mb-4">Our Team</h2>
          <button className="btn btn-light btn-xl" >Nanmaran S M - 22BCS0120 </button>
          <button className="btn btn-light btn-xl" >Jayashree G - 22BCS0176</button>

        </div>
      </section>

     

      {/* Footer */}
      <footer className="bg-light py-5">
        <div className="container px-4 px-lg-5 text-center">
          <small className="text-muted">Copyright &copy; 2025 - VC (Void Class)</small>
        </div>
      </footer>
    </>
  );
};

export default Home;