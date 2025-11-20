document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initHeroSlider();
    initScrollTop();
    initProjectFilters();
    initContactForm();
    initLazyLoading();
});

function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // const header = document.getElementById('header');
    // if (header) {
    //     window.addEventListener('scroll', function() {
    //         if (window.scrollY > 100) {
    //             header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    //         } else {
    //             header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
    //         }
    //     });
    // }
}

// window.addEventListener("scroll", function () {
//     const header = document.querySelector(".header");

//     if (window.scrollY > 20) {   
//         header.classList.add("header-active");
//     } else {
//         header.classList.remove("header-active");
//     }
// });


function initHeroSlider() {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const dotsContainer = document.getElementById('sliderDots');

    let currentSlide = 0;
    const slideCount = slides.length;

    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');

        currentSlide = (n + slideCount) % slideCount;

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    setInterval(nextSlide, 5000);
}

function initScrollTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectsGallery = document.getElementById('projectsGallery');

    if (!filterButtons.length || !projectsGallery) return;

    const projects = projectsGallery.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            projects.forEach(project => {
                if (filter === 'all' || project.getAttribute('data-category') === filter) {
                    project.classList.remove('hidden');
                    setTimeout(() => {
                        project.style.display = 'block';
                    }, 10);
                } else {
                    project.classList.add('hidden');
                    setTimeout(() => {
                        project.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        clearErrors();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();

        let isValid = true;

        if (name.length < 3) {
            showError('nameError', 'الرجاء إدخال اسم صحيح (3 أحرف على الأقل)');
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('emailError', 'الرجاء إدخال بريد إلكتروني صحيح');
            isValid = false;
        }

        const phoneRegex = /^[0-9+]{10,}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            showError('phoneError', 'الرجاء إدخال رقم هاتف صحيح');
            isValid = false;
        }

        if (!subject) {
            showError('subjectError', 'الرجاء اختيار الموضوع');
            isValid = false;
        }

        if (message.length < 10) {
            showError('messageError', 'الرجاء إدخال رسالة (10 أحرف على الأقل)');
            isValid = false;
        }

        if (isValid) {
            const formSuccess = document.getElementById('formSuccess');
            formSuccess.style.display = 'block';
            form.reset();

            setTimeout(() => {
                formSuccess.style.display = 'none';
            }, 5000);
        }
    });

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => {
            error.style.display = 'none';
            error.textContent = '';
        });
    }
}

function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}