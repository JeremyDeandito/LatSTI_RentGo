// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get references to elements
    const header = document.querySelector('.header');
    const searchTabs = document.querySelectorAll('.search-tabs .search-tab');
    const searchForm = document.querySelector('.search-form');
    const searchInputs = document.querySelectorAll('.search-inputs input');
    const searchButton = document.querySelector('.btn-telusuri');
    const registerHostBtn = document.querySelector('.btn-outline');  // "Mendaftar sebagai Host" button
    const loginBtn = document.querySelector('.btn-primary');        // "Masuk" button
      // Add click handlers for navigation buttons
    if (registerHostBtn) {
        registerHostBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'register.html';
        });
    }
      if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }
    // Function to handle scroll events
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.style.background = 'rgba(0, 0, 0, 0.8)';
      } else {
        header.style.background = 'transparent';
      }
    };
  
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
  
    // Function to handle search tab clicks
    const handleTabClick = (event) => {
      searchTabs.forEach(tab => tab.classList.remove('active'));
      event.target.classList.add('active');
    };
  
    // Add click event listeners to search tabs
    searchTabs.forEach(tab => {
      tab.addEventListener('click', handleTabClick);
    });
  
    // Function to validate search form
    const validateForm = () => {
      let isValid = true;
      searchInputs.forEach(input => {
        if (input.value.trim() === '') {
          input.style.border = '1px solid red';
          isValid = false;
        } else {
          input.style.border = '1px solid #ddd';
        }
      });
      return isValid;
    };
  
    // Function to handle form submission
    const handleSubmit = (event) => {
      event.preventDefault();
      if (validateForm()) {
        alert('Search submitted successfully!');
        // Here you would typically send the form data to a server
      } else {
        alert('Please fill in all fields');
      }
    };
  
    // Add submit event listener to search form
    searchForm.addEventListener('submit', handleSubmit);
  
    // Add input event listeners to search inputs for real-time validation
    searchInputs.forEach(input => {
      input.addEventListener('input', () => {
        input.style.border = input.value.trim() === '' ? '1px solid red' : '1px solid #ddd';
      });
    });
  
    // Function to animate elements on scroll
    const animateOnScroll = () => {
      // Feature cards animation
      const featureCards = document.querySelectorAll('.feature-card');
      // How it works animation
      const stepCards = document.querySelectorAll('.step-card');
      // Host section animation
      const hostContent = document.querySelector('.host-content');
      
      const triggerPoint = window.innerHeight * 0.8;

      // Animate feature cards
      featureCards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        if (cardTop < triggerPoint) {
          card.classList.add('animate');
        }
      });

      // Animate step cards
      stepCards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        if (cardTop < triggerPoint) {
          card.classList.add('animate');
        }
      });

      // Animate host section
      if (hostContent) {
        const hostTop = hostContent.getBoundingClientRect().top;
        if (hostTop < triggerPoint) {
          hostContent.classList.add('animate');
        }
      }
    };

    // Set initial states
    const initializeAnimations = () => {
      const elements = [
        ...document.querySelectorAll('.feature-card'),
        ...document.querySelectorAll('.step-card'),
        document.querySelector('.host-content')
      ].filter(Boolean);

      elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 0.6s ease-out';
      });
    };

    // Initialize animations
    initializeAnimations();
  
    // Initial call to animate elements
    animateOnScroll();
  
    // Add scroll event listener with throttling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          animateOnScroll();
          scrollTimeout = null;
        }, 50);
      }
    });
  
    // Log that the script has loaded successfully
    console.log('RentGo landing page script loaded successfully!');
  });
  
  // Since we can't actually run this in the browser environment, 
  // we'll simulate the script loading message
  console.log('RentGo landing page script loaded successfully!');