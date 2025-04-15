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
        currentSection.style.display = 'none'; // <-- hide the old one
        currentSection.style.transform = '';
        
        targetSection.style.display = 'block'; // <-- make target visible
        targetSection.classList.add('active-section');
        targetSection.style.opacity = '0'; // Start from 0
        targetSection.style.transform = 'translateY(30px)'; // Optional
    
        const animatedElements = targetSection.querySelectorAll(
          '.hero > *, .gallery-item, .timeline-item, .analytics-container, .cv-container'
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
  
    // Enhanced text analysis
// Enhanced text analysis with minimum word count check
// Enhanced text analysis with minimum word count check
window.analyzeText = function() {
  const input = document.getElementById("text-input").value;
  const resultContainer = document.getElementById("results");
  
  // Count words first
  const wordCount = input.split(/\s+/).filter(w => w).length;
  
  // Check if word count is less than 10,000
  if (wordCount < 10000) {
    resultContainer.innerHTML = `
      <div class="result-card">
        <h3>Minimum Word Count Not Met</h3>
        <p>This text contains only ${wordCount} words. Analysis requires at least 10,000 words.</p>
        <p>Please add more content or use the "Load Sample Text" button.</p>
      </div>
    `;
    return; // Exit the function
  }
  
  // Show loading state
  resultContainer.innerHTML = `
    <div class="result-card">
      <h3>Processing</h3>
      <p>Analyzing ${input.length} characters of text...</p>
    </div>
  `;
  
  // Use setTimeout to avoid UI freezing with large text
  setTimeout(() => {
    // Basic counts
    const letters = input.replace(/[^a-zA-Z]/g, '').length;
    const words = wordCount; // We already calculated this
    const spaces = (input.match(/\s/g) || []).length;
    const newlines = (input.match(/\n/g) || []).length;
    const special = input.replace(/[\w\s]/g, '').length;
    
    // Word frequency analysis
    const wordFrequency = {};
    input.toLowerCase().match(/\b\w+\b/g)?.forEach(word => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });
    
    // Linguistic analysis
    const pronouns = ['i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'];
    const prepositions = ['in', 'on', 'at', 'by', 'with', 'about', 'above', 'below', 'during', 'for'];
    const articles = ['a', 'an', 'the'];
    
    const counts = {
      pronouns: {},
      prepositions: {},
      articles: {}
    };
    
    input.toLowerCase().split(/\s+/).forEach(word => {
      word = word.replace(/[^a-z]/g, '');
      if (pronouns.includes(word)) counts.pronouns[word] = (counts.pronouns[word] || 0) + 1;
      if (prepositions.includes(word)) counts.prepositions[word] = (counts.prepositions[word] || 0) + 1;
      if (articles.includes(word)) counts.articles[word] = (counts.articles[word] || 0) + 1;
    });
    
    // Average word length
    const totalWordLength = input.match(/\b\w+\b/g)?.reduce((sum, word) => sum + word.length, 0) || 0;
    
    // Display results with improved visual feedback
    resultContainer.innerHTML = `
      <div class="result-card">
        <h3>Basic Statistics</h3>
        <p>Letters: ${letters}</p>
        <p>Words: ${words}</p>
        <p>Spaces: ${spaces}</p>
        <p>Newlines: ${newlines}</p>
        <p>Special Characters: ${special}</p>
      </div>
      <div class="result-card">
        <h3>Indefinite Articles</h3>
        ${Object.entries(counts.articles).map(([word, count]) => `
          <p>${word}: ${count}</p>
        `).join('')}
      </div>
      <div class="result-card">
        <h3>Pronouns</h3>
        ${Object.entries(counts.pronouns).map(([word, count]) => `
          <p>${word}: ${count}</p>
        `).join('')}
      </div>
      <div class="result-card">
        <h3>Prepositions</h3>
        ${Object.entries(counts.prepositions).map(([word, count]) => `
          <p>${word}: ${count}</p>
        `).join('')}
      </div>
    `;
    
    // Add animation class to results
    document.querySelectorAll('.result-card').forEach((card, index) => {
      card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
      card.style.opacity = '0';
    });
    
  }, 100); // Short delay to allow UI to update
}

  // Theme toggle with improved animation
  const themeToggle = document.getElementById("theme-toggle");
  const root = document.documentElement;
  
  themeToggle.addEventListener("click", () => {
    // Store current position
    const scrollPos = window.scrollY;
    
    // Add transition class for smooth color changes
    document.body.classList.add('theme-transitioning');
    
    const currentTheme = root.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    // Change theme icon with animation
    themeToggle.style.transform = "rotate(180deg)";
    setTimeout(() => {
      themeToggle.textContent = newTheme === "dark" ? "🌙" : "☀️";
      themeToggle.style.transform = "rotate(0deg)";
    }, 200);
    
    // Apply new theme
    root.setAttribute("data-theme", newTheme);
    
    // Remove transition class after colors have changed
    setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 500);
    
    // Maintain scroll position
    window.scrollTo(0, scrollPos);
  });
  
  // Initial setup for smooth section appearances
  sections.forEach((section, index) => {
    if (!section.classList.contains('active-section')) {
      section.style.display = 'none';
      section.style.opacity = '0';
    } else {
      // Initialize animations for active section elements
      const animatedElements = section.querySelectorAll('.hero > *, .gallery-item, .timeline-item, .analytics-container, .cv-container');
      animatedElements.forEach((el, i) => {
        el.style.animation = `fadeIn 0.8s ease forwards ${i * 0.15}s`;
      });
    }
  });
  
  // Gallery image enhanced hover effects
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      const img = item.querySelector('img');
      const overlay = item.querySelector('.overlay');
      
      img.style.transform = 'scale(1.1)';
      overlay.style.opacity = '1';
      overlay.style.transform = 'translateY(0)';
    });
    
    item.addEventListener('mouseleave', () => {
      const img = item.querySelector('img');
      const overlay = item.querySelector('.overlay');
      
      img.style.transform = 'scale(1.0)';
      overlay.style.opacity = '0';
      overlay.style.transform = 'translateY(20px)';
    });
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
    } else if (activeSection.id === 'local') {
      const galleryItems = activeSection.querySelectorAll('.gallery-item');
      galleryItems.forEach((item, i) => {
        const factor = 0.03 + (i * 0.01);
        item.style.transform = `translateY(${scrollY * factor}px)`;
      });
    }
  });
  
  // Enhanced button hover effects
  document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-3px)';
      button.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
    });
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
