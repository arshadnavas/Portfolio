// ============================================
// PORTFOLIO SCRIPT
// ============================================

// Mobile Navigation
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {

    hamburger.addEventListener('click', () => {

        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {

        link.addEventListener('click', () => {

            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// ============================================
// ACTIVE NAVIGATION
// ============================================

const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {

    let current = '';

    sections.forEach(section => {

        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop - 200) {

            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {

        link.classList.remove('active');

        if (
            link.getAttribute('href') === `#${current}`
        ) {

            link.classList.add('active');
        }
    });
});

// ============================================
// SMOOTH SCROLL
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener('click', function (e) {

        e.preventDefault();

        const target = document.querySelector(
            this.getAttribute('href')
        );

        if (target) {

            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// SCROLL REVEAL ANIMATION
// ============================================

const revealElements = document.querySelectorAll(
    '.hero-content, .about-content, .skill-category, .project-card, .experience-item, .contact-content'
);

function revealOnScroll() {

    revealElements.forEach(element => {

        const windowHeight = window.innerHeight;
        const revealTop =
            element.getBoundingClientRect().top;

        const revealPoint = 100;

        if (
            revealTop < windowHeight - revealPoint
        ) {

            element.style.opacity = '1';

            element.style.transform =
                'translateY(0)';
        }
    });
}

revealElements.forEach(element => {

    element.style.opacity = '0';

    element.style.transform =
        'translateY(40px)';

    element.style.transition =
        'all 0.8s ease';
});

window.addEventListener(
    'scroll',
    revealOnScroll
);

window.addEventListener(
    'load',
    revealOnScroll
);

// ============================================
// CONTACT FORM
// ============================================

const contactForm =
    document.getElementById('contactForm');

if (contactForm) {

    contactForm.addEventListener(
        'submit',

        async function (e) {

            e.preventDefault();

            const name =
                document.getElementById('name').value;

            const email =
                document.getElementById('email').value;

            const subject =
                document.getElementById('subject').value;

            const message =
                document.getElementById('message').value;

            if (
                !name ||
                !email ||
                !subject ||
                !message
            ) {

                showNotification(
                    'Please fill in all fields',
                    'error'
                );

                return;
            }

            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {

                showNotification(
                    'Please enter a valid email',
                    'error'
                );

                return;
            }

            try {

                const submitBtn =
                    contactForm.querySelector(
                        'button[type="submit"]'
                    );

                const originalText =
                    submitBtn.textContent;

                submitBtn.textContent =
                    'Sending...';

                submitBtn.disabled = true;

                const response =
                    fetch(https://portfolio-snwr.onrender.com/api/contact', {

                        method: 'POST',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body: JSON.stringify({
                            name,
                            email,
                            subject,
                            message
                        })
                    });

                const data =
                    await response.json();

                if (response.ok) {

                    showNotification(
                        'Message sent successfully!',
                        'success'
                    );

                    contactForm.reset();
                }

                else {

                    showNotification(
                        data.error ||
                        'Failed to send message',

                        'error'
                    );
                }

                submitBtn.textContent =
                    originalText;

                submitBtn.disabled = false;
            }

            catch (error) {

                console.error(error);

                showNotification(
                    'Server error occurred',
                    'error'
                );

                const submitBtn =
                    contactForm.querySelector(
                        'button[type="submit"]'
                    );

                submitBtn.textContent =
                    'Send Message';

                submitBtn.disabled = false;
            }
        }
    );
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(message, type) {

    const notification =
        document.createElement('div');

    notification.textContent = message;

    notification.style.position = 'fixed';

    notification.style.top = '25px';

    notification.style.right = '25px';

    notification.style.padding =
        '14px 20px';

    notification.style.borderRadius =
        '16px';

    notification.style.color = 'white';

    notification.style.fontWeight =
        '700';

    notification.style.zIndex = '9999';

    notification.style.backdropFilter =
        'blur(16px)';

    notification.style.border =
        '1px solid rgba(255,255,255,0.08)';

    notification.style.boxShadow =
        '0 20px 50px rgba(0,0,0,0.35)';

    notification.style.transform =
        'translateX(400px)';

    notification.style.transition =
        'all 0.4s ease';

    if (type === 'success') {

        notification.style.background =
            'linear-gradient(135deg,#ff7a1a,#d95b00)';
    }

    else {

        notification.style.background =
            'linear-gradient(135deg,#ff3b3b,#b80000)';
    }

    document.body.appendChild(notification);

    setTimeout(() => {

        notification.style.transform =
            'translateX(0)';
    }, 100);

    setTimeout(() => {

        notification.style.transform =
            'translateX(400px)';

        setTimeout(() => {

            notification.remove();

        }, 400);

    }, 3000);
}

// ============================================
// CURSOR GLOW EFFECT
// ============================================

const glow = document.createElement('div');

glow.style.position = 'fixed';

glow.style.width = '280px';
glow.style.height = '280px';

glow.style.borderRadius = '50%';

glow.style.pointerEvents = 'none';

glow.style.background =
    'radial-gradient(circle, rgba(255,122,26,0.12), transparent 70%)';

glow.style.zIndex = '0';

glow.style.transform =
    'translate(-50%, -50%)';

document.body.appendChild(glow);

document.addEventListener('mousemove', (e) => {

    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
});

// ============================================
// HERO IMAGE FLOAT EFFECT
// ============================================

const heroImage =
    document.querySelector('.profile-img');

if (heroImage) {

    window.addEventListener('mousemove', (e) => {

        const x =
            (window.innerWidth / 2 - e.pageX) / 35;

        const y =
            (window.innerHeight / 2 - e.pageY) / 35;

        heroImage.style.transform =
            `rotateY(${x}deg) rotateX(${-y}deg)`;
    });
}
