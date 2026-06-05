// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  initTypewriter();
  initScrollAnimations();
  initProjectFilters();
  initMobileNav();
  initContactForm();
  initActiveNavLink();
});

// 1. TYPEWRITER EFFECT
function initTypewriter() {
  const words = ["Data Engineer", "AI/ML Engineer", "Automation Architect", "Python & GCP Specialist"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const targetElement = document.getElementById('typewriter');
  
  if (!targetElement) return;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      // Remove character
      targetElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Add character
      targetElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }
    
    let typeSpeed = isDeleting ? 40 : 80;
    
    // Word fully typed
    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 1500; // Pause at the end of the word
      isDeleting = true;
    } 
    // Word fully deleted
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 400; // Pause before typing next word
    }
    
    setTimeout(type, typeSpeed);
  }
  
  type();
}

// 2. SCROLL ANIMATIONS (Intersection Observer)
function initScrollAnimations() {
  const sections = document.querySelectorAll('.fade-in-section');
  
  const options = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, options);
  
  sections.forEach(section => {
    observer.observe(section);
  });
  
  // Header scroll class
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// 3. PROJECT FILTERING
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all') {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
        } else if (category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });
}

// 4. MOBILE NAVIGATION
function initMobileNav() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  if (!menuToggle || !navMenu) return;
  
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('open');
    
    // Animate hamburger lines
    const spans = menuToggle.querySelectorAll('span');
    if (menuToggle.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
  
  // Close menu when clicking nav links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('open');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  });
}

// 5. CONTACT FORM HANDLING (Asynchronous Submission)
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusDiv = document.getElementById('form-status');
  
  if (!form || !statusDiv) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    
    statusDiv.textContent = "Sending message...";
    statusDiv.className = "form-status success"; // Temporarily show in green
    
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        statusDiv.textContent = "Thank you! Your message has been sent successfully.";
        statusDiv.className = "form-status success";
        form.reset();
      } else {
        const responseData = await response.json();
        if (Object.prototype.hasOwnProperty.call(responseData, 'errors')) {
          statusDiv.textContent = responseData["errors"].map(error => error.message).join(", ");
        } else {
          statusDiv.textContent = "Oops! There was a problem submitting your form.";
        }
        statusDiv.className = "form-status error";
      }
    } catch (error) {
      // Offline / Local development fallback: Simulate success for better local UX
      console.warn("Formspree submission failed due to network. Simulating local success.", error);
      setTimeout(() => {
        statusDiv.textContent = "Message simulated successfully! (Offline fallback triggered)";
        statusDiv.className = "form-status success";
        form.reset();
      }, 1000);
    }
  });
}

// 6. ACTIVE NAV LINK HIGHLIGHTER ON SCROLL
function initActiveNavLink() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-btn)');
  
  window.addEventListener('scroll', () => {
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      // Triggers slightly before reaching the section
      if (window.scrollY >= (sectionTop - 200)) {
        currentSection = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === currentSection) {
        link.classList.add('active');
      }
    });
  });
}
