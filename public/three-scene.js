(function () {
  const canvas = document.getElementById("hero-canvas");
  const hero = document.getElementById("home");
  if (!canvas || !hero) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.innerWidth < 768;

  let renderer, scene, camera, orb, orbWire, points, mouseX = 0, mouseY = 0, raf;

  function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7);

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

    const group = new THREE.Group();

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.45, 2),
      new THREE.MeshBasicMaterial({
        color: 0x4f7cff,
        wireframe: true,
        transparent: true,
        opacity: 0.5
      })
    );
    group.add(core);

    const innerGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.85, 24, 24),
      new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.08
      })
    );
    group.add(innerGlow);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.85, 0.012, 8, 120),
      new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.6 })
    );
    ring.rotation.x = Math.PI / 2.4;
    group.add(ring);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.15, 0.008, 8, 120),
      new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.35 })
    );
    ring2.rotation.y = Math.PI / 3;
    group.add(ring2);

    const particleCount = isMobile ? 350 : 1100;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 3.2 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x22d3ee,
      size: isMobile ? 0.02 : 0.035,
      transparent: true,
      opacity: 0.8
    });
    points = new THREE.Points(geo, mat);
    group.add(points);

    group.position.x = window.innerWidth >= 1280 ? 2.4 : window.innerWidth >= 768 ? 2.9 : 0;
    group.position.y = -0.2;

    scene.add(group);
    orb = group;

    window.addEventListener("resize", onResize);
    document.addEventListener("mousemove", onMouseMove);

    if (reduced) {
      renderOnce();
    } else {
      animate();
    }
  }

  function onMouseMove(e) {
    mouseX = (e.clientX / window.innerWidth - 0.5);
    mouseY = (e.clientY / window.innerHeight - 0.5);
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (window.innerWidth >= 768) orb.position.x = window.innerWidth >= 1280 ? 2.4 : 2.9;
    else orb.position.x = 0;
  }

  function renderOnce() {
    renderer.render(scene, camera);
  }

  function animate() {
    raf = requestAnimationFrame(animate);

    orb.rotation.y += 0.004;
    orb.rotation.x += 0.0012;

    const targetX = mouseX * 0.35;
    const targetY = mouseY * 0.25;
    orb.rotation.y += (targetX - orb.rotation.y * 0.12) * 0.02;
    orb.rotation.x += (targetY - orb.rotation.x * 0.1) * 0.02;
    camera.position.x += (mouseX * 0.55 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 0.42 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  if (reduced || !window.WebGLRenderingContext) {
    canvas.style.display = "none";
    return;
  }

  try {
    init();
  } catch (err) {
    canvas.style.display = "none";
  }

  window.addEventListener("pagehide", function () {
    if (raf) cancelAnimationFrame(raf);
    if (renderer) {
      renderer.dispose();
      if (scene) {
        scene.traverse(function (obj) {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) obj.material.dispose();
        });
      }
    }
  });
})();