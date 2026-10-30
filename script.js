(() => {
  "use strict";

  const canvas = document.querySelector("#hero-canvas");

  if (canvas && window.THREE) {
    initBottleScene(canvas);
  }

  initScrollAnimations();
  initMobileMenu();

  function initBottleScene(canvas) {
    const THREE = window.THREE;
    const scene = new THREE.Scene();
    scene.background = null;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.25, 6);

    const controls = new THREE.OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.enablePan = false;
    controls.minDistance = 4;
    controls.maxDistance = 8;
    controls.minPolarAngle = Math.PI * 0.31;
    controls.maxPolarAngle = Math.PI * 0.69;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    controls.target.set(0, 0.05, 0);

    scene.add(new THREE.HemisphereLight(0xeaffc1, 0x151711, 1.5));

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(-3, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xccff00, 24, 12);
    rimLight.position.set(2.8, 1.4, -2.2);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xb7c1a0, 8, 10);
    fillLight.position.set(-3, -1, 2.5);
    scene.add(fillLight);

    const frontLight = new THREE.PointLight(0xffffff, 3, 10);
    frontLight.position.set(0, 2, 4);
    scene.add(frontLight);

    const bottleRoot = new THREE.Group();
    scene.add(bottleRoot);

    const loader = new THREE.GLTFLoader();
    loader.load(
      "./perfume.glb",
      (gltf) => {
        const model = gltf.scene;

        model.traverse((node) => {
          if (!node.isMesh) return;

          node.castShadow = true;
          node.receiveShadow = true;

          if (node.material) {
            node.material.needsUpdate = true;
          }
        });

        const bounds = new THREE.Box3().setFromObject(model);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        const largestDimension = Math.max(size.x, size.y, size.z);

        if (largestDimension > 0) {
          const scale = 3.15 / largestDimension;
          model.scale.setScalar(scale);
        }

        // Recenter the imported model around the scene origin.
        model.position.set(
          -center.x * model.scale.x,
          -center.y * model.scale.y,
          -center.z * model.scale.z
        );

        bottleRoot.add(model);
      },
      undefined,
      (error) => {
        console.warn(
          'Could not load "./perfume.glb". Showing the built-in bottle placeholder instead.',
          error
        );
        createBottlePlaceholder(bottleRoot, THREE);
      }
    );

    function resizeRenderer() {
      const bounds = canvas.getBoundingClientRect();
      const width = Math.max(1, bounds.width);
      const height = Math.max(1, bounds.height);

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    const resizeObserver = new ResizeObserver(resizeRenderer);
    resizeObserver.observe(canvas);
    resizeRenderer();

    let animationFrameId;

    function render() {
      animationFrameId = window.requestAnimationFrame(render);
      controls.update();
      renderer.render(scene, camera);
    }

    render();

    window.addEventListener("pagehide", () => {
      window.cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
    }, { once: true });
  }

  function createBottlePlaceholder(parent, THREE) {
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x78805e,
      metalness: 0.18,
      roughness: 0.16,
      transmission: 0.18,
      transparent: true,
      opacity: 0.88,
      thickness: 0.8,
      clearcoat: 1,
      clearcoatRoughness: 0.08
    });

    const darkMaterial = new THREE.MeshStandardMaterial({
      color: 0x171a12,
      metalness: 0.72,
      roughness: 0.25
    });

    const labelMaterial = new THREE.MeshStandardMaterial({
      color: 0xccff00,
      emissive: 0x344400,
      metalness: 0.2,
      roughness: 0.45
    });

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.45, 2.15, 0.72, 1, 1, 1),
      glassMaterial
    );
    body.position.y = -0.25;
    parent.add(body);

    const shoulder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.65, 0.36, 8),
      glassMaterial
    );
    shoulder.position.y = 1.0;
    parent.add(shoulder);

    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.29, 0.29, 0.34, 8),
      darkMaterial
    );
    neck.position.y = 1.32;
    parent.add(neck);

    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.42, 0.68, 8),
      darkMaterial
    );
    cap.position.y = 1.8;
    parent.add(cap);

    const label = new THREE.Mesh(
      new THREE.BoxGeometry(0.88, 0.68, 0.025),
      labelMaterial
    );
    label.position.set(0, -0.28, 0.38);
    parent.add(label);

    const plinth = new THREE.Mesh(
      new THREE.BoxGeometry(1.53, 0.09, 0.78),
      darkMaterial
    );
    plinth.position.y = -1.36;
    parent.add(plinth);
  }

  function initScrollAnimations() {
    if (!window.gsap) {
      document.querySelectorAll(".reveal").forEach((element) => {
        element.style.opacity = "1";
        element.style.transform = "none";
      });
      return;
    }

    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      gsap.set(".reveal", { clearProps: "all" });
      return;
    }

    gsap.set(".reveal", {
      autoAlpha: 0,
      y: 28
    });

    if (window.ScrollTrigger) {
      gsap.utils.toArray(".reveal").forEach((element) => {
        gsap.to(element, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true
          }
        });
      });

      gsap.to(".hero-grid-lines", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(".price-orbit", {
        rotation: 18,
        scaleY: 0.56,
        ease: "none",
        scrollTrigger: {
          trigger: ".price-section",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    } else {
      gsap.to(".reveal", {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power2.out"
      });
    }
  }

  function initMobileMenu() {
    const menuButton = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav-glass");

    if (!menuButton || !nav) return;

    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("menu-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    nav.querySelectorAll(".nav-links a, .nav-cta").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("menu-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");
      });
    });
  }
})();
