gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ duration: 2, ease: "power2.out" });

const dropdown = document.querySelector(".dropdown");
const menu = dropdown.querySelector(".dropdown-menu");

gsap.set(menu, { autoAlpha: 0, y: 10 });

dropdown.addEventListener("mouseenter", () => {
  gsap.to(menu, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" });
});

dropdown.addEventListener("mouseleave", () => {
  gsap.to(menu, { autoAlpha: 0, y: 10, duration: 0.3, ease: "power2.inOut" });
});

function splitText(selector) {
  const element = document.querySelector(selector);
  if (!element) return;
  const text = element.textContent;
  let newHTML = "";
  text.split("").forEach((char) => {
    newHTML += `<span class="char" style="display: inline-block;">${
      char === " " ? "&nbsp;" : char
    }</span>`;
  });
  element.innerHTML = newHTML;
}

function setupHorizontalScroll() {
  let horizontalContainer = document.querySelector(".project-wrapper");
  let projects = gsap.utils.toArray(".project-card");

  if (!horizontalContainer || projects.length === 0) return;

  // Create a media query using GSAP's built-in matchMedia
  let mm = gsap.matchMedia();

  mm.add("(min-width: 769px)", () => {
    // --- Enable horizontal scroll for desktop only ---
    ScrollTrigger.addEventListener("refreshInit", () => {
      let totalWidth = 0;
      const gap = window.innerWidth * 0.05;

      projects.forEach((project) => {
        totalWidth += project.offsetWidth + gap;
      });

      horizontalContainer.style.width = totalWidth + "px";
    });

    let scrollDistance = () =>
      horizontalContainer.scrollWidth - window.innerWidth;

    // Horizontal scroll animation
    gsap.to(horizontalContainer, {
      x: () => -scrollDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: () => `+=${scrollDistance()}`,
        pin: true,
        scrub: 2.5,
        invalidateOnRefresh: true,
      },
    });
  });

  mm.add("(max-width: 768px)", () => {
    // --- Disable horizontal scroll on tablet and mobile ---
    gsap.set(horizontalContainer, { x: 0 }); // reset position
    ScrollTrigger.getAll().forEach((trigger) => {
      if (
        trigger.trigger &&
        trigger.trigger.classList.contains("work-section")
      ) {
        trigger.kill();
      }
    });
  });
}

const designerData = {
  glaser: {
    name: "Milton Glaser",
    significance:
      "Iconic cultural illustrator (I ❤️ NY) who defined the expressive and eclectic graphic design of the 60s and 70s.",
    designs: [
      "I ❤️ NY Logo",
      "Bob Dylan Poster (1966)",
      "New York Magazine Identity",
    ],
    quote:
      "There are three responses to a piece of design—yes, no, and WOW! Wow is the one to aim for.",
    bio: "Co-founded Push Pin Studios, rejecting Swiss Modernism for eclectic illustration and blending fine art with commercial art.",
    image: "url('/images/glaser.webp')",
  },
  scher: {
    name: "Paula Scher",
    significance:
      "Typographic master and titan of American graphic design, known for injecting street vitality into major institutional identities.",
    designs: [
      "The Public Theater Branding",
      "Citi Logo",
      "The Metropolitan Opera Identity",
    ],
    quote:
      "It's through the process of making mistakes that you make discoveries.",
    bio: "First female principal at Pentagram, she used a painterly and expressive approach to typography, often referencing historical styles.",
    image: "url('/images/scher.png')",
  },
  rams: {
    name: "Dieter Rams",
    significance:
      "Legendary industrial designer who created the 'Ten Principles for Good Design,' emphasizing simplicity and durability ('Less but better').",
    designs: [
      "Braun SK 4 record player ('Snow White's Coffin')",
      "606 Universal Shelving System",
      "Braun ET 66 calculator",
    ],
    quote: "Good design is as little design as possible.",
    bio: "As head designer for Braun for decades, his minimalist philosophy became the foundation for modern product design, notably influencing Apple.",
    image: "url('/images/rams.jpg')",
  },
  eames: {
    name: "Charles & Ray Eames",
    significance:
      "Pioneers of Mid-Century Modernism, they revolutionized furniture using new industrial techniques (molded plywood, fiberglass).",
    designs: [
      "Eames Lounge Chair and Ottoman",
      "Eames House (Case Study House #8)",
      "Plywood Chair (LCW)",
    ],
    quote: "The best is the most for the most for the least.",
    bio: "A husband-and-wife duo who saw design as a problem-solving process, creating beautiful, functional, and accessible items for mass production.",
    image: "url('/images/eames.webp')",
  },
  vignelli: {
    name: "Lella Vignelli",
    significance:
      "Architect and influential designer who championed clarity and systemic design, applying Swiss Modernism to corporate identity.",
    designs: [
      "American Airlines Identity (1967)",
      "Knoll Branding",
      "New York City Subway Map (1972)",
    ],
    quote:
      "I always say, if you can design one thing, you can design anything.",
    bio: "Managed the operations of Vignelli Associates and, alongside her husband Massimo, created cohesive, timeless design systems using minimal typefaces like Helvetica.",
    image: "url('/images/vignelli-space.png')",
  },
  anderson: {
    name: "Wes Anderson",
    significance:
      "Filmmaker whose highly stylized, symmetrical, and color-saturated aesthetic has profoundly influenced contemporary visual design and graphic artists.",
    designs: [
      "The Grand Budapest Hotel (Aesthetic)",
      "Moonrise Kingdom (Visual Identity)",
      "Use of Futura & ITC Darjeeling Typefaces",
    ],
    quote: "I try to choose a color palette for a film that that is distinct.",
    bio: "Known for his meticulous use of art direction, set design, and graphic props, his cinematic worlds serve as design masterclasses.",
    image: "url('/images/anderson.jpg')",
  },
};

function setupDesignStudyCarousel() {
  const grid = document.querySelector(".designer-grid");
  const initialCards = gsap.utils.toArray(".designer-card");

  if (!grid || initialCards.length === 0) return;

  gsap.set(grid, { perspective: 1000, transformStyle: "preserve-3d" });
  gsap.set(initialCards, { transformOrigin: "center center" });

  // 1. Set Background Images and Clone Cards for Infinite Loop
  const cardsFragment = document.createDocumentFragment();
  let loopDistance = 0;

  initialCards.forEach((card) => {
    const designerKey = card.getAttribute("data-designer");
    const data = designerData[designerKey];
    if (data && data.image) {
      card.style.setProperty("--card-bg-image", data.image);
    }

    const cardStyle = window.getComputedStyle(card);
    loopDistance +=
      card.offsetWidth +
      parseFloat(cardStyle.marginLeft) +
      parseFloat(cardStyle.marginRight);

    cardsFragment.appendChild(card.cloneNode(true));
  });

  grid.appendChild(cardsFragment);
  const allCards = gsap.utils.toArray(".designer-grid .designer-card");

  // 2. Setup the Continuous Horizontal Loop
  const DURATION = 20;

  const carouselTimeline = gsap.timeline({
    repeat: -1,
    defaults: { ease: "none" },
  });

  carouselTimeline.to(grid, {
    x: `-=${loopDistance}px`,
    duration: DURATION,
  });

  // 3. Setup the Dynamic 3D Perspective Transforms (UNMODIFIED)
  const MAX_ROTATION = 35;
  const ROTATION_DIVISOR = 15;

  const applyPerspectiveTransforms = () => {
    const viewportCenter = window.innerWidth / 2;
    const maxDelta = window.innerWidth / 2;

    allCards.forEach((card) => {
      let hoverTween;

      card.addEventListener("mouseenter", () => {
        card.classList.add("hovered");

        // Gently slow down the carousel instead of snapping
        gsap.to(carouselTimeline, {
          timeScale: 0.4,
          duration: 0.8,
          ease: "power2.out",
        });

        // Cancel any previous hover animation
        if (hoverTween) hoverTween.kill();

        hoverTween = gsap.to(card, {
          scale: 1.08,
          rotationY: 0,
          z: 60,
          duration: 0.6,
          ease: "power3.out",
          overwrite: "auto",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(carouselTimeline, {
          timeScale: 1,
          duration: 1.2,
          ease: "power3.inOut",
        });

        if (hoverTween) hoverTween.kill();

        gsap.to(card, {
          scale: 1,
          z: 0,
          rotationY: 0,
          duration: 0.6,
          ease: "power2.inOut",
          overwrite: "auto",
          onComplete: () => {
            gsap.set(card, { clearProps: "scale,z,rotationY" });
            card.classList.remove("hovered");
            applyPerspectiveTransforms();
          },
        });
      });
    });
  };

  gsap.ticker.add(applyPerspectiveTransforms);
  window.addEventListener("resize", () => applyPerspectiveTransforms());

  // 4. Setup Hover Interactions (CONTROLS timeScale)
  allCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.classList.add("hovered");
      gsap.killTweensOf(card);

      // SLOW DOWN the loop significantly on hover (0.1 is nearly stopped)
      gsap.to(carouselTimeline, { timeScale: 0.1, duration: 0.5 });

      gsap.to(card, {
        scale: 1.1,
        rotationY: 0,
        z: 50,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    card.addEventListener("mouseleave", () => {
      // RESTORE the loop speed on mouse leave (timeScale: 1)
      gsap.to(carouselTimeline, { timeScale: 1, duration: 0.5 });

      gsap.to(card, {
        scale: 1,
        z: 0,
        rotationY: 0,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(card, { clearProps: "scale,z,rotationY" });
          card.classList.remove("hovered");
          applyPerspectiveTransforms();
        },
      });
    });
  });

  // 5. Setup Scroll-Based Speed Adjustment (SIMPLIFIED to avoid conflicts)
  // We only slightly slow the timeline down when the section is visible.
  ScrollTrigger.create({
    trigger: ".design-study-section",
    start: "top bottom",
    end: "bottom top",

    onEnter: () => {
      // Subtle slow down when entering the section
      gsap.to(carouselTimeline, { timeScale: 0.8, duration: 1.0 });
    },
    onLeave: () => {
      // Subtle speed up when leaving below
      gsap.to(carouselTimeline, { timeScale: 1.0, duration: 1.0 });
    },
    onEnterBack: () => {
      gsap.to(carouselTimeline, { timeScale: 0.8, duration: 1.0 });
    },
    onLeaveBack: () => {
      // Return to default speed when leaving above
      gsap.to(carouselTimeline, { timeScale: 1.0, duration: 1.0 });
    },

    // Removed the onUpdate logic and manual X setting
  });

  // 6. Setup Click Handler (Modal opening)
  setupCardLinks(allCards);
}
function setupCardLinks(allCards) {
  allCards.forEach((card) => {
    card.addEventListener("click", () => {
      const designerKey = card.getAttribute("data-designer");

      if (designerKey) {
        // 1. Define the target URL structure
        // Example: Navigates to /study/milton-glaser.html
        const targetUrl = `/study/${designerKey}.html`;

        // 2. Add a brief exit animation for a smooth transition (optional but nice)
        gsap.to("body", {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => {
            // 3. Navigate to the new page after the animation finishes
            window.location.href = targetUrl;
          },
        });

        // If you don't want an exit animation, just use:
        // window.location.href = targetUrl;
      }
    });
  });
}

const preloader = document.querySelector(".preloader");

splitText(".split-text-target");

const masterEntrance = gsap.timeline({
  delay: 0.2,
});

masterEntrance
  .to(preloader, {
    opacity: 0,
    duration: 0.8,
    ease: "power2.inOut",
    onComplete: () => {
      if (preloader) preloader.style.display = "none";
      ScrollTrigger.refresh();
    },
  })

  .fromTo(
    ".split-text-target .char",
    {
      y: "100%",
      opacity: 1,
    },
    {
      y: "0%",
      opacity: 1,
      duration: 1.2,
      ease: "power3.out",
      stagger: 0.04,
    },
    "<0.1"
  );

function setupScrollAnimations() {
  gsap.from(".intro-section p", {
    y: 30,
    opacity: 0,
    duration: 1,
    delay: masterEntrance.duration() + 0.5,
    ease: "power2.out",
  });

  const introAnim = gsap.timeline({ paused: true });

  // Define the exit animation steps in the timeline
  introAnim.to(
    ".split-text-target",
    {
      scale: 0.8,
      opacity: 0,
      y: -100,
      duration: 1, // Normalized duration
      ease: "power2.out",
    },
    0
  ); // Start at time 0

  introAnim.to(
    ".intro-section p",
    {
      opacity: 0,
      y: -50,
      duration: 0.6, // Start slightly later/end earlier for the paragraph
      ease: "power1.out",
    },
    0.2
  ); // Start slightly after the H1

  // 2. PIN HERO SECTION & CONTROL THE NEW TIMELINE
  ScrollTrigger.create({
    trigger: ".wrapper",
    start: "top top",
    end: "bottom top",
    pin: true,
    pinSpacing: false,

    // This function ties the introAnim timeline progress directly to the scroll progress
    onUpdate: (self) => {
      // Drive the introAnim timeline based on the parent ScrollTrigger's progress
      introAnim.progress(self.progress);
    },
  });

  // 3. Scroll animation for the About section (Your original logic)
  gsap.from(".about-section .content-wrapper", {
    scrollTrigger: {
      trigger: ".about-section",
      start: "top 80%",
      toggleActions: "play none none none",
    },
    opacity: 0,
    x: -50,
    duration: 1,
    ease: "power2.out",
  });

  // 4. Scroll animation for the Contact section (Your original logic)
  gsap.from(".contact-section h2, .contact-section p", {
    scrollTrigger: {
      trigger: ".contact-section",
      start: "top 75%",
      toggleActions: "play none none none",
    },
    opacity: 0,
    y: 50,
    duration: 1,
    stagger: 0.3,
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal && modal.style.display === "flex") {
    closeDesignerModal();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  setupDesignStudyCarousel();
  setupHorizontalScroll();
  setupScrollAnimations();
});
