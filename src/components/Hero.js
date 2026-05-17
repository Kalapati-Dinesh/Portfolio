import { useEffect, useRef } from 'react';
import { Link } from 'react-scroll';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import './Hero.css';

export default function Hero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let raf;

    const COUNT  = 120;
    const RADIUS = 210;
    const LINK   = 68;

    let autoAngle = 0;
    let autoSpeed = 0.004;
    let speedDecay = false;

    // morph
    let morphTo = 1, morphT = 0, morphing = false;
    let shapeTimer = null;

    // black hole
    let blackHole = false, bhT = 0;

    // lightning
    let bolts = [];
    let boltTimer = null;

    // color wave
    let waves = [];
    const nodeWave = new Float32Array(COUNT);

    // gravity well — mouse hold
    let gravityActive = false;

    // neural pulses
    let pulses = [];
    let hoverPulseTimer = null;

    // double click tracker
    let lastClick = 0;

    const mouse = { x: -999, y: -999, down: false };

    const getCenter = () => ({
      cx: canvas.width  * 0.72,
      cy: canvas.height * 0.5,
    });

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    /* shapes */
    // 1. Sphere
    const makeSphere = (i) => {
      const phi   = Math.acos(-1 + (2 * i) / COUNT);
      const theta = Math.sqrt(COUNT * Math.PI) * phi;
      return {
        x: RADIUS * Math.sin(phi) * Math.cos(theta),
        y: RADIUS * Math.sin(phi) * Math.sin(theta),
        z: RADIUS * Math.cos(phi),
      };
    };

    // 2. Cube
    const makeCube = (i) => {
      const face = Math.floor(i / (COUNT / 6));
      const idx  = i % Math.ceil(COUNT / 6);
      const side = Math.ceil(Math.sqrt(COUNT / 6));
      const u = ((idx % side) / (side - 1) - 0.5) * 2 * RADIUS * 0.85;
      const v = (Math.floor(idx / side) / (side - 1) - 0.5) * 2 * RADIUS * 0.85;
      const r = RADIUS * 0.85;
      return [
        { x: r, y: u, z: v }, { x: -r, y: u, z: v },
        { x: u, y: r, z: v }, { x: u, y: -r, z: v },
        { x: u, y: v, z: r }, { x: u, y: v, z: -r },
      ][Math.min(face, 5)];
    };

    // 3. Torus
    const makeTorus = (i) => {
      const R = RADIUS * 0.7, r2 = RADIUS * 0.28;
      const u = (i / COUNT) * Math.PI * 2;
      const v = ((i * 7) % COUNT / COUNT) * Math.PI * 2;
      return {
        x: (R + r2 * Math.cos(v)) * Math.cos(u),
        y: (R + r2 * Math.cos(v)) * Math.sin(u),
        z: r2 * Math.sin(v),
      };
    };

    // 4. Double Helix
    const makeHelix = (i) => {
      const strand = i % 2;
      const t      = Math.floor(i / 2) / (COUNT / 2);
      const angle  = t * Math.PI * 6 + strand * Math.PI;
      const height = (t - 0.5) * RADIUS * 2;
      return {
        x: RADIUS * 0.55 * Math.cos(angle),
        y: height,
        z: RADIUS * 0.55 * Math.sin(angle),
      };
    };

    // 5. Diamond (Octahedron-like star)
    const makeDiamond = (i) => {
      const t     = i / COUNT;
      const rings = 8;
      const ring  = Math.floor(t * rings);
      const pos   = (t * rings) % 1;
      const angle = pos * Math.PI * 2 + ring * 0.4;
      const lat   = (ring / (rings - 1) - 0.5) * Math.PI;
      const r2    = RADIUS * Math.cos(lat) * (0.5 + 0.5 * Math.abs(Math.cos(lat * 2)));
      return {
        x: r2 * Math.cos(angle),
        y: RADIUS * Math.sin(lat) * 1.3,
        z: r2 * Math.sin(angle),
      };
    };

    const shapes = [makeSphere, makeCube, makeTorus, makeHelix, makeDiamond];

    const base = Array.from({ length: COUNT }, (_, i) => {
      const s = makeSphere(i);
      return { ...s, fromX: s.x, fromY: s.y, fromZ: s.z, toX: s.x, toY: s.y, toZ: s.z,
               ax: 0, ay: 0, az: 0, vax: 0, vay: 0, vaz: 0,
               bhOrigX: s.x, bhOrigY: s.y, bhOrigZ: s.z };
    });

    const startMorph = () => {
      morphTo  = (morphTo + 1) % 3;
      morphT   = 0; morphing = true;
      base.forEach((b, i) => {
        b.fromX = b.x; b.fromY = b.y; b.fromZ = b.z;
        const t = shapes[morphTo](i);
        b.toX = t.x; b.toY = t.y; b.toZ = t.z;
      });
    };
    const scheduleMorph = () => {
      shapeTimer = setTimeout(() => { startMorph(); scheduleMorph(); }, 5000);
    };

    /* lightning */
    const spawnBolt = (pts) => {
      const i = Math.floor(Math.random() * pts.length);
      let cur = i;
      const chain = [cur];
      for (let h = 0; h < 2 + Math.floor(Math.random() * 2); h++) {
        let best = -1, bestD = Infinity;
        pts.forEach((p, j) => {
          if (chain.includes(j)) return;
          const d = Math.hypot(pts[cur].sx - p.sx, pts[cur].sy - p.sy);
          if (d < LINK * 1.4 && d < bestD) { bestD = d; best = j; }
        });
        if (best === -1) break;
        chain.push(best); cur = best;
      }
      if (chain.length < 2) return;
      bolts.push({ chain, life: 1, decay: 0.055 + Math.random() * 0.04 });
    };

    /* neural pulse */
    const buildPath = (pts, startIdx) => {
      const visited = new Set([startIdx]);
      const path    = [startIdx];
      for (let s = 0; s < 4; s++) {
        const cur = path[path.length - 1];
        let best = -1, bestD = Infinity;
        pts.forEach((p, i) => {
          if (visited.has(i)) return;
          const d = Math.hypot(pts[cur].sx - p.sx, pts[cur].sy - p.sy);
          if (d < LINK && d < bestD) { bestD = d; best = i; }
        });
        if (best === -1) break;
        path.push(best); visited.add(best);
      }
      return path.length >= 2 ? path : null;
    };
    const spawnPulse = (pts, idx) => {
      if (pulses.length > 0) return;
      const path = buildPath(pts, idx);
      if (path) pulses.push({ path, seg: 0, t: 0, speed: 0.007, done: false });
    };

    const ry = (p, a) => ({
      x:  p.x * Math.cos(a) + p.z * Math.sin(a), y: p.y,
      z: -p.x * Math.sin(a) + p.z * Math.cos(a),
    });
    const rx = (p, a) => ({
      x: p.x,
      y: p.y * Math.cos(a) - p.z * Math.sin(a),
      z: p.y * Math.sin(a) + p.z * Math.cos(a),
    });
    const easeInOut = t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;

    /* ── draw ── */
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { cx, cy } = getCenter();

      autoAngle += autoSpeed;
      // speed decay back to normal
      if (speedDecay && autoSpeed > 0.004) {
        autoSpeed = Math.max(0.004, autoSpeed * 0.985);
        if (autoSpeed <= 0.004) speedDecay = false;
      }

      /* morph */
      if (morphing) {
        morphT += 0.012;
        const e = easeInOut(Math.min(morphT, 1));
        base.forEach(b => {
          b.x = b.fromX + (b.toX - b.fromX) * e;
          b.y = b.fromY + (b.toY - b.fromY) * e;
          b.z = b.fromZ + (b.toZ - b.fromZ) * e;
        });
        if (morphT >= 1) morphing = false;
      }

      /* black hole */
      if (blackHole) {
        bhT += 0.010;
        base.forEach(b => {
          const spiral = bhT < 1 ? bhT * bhT : Math.max(0, 2 - bhT);
          const angle  = bhT * Math.PI * 6;
          const shrink = 1 - spiral * 0.95;
          b.ax = (b.bhOrigX * shrink * Math.cos(angle) - b.bhOrigZ * shrink * Math.sin(angle)) - b.x;
          b.ay = b.bhOrigY * shrink - b.y;
          b.az = (b.bhOrigX * shrink * Math.sin(angle) + b.bhOrigZ * shrink * Math.cos(angle)) - b.z;
        });
        if (bhT > 2.2) { blackHole = false; bhT = 0; base.forEach(b => { b.ax=0; b.ay=0; b.az=0; }); }
      }

      /* color wave update */
      waves = waves.filter(w => w.t < 1.05);
      waves.forEach(w => { w.t += 0.009; });
      nodeWave.fill(0);
      waves.forEach(w => {
        const o = base[w.originIdx];
        base.forEach((b, i) => {
          const dot = Math.min(1, Math.max(-1,
            o.x/RADIUS * b.x/RADIUS + o.y/RADIUS * b.y/RADIUS + o.z/RADIUS * b.z/RADIUS));
          const ang  = Math.acos(dot) / Math.PI;
          const diff = w.t - ang;
          if (diff > 0 && diff < 0.2) nodeWave[i] = Math.max(nodeWave[i], Math.sin(diff/0.2*Math.PI));
        });
      });

      const tiltY = (mouse.x - cx) / (canvas.width  * 0.5) * 1.0;
      const tiltX = (mouse.y - cy) / (canvas.height * 0.5) * 0.8;

      /* project */
      const pts = base.map((b, i) => {
        if (!blackHole) {
          /* gravity well — mouse hold sucks nodes toward cursor */
          if (gravityActive && mouse.x > 0) {
            const fov = 680;
            const projX = cx + b.x * (fov / (fov + b.z));
            const projY = cy + b.y * (fov / (fov + b.z));
            const dx = mouse.x - projX, dy = mouse.y - projY;
            const dist = Math.hypot(dx, dy);
            if (dist < 180 && dist > 0) {
              const pull = (1 - dist / 180) * 1.8;
              b.vax += (dx / dist) * pull;
              b.vay += (dy / dist) * pull;
            }
          }
          b.vax += -b.ax * 0.12; b.vay += -b.ay * 0.12; b.vaz += -b.az * 0.12;
          b.vax *= 0.75; b.vay *= 0.75; b.vaz *= 0.75;
          b.ax  += b.vax; b.ay  += b.vay; b.az  += b.vaz;
        }
        let p = { x: b.x + b.ax, y: b.y + b.ay, z: b.z + b.az };
        p = ry(p, autoAngle + tiltY);
        p = rx(p, tiltX);
        const fov   = 680;
        const scale = fov / (fov + p.z);
        return {
          sx: cx + p.x * scale, sy: cy + p.y * scale,
          z: p.z, d: Math.max(0, Math.min(1, (p.z + RADIUS) / (2 * RADIUS))),
        };
      });

      /* hover attract + pulse */
      let nearIdx = -1, nearDist = Infinity;
      pts.forEach((p, i) => {
        const d = Math.hypot(p.sx - mouse.x, p.sy - mouse.y);
        if (d < nearDist) { nearDist = d; nearIdx = i; }
      });
      if (nearIdx >= 0 && nearDist < 90 && !blackHole && !gravityActive) {
        const b = base[nearIdx], p = pts[nearIdx];
        b.vax += (mouse.x - p.sx) / canvas.width  * (1 - nearDist/90) * 22;
        b.vay += (mouse.y - p.sy) / canvas.height * (1 - nearDist/90) * 22;
        if (!hoverPulseTimer) {
          hoverPulseTimer = setTimeout(() => {
            hoverPulseTimer = null; spawnPulse(pts, nearIdx);
          }, 300);
        }
      } else { clearTimeout(hoverPulseTimer); hoverPulseTimer = null; }

      /* active edges */
      const activeEdges = new Set();
      pulses.forEach(pu => {
        if (pu.done) return;
        const a = pu.path[pu.seg], b = pu.path[pu.seg + 1];
        if (b !== undefined) activeEdges.add(`${Math.min(a,b)}_${Math.max(a,b)}`);
      });

      /* edges */
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].sx - pts[j].sx, dy = pts[i].sy - pts[j].sy;
          if (Math.abs(dx) > LINK || Math.abs(dy) > LINK) continue;
          const dist = Math.hypot(dx, dy);
          if (dist >= LINK) continue;
          const avg = (pts[i].d + pts[j].d) * 0.5;
          const wv  = (nodeWave[i] + nodeWave[j]) * 0.5;
          const isActive = activeEdges.has(`${i}_${j}`);
          if (isActive) {
            ctx.strokeStyle = `rgba(147,210,255,${0.5 + avg * 0.4})`;
            ctx.lineWidth   = 1.5;
          } else if (wv > 0.05) {
            ctx.strokeStyle = `rgba(${Math.round(96+wv*110)},${Math.round(165+wv*80)},255,${0.15+wv*0.6+avg*0.2})`;
            ctx.lineWidth   = 0.5 + wv * 1.4 + avg * 0.3;
          } else {
            ctx.strokeStyle = `rgba(96,165,250,${0.08 + avg * 0.3})`;
            ctx.lineWidth   = 0.4 + avg * 0.6;
          }
          ctx.beginPath(); ctx.moveTo(pts[i].sx, pts[i].sy); ctx.lineTo(pts[j].sx, pts[j].sy); ctx.stroke();
        }
      }

      /* lightning */
      bolts = bolts.filter(b => b.life > 0);
      bolts.forEach(bolt => {
        bolt.life -= bolt.decay;
        for (let s = 0; s < bolt.chain.length - 1; s++) {
          const a = pts[bolt.chain[s]], b = pts[bolt.chain[s+1]];
          if (!a || !b) continue;
          ctx.beginPath(); ctx.moveTo(a.sx, a.sy);
          for (let k = 1; k <= 6; k++) {
            const t = k / 6;
            ctx.lineTo(a.sx+(b.sx-a.sx)*t+(Math.random()-.5)*14*(1-t), a.sy+(b.sy-a.sy)*t+(Math.random()-.5)*14*(1-t));
          }
          ctx.strokeStyle = `rgba(180,230,255,${bolt.life*0.25})`; ctx.lineWidth = 4; ctx.stroke();
          ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy);
          ctx.strokeStyle = `rgba(220,245,255,${bolt.life*0.9})`; ctx.lineWidth = 1.2; ctx.stroke();
        }
        [bolt.chain[0], bolt.chain[bolt.chain.length-1]].forEach(idx => {
          const p = pts[idx]; if (!p) return;
          const g = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, 18);
          g.addColorStop(0, `rgba(200,240,255,${bolt.life*0.8})`); g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.beginPath(); ctx.arc(p.sx, p.sy, 18, 0, Math.PI*2); ctx.fillStyle = g; ctx.fill();
        });
      });

      /* neural pulses */
      pulses = pulses.filter(pu => !pu.done);
      pulses.forEach(pu => {
        pu.t += pu.speed;
        if (pu.t >= 1) { pu.t = 0; pu.seg++; if (pu.seg >= pu.path.length-1) { pu.done=true; return; } }
        const a = pts[pu.path[pu.seg]], b = pts[pu.path[pu.seg+1]];
        if (!a || !b) return;
        const px = a.sx+(b.sx-a.sx)*pu.t, py = a.sy+(b.sy-a.sy)*pu.t;
        const t0 = Math.max(0, pu.t-0.22);
        const tg = ctx.createLinearGradient(a.sx+(b.sx-a.sx)*t0, a.sy+(b.sy-a.sy)*t0, px, py);
        tg.addColorStop(0,'rgba(96,165,250,0)'); tg.addColorStop(1,'rgba(147,210,255,0.8)');
        ctx.beginPath(); ctx.moveTo(a.sx+(b.sx-a.sx)*t0, a.sy+(b.sy-a.sy)*t0); ctx.lineTo(px,py);
        ctx.strokeStyle=tg; ctx.lineWidth=2.5; ctx.stroke();
        const g = ctx.createRadialGradient(px,py,0,px,py,12);
        g.addColorStop(0,'rgba(220,245,255,1)'); g.addColorStop(0.4,'rgba(96,165,250,0.7)'); g.addColorStop(1,'rgba(0,0,0,0)');
        ctx.beginPath(); ctx.arc(px,py,12,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
        ctx.beginPath(); ctx.arc(px,py,3,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill();
      });

      /* nodes */
      pts.forEach((p, i) => {
        const isNear = i === nearIdx && nearDist < 90;
        const wv = nodeWave[i];
        const cr = Math.round(96  + wv * 110);
        const cg = Math.round(165 + wv * 80);
        const r  = isNear ? 5.5 : (1.4 + p.d * 2.8) * (1 + wv * 0.5);
        const al = isNear ? 1   : 0.3 + p.d * 0.7 + wv * 0.3;
        if (wv > 0.15) {
          const h = ctx.createRadialGradient(p.sx,p.sy,0,p.sx,p.sy,r*5);
          h.addColorStop(0,`rgba(${cr},${cg},255,${wv*0.3})`); h.addColorStop(1,'rgba(0,0,0,0)');
          ctx.beginPath(); ctx.arc(p.sx,p.sy,r*5,0,Math.PI*2); ctx.fillStyle=h; ctx.fill();
        }
        if (isNear) {
          const g = ctx.createRadialGradient(p.sx,p.sy,0,p.sx,p.sy,24);
          g.addColorStop(0,'rgba(147,210,255,0.5)'); g.addColorStop(1,'rgba(0,0,0,0)');
          ctx.beginPath(); ctx.arc(p.sx,p.sy,24,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
        }
        ctx.beginPath(); ctx.arc(p.sx,p.sy,r,0,Math.PI*2);
        ctx.fillStyle=`rgba(${cr},${cg},250,${Math.min(al,1)})`; ctx.fill();
        if (p.d > 0.7 || isNear || wv > 0.3) {
          ctx.beginPath(); ctx.arc(p.sx,p.sy,r*0.38,0,Math.PI*2);
          ctx.fillStyle=`rgba(220,240,255,${isNear?1:Math.max((p.d-0.7)*3,wv*0.9)})`; ctx.fill();
        }
      });

      /* gravity well visual */
      if (gravityActive && mouse.x > 0) {
        const g = ctx.createRadialGradient(mouse.x,mouse.y,0,mouse.x,mouse.y,180);
        g.addColorStop(0,'rgba(96,165,250,0.12)'); g.addColorStop(0.5,'rgba(96,165,250,0.04)'); g.addColorStop(1,'rgba(0,0,0,0)');
        ctx.beginPath(); ctx.arc(mouse.x,mouse.y,180,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
        ctx.beginPath(); ctx.arc(mouse.x,mouse.y,8,0,Math.PI*2);
        ctx.strokeStyle='rgba(147,210,255,0.7)'; ctx.lineWidth=1.5; ctx.stroke();
      }

      /* black hole glow */
      if (blackHole) {
        const intensity = Math.sin(Math.min(bhT, Math.PI));
        const g = ctx.createRadialGradient(cx,cy,0,cx,cy,RADIUS*0.5);
        g.addColorStop(0,`rgba(0,10,40,${intensity*0.85})`); g.addColorStop(0.4,`rgba(30,80,180,${intensity*0.3})`); g.addColorStop(1,'rgba(0,0,0,0)');
        ctx.beginPath(); ctx.arc(cx,cy,RADIUS*0.5,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    /* events */
    const onMove  = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = -999; mouse.y = -999; };
    const onDown  = () => { mouse.down = true; gravityActive = true; };
    const onUp    = () => { mouse.down = false; gravityActive = false; };

    const onClick = e => {
      const { cx, cy } = getCenter();
      const now = Date.now();
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      if (dist > RADIUS * 1.5) return;

      if (now - lastClick < 350) {
        /* double click → black hole */
        if (!blackHole) {
          blackHole = true; bhT = 0;
          base.forEach(b => { b.bhOrigX=b.x; b.bhOrigY=b.y; b.bhOrigZ=b.z; });
        }
      } else {
        /* single click → color wave */
        const approxPts = base.map(b => ({ sx: cx + b.x, sy: cy + b.y }));
        let originIdx = 0, minD = Infinity;
        approxPts.forEach((p, i) => {
          const d = Math.hypot(p.sx - e.clientX, p.sy - e.clientY);
          if (d < minD) { minD = d; originIdx = i; }
        });
        waves.push({ t: 0, originIdx });
        pulses = [];
        spawnPulse(approxPts, originIdx);
      }
      lastClick = now;
    };

    const onScroll = e => {
      /* scroll → speed burst then decay */
      autoSpeed = Math.min(0.035, autoSpeed + Math.abs(e.deltaY) * 0.00008);
      speedDecay = true;
    };
    const onOrientation = () => setTimeout(resize, 150);

    resize(); draw(); scheduleMorph();

    const fireLightning = () => {
      const approxPts = base.map(b => ({ sx: canvas.width*0.72+b.x, sy: canvas.height*0.5+b.y }));
      spawnBolt(approxPts);
      boltTimer = setTimeout(fireLightning, 600 + Math.random() * 900);
    };
    boltTimer = setTimeout(fireLightning, 1200);

    window.addEventListener('mousemove',         onMove);
    window.addEventListener('mouseleave',        onLeave);
    window.addEventListener('mousedown',         onDown);
    window.addEventListener('mouseup',           onUp);
    window.addEventListener('click',             onClick);
    window.addEventListener('wheel',             onScroll, { passive: true });
    window.addEventListener('resize',            resize);
    window.addEventListener('orientationchange', onOrientation);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(shapeTimer); clearTimeout(boltTimer); clearTimeout(hoverPulseTimer);
      window.removeEventListener('mousemove',         onMove);
      window.removeEventListener('mouseleave',        onLeave);
      window.removeEventListener('mousedown',         onDown);
      window.removeEventListener('mouseup',           onUp);
      window.removeEventListener('click',             onClick);
      window.removeEventListener('wheel',             onScroll);
      window.removeEventListener('resize',            resize);
      window.removeEventListener('orientationchange', onOrientation);
    };
  }, []);

  return (
    <section className="hero" id="hero">
      <canvas ref={canvasRef} className="hero-canvas" />
      <div className="hero-content">
        <h1 className="hero-name">Kalapati <span>Dinesh</span></h1>
        <p className="hero-desc">
          Aspiring Java Full Stack Developer passionate about building scalable web applications
          with clean code and modern technologies.
        </p>
        <div className="hero-actions">
          <Link to="projects" smooth duration={600} offset={-70} className="btn-primary">
            View My Work
          </Link>
          <Link to="contact" smooth duration={600} offset={-70} className="btn-outline">
            Get In Touch
          </Link>
        </div>
        <div className="hero-socials">
          <a href="https://github.com/Kalapati-Dinesh" target="_blank" rel="noreferrer"><FaGithub /></a>
          <a href="https://www.linkedin.com/in/dinesh2745" target="_blank" rel="noreferrer"><FaLinkedin /></a>
          <a href="mailto:dineshkalapati0498@gmail.com"><MdEmail /></a>
        </div>
      </div>
    </section>
  );
}
