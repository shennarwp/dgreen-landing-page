/* Language switching is handled via real URLs (/ and /id/) — see the
   hreflang links in the HTML. This file only contains page behaviour. */

        /* Centralized contact info: the WhatsApp number lives here only.
           Every <a data-wa-msg="..."> on the page gets its href built below. */
        const WA_NUMBER = '6281128070123';

        function initWhatsAppLinks() {
            document.querySelectorAll('a[data-wa-msg]').forEach((link) => {
                link.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(link.dataset.waMsg);
            });
        }
        initWhatsAppLinks();

        function updateActiveNav() {
            const sections = document.querySelectorAll('#about, #gallery, #suites, #location');
            const navLinks = document.querySelectorAll('.nav-links a');
            let current = '';
            sections.forEach(section => {
                if (window.scrollY >= section.offsetTop - 120) {
                    current = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + current);
            });
        }

        window.addEventListener('scroll', updateActiveNav);
        window.addEventListener('load', updateActiveNav);

        /* Mobile Nav Toggle */
        const mobileNav = document.getElementById('navLinks');
        const navToggle = document.getElementById('navToggle');

        function toggleNav(open) {
            mobileNav.classList.toggle('open', open);
            navToggle.setAttribute('aria-expanded', String(open));
            const icon = navToggle.querySelector('i');
            if (icon) icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        }

        navToggle.addEventListener('click', () => {
            toggleNav(!mobileNav.classList.contains('open'));
        });
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => toggleNav(false));
        });

        /* Back to Top */
        const backToTop = document.getElementById('backToTop');
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('show', window.scrollY > 600);
        }, { passive: true });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        /* Scroll-in Reveal */
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

        /* Lightbox (with keyboard + focus management) */
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = lightbox.querySelector('.lightbox-img');
        const lightboxCounter = lightbox.querySelector('.lightbox-counter');
        const lbSources = Array.from(document.querySelectorAll('img[data-lightbox]'))
            .map(img => ({ src: img.getAttribute('data-lightbox'), caption: img.getAttribute('data-caption') || '' }));
        document.querySelectorAll('[data-lightbox-bg]').forEach(el => {
            lbSources.push({ src: el.getAttribute('data-lightbox-bg'), caption: el.getAttribute('data-caption') || '' });
        });
        let lbIndex = 0;
        let lastFocusedEl = null;

        function lightboxFocusables() {
            return Array.from(lightbox.querySelectorAll('.lightbox-close, .lightbox-prev, .lightbox-next'));
        }

        function openLightbox(index) {
            lastFocusedEl = document.activeElement;
            const i = (lbSources.length + (index % lbSources.length)) % lbSources.length;
            lbIndex = i;
            lightboxImg.src = lbSources[i].src;
            lightboxImg.alt = lbSources[i].caption;
            lightboxCounter.textContent = `${i + 1} / ${lbSources.length}`;
            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            lightbox.querySelector('.lightbox-close').focus();
        }

        function closeLightbox() {
            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
                lastFocusedEl.focus();
            }
        }

        function makeKeyboardOpenable(el) {
            el.setAttribute('tabindex', '0');
            el.setAttribute('role', 'button');
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    el.click();
                }
            });
        }

        document.querySelectorAll('img[data-lightbox]').forEach((img, i) => {
            makeKeyboardOpenable(img);
            img.addEventListener('click', () => openLightbox(i));
        });
        document.querySelectorAll('[data-lightbox-bg]').forEach(el => {
            makeKeyboardOpenable(el);
            const src = el.getAttribute('data-lightbox-bg');
            const caption = el.getAttribute('data-caption');
            if (caption) el.setAttribute('aria-label', caption);
            el.addEventListener('click', () => {
                const idx = lbSources.findIndex(s => s.src === src);
                openLightbox(idx);
            });
        });

        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => openLightbox(lbIndex - 1));
        lightbox.querySelector('.lightbox-next').addEventListener('click', () => openLightbox(lbIndex + 1));
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        /* Trap focus inside the open lightbox */
        lightbox.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            const focusables = lightboxFocusables();
            if (focusables.length === 0) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement;
            if (e.shiftKey) {
                if (active === first || !lightbox.contains(active)) {
                    e.preventDefault();
                    last.focus();
                }
            } else if (active === last || !lightbox.contains(active)) {
                e.preventDefault();
                first.focus();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') openLightbox(lbIndex - 1);
            if (e.key === 'ArrowRight') openLightbox(lbIndex + 1);
        });

        /* Vertical scrolling is locked while the lightbox is open, so a
           horizontal drag here is interpreted as swipe prev/next. */
        let swipeStartX = 0;
        let swipeStartY = 0;
        lightbox.addEventListener('pointerdown', (e) => {
            swipeStartX = e.clientX;
            swipeStartY = e.clientY;
        }, { passive: true });
        lightbox.addEventListener('pointerup', (e) => {
            if (!lightbox.classList.contains('open')) return;
            const dx = e.clientX - swipeStartX;
            const dy = e.clientY - swipeStartY;
            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
                openLightbox(lbIndex + (dx < 0 ? 1 : -1));
            }
        }, { passive: true });