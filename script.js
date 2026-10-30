gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. حركة دخول النصوص في الهيرو
  gsap.from(".hero-text > *", {
    opacity: 0,
    y: 30,
    duration: 1,
    stagger: 0.15,
    ease: "power3.out",
    delay: 0.2
  });

  // 2. حركة دخول صورة العطر
  gsap.from(".hero-img-container", {
    opacity: 0,
    scale: 0.9,
    duration: 1.5,
    ease: "power3.out",
    delay: 0.4
  });

  // 3. تأثير Parallax لصورة العطر عند التمرير
  gsap.to(".floating-bottle", {
    y: 120,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  // 4. حركة ظهور البطاقات الزجاجية عند التمرير
  gsap.utils.toArray(".reveal").forEach((element) => {
    gsap.to(element, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  });
});