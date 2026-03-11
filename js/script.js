// ============================================
// 1. Dark Mode Toggle with LocalStorage
// ============================================

const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Function to toggle dark mode
function toggleDarkMode() {
    body.classList.toggle('dark-mode');
    
    // Update icon with animation
    const icon = darkModeToggle.querySelector('i');
    icon.style.transform = 'rotate(180deg)';
    
    setTimeout(() => {
        if (body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
        icon.style.transform = 'rotate(0deg)';
    }, 200);
}

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    darkModeToggle.querySelector('i').classList.remove('fa-moon');
    darkModeToggle.querySelector('i').classList.add('fa-sun');
}

// Add event listener to toggle button
darkModeToggle.addEventListener('click', toggleDarkMode);


// ============================================
// 2. Enhanced Smart Search Functionality
// ============================================

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');

// Get all searchable card containers
const searchableCards = document.querySelectorAll('.col-md-6, .col-lg-4');

// Prevent form submission and perform search
searchForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent page reload
    performSearch();
});

// Search on keyup for real-time filtering
searchInput.addEventListener('keyup', function () {
    performSearch();
});

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    // Remove previous highlights
    document.querySelectorAll('.search-highlight').forEach(el => {
        const parent = el.parentNode;
        parent.replaceChild(document.createTextNode(el.textContent), el);
        parent.normalize();
    });

    searchableCards.forEach(card => {
        // Get all text content from the card
        const cardText = card.innerText.toLowerCase();
        
        // Show/hide based on search term
        if (cardText.includes(searchTerm) || searchTerm === '') {
            card.style.display = ''; // Show element (default)
            card.classList.add('visible');
        } else {
            card.style.display = 'none'; // Hide element
            card.classList.remove('visible');
        }
    });

    // Highlight search terms in visible cards
    if (searchTerm !== '') {
        highlightSearchTerms(searchTerm);
    }

    // Show "no results" message if needed
    let anyVisible = Array.from(searchableCards).some(card => card.style.display !== 'none');
    let noResultsMsg = document.getElementById('noResultsMessage');
    
    if (!anyVisible && searchTerm !== '') {
        // Create no results message if it doesn't exist
        if (!noResultsMsg) {
            const mainContainer = document.querySelector('main');
            const msg = document.createElement('div');
            msg.id = 'noResultsMessage';
            msg.className = 'alert alert-warning mt-3';
            msg.role = 'alert';
            msg.innerHTML = `<i class="fas fa-exclamation-triangle me-2"></i>No results found for "${searchTerm}".`;
            mainContainer.appendChild(msg);
            
            // Add fade in animation
            msg.style.animation = 'fadeIn 0.3s ease-in-out';
        } else {
            // Update existing message with new search term
            noResultsMsg.innerHTML = `<i class="fas fa-exclamation-triangle me-2"></i>No results found for "${searchTerm}".`;
        }
    } else {
        // Remove no results message if results exist
        if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }
}

// Function to highlight search terms
function highlightSearchTerms(term) {
    searchableCards.forEach(card => {
        if (card.style.display !== 'none') {
            const walker = document.createTreeWalker(
                card,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
            
            const nodesToReplace = [];
            while (walker.nextNode()) {
                const node = walker.currentNode;
                if (node.nodeValue.toLowerCase().includes(term) && !node.parentNode.classList.contains('search-highlight')) {
                    nodesToReplace.push(node);
                }
            }
            
            nodesToReplace.forEach(node => {
                const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
                const span = document.createElement('span');
                span.innerHTML = node.nodeValue.replace(regex, '<span class="search-highlight">$1</span>');
                node.parentNode.replaceChild(span, node);
            });
        }
    });
}

// Escape special regex characters
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


// ============================================
// 3. Enhanced Copy Template Functionality
// ============================================

document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Find the template div (previous sibling)
        const templateDiv = this.previousElementSibling;
        
        // Get the text to copy from the template
        const textToCopy = templateDiv.querySelector('p:last-child').innerText;
        
        // Copy to clipboard
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Show success feedback with animation
            const originalHTML = this.innerHTML;
            const originalClass = this.className;
            
            this.innerHTML = '<i class="fas fa-check me-1"></i>Copied!';
            this.classList.remove('btn-outline-primary', 'btn-outline-warning', 'btn-outline-success', 'btn-outline-info', 'btn-outline-teal', 'btn-outline-coral', 'btn-outline-indigo', 'btn-outline-red');
            this.classList.add('btn-success');
            
            // Add bounce animation
            this.style.animation = 'bounce 0.5s ease';
            
            // Reset after 2 seconds
            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.className = originalClass;
                this.style.animation = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            // Show success feedback
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check me-1"></i>Copied!';
            setTimeout(() => {
                this.innerHTML = originalHTML;
            }, 2000);
        });
    });
});


// ============================================
// 4. Smooth Scrolling Navigation
// ============================================

document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href'); // e.g., #it-general
        
        if (targetId && targetId !== '#' && targetId.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        }
    });
});


// ============================================
// 5. Auto-Update Footer Year
// ============================================

const footerYear = document.querySelector('footer .container p');
if (footerYear) {
    const currentYear = new Date().getFullYear();
    footerYear.innerHTML = footerYear.innerHTML.replace('2025', currentYear);
}


// ============================================
// 6. Active Nav Link Highlighting
// ============================================

// Highlight current section in navbar based on scroll position
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('#tickets-guide, #useful-links, #it-general');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        
        if (linkHref === '#' + current) {
            link.classList.add('active');
        }
    });
});


// ============================================
// 7. Staggered Card Animation on Load
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.col-md-6, .col-lg-4');
    
    cards.forEach((card, index) => {
        card.classList.add('card-animate');
        
        // Staggered animation with shorter delay
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 80);
    });
    
    // Animate welcome alert
    const welcomeAlert = document.querySelector('.alert');
    if (welcomeAlert) {
        welcomeAlert.style.animation = 'fadeInUp 0.5s ease-out';
    }
    
    // Animate section headers
    document.querySelectorAll('h2.border-bottom').forEach((header, index) => {
        header.style.opacity = '0';
        header.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            header.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            header.style.opacity = '1';
            header.style.transform = 'translateX(0)';
        }, 300 + (index * 150));
    });
});


// ============================================
// 8. Keyboard Shortcuts
// ============================================

// Press '/' to focus search input
document.addEventListener('keydown', function(e) {
    // Check if '/' is pressed and not in an input field
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInput.focus();
    }
    
    // Press 'Escape' to clear search and blur input
    if (e.key === 'Escape') {
        searchInput.blur();
        if (searchInput.value !== '') {
            searchInput.value = '';
            performSearch();
        }
    }
});


// ============================================
// 9. External Link Handler
// ============================================

// Add target="_blank" to external links automatically
document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.href.includes(window.location.hostname)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        
        // Add external link icon
        if (!link.querySelector('.external-icon')) {
            const icon = document.createElement('i');
            icon.className = 'fas fa-external-link-alt ms-1 external-icon';
            icon.style.fontSize = '0.75rem';
            link.appendChild(icon);
        }
    }
});


// ============================================
// 10. Accordion - Close others when opening one
// ============================================

document.querySelectorAll('.accordion-collapse').forEach(accordion => {
    accordion.addEventListener('show.bs.collapse', function() {
        const accordionId = this.getAttribute('data-bs-parent');
        if (accordionId) {
            document.querySelectorAll(accordionId + ' .accordion-collapse.show').forEach(openAccordion => {
                if (openAccordion !== this) {
                    openAccordion.classList.remove('show');
                }
            });
        }
    });
});


// ============================================
// 11. Smooth Scroll Indicator Animation
// ============================================

// Add scroll progress indicator
window.addEventListener('scroll', function() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    // Create or update scroll progress bar
    let progressBar = document.querySelector('.scroll-progress-bar');
    
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress-bar';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #00a896, #02c39a);
            z-index: 9999;
            transition: width 0.1s ease;
            box-shadow: 0 0 10px rgba(0, 168, 150, 0.5);
        `;
        document.body.appendChild(progressBar);
    }
    
    progressBar.style.width = scrolled + '%';
});


// ============================================
// 12. Navbar background on scroll
// ============================================

window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 168, 150, 0.3)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 168, 150, 0.15)';
    }
});


// ============================================
// 13. Card click to expand (mobile)
// ============================================

if (window.innerWidth < 768) {
    document.querySelectorAll('.card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function(e) {
            // Only trigger if not clicking on a link or button
            if (!e.target.closest('a') && !e.target.closest('button') && !e.target.closest('.copy-btn')) {
                this.classList.toggle('expanded');
            }
        });
    });
}

