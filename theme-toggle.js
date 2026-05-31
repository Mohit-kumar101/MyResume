// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const currentTheme = localStorage.getItem('theme') || 'light';
body.className = currentTheme === 'dark' ? 'dark' : '';
themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  const isDark = body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
});

// Active Section Detection
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar a');

function updateActiveLink() {
  const scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active-link');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveLink);

// Mobile Menu
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navMenu = document.getElementById('nav-menu');

mobileMenuBtn.addEventListener('click', () => {
  mobileMenuBtn.classList.toggle('active');
  navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenuBtn.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// Contact Form
const contactForm = document.getElementById('contact-form');
const submitBtn = contactForm.querySelector('.contact-submit');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoading = submitBtn.querySelector('.btn-loading');

function validateField(field, errorElement) {
  const value = field.value.trim();
  let isValid = true;
  let errorMessage = '';
  field.classList.remove('error');
  errorElement.textContent = '';

  if (!value) {
    isValid = false;
    errorMessage = 'This field is required';
  } else {
    if (field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }
    if (field.id === 'name' && value.length < 2) {
      isValid = false;
      errorMessage = 'Name must be at least 2 characters long';
    }
    if (field.id === 'message' && value.length < 10) {
      isValid = false;
      errorMessage = 'Message must be at least 10 characters long';
    }
  }

  if (!isValid) {
    field.classList.add('error');
    errorElement.textContent = errorMessage;
  }
  return isValid;
}

contactForm.querySelectorAll('input, textarea').forEach(field => {
  field.addEventListener('blur', () => {
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) validateField(field, errorElement);
  });
  field.addEventListener('input', () => {
    if (field.classList.contains('error')) {
      const errorElement = document.getElementById(`${field.id}-error`);
      if (errorElement) validateField(field, errorElement);
    }
  });
});

contactForm.addEventListener('submit', (e) => {
  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const messageField = document.getElementById('message');
  const nameValid = validateField(nameField, document.getElementById('name-error'));
  const emailValid = validateField(emailField, document.getElementById('email-error'));
  const messageValid = validateField(messageField, document.getElementById('message-error'));

  if (!nameValid || !emailValid || !messageValid) {
    e.preventDefault();
    return;
  }

  btnText.style.display = 'none';
  btnLoading.style.display = 'inline-flex';
  submitBtn.disabled = true;
});

// Console Contact
const consoleContactBtn = document.getElementById('console-contact-btn');
const consoleOutput = document.getElementById('console-output');

consoleContactBtn.addEventListener('click', () => {
  consoleOutput.style.display = 'block';
  consoleOutput.innerHTML = `// WMS Contact Query
const dispatch = {
  name: "Mohit Kumar",
  id: "MK-2025",
  email: "mohit.k3089@gmail.com",
  github: "https://github.com/Mohit-kumar101",
  linkedin: "https://www.linkedin.com/in/mohit-k-12b941275/",
  hub: "Vancouver, BC",
  status: "AVAILABLE"
};

console.log("Dispatch center online — ready to receive shipments!");
console.log("Contact:", dispatch.email);`;
});

// Interactive Course Details
document.querySelectorAll('.course-title.interactive-course').forEach(course => {
  course.addEventListener('click', () => {
    const details = course.nextElementSibling;
    const isVisible = details.style.display === 'block';
    details.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) details.style.animation = 'fadeInUp 0.3s ease-out';
  });
  course.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      course.click();
    }
  });
});

// SKU Barcode Scanner System
const skuTags = document.querySelectorAll('.sku-tag');
const scannerReader = document.getElementById('scanner-reader');
const scannerContent = document.getElementById('scanner-content');
const scannerZone = document.getElementById('scanner-zone');
const scannerStatus = document.querySelector('.scanner-status');

const zoneNames = {
  A: 'Frontend Bay',
  B: 'Backend Dock',
  C: 'Data Storage',
  D: 'DevOps / Tools',
  E: 'CS Fundamentals'
};

let activeScanId = 0;
let hoverTimer = null;

function generateBarcode(skill) {
  const hash = skill.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return `MK-${hash.toString().padStart(6, '0')}-SKU`;
}

function setScannerStatus(text, scanning = false) {
  if (!scannerStatus) return;
  scannerStatus.innerHTML = scanning
    ? `<i class="fa-solid fa-circle"></i> ${text}`
    : `<i class="fa-solid fa-circle"></i> ${text}`;
}

function scanSKU(tag) {
  if (!scannerReader || !scannerContent || !scannerZone) return;

  const skill = tag.dataset.skill;
  const desc = tag.dataset.desc;
  const zoneCard = tag.closest('.zone-card');
  if (!skill || !desc || !zoneCard) return;

  const zone = zoneCard.dataset.zone;
  const scanId = ++activeScanId;

  skuTags.forEach(t => t.classList.remove('active'));
  tag.classList.add('active');

  scannerReader.classList.add('scanning');
  setScannerStatus('SCANNING...', true);
  scannerContent.innerHTML = `
    <div class="scanner-idle"><i class="fa-solid fa-spinner fa-spin"></i><p>Scanning ${skill}...</p></div>
  `;

  setTimeout(() => {
    if (scanId !== activeScanId) return;

    scannerReader.classList.remove('scanning');
    scannerZone.textContent = `Zone: ${zone} — ${zoneNames[zone] || 'Unknown'}`;
    setScannerStatus('SCAN COMPLETE');
    scannerContent.innerHTML = `
      <div class="scan-result">
        <div class="scan-barcode">${generateBarcode(skill)}</div>
        <h4><i class="fa-solid fa-circle-check" style="color:#4ade80"></i> ${skill}</h4>
        <p>${desc}</p>
      </div>
    `;

    setTimeout(() => {
      if (scanId === activeScanId) setScannerStatus('SCANNER READY');
    }, 2000);
  }, 800);
}

skuTags.forEach(tag => {
  tag.addEventListener('click', () => scanSKU(tag));

  tag.addEventListener('mouseenter', () => {
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => scanSKU(tag), 200);
  });

  tag.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimer);
  });

  tag.addEventListener('focus', () => scanSKU(tag));

  tag.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scanSKU(tag);
    }
  });
});

// Code Preview Buttons
document.querySelectorAll('.code-preview-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const projectCard = btn.closest('.project-card-advanced');
    const codePreview = projectCard.querySelector('.code-preview');
    const isVisible = codePreview.style.display === 'block';
    codePreview.style.display = isVisible ? 'none' : 'block';
    btn.innerHTML = isVisible
      ? '<i class="fa-solid fa-code"></i> Manifest'
      : '<i class="fa-solid fa-eye-slash"></i> Hide';
    if (!isVisible) codePreview.style.animation = 'fadeInUp 0.3s ease-out';
  });
});

// WMS Terminal
const runDemoBtn = document.getElementById('run-demo');
const clearTerminalBtn = document.getElementById('clear-terminal');
const helpBtn = document.getElementById('help-btn');
const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');

if (runDemoBtn && clearTerminalBtn && helpBtn && terminalOutput && terminalInput) {
  const terminalCommands = {
    'scan': 'wms-demo',
    'demo': 'wms-demo',
    'inventory': 'skills-output',
    'skills': 'skills-output',
    'shipments': 'projects-output',
    'projects': 'projects-output',
    'dispatch': 'contact-output',
    'contact': 'contact-output',
    'manifest': 'about-output',
    'about': 'about-output',
    'clear': 'clear',
    'help': 'help-output'
  };

  function addOutputLine(text, delay = 0) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const line = document.createElement('div');
        line.className = 'output-line';
        line.textContent = text;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        resolve();
      }, delay);
    });
  }

  async function executeCommand(command) {
    const outputId = terminalCommands[command];

    if (!outputId) {
      await addOutputLine(`[ERROR] Unknown command: '${command}'. Type 'help' for available commands.`);
      return;
    }

    if (outputId === 'clear') {
      terminalOutput.innerHTML = '';
      await addOutputLine('[WMS] Terminal cleared.');
      return;
    }

    const outputElement = document.getElementById(outputId);
    if (outputElement) {
      const lines = outputElement.querySelectorAll('.output-line');
      for (const line of lines) {
        await addOutputLine(line.textContent, 80);
      }
    }
  }

  function handleTerminalInput() {
    const command = terminalInput.value.trim().toLowerCase();
    if (command) {
      addOutputLine(`wms> ${command}`);
      executeCommand(command);
      terminalInput.value = '';
    }
  }

  async function runInventoryScan() {
    terminalOutput.innerHTML = '';
    terminalInput.value = 'scan --full';
    await addOutputLine('wms> scan --full', 400);
    await addOutputLine('[WMS] Initializing barcode scanner...', 300);
    await addOutputLine('[WMS] Scanning all warehouse zones...', 400);
    await executeCommand('scan');
    terminalInput.value = '';
  }

  runDemoBtn.addEventListener('click', runInventoryScan);

  clearTerminalBtn.addEventListener('click', async () => {
    terminalOutput.innerHTML = '';
    terminalInput.value = '';
    await addOutputLine('[WMS] Terminal cleared.');
  });

  helpBtn.addEventListener('click', () => executeCommand('help'));

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTerminalInput();
    }
  });

  const terminalContent = document.querySelector('.terminal-content');
  if (terminalContent) {
    terminalContent.addEventListener('click', () => terminalInput.focus());
  }

  window.addEventListener('load', () => {
    setTimeout(runInventoryScan, 2000);
  });
}

// Warehouse Stats Counter
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.warehouse-stats');
if (statsEl) statObserver.observe(statsEl);

// Scroll-triggered animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      setTimeout(() => {
        if (!entry.isIntersecting) entry.target.classList.remove('visible');
      }, 100);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('section, .fade-in, .timeline-item, .fade-in-contact, .zone-card').forEach(el => {
  observer.observe(el);
});

// Zone cards visible on scroll
const zoneObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.zone-card').forEach(card => zoneObserver.observe(card));
