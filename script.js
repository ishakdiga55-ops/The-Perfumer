gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  
  // حركة دخول فخمة جداً في الهيرو
  const tl = gsap.timeline();

  tl.to(".hero-subtitle", { opacity: 1, visibility: "visible", y: 0, duration: 1, startAt: { y: 20 }, ease: "power3.out", delay: 0.2 })
    .to(".hero-title", { opacity: 1, visibility: "visible", y: 0, duration: 1.5, startAt: { y: 40 }, ease: "power4.out" }, "-=0.8")
    .to(".hero-bottle", { opacity: 1, visibility: "visible", duration: 2, startAt: { scale: 0.9 }, ease: "power2.out" }, "-=1.0")
    .to(".hero-desc", { opacity: 1, visibility: "visible", y: 0, duration: 1, startAt: { y: 20 }, ease: "power3.out" }, "-=1.2")
    .to(".hero-btn", { opacity: 1, visibility: "visible", y: 0, duration: 1, startAt: { y: 20 }, ease: "power3.out" }, "-=0.8");

  // تأثير Parallax عند التمرير لصورة العطر
  gsap.to(".hero-bottle", {
    y: 150,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  // ظهور النوتات العطرية عند التمرير
  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  });
});