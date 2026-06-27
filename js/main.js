/* =========================================
   JOVIAN TECH LABS — main.js
   ========================================= */

(function () {
  "use strict";

  /* ---- Navbar scroll effect ---- */
  const navbar = document.getElementById("navbar");

  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleNavbarScroll, { passive: true });
  handleNavbarScroll();


  /* ---- Hamburger menu ---- */
  const hamburger = document.getElementById("hamburger");
  const navLinks  = document.getElementById("nav-links");
  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    hamburger.classList.add("open");
    navLinks.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    menuOpen = false;
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", function () {
    if (menuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close when a nav link is clicked
  navLinks.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  // Close on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menuOpen) {
      closeMenu();
    }
  });

  // Close on outside click
  document.addEventListener("click", function (e) {
    if (menuOpen && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });


  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });


  /* ---- Bar fill animation (benefits visual) ---- */
  const barFill = document.querySelector(".vc-bar-fill");
  if (barFill) {
    const barObserver = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          barFill.classList.add("animated");
          barObserver.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    barObserver.observe(barFill);
  }


  /* ---- Particle canvas ---- */
  const canvas  = document.getElementById("particle-canvas");
  const ctx     = canvas ? canvas.getContext("2d") : null;
  let particles = [];
  let animFrame;
  let W, H;

  function resize() {
    if (!canvas) return;
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function createParticle() {
    return {
      x:    randomBetween(0, W),
      y:    randomBetween(0, H),
      r:    randomBetween(0.6, 2.0),
      vx:   randomBetween(-0.18, 0.18),
      vy:   randomBetween(-0.28, -0.06),
      alpha:randomBetween(0.15, 0.55),
    };
  }

  function initParticles(count) {
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push(createParticle());
    }
  }

  function drawParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    particles.forEach(function (p) {
      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(34, 197, 94, " + p.alpha + ")";
      ctx.fill();

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Fade near top
      if (p.y < H * 0.2) {
        p.alpha -= 0.002;
      }

      // Reset
      if (p.y < -5 || p.alpha <= 0) {
        var next = createParticle();
        next.y = H + 5;
        Object.assign(p, next);
      }
    });

    // Draw connection lines for nearby particles
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx   = particles[i].x - particles[j].x;
        var dy   = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          var lineAlpha = (1 - dist / 100) * 0.08;
          ctx.strokeStyle = "rgba(34, 197, 94, " + lineAlpha + ")";
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    animFrame = requestAnimationFrame(drawParticles);
  }

  // Only run particles if canvas exists
  if (canvas) {
    resize();
    initParticles(60);
    drawParticles();

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        resize();
        initParticles(60);
      }, 200);
    });

    // Pause particles when page is hidden (performance)
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        cancelAnimationFrame(animFrame);
      } else {
        drawParticles();
      }
    });
  }


  /* ---- Smooth active nav highlighting ---- */
  const sections   = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-link[href^='#']");

  function highlightNav() {
    var scrollY = window.scrollY + 120;
    sections.forEach(function (section) {
      var top    = section.offsetTop;
      var height = section.offsetHeight;
      var id     = section.getAttribute("id");

      if (scrollY >= top && scrollY < top + height) {
        navAnchors.forEach(function (a) {
          a.classList.remove("active");
          if (a.getAttribute("href") === "#" + id) {
            a.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", highlightNav, { passive: true });
  highlightNav();


  /* ---- Mouse parallax on hero glows ---- */
  const glows = document.querySelectorAll(".hero-glow");

  document.addEventListener("mousemove", function (e) {
    var cx = window.innerWidth  / 2;
    var cy = window.innerHeight / 2;
    var rx = (e.clientX - cx) / cx;
    var ry = (e.clientY - cy) / cy;

    glows.forEach(function (glow, i) {
      var factor = (i + 1) * 14;
      glow.style.transform =
        "translate(" + rx * factor + "px, " + ry * factor + "px)";
    });
  });


  /* ---- Tilt effect on service cards ---- */
  var tiltCards = document.querySelectorAll(".service-card");

  tiltCards.forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var rect   = card.getBoundingClientRect();
      var cx     = rect.left + rect.width  / 2;
      var cy     = rect.top  + rect.height / 2;
      var dx     = (e.clientX - cx) / (rect.width  / 2);
      var dy     = (e.clientY - cy) / (rect.height / 2);
      card.style.transform =
        "translateY(-6px) rotateX(" + (-dy * 4) + "deg) rotateY(" + (dx * 4) + "deg)";
    });

    card.addEventListener("mouseleave", function () {
      card.style.transform = "";
    });
  });

})();
