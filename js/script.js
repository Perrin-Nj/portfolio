// ============================================
// MODERN ANIMATED PORTFOLIO JAVASCRIPT
// ============================================

// Utility function for debouncing scroll events
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Utility function for throttling scroll events
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Initialize AOS with optimized settings for mobile
document.addEventListener('DOMContentLoaded', function() {
  // Detect if device is mobile
  const isMobile = window.innerWidth <= 768;
  const isVerySmall = window.innerWidth <= 480;

  // Disable AOS on very small devices for better performance
  if (isVerySmall) {
    AOS.init({
      disable: true
    });
  } else {
    AOS.init({
      duration: isMobile ? 400 : 600,
      offset: isMobile ? 30 : 60,
      once: true, // Only animate once for better performance
      mirror: false, // Disable mirror for better performance
      easing: 'ease-out',
      startEvent: 'DOMContentLoaded',
      throttleDelay: 100,
      delay: 0,
      useClassNames: false,
      disableMutationObserver: true // Better performance
    });
  }

  // Force initial animation trigger for visible elements
  if (!isVerySmall) {
    setTimeout(() => {
      AOS.refresh();
    }, 100);
  }

  // Initialize all features
  setupNavbarAnimations();
  setupScrollIndicator();
  setupBackToTopButton();
  setupSkillAnimations();
  setupSmoothScrolling();

  // Only enable mouse follower and parallax on desktop
  if (!isMobile) {
    setupMouseFollower();
    setupParallaxEffect();
  }
});

// ============================================
// NAVBAR ANIMATIONS
// ============================================

function setupNavbarAnimations() {
  const navbar = document.getElementById('navbar-top');
  const navLinks = document.querySelectorAll('.nav-link-animated');

  // Throttled scroll handler for navbar
  const handleNavbarScroll = throttle(() => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  }, 50); // Throttle to 50ms for smooth updates

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link-animated');

  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.href.includes(current)) {
      link.classList.add('active');
    }
  });
}

// ============================================
// SKILL PROGRESS ANIMATIONS
// ============================================

function setupSkillAnimations() {
  const skills = [
    { selector: '.html-css', endValue: 90, color: '#fca61f' },
    { selector: '.javascript', endValue: 85, color: '#6f34fe' },
    { selector: '.php', endValue: 80, color: '#20c997' },
    { selector: '.reactjs', endValue: 75, color: '#00d4ff' }
  ];

  // Use Intersection Observer to trigger animations only when visible
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
        entry.target.setAttribute('data-animated', 'true');
        animateSkillProgress(entry.target);
      }
    });
  }, observerOptions);

  // Observe each circular progress element
  document.querySelectorAll('.circular-progress').forEach(element => {
    observer.observe(element);
  });
}

function animateSkillProgress(element) {
  const skillClass = element.className.baseVal || element.className;
  const skill = getSkillConfig(skillClass);

  if (!skill) return;

  // Detect mobile for faster, simpler animation
  const isMobile = window.innerWidth <= 768;

  let currentValue = 0;
  const targetValue = skill.endValue;
  const speed = isMobile ? 20 : 30; // Faster on mobile
  const step = isMobile ? Math.ceil(targetValue / 20) : Math.ceil(targetValue / 50); // Fewer steps on mobile

  const interval = setInterval(() => {
    currentValue += step;
    if (currentValue >= targetValue) {
      currentValue = targetValue;
      clearInterval(interval);
    }

    const percentageDegrees = (currentValue * 3.6);
    const progressDisplay = element.querySelector('.progress-value');

    // Use CSS variable for better performance
    element.style.setProperty('--progress-deg', `${percentageDegrees}deg`);
    element.style.background = `conic-gradient(var(--accent-purple) ${percentageDegrees}deg, rgba(111, 52, 254, 0.2) 0deg)`;

    if (progressDisplay) {
      progressDisplay.textContent = `${currentValue}%`;
      // Update color dynamically
      progressDisplay.style.color = skill.color;
    }
  }, speed);
}

function getSkillConfig(skillClass) {
  const configs = {
    'html-css': { endValue: 90, color: '#fca61f' },
    'javascript': { endValue: 85, color: '#6f34fe' },
    'php': { endValue: 80, color: '#20c997' },
    'reactjs': { endValue: 75, color: '#00d4ff' }
  };

  for (const [key, value] of Object.entries(configs)) {
    if (skillClass.includes(key)) {
      return value;
    }
  }
  return null;
}

// ============================================
// SCROLL INDICATOR ANIMATION
// ============================================

function setupScrollIndicator() {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (!scrollIndicator) return;

  const handleScrollIndicator = throttle(() => {
    if (window.scrollY > 100) {
      scrollIndicator.style.opacity = '0';
      scrollIndicator.style.pointerEvents = 'none';
    } else {
      scrollIndicator.style.opacity = '1';
      scrollIndicator.style.pointerEvents = 'auto';
    }
  }, 100);

  window.addEventListener('scroll', handleScrollIndicator, { passive: true });
}

// ============================================
// BACK TO TOP BUTTON
// ============================================

function setupBackToTopButton() {
  const button = document.getElementById('btn-back-to-top');
  if (!button) return;

  const handleBackToTop = throttle(() => {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    if (scrollTop > 300) {
      if (button.style.display !== 'block') {
        button.style.display = 'block';
        button.style.animation = 'slideUp 0.3s ease';
      }
    } else {
      if (button.style.display !== 'none') {
        button.style.display = 'none';
      }
    }
  }, 100);

  window.addEventListener('scroll', handleBackToTop, { passive: true });

  button.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ============================================
// SMOOTH SCROLLING
// ============================================

function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ============================================
// PARALLAX EFFECT
// ============================================

function setupParallaxEffect() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  if (parallaxElements.length === 0) return;

  // Use requestAnimationFrame for smooth parallax with minimal performance impact
  let ticking = false;
  let scrollPosition = 0;

  window.addEventListener('scroll', () => {
    scrollPosition = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        parallaxElements.forEach(element => {
          const elementOffset = element.offsetTop;
          const distance = scrollPosition - elementOffset;
          const parallaxValue = distance * 0.3; // Reduced parallax intensity for mobile

          element.style.transform = `translateY(${parallaxValue}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ============================================
// MOUSE FOLLOWER EFFECT
// ============================================

function setupMouseFollower() {
  const heroSection = document.querySelector('.hero-section');
  if (!heroSection) return;

  // Disable mouse follower on mobile devices
  const isMobile = window.innerWidth <= 768;
  if (isMobile) return;

  // Throttle mouse move events for better performance
  const handleMouseMove = throttle((e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;

    // Subtle background shift on mouse move
    heroSection.style.backgroundPosition = `${x}% ${y}%`;
  }, 30);

  document.addEventListener('mousemove', handleMouseMove, { passive: true });
}

// ============================================
// TEXT ANIMATION ON SCROLL
// ============================================

function setupTextAnimations() {
  const textElements = document.querySelectorAll('[data-text-animate]');

  textElements.forEach(element => {
    const text = element.textContent;
    const chars = text.split('');

    element.innerHTML = chars.map((char, index) =>
      `<span style="animation: slideInDown 0.5s ease-out ${index * 0.05}s backwards;">${char}</span>`
    ).join('');
  });
}

// ============================================
// CARD HOVER EFFECTS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Disable hover effects on mobile/touch devices for better performance
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice) {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
      });

      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
      });
    });
  }
});

// ============================================
// EXPERTISE CARD ANIMATIONS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  const isMobile = window.innerWidth <= 768;

  // Disable staggered animations on mobile for faster load
  if (!isMobile) {
    const expertiseCards = document.querySelectorAll('.expertise-card');

    expertiseCards.forEach((card, index) => {
      card.style.animation = `slideInUp 0.4s ease-out ${index * 0.05}s backwards`;
    });
  }
});

// ============================================
// TYPING ANIMATION FOR HERO TITLE
// ============================================

function setupTypingAnimation() {
  const heroTitle = document.querySelector('.hero-title');
  if (!heroTitle) return;

  const text = heroTitle.textContent;
  heroTitle.textContent = '';
  let index = 0;

  const typeInterval = setInterval(() => {
    if (index < text.length) {
      heroTitle.textContent += text[index];
      index++;
    } else {
      clearInterval(typeInterval);
    }
  }, 50);
}

// ============================================
// COUNTER ANIMATION
// ============================================

function setupCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number');
  const observerOptions = { threshold: 0.5 };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.hasAttribute('data-counted')) {
        entry.target.setAttribute('data-counted', 'true');
        animateCounter(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => {
    observer.observe(counter);
  });
}

function animateCounter(element) {
  const finalValue = parseInt(element.textContent);
  if (isNaN(finalValue)) return;

  let currentValue = 0;
  const step = Math.ceil(finalValue / 50);
  const speed = 30;

  const interval = setInterval(() => {
    currentValue += step;
    if (currentValue >= finalValue) {
      currentValue = finalValue;
      clearInterval(interval);
    }
    element.textContent = currentValue + '%';
  }, speed);
}

// ============================================
// FORM INTERACTIONS
// ============================================

function setupFormInteractions() {
  const formInputs = document.querySelectorAll('.form-control');

  formInputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.style.transform = 'scale(1.02)';
      this.style.boxShadow = '0 0 30px rgba(111, 52, 254, 0.4)';
    });

    input.addEventListener('blur', function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = 'none';
    });
  });
}

// ============================================
// LAZY LOADING
// ============================================

function setupLazyLoading() {
  const images = document.querySelectorAll('img[data-lazy]');

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute('data-lazy');
        img.removeAttribute('data-lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => {
    imageObserver.observe(img);
  });
}

// ============================================
// INITIALIZE ALL ON LOAD
// ============================================

window.addEventListener('load', function() {
  setupCounterAnimation();
  setupFormInteractions();
  setupLazyLoading();

  // Trigger AOS refresh
  setTimeout(() => {
    AOS.refresh();
  }, 100);
});

// ============================================
// PORTFOLIO FILTER (Original Functionality)
// ============================================

$(document).ready(function() {
  $(".filter-item").click(function() {
    const value = $(this).attr("data-filter");

    // Update active button
    $(".filter-item").removeClass("active");
    $(this).addClass("active");

    if (value == "all") {
      $(".post").fadeIn(500);
    } else {
      $(".post")
        .not("." + value)
        .fadeOut(300);
      $(".post")
        .filter("." + value)
        .fadeIn(500);
    }
  });

  // Add click animation to filter buttons
  $(".filter-item").hover(
    function() {
      $(this).css({
        "color": "#fca61f",
        "transform": "scale(1.1)",
        "transition": "all 0.3s ease"
      });
    },
    function() {
      $(this).css({
        "color": "inherit",
        "transform": "scale(1)"
      });
    }
  );
});

// ============================================
// NAVBAR STICKY ON SCROLL
// ============================================

document.addEventListener("DOMContentLoaded", function() {
  const navbar = document.getElementById('navbar-top');

  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('fixed-top');
      document.body.style.paddingTop = navbar.offsetHeight + 'px';
    } else {
      navbar.classList.remove('fixed-top');
      document.body.style.paddingTop = '0';
    }
  });
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Debounce function for scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounce to expensive scroll listeners
const debouncedScroll = debounce(() => {
  updateActiveNavLink();
}, 100);

window.addEventListener('scroll', debouncedScroll);

// ============================================
// PROJECT MODAL FUNCTIONALITY
// ============================================

const projectData = {
  1: {
    title: "me2u-transit",
    subtitle: "Secure Remote Transaction Platform",
    description: "A comprehensive platform enabling secure transactions between geographically distant buyers and sellers (e.g., Yaoundé to Douala). Built with advanced process orchestration using Camunda 8 and Zeebe for workflow management, integrated with Agentic AI for decision verification, and deployed on Kubernetes for scalability.",
    images: [
      "images/currency-converter.png",
      "images/dictionary.png",
      "images/2048game.png"
    ],
    stats: [
      { value: "100%", label: "Risk Reduction" },
      { value: "Real-time", label: "Processing" },
      { value: "5TB+", label: "Data Handled" }
    ],
    tech: ["Camunda 8", "Spring Boot", "Kubernetes", "Agentic AI", "OAuth2", "Zeebe", "Flask", "WebSockets"],
    links: [
      { label: "GitHub", icon: "bi-github", url: "https://github.com/Perrin-Nj" },
      { label: "Demo", icon: "bi-play-circle", url: "#" }
    ]
  },
  2: {
    title: "Iwork",
    subtitle: "Freelance Platform on Azure",
    description: "A scalable freelance platform showcasing modern microservices architecture deployed on Microsoft Azure. Features AI integration with Spring AI, GraphQL API, Spring Security for authentication, and Docker containerization. Achieved 75% performance improvement with faster response times.",
    images: [
      "images/tictactoe.png",
      "images/currency-converter.png",
      "images/lang-translator.png"
    ],
    stats: [
      { value: "75%", label: "Performance Boost" },
      { value: "1M+", label: "Requests/Day" },
      { value: "99.9%", label: "Uptime" }
    ],
    tech: ["Spring Boot", "GraphQL", "Azure", "Docker", "Spring AI", "Spring Security", "PostgreSQL", "Kubernetes"],
    links: [
      { label: "Visit", icon: "bi-globe", url: "#" },
      { label: "GitHub", icon: "bi-github", url: "https://github.com/Perrin-Nj" }
    ]
  },
  3: {
    title: "E-Learning Platform",
    subtitle: "Anti-Cheating Assessment System",
    description: "Real-time online assessment system with machine learning-powered cheating detection. Built with Spring Boot backend and Flutter mobile app integrated with ML models using flutter_sensor_plus for detecting anomalies. Successfully deployed at University of Yaoundé 1 with measurable impact on exam integrity.",
    images: [
      "images/piceditor.png",
      "images/2048game.png",
      "images/dictionary.png"
    ],
    stats: [
      { value: "50%", label: "Less Cheating" },
      { value: "10K+", label: "Students" },
      { value: "100+", label: "Exams/Year" }
    ],
    tech: ["Spring Boot", "Flutter", "ML Integration", "CI/CD", "Jenkins", "Docker", "SQLite3", "TensorFlow"],
    links: [
      { label: "Case Study", icon: "bi-file-text", url: "#" },
      { label: "GitHub", icon: "bi-github", url: "https://github.com/Perrin-Nj" }
    ]
  },
  4: {
    title: "Core Banking System",
    subtitle: "Afriland First Bank Integration",
    description: "Enterprise banking system integrating transfer functionalities and transaction validation with role-based access control using Spring Security and OAuth2. Achieved 15% increase in transaction success rates through rigorous validation logic and improved error handling mechanisms.",
    images: [
      "images/lang-translator.png",
      "images/tictactoe.png",
      "images/piceditor.png"
    ],
    stats: [
      { value: "15%", label: "Success Rate ↑" },
      { value: "$2.5B+", label: "Transactions" },
      { value: "50%", label: "Reduced Fraud" }
    ],
    tech: ["Spring Boot", "PostgreSQL", "Spring Security", "RBAC", "OAuth2", "Liquibase", "Kong Gateway", "Keycloak"],
    links: [
      { label: "Impact Report", icon: "bi-file-earmark-pdf", url: "#" },
      { label: "GitHub", icon: "bi-github", url: "https://github.com/Perrin-Nj" }
    ]
  },
  5: {
    title: "BUS Reservation",
    subtitle: "Mobile App Leadership",
    description: "Modern bus reservation system built with Flutter and Firebase, led a team of 5 developers applying SOLID principles and SDLC methodology. Achieved 25% improvement in team productivity through structured project management using Gantt charts and agile practices.",
    images: [
      "images/dictionary.png",
      "images/currency-converter.png",
      "images/2048game.png"
    ],
    stats: [
      { value: "5", label: "Team Members" },
      { value: "25%", label: "Productivity ↑" },
      { value: "50K+", label: "Active Users" }
    ],
    tech: ["Flutter", "Firebase", "SOLID", "Agile", "Git", "SDLC", "Redux", "Dart"],
    links: [
      { label: "Live Demo", icon: "bi-phone", url: "#" },
      { label: "GitHub", icon: "bi-github", url: "https://github.com/Perrin-Nj" }
    ]
  },
  6: {
    title: "Sudoku Game",
    subtitle: "Algorithm Optimization",
    description: "High-performance Sudoku solver implemented with JavaFX featuring advanced backtracking algorithm and 2-4 tree data structure for optimal performance. Achieved 50% improvement in lookup times and overall application responsiveness through algorithmic optimization.",
    images: [
      "images/2048game.png",
      "images/piceditor.png",
      "images/lang-translator.png"
    ],
    stats: [
      { value: "50%", label: "Faster Lookups" },
      { value: "<100ms", label: "Solve Time" },
      { value: "Java", label: "Performance" }
    ],
    tech: ["JavaFX", "Backtracking", "SQLite3", "Algorithm Design", "Data Structures", "Java", "OOP"],
    links: [
      { label: "GitHub", icon: "bi-github", url: "https://github.com/Perrin-Nj" },
      { label: "Download", icon: "bi-download", url: "#" }
    ]
  }
};

function setupProjectModal() {
  const projectCards = document.querySelectorAll('.project-card');
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('closeModal');

  projectCards.forEach(card => {
    card.addEventListener('click', function() {
      const projectId = this.getAttribute('data-project-id');
      openProjectModal(projectId);
    });
  });

  closeBtn.addEventListener('click', function() {
    closeProjectModal();
  });

  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeProjectModal();
    }
  });

  // Keyboard close
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeProjectModal();
    }
  });
}

function openProjectModal(projectId) {
  const project = projectData[projectId];
  if (!project) return;

  const modal = document.getElementById('projectModal');
  const imagesContainer = document.getElementById('projectImages');
  const contentContainer = document.getElementById('projectContent');

  // Build images carousel
  let imagesHTML = '<div class="project-modal-carousel">';
  project.images.forEach((img, index) => {
    imagesHTML += `<img src="${img}" alt="Project image ${index + 1}" class="carousel-image" style="display: ${index === 0 ? 'block' : 'none'};" data-image-index="${index}">`;
  });
  imagesHTML += '</div>';

  // Build carousel dots
  imagesHTML += '<div class="carousel-controls">';
  project.images.forEach((_, index) => {
    imagesHTML += `<div class="carousel-dot ${index === 0 ? 'active' : ''}" data-dot-index="${index}"></div>`;
  });
  imagesHTML += '</div>';

  imagesContainer.innerHTML = imagesHTML;

  // Build content
  let contentHTML = `<h2 class="project-modal-title">${project.title}</h2>
    <p class="project-modal-subtitle">${project.subtitle}</p>
    <p class="project-modal-description">${project.description}</p>

    <div class="project-modal-stats">`;

  project.stats.forEach(stat => {
    contentHTML += `<div class="modal-stat">
      <div class="modal-stat-value">${stat.value}</div>
      <div class="modal-stat-label">${stat.label}</div>
    </div>`;
  });

  contentHTML += `</div>

    <div class="project-modal-tech">
      <span class="tech-label">Technologies Used</span>
      <div class="tech-tags-modal">`;

  project.tech.forEach(tech => {
    contentHTML += `<span class="tech-tag-modal">${tech}</span>`;
  });

  contentHTML += `</div></div>

    <div class="project-modal-links">`;

  project.links.forEach(link => {
    contentHTML += `<a href="${link.url}" class="project-link-btn" target="_blank" rel="noopener noreferrer">
      <i class="bi ${link.icon}"></i>
      ${link.label}
    </a>`;
  });

  contentHTML += '</div>';

  contentContainer.innerHTML = contentHTML;

  // Add carousel functionality
  setupCarouselControls();

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function setupCarouselControls() {
  const images = document.querySelectorAll('.carousel-image');
  const dots = document.querySelectorAll('.carousel-dot');

  dots.forEach((dot, index) => {
    dot.addEventListener('click', function() {
      showImage(index, images, dots);
    });
  });
}

function showImage(index, images, dots) {
  images.forEach(img => img.style.display = 'none');
  dots.forEach(dot => dot.classList.remove('active'));

  images[index].style.display = 'block';
  dots[index].classList.add('active');
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
  setupProjectModal();
  setupTestimonialsCarousel();
});

// ============================================
// AUTO-SCROLLING TESTIMONIALS CAROUSEL
// ============================================

function setupTestimonialsCarousel() {
  const carousel = document.getElementById('testimonialsCarousel');
  const indicatorsContainer = document.getElementById('testimonialsIndicators');

  if (!carousel) return;

  const cards = carousel.querySelectorAll('.testimonial-card');
  const cardCount = cards.length;
  const isMobile = window.innerWidth <= 768;

  // Create indicator dots
  for (let i = 0; i < cardCount; i++) {
    const dot = document.createElement('div');
    dot.className = `testimonial-dot ${i === 0 ? 'active' : ''}`;
    dot.addEventListener('click', function() {
      pauseScroll();
      scrollToCard(i);
    });
    indicatorsContainer.appendChild(dot);
  }

  let scrollPosition = 0;
  let scrollTimeout;
  let rafId;

  function updateIndicator() {
    const dots = document.querySelectorAll('.testimonial-dot');
    const itemsPerView = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
    const currentIndex = Math.round(scrollPosition / (100 / itemsPerView)) % cardCount;

    dots.forEach((dot, index) => {
      dot.classList.remove('active');
      if (index === currentIndex) {
        dot.classList.add('active');
      }
    });
  }

  function pauseScroll() {
    carousel.style.animationPlayState = 'paused';
    clearTimeout(scrollTimeout);
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
  }

  function resumeScroll() {
    carousel.style.animationPlayState = 'running';
    scrollTimeout = setTimeout(resumeScroll, 10000);
  }

  function scrollToCard(index) {
    const itemsPerView = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
    scrollPosition = index % cardCount;
    updateIndicator();
    resumeScroll();
  }

  // Auto-resume after interaction
  carousel.addEventListener('mouseenter', pauseScroll);
  carousel.addEventListener('mouseleave', resumeScroll);

  // Optimize animation frame updates - only update every 100ms on mobile
  let lastUpdate = 0;
  const updateInterval = isMobile ? 200 : 100;

  function animationFrame(timestamp) {
    if (timestamp - lastUpdate >= updateInterval) {
      updateIndicator();
      lastUpdate = timestamp;
    }
    rafId = requestAnimationFrame(animationFrame);
  }

  // Only start animation frame if carousel is visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        rafId = requestAnimationFrame(animationFrame);
      } else {
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
      }
    });
  });

  observer.observe(carousel);
}

// ============================================
// CONTACT FORM SUBMISSION (Web3Forms)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const formMessage = document.getElementById('formMessage');

  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Disable submit button
      submitBtn.disabled = true;
      btnText.textContent = 'Sending...';

      // Get form data
      const formData = new FormData(contactForm);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          // Success message
          formMessage.style.display = 'block';
          formMessage.style.color = '#00d084';
          formMessage.style.padding = '12px';
          formMessage.style.borderRadius = '8px';
          formMessage.style.background = 'rgba(0, 208, 132, 0.1)';
          formMessage.style.border = '1px solid rgba(0, 208, 132, 0.3)';
          formMessage.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Thank you! Your message has been sent successfully. I\'ll get back to you soon.';

          // Reset form
          contactForm.reset();

          // Hide message after 5 seconds
          setTimeout(() => {
            formMessage.style.display = 'none';
          }, 5000);
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        // Error message
        formMessage.style.display = 'block';
        formMessage.style.color = '#ea4335';
        formMessage.style.padding = '12px';
        formMessage.style.borderRadius = '8px';
        formMessage.style.background = 'rgba(234, 67, 53, 0.1)';
        formMessage.style.border = '1px solid rgba(234, 67, 53, 0.3)';
        formMessage.innerHTML = '<i class="bi bi-exclamation-circle-fill me-2"></i>Oops! Something went wrong. Please try again or email me directly at njietche.wandji@gmail.com';
      } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        btnText.textContent = 'Send Message';
      }
    });
  }
});
