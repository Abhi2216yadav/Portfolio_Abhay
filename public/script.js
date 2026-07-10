// --- Particles Background ---
particlesJS('particles-js', {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: '#00d2ff' },
    shape: { type: 'circle' },
    opacity: { value: 0.3, random: true },
    size: { value: 3, random: true },
    line_linked: {
      enable: true,
      distance: 150,
      color: '#7b2ff7',
      opacity: 0.2,
      width: 1
    },
    move: {
      enable: true,
      speed: 2,
      direction: 'none',
      random: false,
      straight: false,
      out_mode: 'out'
    }
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: { enable: true, mode: 'grab' },
      onclick: { enable: true, mode: 'push' }
    },
    modes: {
      grab: { distance: 140, line_linked: { opacity: 0.5 } },
      push: { particles_nb: 4 }
    }
  },
  retina_detect: true
});

// --- Typewriter Effect ---
const words = ['Engineering Student', 'Software Developer', 'Tech Enthusiast', 'Problem Solver'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriter = document.querySelector('.typewriter');

function typeEffect() {
  const currentWord = words[wordIndex];
  if (isDeleting) {
    typewriter.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typewriter.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === currentWord.length) {
    isDeleting = true;
    setTimeout(typeEffect, 2000);
    return;
  }

  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(typeEffect, 500);
    return;
  }

  setTimeout(typeEffect, isDeleting ? 50 : 100);
}

typeEffect();

// --- Scroll Reveal Animations ---
function revealOnScroll() {
  const reveals = document.querySelectorAll('.section, .skill-card, .project-card, .timeline-item, .about-text, .contact-container, .achievement-card, .cert-card');
  reveals.forEach(el => {
    el.classList.add('reveal');
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    const revealPoint = 100;
    if (elementTop < windowHeight - revealPoint) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// --- Animated Counters ---
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const speed = 50;
    const updateCount = () => {
      const current = parseInt(counter.innerText);
      const increment = Math.ceil(target / (2000 / speed));
      if (current < target) {
        counter.innerText = current + increment;
        setTimeout(updateCount, speed);
      } else {
        counter.innerText = target + '+';
      }
    };
    updateCount();
  });
}

const aboutSection = document.querySelector('#about');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

observer.observe(aboutSection);

// --- Animated Skill Bars ---
function animateSkills() {
  const skillsSection = document.querySelector('#skills');
  const progressBars = skillsSection.querySelectorAll('.progress div');
  progressBars.forEach(bar => {
    const width = bar.getAttribute('data-width');
    bar.style.width = width;
  });
}

const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateSkills();
      skillsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillsObserver.observe(document.querySelector('#skills'));

// --- Active Nav Link Highlighting ---
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// --- Mobile Menu Toggle ---
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

menuToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
  });
});

// --- Contact Form ---
document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const btn = this.querySelector('button');
  const originalText = btn.innerHTML;
  btn.innerHTML = 'Sending...';
  btn.disabled = true;

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  try {
    const response = await fetch('/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });

    if (response.ok) {
      btn.innerHTML = 'Sent! <i class="fas fa-check"></i>';
      this.reset();
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 3000);
    } else {
      throw new Error('Failed');
    }
  } catch {
    btn.innerHTML = 'Error! <i class="fas fa-times"></i>';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }, 3000);
  }
});
