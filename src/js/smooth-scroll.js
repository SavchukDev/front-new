document.addEventListener('DOMContentLoaded', () => {

    /* =========================
       HEADER OFFSET
    ========================== */
    function getHeaderOffset() {
        const header = document.getElementById('site-header');
        return header ? header.offsetHeight : 0;
    }

    /* =========================
       SMOOTH SCROLL
    ========================== */
    function smoothScrollToElement(targetId) {
        const target = document.getElementById(targetId);
        if (!target) return;

        const offset = getHeaderOffset();
        const targetPosition =
            target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    /* =========================
       LINK HANDLER (SAFE)
    ========================== */
    const navLinks = document.querySelectorAll('.navigation-item a');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href) return;

            const [path, hash] = href.split('#');
            if (!hash) return;

            const currentFile = window.location.pathname.split('/').pop();
            const isSamePage =
                path === '' ||
                path === './' ||
                path === currentFile ||
                path === './' + currentFile;

            if (!isSamePage) return;

            const target = document.getElementById(hash);
            if (!target) return;

            e.preventDefault();

            smoothScrollToElement(hash);
            setActiveNavItem(hash);
        });
    });

    /* =========================
       ACTIVE NAV ITEM
    ========================== */
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.navigation-item');

    function setActiveNavItem(sectionId) {
        navItems.forEach(item => item.classList.remove('active'));

        const activeLink = document.querySelector(
            `.navigation-item a[href*="#${sectionId}"]`
        );

        if (activeLink) {
            activeLink.closest('.navigation-item').classList.add('active');
        }
    }

    /* =========================
       SCROLL SPY
    ========================== */
    function onScroll() {
        const scrollPos = window.pageYOffset + getHeaderOffset() + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;

            if (scrollPos >= top && scrollPos < bottom) {
                setActiveNavItem(section.id);
            }
        });
    }

    window.addEventListener('scroll', onScroll);

    /* =========================
       ON LOAD WITH HASH
    ========================== */
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        setTimeout(() => {
            smoothScrollToElement(targetId);
            setActiveNavItem(targetId);
        }, 300);
    }

});