document.addEventListener('DOMContentLoaded', () => {
  // Get all sections and nav links
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Set initial active section and nav link
  if (document.querySelector('.active-section') === null) {
    document.getElementById('home').classList.add('active-section');
    document.querySelector('a[href="#home"]').classList.add('active');
  }
  
  // Smooth section transitions
  function changeSection(targetId) {
    const currentSection = document.querySelector('.active-section');
    const targetSection = document.getElementById(targetId);
  
    if (currentSection === targetSection) return;
  
    // Fade out current section
    currentSection.style.opacity = '0';
    currentSection.style.transform = 'translateY(-30px)';
  
    // Wait for fade out, then switch
    setTimeout(() => {
      currentSection.classList.remove('active-section');
      currentSection.style.display = 'none';
      currentSection.style.transform = '';
      
      targetSection.style.display = 'block';
      targetSection.classList.add('active-section');
      targetSection.style.opacity = '0';
      targetSection.style.transform = 'translateY(30px)';
  
      const animatedElements = targetSection.querySelectorAll(
        '.hero > *, .timeline-item'
      );
  
      animatedElements.forEach((el, index) => {
        el.style.animation = 'none';
        el.offsetHeight; // force reflow
        el.style.animation = `fadeIn 0.8s ease forwards ${index * 0.15}s`;
      });
  
      // Fade in
      setTimeout(() => {
        targetSection.style.opacity = '1';
        targetSection.style.transform = 'translateY(0)';
      }, 50);
    }, 300);
  
    // Nav link highlight
    document.querySelector('.nav-link.active')?.classList.remove('active');
    document.querySelector(`a[href="#${targetId}"]`).classList.add('active');
  
    // Update theme class
    document.body.className = `theme-${targetId}`;
  }
  
  // Section navigation
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      changeSection(targetId);
      
      // Scroll to top smoothly
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });

  // Event tracking with enhanced data
  document.addEventListener('click', (e) => {
    const timestamp = new Date().toISOString();
    const tagName = e.target.tagName.toLowerCase();
    const className = e.target.className;
    const sectionId = getCurrentSectionId();
    
    let eventType = 'click';
    if (e.target.classList.contains('nav-link')) eventType = 'navigation';
    if (e.target.id === 'theme-toggle') eventType = 'theme-change';
    
    console.log(`${timestamp}, ${eventType}, ${tagName}, ${className}, section: ${sectionId}`);
  });

  // Helper function to get current section ID
  function getCurrentSectionId() {
    return document.querySelector('.active-section').id;
  }

  // Intersection Observer for section views with smoother threshold
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
        const timestamp = new Date().toISOString();
        console.log(`${timestamp}, view, ${entry.target.id}, visibility: ${Math.round(entry.intersectionRatio * 100)}%`);
      }
    });
  }, { threshold: [0.1, 0.5, 0.7, 0.9] });

  sections.forEach(section => {
    observer.observe(section);
  });

  // Initial setup for smooth section appearances
  sections.forEach((section, index) => {
    if (!section.classList.contains('active-section')) {
      section.style.display = 'none';
      section.style.opacity = '0';
    } else {
      // Initialize animations for active section elements
      const animatedElements = section.querySelectorAll('.hero > *, .timeline-item');
      animatedElements.forEach((el, i) => {
        el.style.animation = `fadeIn 0.8s ease forwards ${i * 0.15}s`;
      });
    }
  });

  // Parallax scroll effects
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Only apply to active section
    const activeSection = document.querySelector('.active-section');
    if (!activeSection) return;
    
    // Apply subtle parallax to section backgrounds
    activeSection.style.backgroundPositionY = `${scrollY * 0.05}px`;
    
    // Handle section-specific parallax effects
    if (activeSection.id === 'home') {
      const heroImg = activeSection.querySelector('.profile-img');
      if (heroImg) {
        heroImg.style.transform = `translateY(${scrollY * 0.05}px)`;
      }
    }
  });

  // Add keyboard navigation for sections
  document.addEventListener('keydown', (e) => {
    const activeSection = document.querySelector('.active-section');
    const sections = Array.from(document.querySelectorAll('section'));
    const currentIndex = sections.indexOf(activeSection);
    
    // Navigate with arrow keys
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      // Next section
      const nextIndex = (currentIndex + 1) % sections.length;
      const nextId = sections[nextIndex].id;
      changeSection(nextId);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      // Previous section
      const prevIndex = (currentIndex - 1 + sections.length) % sections.length;
      const prevId = sections[prevIndex].id;
      changeSection(prevId);
    }
  });
});