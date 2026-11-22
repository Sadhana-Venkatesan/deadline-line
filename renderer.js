/**
 * Deadline Line — Precision High-DPI Canvas 2D Lock Screen & Handshake 3:2 Cover Renderer
 * Dual-mode: works cleanly over file:// AND http(s):// with zero external dependencies.
 */
(function (root) {
  const DL = (root.DeadlineLine = root.DeadlineLine || {});

  const FONT_DISPLAY = "'Space Grotesk', 'Bahnschrift', 'SF Pro Display', 'Segoe UI', -apple-system, sans-serif";
  const FONT_SANS = "'Inter', 'SF Pro Text', 'Segoe UI', -apple-system, sans-serif";
  const FONT_MONO = "'JetBrains Mono', 'Cascadia Mono', 'SF Mono', 'Consolas', monospace";
  const FONT_SERIF = "'Instrument Serif', 'Georgia', 'Times New Roman', serif";

  function roundRectPath(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function fitText(ctx, text, maxWidth) {
    const str = String(text || '');
    if (ctx.measureText(str).width <= maxWidth) return str;
    let trimmed = str;
    while (trimmed.length > 3 && ctx.measureText(`${trimmed}…`).width > maxWidth) {
      trimmed = trimmed.slice(0, -1);
    }
    return `${trimmed}…`;
  }

  function getPalette(state) {
    const theme = DL.THEMES[state.theme] || DL.THEMES.metro;
    return theme.modes[state.mode] || theme.modes.dark || Object.values(theme.modes)[0];
  }

  function drawMilestoneVectorIcon(ctx, iconId, cx, cy, size, color, accentColor) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = Math.max(2.2, size * 0.11);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const r = size * 0.44;

    switch (iconId) {
      case 'compass': {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.42, cy - r * 0.42);
        ctx.lineTo(cx + r * 0.12, cy + r * 0.12);
        ctx.lineTo(cx - r * 0.42, cy + r * 0.42);
        ctx.lineTo(cx - r * 0.12, cy - r * 0.12);
        ctx.closePath();
        ctx.fillStyle = accentColor;
        ctx.fill();
        break;
      }
      case 'code': {
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.45, cy - r * 0.48);
        ctx.lineTo(cx - r * 0.92, cy);
        ctx.lineTo(cx - r * 0.45, cy + r * 0.48);
        ctx.moveTo(cx + r * 0.45, cy - r * 0.48);
        ctx.lineTo(cx + r * 0.92, cy);
        ctx.lineTo(cx + r * 0.45, cy + r * 0.48);
        ctx.stroke();
        ctx.strokeStyle = accentColor;
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.16, cy - r * 0.62);
        ctx.lineTo(cx - r * 0.16, cy + r * 0.62);
        ctx.stroke();
        break;
      }
      case 'shield': {
        ctx.beginPath();
        ctx.moveTo(cx, cy - r * 0.95);
        ctx.lineTo(cx + r * 0.78, cy - r * 0.52);
        ctx.lineTo(cx + r * 0.68, cy + r * 0.25);
        ctx.quadraticCurveTo(cx, cy + r * 1.0, cx, cy + r * 1.0);
        ctx.quadraticCurveTo(cx, cy + r * 1.0, cx - r * 0.68, cy + r * 0.25);
        ctx.lineTo(cx - r * 0.78, cy - r * 0.52);
        ctx.closePath();
        ctx.stroke();
        ctx.strokeStyle = accentColor;
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.28, cy + r * 0.02);
        ctx.lineTo(cx - r * 0.04, cy + r * 0.28);
        ctx.lineTo(cx + r * 0.34, cy - r * 0.22);
        ctx.stroke();
        break;
      }
      case 'deck': {
        roundRectPath(ctx, cx - r * 0.9, cy - r * 0.75, r * 1.8, r * 1.18, r * 0.22);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx, cy + r * 0.43);
        ctx.lineTo(cx, cy + r * 0.88);
        ctx.moveTo(cx - r * 0.42, cy + r * 0.88);
        ctx.lineTo(cx + r * 0.42, cy + r * 0.88);
        ctx.stroke();
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.2, cy - r * 0.38);
        ctx.lineTo(cx + r * 0.32, cy - r * 0.14);
        ctx.lineTo(cx - r * 0.2, cy + r * 0.1);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 'rocket': {
        ctx.beginPath();
        ctx.moveTo(cx, cy - r * 0.98);
        ctx.quadraticCurveTo(cx + r * 0.62, cy - r * 0.3, cx + r * 0.44, cy + r * 0.52);
        ctx.lineTo(cx - r * 0.44, cy + r * 0.52);
        ctx.quadraticCurveTo(cx - r * 0.62, cy - r * 0.3, cx, cy - r * 0.98);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy - r * 0.15, r * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = accentColor;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.24, cy + r * 0.66);
        ctx.lineTo(cx, cy + r * 1.0);
        ctx.lineTo(cx + r * 0.24, cy + r * 0.66);
        ctx.strokeStyle = accentColor;
        ctx.stroke();
        break;
      }
      case 'book': {
        roundRectPath(ctx, cx - r * 0.82, cy - r * 0.78, r * 1.64, r * 1.56, r * 0.22);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx, cy - r * 0.76);
        ctx.lineTo(cx, cy + r * 0.76);
        ctx.stroke();
        ctx.strokeStyle = accentColor;
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.24, cy - r * 0.3);
        ctx.lineTo(cx + r * 0.58, cy - r * 0.3);
        ctx.moveTo(cx + r * 0.24, cy + r * 0.08);
        ctx.lineTo(cx + r * 0.58, cy + r * 0.08);
        ctx.stroke();
        break;
      }
      case 'timer': {
        ctx.beginPath();
        ctx.arc(cx, cy + r * 0.08, r * 0.78, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.26, cy - r * 0.92);
        ctx.lineTo(cx + r * 0.26, cy - r * 0.92);
        ctx.stroke();
        ctx.strokeStyle = accentColor;
        ctx.beginPath();
        ctx.moveTo(cx, cy + r * 0.08);
        ctx.lineTo(cx, cy - r * 0.34);
        ctx.moveTo(cx, cy + r * 0.08);
        ctx.lineTo(cx + r * 0.34, cy + r * 0.22);
        ctx.stroke();
        break;
      }
      case 'calendar': {
        roundRectPath(ctx, cx - r * 0.84, cy - r * 0.68, r * 1.68, r * 1.48, r * 0.22);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.84, cy - r * 0.2);
        ctx.lineTo(cx + r * 0.84, cy - r * 0.2);
        ctx.moveTo(cx - r * 0.38, cy - r * 0.94);
        ctx.lineTo(cx - r * 0.38, cy - r * 0.52);
        ctx.moveTo(cx + r * 0.38, cy - r * 0.94);
        ctx.lineTo(cx + r * 0.38, cy - r * 0.52);
        ctx.stroke();
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.arc(cx, cy + r * 0.28, r * 0.19, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'spark': {
        ctx.strokeStyle = accentColor;
        ctx.beginPath();
        ctx.moveTo(cx, cy - r * 0.96);
        ctx.quadraticCurveTo(cx, cy, cx + r * 0.96, cy);
        ctx.quadraticCurveTo(cx, cy, cx, cy + r * 0.96);
        ctx.quadraticCurveTo(cx, cy, cx - r * 0.96, cy);
        ctx.quadraticCurveTo(cx, cy, cx, cy - r * 0.96);
        ctx.stroke();
        break;
      }
      default: {
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const ang = (i * Math.PI) / 5 - Math.PI / 2;
          const rad = i % 2 === 0 ? r * 0.95 : r * 0.42;
          const px = cx + Math.cos(ang) * rad;
          const py = cy + Math.sin(ang) * rad;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = accentColor;
        ctx.stroke();
        break;
      }
    }
    ctx.restore();
  }

  function drawThemeAtmosphere(ctx, W, H, state, p, isDesktop) {
    // Support optional client-side custom reference/background photo with cover-crop & clock-legibility scrim
    if (state.bgImage && state.bgImage.complete && state.bgImage.naturalWidth > 0) {
      const img = state.bgImage;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = W / H;
      let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
      if (imgRatio > canvasRatio) {
        sw = img.naturalHeight * canvasRatio;
        sx = (img.naturalWidth - sw) / 2;
      } else {
        sh = img.naturalWidth / canvasRatio;
        sy = (img.naturalHeight - sh) / 2;
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
      const scrim = ctx.createLinearGradient(0, 0, 0, H);
      if (p.isDark) {
        scrim.addColorStop(0, 'rgba(8, 11, 17, 0.56)');
        scrim.addColorStop(0.5, 'rgba(8, 11, 17, 0.42)');
        scrim.addColorStop(1, 'rgba(8, 11, 17, 0.62)');
      } else {
        scrim.addColorStop(0, 'rgba(18, 28, 24, 0.34)');
        scrim.addColorStop(0.5, 'rgba(248, 246, 240, 0.25)');
        scrim.addColorStop(1, 'rgba(18, 28, 24, 0.32)');
      }
      ctx.fillStyle = scrim;
      ctx.fillRect(0, 0, W, H);
      return;
    }

    const grad = ctx.createLinearGradient(0, 0, isDesktop ? W : 0, H);
    grad.addColorStop(0, p.bg);
    grad.addColorStop(0.55, p.bgSecondary);
    grad.addColorStop(1, p.bg);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    if (state.theme === 'glass') {
      const orbs = p.isDark
        ? [
            { x: 0.16, y: 0.12, r: 0.34, c: 'rgba(52, 211, 153, 0.18)' },
            { x: 0.84, y: 0.18, r: 0.36, c: 'rgba(245, 158, 11, 0.16)' },
            { x: 0.5, y: 0.52, r: 0.45, c: 'rgba(20, 184, 166, 0.14)' },
            { x: 0.2, y: 0.86, r: 0.35, c: 'rgba(251, 191, 36, 0.16)' },
          ]
        : [
            { x: 0.14, y: 0.11, r: 0.34, c: 'rgba(92, 158, 108, 0.42)' },
            { x: 0.86, y: 0.14, r: 0.38, c: 'rgba(245, 198, 110, 0.46)' },
            { x: 0.52, y: 0.22, r: 0.32, c: 'rgba(130, 186, 152, 0.36)' },
            { x: 0.18, y: 0.78, r: 0.42, c: 'rgba(236, 168, 86, 0.36)' },
            { x: 0.85, y: 0.84, r: 0.38, c: 'rgba(82, 148, 104, 0.38)' },
          ];
      orbs.forEach((o) => {
        const rr = Math.min(W, H) * o.r;
        const g = ctx.createRadialGradient(W * o.x, H * o.y, 0, W * o.x, H * o.y, rr);
        g.addColorStop(0, o.c);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      });

      if (!p.isDark) {
        const topScrim = ctx.createLinearGradient(0, 0, 0, H * 0.33);
        topScrim.addColorStop(0, 'rgba(25, 58, 42, 0.38)');
        topScrim.addColorStop(0.65, 'rgba(25, 58, 42, 0.16)');
        topScrim.addColorStop(1, 'rgba(25, 58, 42, 0)');
        ctx.fillStyle = topScrim;
        ctx.fillRect(0, 0, W, H * 0.33);
      }

      const drawLeaf = (lx, ly, scale, rot, fill) => {
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(rot);
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(scale * 0.55, -scale * 0.38, scale, 0);
        ctx.quadraticCurveTo(scale * 0.55, scale * 0.38, 0, 0);
        ctx.fill();
        ctx.restore();
      };
      const leafColor = p.isDark ? 'rgba(134, 239, 172, 0.10)' : 'rgba(38, 92, 62, 0.15)';
      const ls = Math.min(W, H) * 0.18;
      drawLeaf(W * -0.02, H * 0.06, ls, 0.35, leafColor);
      drawLeaf(W * 0.04, H * 0.02, ls * 0.78, 0.85, leafColor);
      drawLeaf(W * 1.02, H * 0.07, ls, 2.7, leafColor);
      drawLeaf(W * 0.96, H * 0.92, ls * 0.95, 3.6, leafColor);
      drawLeaf(W * 0.02, H * 0.94, ls * 0.85, -0.5, leafColor);
    } else {
      const glowX = isDesktop ? W * 0.24 : W * 0.5;
      const glowY = isDesktop ? H * 0.56 : H * 0.43;
      const glowR = isDesktop ? W * 0.36 : W * 0.7;
      const rad = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowR);
      rad.addColorStop(0, p.accentSoft);
      rad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rad;
      ctx.fillRect(0, 0, W, H);
    }

    if (state.theme === 'metro') {
      ctx.strokeStyle = p.grid;
      ctx.lineWidth = Math.max(1.5, W * 0.0014);
      const step = isDesktop ? W / 24 : W / 10;
      for (let x = step; x < W; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = step; y < H; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      ctx.strokeStyle = p.accentSoft;
      ctx.lineWidth = Math.max(4, W * 0.005);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      if (isDesktop) {
        ctx.moveTo(W * 0.89, 0);
        ctx.lineTo(W * 0.965, H * 0.22);
        ctx.lineTo(W * 0.965, H);
      } else {
        ctx.moveTo(W * 0.88, H * 0.27);
        ctx.lineTo(W * 0.955, H * 0.34);
        ctx.lineTo(W * 0.955, H * 0.835);
      }
      ctx.stroke();
    } else if (state.theme === 'flight') {
      const step = isDesktop ? W / 20 : W / 12;
      ctx.fillStyle = p.grid;
      for (let x = step; x < W; x += step) {
        for (let y = step; y < H; y += step) {
          ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
        }
      }
      const tickYStart = H * 0.09;
      const tickYEnd = H * 0.84;
      const tickGap = isDesktop ? H * 0.032 : H * 0.022;
      ctx.strokeStyle = p.surfaceBorder;
      ctx.lineWidth = Math.max(1.5, W * 0.0014);
      let idx = 0;
      for (let y = tickYStart; y <= tickYEnd; y += tickGap) {
        const len = idx % 5 === 0 ? W * 0.02 : W * 0.009;
        ctx.beginPath();
        ctx.moveTo(W * 0.024, y);
        ctx.lineTo(W * 0.024 + len, y);
        ctx.moveTo(W * 0.976 - len, y);
        ctx.lineTo(W * 0.976, y);
        ctx.stroke();
        idx++;
      }
    } else if (state.theme === 'editorial') {
      ctx.strokeStyle = p.grid;
      ctx.lineWidth = Math.max(1.2, W * 0.001);
      const cell = W / (isDesktop ? 16 : 8);
      for (let x = cell; x < W; x += cell) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = cell; y < H; y += cell) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      const inset = isDesktop ? W * 0.024 : W * 0.04;
      ctx.strokeStyle = p.surfaceBorder;
      ctx.lineWidth = Math.max(2, W * 0.0016);
      ctx.strokeRect(inset, inset, W - inset * 2, H - inset * 2);
    } else if (state.theme === 'botanical') {
      ctx.strokeStyle = p.grid;
      ctx.lineWidth = Math.max(2, W * 0.0018);
      const cx = isDesktop ? W * 0.8 : W * 0.86;
      const cy = isDesktop ? H * 0.5 : H * 0.36;
      [0.18, 0.28, 0.4, 0.54].forEach((rMul) => {
        ctx.beginPath();
        ctx.arc(cx, cy, Math.min(W, H) * rMul, 0, Math.PI * 2);
        ctx.stroke();
      });
    }
    ctx.restore();
  }

  function drawMilestoneCheckbox(ctx, x, y, size, style, isDone, isActive, isFinal, p) {
    ctx.save();
    if (style === 'metro') {
      const r = size * (isActive || isFinal ? 0.54 : 0.44);
      if (isActive) {
        ctx.beginPath();
        ctx.arc(x, y, r * 1.65, 0, Math.PI * 2);
        ctx.fillStyle = p.accentGlow;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      if (isDone) {
        ctx.fillStyle = p.secondaryAccent;
        ctx.fill();
        ctx.strokeStyle = p.bg;
        ctx.lineWidth = Math.max(3, size * 0.12);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(x - r * 0.4, y + r * 0.04);
        ctx.lineTo(x - r * 0.08, y + r * 0.36);
        ctx.lineTo(x + r * 0.44, y - r * 0.34);
        ctx.stroke();
      } else if (isActive) {
        ctx.fillStyle = p.accent;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, r * 0.38, 0, Math.PI * 2);
        ctx.fillStyle = p.bg;
        ctx.fill();
      } else if (isFinal) {
        ctx.fillStyle = p.surfaceSolid;
        ctx.fill();
        ctx.strokeStyle = p.accent;
        ctx.lineWidth = Math.max(4, size * 0.14);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, r * 0.36, 0, Math.PI * 2);
        ctx.fillStyle = p.accent;
        ctx.fill();
      } else {
        ctx.fillStyle = p.surfaceSolid;
        ctx.fill();
        ctx.strokeStyle = p.textMuted;
        ctx.lineWidth = Math.max(3, size * 0.11);
        ctx.stroke();
      }
    } else {
      const box = size * 0.94;
      const bx = x - box / 2;
      const by = y - box / 2;
      const rad = style === 'editorial' ? box * 0.12 : box * 0.28;
      roundRectPath(ctx, bx, by, box, box, rad);
      if (isDone) {
        ctx.fillStyle = p.secondaryAccent;
        ctx.fill();
        ctx.strokeStyle = p.isDark ? '#0B0E14' : '#FFFFFF';
        ctx.lineWidth = Math.max(3, box * 0.13);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(x - box * 0.24, y + box * 0.03);
        ctx.lineTo(x - box * 0.04, y + box * 0.22);
        ctx.lineTo(x + box * 0.28, y - box * 0.2);
        ctx.stroke();
      } else {
        ctx.fillStyle = isActive ? p.accentSoft : 'transparent';
        ctx.fill();
        ctx.strokeStyle = isActive || isFinal ? p.accent : p.textSecondary;
        ctx.lineWidth = Math.max(3, box * 0.095);
        ctx.stroke();
        if (isActive) {
          ctx.beginPath();
          ctx.arc(x, y, box * 0.17, 0, Math.PI * 2);
          ctx.fillStyle = p.accent;
          ctx.fill();
        }
      }
    }
    ctx.restore();
  }

  function renderPortraitLockScreen(ctx, W, H, state, p, metrics) {
    const padX = W * 0.068;
    const contentW = W - padX * 2;
    const isAndroid = state.device === 'android';

    const heroTop = H * 0.334;
    const heroH = H * 0.142;
    const listTop = heroTop + heroH + H * 0.018;
    const footerH = H * 0.045;
    const footerBottom = H * (isAndroid ? 0.816 : 0.846);
    const footerTop = footerBottom - footerH;
    const listBottom = footerTop - H * 0.015;
    const listH = listBottom - listTop;

    const milestones = state.milestones.slice(0, 6);
    const activeIdx = DL.getActiveMilestoneIndex(milestones);
    const doneCount = milestones.filter((m) => m.done).length;
    const progressPct = milestones.length ? Math.round((doneCount / milestones.length) * 100) : 0;

    ctx.save();
    ctx.strokeStyle = p.surfaceBorder;
    ctx.lineWidth = Math.max(1.5, W * 0.0016);
    ctx.beginPath();
    ctx.moveTo(padX, heroTop - H * 0.011);
    ctx.lineTo(W - padX, heroTop - H * 0.011);
    ctx.stroke();

    ctx.font = `700 ${Math.round(W * 0.022)}px ${FONT_MONO}`;
    ctx.fillStyle = state.theme === 'glass' && !p.isDark ? p.textPrimary : p.textMuted;
    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'left';
    ctx.fillText(`T-MINUS COUNTDOWN · ${(state.lineCode || 'LINE 26').toUpperCase()}`, padX, heroTop - H * 0.016);

    ctx.textAlign = 'right';
    ctx.fillStyle = p.accent;
    ctx.fillText(`TARGET ${metrics.formattedShortTarget}`, W - padX, heroTop - H * 0.016);
    ctx.restore();

    ctx.save();
    const cardRadius = state.theme === 'editorial' ? W * 0.014 : W * 0.044;
    if (state.theme === 'glass') {
      ctx.shadowColor = 'rgba(18, 34, 24, 0.12)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 14;
    }
    roundRectPath(ctx, padX, heroTop, contentW, heroH, cardRadius);
    ctx.fillStyle = p.surface;
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = p.surfaceBorder;
    ctx.lineWidth = Math.max(2, W * 0.002);
    ctx.stroke();

    if (state.theme === 'metro' || state.theme === 'flight') {
      ctx.save();
      roundRectPath(ctx, padX, heroTop, contentW, heroH, cardRadius);
      ctx.clip();
      ctx.fillStyle = p.accent;
      ctx.fillRect(padX, heroTop, W * 0.013, heroH);
      ctx.restore();
    }

    const innerPadX = W * 0.05;
    const innerX = padX + innerPadX;
    const innerRight = padX + contentW - innerPadX;

    const countStr = metrics.isToday ? 'T-0' : `T-${metrics.days}`;
    const numFontSize = Math.round(W * (countStr.length >= 4 ? 0.118 : 0.132));
    ctx.font =
      state.theme === 'botanical'
        ? `400 ${Math.round(numFontSize * 1.12)}px ${FONT_SERIF}`
        : `700 ${numFontSize}px ${FONT_DISPLAY}`;
    ctx.fillStyle = p.accent;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(countStr, innerX, heroTop + heroH * 0.62);
    const numW = ctx.measureText(countStr).width;

    const labelX = innerX + numW + W * 0.036;
    const rightColMaxW = innerRight - labelX;

    const pillText = metrics.isPast
      ? 'DEADLINE REACHED'
      : metrics.isToday
      ? 'DEADLINE TODAY'
      : `${metrics.days} ${metrics.days === 1 ? 'DAY' : 'DAYS'} TO GO`;
    ctx.font = `700 ${Math.round(W * 0.022)}px ${FONT_MONO}`;
    const pillH = Math.round(W * 0.044);
    const pillW = Math.min(rightColMaxW, ctx.measureText(pillText).width + W * 0.038);
    const pillY = heroTop + heroH * 0.16;
    roundRectPath(ctx, labelX, pillY, pillW, pillH, pillH / 2);
    ctx.fillStyle = p.accentSoft;
    ctx.fill();
    ctx.fillStyle = p.accent;
    ctx.textBaseline = 'middle';
    ctx.fillText(fitText(ctx, pillText, pillW - W * 0.025), labelX + W * 0.019, pillY + pillH / 2 + 1);

    ctx.font = `700 ${Math.round(W * 0.044)}px ${FONT_DISPLAY}`;
    ctx.fillStyle = p.textPrimary;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(fitText(ctx, state.title.toUpperCase(), rightColMaxW), labelX, heroTop + heroH * 0.56);

    ctx.font = `500 ${Math.round(W * 0.028)}px ${FONT_SANS}`;
    ctx.fillStyle = p.textSecondary;
    ctx.fillText(fitText(ctx, state.subtitle || metrics.formattedTarget, rightColMaxW), labelX, heroTop + heroH * 0.72);

    const barY = heroTop + heroH * 0.845;
    const barH = Math.max(8, Math.round(W * 0.01));
    const barW = innerRight - innerX;
    const segCount = Math.max(1, milestones.length);
    const segGap = W * 0.012;
    const segW = (barW - segGap * (segCount - 1)) / segCount;
    for (let i = 0; i < segCount; i++) {
      const sx = innerX + i * (segW + segGap);
      roundRectPath(ctx, sx, barY, segW, barH, barH / 2);
      ctx.fillStyle = milestones[i]?.done ? p.secondaryAccent : i === activeIdx ? p.accent : p.trackMuted;
      ctx.fill();
    }
    ctx.restore();

    ctx.save();
    if (state.theme === 'glass') {
      ctx.shadowColor = 'rgba(18, 34, 24, 0.14)';
      ctx.shadowBlur = 46;
      ctx.shadowOffsetY = 18;
    }
    roundRectPath(ctx, padX, listTop, contentW, listH, cardRadius);
    ctx.fillStyle = p.surface;
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = p.surfaceBorder;
    ctx.lineWidth = Math.max(2, W * 0.002);
    ctx.stroke();

    const headerH = listH * 0.115;
    const headerY = listTop + headerH * 0.54;
    ctx.font = `700 ${Math.round(W * 0.022)}px ${FONT_MONO}`;
    ctx.fillStyle = p.textMuted;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const listHeader =
      state.theme === 'metro'
        ? `EXPRESS ROUTE · ${doneCount}/${milestones.length} CLEARED`
        : state.theme === 'flight'
        ? `FLIGHT CHECKLIST · ${doneCount}/${milestones.length} VERIFIED`
        : `T-MINUS MILESTONES · ${doneCount}/${milestones.length} DONE`;
    ctx.fillText(listHeader, padX + W * 0.048, headerY);

    ctx.textAlign = 'right';
    ctx.fillStyle = p.secondaryAccent;
    ctx.fillText(`${progressPct}% COMPLETE`, padX + contentW - W * 0.048, headerY);

    ctx.strokeStyle = p.surfaceBorder;
    ctx.lineWidth = Math.max(1.5, W * 0.0014);
    ctx.beginPath();
    ctx.moveTo(padX + W * 0.044, listTop + headerH);
    ctx.lineTo(padX + contentW - W * 0.044, listTop + headerH);
    ctx.stroke();

    const rowsTop = listTop + headerH + listH * 0.03;
    const rowsBottom = listTop + listH - listH * 0.032;
    const count = Math.max(1, milestones.length);
    const rowStep = (rowsBottom - rowsTop) / count;
    const trackX = padX + W * 0.088;

    if (count > 1 && (state.theme === 'metro' || state.theme === 'botanical' || state.theme === 'flight')) {
      const firstY = rowsTop + rowStep * 0.5;
      const lastY = rowsTop + rowStep * (count - 0.5);
      ctx.strokeStyle = p.trackMuted;
      ctx.lineWidth = Math.max(5, Math.round(W * (state.theme === 'metro' ? 0.01 : 0.0045)));
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(trackX, firstY);
      ctx.lineTo(trackX, lastY);
      ctx.stroke();

      const activeY = rowsTop + rowStep * (activeIdx + 0.5);
      const pg = ctx.createLinearGradient(0, firstY, 0, activeY);
      pg.addColorStop(0, p.secondaryAccent);
      pg.addColorStop(1, p.accent);
      ctx.strokeStyle = pg;
      ctx.beginPath();
      ctx.moveTo(trackX, firstY);
      ctx.lineTo(trackX, activeY);
      ctx.stroke();
    }

    milestones.forEach((m, idx) => {
      const cy = rowsTop + rowStep * (idx + 0.5);
      const isDone = m.done;
      const isActive = idx === activeIdx && !isDone;
      const isFinal = idx === milestones.length - 1;

      if (isActive) {
        const hlPad = W * 0.024;
        const hlH = rowStep * 0.82;
        roundRectPath(ctx, padX + hlPad, cy - hlH / 2, contentW - hlPad * 2, hlH, W * 0.026);
        ctx.fillStyle = p.accentSoft;
        ctx.fill();
        ctx.strokeStyle = p.accent;
        ctx.lineWidth = Math.max(1.5, W * 0.0018);
        ctx.stroke();
      }

      drawMilestoneCheckbox(ctx, trackX, cy, W * 0.044, state.theme, isDone, isActive, isFinal, p);

      const badgeSize = Math.min(rowStep * 0.64, W * 0.096);
      const badgeRightX = padX + contentW - W * 0.044;
      const badgeCx = badgeRightX - badgeSize / 2;

      roundRectPath(ctx, badgeCx - badgeSize / 2, cy - badgeSize / 2, badgeSize, badgeSize, badgeSize * 0.28);
      ctx.fillStyle = isActive ? p.accentSoft : p.isDark ? 'rgba(255,255,255,0.055)' : 'rgba(18,21,28,0.05)';
      ctx.fill();
      ctx.strokeStyle = isActive ? p.accent : p.surfaceBorder;
      ctx.lineWidth = Math.max(1.5, W * 0.0014);
      ctx.stroke();

      drawMilestoneVectorIcon(
        ctx,
        m.icon || 'star',
        badgeCx,
        cy,
        badgeSize * 0.54,
        isDone ? p.secondaryAccent : p.textPrimary,
        isDone ? p.secondaryAccent : p.accent,
      );

      const textX = trackX + W * 0.058;
      const textMaxW = badgeCx - badgeSize / 2 - textX - W * 0.028;

      const tTag = DL.formatTMinusTag(m.date, state.targetDate);
      const datePart = `(${DL.formatShortDate(m.date)})`;

      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      const topLineY = cy - rowStep * 0.175;
      const botLineY = cy + rowStep * 0.175;

      ctx.font = `700 ${Math.round(W * 0.026)}px ${FONT_MONO}`;
      ctx.fillStyle = isDone ? p.secondaryAccent : isActive || isFinal ? p.accent : p.textPrimary;
      ctx.fillText(tTag, textX, topLineY);
      const tW = ctx.measureText(tTag).width;

      ctx.font = `600 ${Math.round(W * 0.024)}px ${FONT_MONO}`;
      ctx.fillStyle = p.textSecondary;
      ctx.fillText(` ${datePart}`, textX + tW, topLineY);
      const dW = ctx.measureText(` ${datePart}`).width;

      const statusChip = isActive ? ' · NEXT' : isFinal ? ' · GOAL' : isDone ? ' · DONE' : '';
      if (statusChip && tW + dW + W * 0.12 < textMaxW) {
        ctx.font = `700 ${Math.round(W * 0.02)}px ${FONT_MONO}`;
        ctx.fillStyle = isDone ? p.secondaryAccent : p.accent;
        ctx.fillText(statusChip, textX + tW + dW + W * 0.008, topLineY);
      }

      const rowFontSize = Math.round(W * (isActive || isFinal ? 0.036 : 0.033));
      ctx.font = `${isActive || isFinal ? '700' : '600'} ${rowFontSize}px ${FONT_SANS}`;
      ctx.fillStyle = isDone ? p.textSecondary : p.textPrimary;
      const cleanLabel = fitText(ctx, m.label, textMaxW);
      ctx.fillText(cleanLabel, textX, botLineY);

      if (isDone) {
        const lw = ctx.measureText(cleanLabel).width;
        ctx.strokeStyle = p.textMuted;
        ctx.lineWidth = Math.max(2, W * 0.0022);
        ctx.beginPath();
        ctx.moveTo(textX, botLineY);
        ctx.lineTo(textX + lw, botLineY);
        ctx.stroke();
      }
    });
    ctx.restore();

    if (state.dailyFocus && state.dailyFocus.trim()) {
      ctx.save();
      roundRectPath(ctx, padX, footerTop, contentW, footerH, footerH * 0.44);
      ctx.fillStyle = p.surface;
      ctx.fill();
      ctx.strokeStyle = p.surfaceBorder;
      ctx.lineWidth = Math.max(1.5, W * 0.0018);
      ctx.stroke();

      const dotX = padX + W * 0.046;
      const dotY = footerTop + footerH / 2;
      ctx.beginPath();
      ctx.arc(dotX, dotY, W * 0.0085, 0, Math.PI * 2);
      ctx.fillStyle = p.accent;
      ctx.fill();

      ctx.font = `700 ${Math.round(W * 0.02)}px ${FONT_MONO}`;
      ctx.fillStyle = p.accent;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('DAILY', dotX + W * 0.024, dotY);
      const tagW = ctx.measureText('DAILY').width;

      const focusX = dotX + W * 0.024 + tagW + W * 0.024;
      const focusMaxW = padX + contentW - focusX - W * 0.04;
      ctx.font = `500 ${Math.round(W * 0.025)}px ${FONT_SANS}`;
      ctx.fillStyle = p.textPrimary;
      ctx.fillText(fitText(ctx, state.dailyFocus, focusMaxW), focusX, dotY);
      ctx.restore();
    }
  }

  function renderDesktopLockScreen(ctx, W, H, state, p, metrics) {
    const padX = W * 0.068;
    const bandTop = H * 0.335;
    const bandBottom = H * 0.83;
    const bandH = bandBottom - bandTop;

    const leftW = W * 0.355;
    const gapX = W * 0.03;
    const rightX = padX + leftW + gapX;
    const rightW = W - padX - rightX;
    const cardRadius = state.theme === 'editorial' ? W * 0.008 : W * 0.022;

    const milestones = state.milestones.slice(0, 6);
    const activeIdx = DL.getActiveMilestoneIndex(milestones);
    const doneCount = milestones.filter((m) => m.done).length;
    const progressPct = milestones.length ? Math.round((doneCount / milestones.length) * 100) : 0;

    ctx.save();
    roundRectPath(ctx, padX, bandTop, leftW, bandH, cardRadius);
    ctx.fillStyle = p.surface;
    ctx.fill();
    ctx.strokeStyle = p.surfaceBorder;
    ctx.lineWidth = Math.max(2.5, W * 0.0012);
    ctx.stroke();

    if (state.theme === 'metro' || state.theme === 'flight') {
      ctx.save();
      roundRectPath(ctx, padX, bandTop, leftW, bandH, cardRadius);
      ctx.clip();
      ctx.fillStyle = p.accent;
      ctx.fillRect(padX, bandTop, leftW, H * 0.011);
      ctx.restore();
    }

    const lx = padX + leftW * 0.082;
    const lMaxW = leftW * 0.836;

    ctx.font = `700 ${Math.round(H * 0.02)}px ${FONT_MONO}`;
    ctx.fillStyle = p.accent;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`T-MINUS COUNTDOWN  ·  ${metrics.formattedTarget}`, lx, bandTop + bandH * 0.11);

    const countStr = metrics.isToday ? 'T-0' : `T-${metrics.days}`;
    ctx.font =
      state.theme === 'botanical'
        ? `400 ${Math.round(H * 0.19)}px ${FONT_SERIF}`
        : `700 ${Math.round(H * 0.175)}px ${FONT_DISPLAY}`;
    ctx.fillStyle = p.accent;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(countStr, lx, bandTop + bandH * 0.47);
    const cw = ctx.measureText(countStr).width;

    ctx.font = `700 ${Math.round(H * 0.024)}px ${FONT_MONO}`;
    ctx.fillStyle = p.textSecondary;
    ctx.fillText(metrics.days === 1 ? 'DAY' : 'DAYS', lx + cw + W * 0.014, bandTop + bandH * 0.37);
    ctx.fillText('TO GO', lx + cw + W * 0.014, bandTop + bandH * 0.43);

    ctx.font = `700 ${Math.round(H * 0.044)}px ${FONT_DISPLAY}`;
    ctx.fillStyle = p.textPrimary;
    ctx.fillText(fitText(ctx, state.title.toUpperCase(), lMaxW), lx, bandTop + bandH * 0.625);

    ctx.font = `500 ${Math.round(H * 0.025)}px ${FONT_SANS}`;
    ctx.fillStyle = p.textSecondary;
    ctx.fillText(fitText(ctx, state.subtitle || '', lMaxW), lx, bandTop + bandH * 0.705);

    const barY = bandTop + bandH * 0.775;
    const barH = Math.max(10, Math.round(H * 0.011));
    const segCount = Math.max(1, milestones.length);
    const segGap = W * 0.006;
    const segW = (lMaxW - segGap * (segCount - 1)) / segCount;
    for (let i = 0; i < segCount; i++) {
      const sx = lx + i * (segW + segGap);
      roundRectPath(ctx, sx, barY, segW, barH, barH / 2);
      ctx.fillStyle = milestones[i]?.done ? p.secondaryAccent : i === activeIdx ? p.accent : p.trackMuted;
      ctx.fill();
    }

    ctx.font = `700 ${Math.round(H * 0.018)}px ${FONT_MONO}`;
    ctx.fillStyle = p.accent;
    ctx.textBaseline = 'middle';
    ctx.fillText('DAILY FOCUS', lx, bandTop + bandH * 0.865);

    ctx.font = `500 ${Math.round(H * 0.022)}px ${FONT_SANS}`;
    ctx.fillStyle = p.textPrimary;
    ctx.fillText(fitText(ctx, state.dailyFocus || '', lMaxW), lx, bandTop + bandH * 0.925);
    ctx.restore();

    ctx.save();
    roundRectPath(ctx, rightX, bandTop, rightW, bandH, cardRadius);
    ctx.fillStyle = p.surface;
    ctx.fill();
    ctx.strokeStyle = p.surfaceBorder;
    ctx.lineWidth = Math.max(2.5, W * 0.0012);
    ctx.stroke();

    const headerH = bandH * 0.135;
    ctx.font = `700 ${Math.round(H * 0.02)}px ${FONT_MONO}`;
    ctx.fillStyle = p.textMuted;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      `BACKWARD-PLANNED T-MINUS MILESTONES · ${doneCount}/${milestones.length} CLEARED`,
      rightX + rightW * 0.05,
      bandTop + headerH * 0.55,
    );

    ctx.textAlign = 'right';
    ctx.fillStyle = p.secondaryAccent;
    ctx.fillText(`${progressPct}% COMPLETE`, rightX + rightW * 0.95, bandTop + headerH * 0.55);

    ctx.strokeStyle = p.surfaceBorder;
    ctx.lineWidth = Math.max(1.8, W * 0.0008);
    ctx.beginPath();
    ctx.moveTo(rightX + rightW * 0.045, bandTop + headerH);
    ctx.lineTo(rightX + rightW * 0.955, bandTop + headerH);
    ctx.stroke();

    const rowsTop = bandTop + headerH + bandH * 0.032;
    const rowsBottom = bandBottom - bandH * 0.036;
    const rowStep = (rowsBottom - rowsTop) / Math.max(1, milestones.length);
    const trackX = rightX + rightW * 0.075;

    if (milestones.length > 1 && (state.theme === 'metro' || state.theme === 'botanical' || state.theme === 'flight')) {
      const firstY = rowsTop + rowStep * 0.5;
      const lastY = rowsTop + rowStep * (milestones.length - 0.5);
      ctx.strokeStyle = p.trackMuted;
      ctx.lineWidth = Math.max(7, Math.round(H * 0.0075));
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(trackX, firstY);
      ctx.lineTo(trackX, lastY);
      ctx.stroke();

      const activeY = rowsTop + rowStep * (activeIdx + 0.5);
      const pg = ctx.createLinearGradient(0, firstY, 0, activeY);
      pg.addColorStop(0, p.secondaryAccent);
      pg.addColorStop(1, p.accent);
      ctx.strokeStyle = pg;
      ctx.beginPath();
      ctx.moveTo(trackX, firstY);
      ctx.lineTo(trackX, activeY);
      ctx.stroke();
    }

    milestones.forEach((m, idx) => {
      const cy = rowsTop + rowStep * (idx + 0.5);
      const isDone = m.done;
      const isActive = idx === activeIdx && !isDone;
      const isFinal = idx === milestones.length - 1;

      if (isActive) {
        const hlH = rowStep * 0.8;
        roundRectPath(ctx, rightX + rightW * 0.03, cy - hlH / 2, rightW * 0.94, hlH, H * 0.018);
        ctx.fillStyle = p.accentSoft;
        ctx.fill();
        ctx.strokeStyle = p.accent;
        ctx.lineWidth = Math.max(2, W * 0.0009);
        ctx.stroke();
      }

      drawMilestoneCheckbox(ctx, trackX, cy, H * 0.032, state.theme, isDone, isActive, isFinal, p);

      const badgeSize = Math.min(rowStep * 0.66, H * 0.068);
      const badgeCx = rightX + rightW * 0.945 - badgeSize / 2;
      roundRectPath(ctx, badgeCx - badgeSize / 2, cy - badgeSize / 2, badgeSize, badgeSize, badgeSize * 0.28);
      ctx.fillStyle = isActive ? p.accentSoft : p.isDark ? 'rgba(255,255,255,0.055)' : 'rgba(18,21,28,0.05)';
      ctx.fill();
      ctx.strokeStyle = isActive ? p.accent : p.surfaceBorder;
      ctx.lineWidth = Math.max(1.8, W * 0.0008);
      ctx.stroke();

      drawMilestoneVectorIcon(
        ctx,
        m.icon || 'star',
        badgeCx,
        cy,
        badgeSize * 0.54,
        isDone ? p.secondaryAccent : p.textPrimary,
        isDone ? p.secondaryAccent : p.accent,
      );

      const tx = trackX + rightW * 0.052;
      const tTag = DL.formatTMinusTag(m.date, state.targetDate);
      const dStr = `(${DL.formatShortDate(m.date)})`;

      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = `700 ${Math.round(H * 0.022)}px ${FONT_MONO}`;
      ctx.fillStyle = isDone ? p.secondaryAccent : isActive || isFinal ? p.accent : p.textPrimary;
      ctx.fillText(tTag, tx, cy);

      const dateX = tx + rightW * 0.162;
      ctx.font = `600 ${Math.round(H * 0.02)}px ${FONT_MONO}`;
      ctx.fillStyle = p.textSecondary;
      ctx.fillText(dStr, dateX, cy);

      const labelX = tx + rightW * 0.308;
      const labelMaxW = badgeCx - badgeSize / 2 - labelX - rightW * 0.03;
      ctx.font = `${isActive || isFinal ? '700' : '600'} ${Math.round(H * 0.028)}px ${FONT_SANS}`;
      ctx.fillStyle = isDone ? p.textSecondary : p.textPrimary;
      const labelTxt = fitText(ctx, m.label, labelMaxW);
      ctx.fillText(labelTxt, labelX, cy);

      if (isDone) {
        const tw = ctx.measureText(labelTxt).width;
        ctx.strokeStyle = p.textMuted;
        ctx.lineWidth = Math.max(2.5, H * 0.0018);
        ctx.beginPath();
        ctx.moveTo(labelX, cy);
        ctx.lineTo(labelX + tw, cy);
        ctx.stroke();
      }
    });
    ctx.restore();
  }

  function renderLockScreenCanvas(canvas, state, options) {
    const opts = options || {};
    const spec = DL.DEVICE_SPECS[opts.device || state.device] || DL.DEVICE_SPECS.iphone;
    const W = opts.width || spec.width;
    const H = opts.height || spec.height;
    canvas.width = W;
    canvas.height = H;

    const ctx = canvas.getContext('2d');
    const p = getPalette(state);
    const metrics = DL.getCountdownMetrics(state.targetDate, opts.now || new Date());
    const isDesktop = spec.id === 'desktop';

    drawThemeAtmosphere(ctx, W, H, state, p, isDesktop);
    if (isDesktop) {
      renderDesktopLockScreen(ctx, W, H, state, p, metrics);
    } else {
      renderPortraitLockScreen(ctx, W, H, state, p, metrics);
    }
  }

  function drawIosChromeOverlay(ctx, x, y, w, h, p, now) {
    const current = now || new Date();
    ctx.save();
    const diW = w * 0.295;
    const diH = h * 0.025;
    roundRectPath(ctx, x + (w - diW) / 2, y + h * 0.017, diW, diH, diH / 2);
    ctx.fillStyle = '#050608';
    ctx.fill();

    ctx.fillStyle = p.clockColor;
    ctx.globalAlpha = 0.88;
    const sbY = y + h * 0.029;
    const sigX = x + w * 0.76;
    for (let i = 0; i < 4; i++) {
      const bh = h * (0.0045 + i * 0.0022);
      roundRectPath(ctx, sigX + i * w * 0.016, sbY + h * 0.005 - bh, w * 0.009, bh, 2);
      ctx.fill();
    }
    const batX = x + w * 0.845;
    const batW = w * 0.072;
    const batH = h * 0.013;
    roundRectPath(ctx, batX, sbY - batH / 2, batW, batH, 4);
    ctx.strokeStyle = p.clockColor;
    ctx.lineWidth = Math.max(1.5, w * 0.003);
    ctx.stroke();
    roundRectPath(ctx, batX + 3, sbY - batH / 2 + 3, batW * 0.78, batH - 6, 2);
    ctx.fill();

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dateStr = `${days[current.getDay()]}, ${months[current.getMonth()]} ${current.getDate()}`;

    if (p.clockShadow) {
      ctx.shadowColor = p.clockShadow;
      ctx.shadowBlur = 18;
    }
    ctx.globalAlpha = 0.94;
    ctx.font = `600 ${Math.round(w * 0.048)}px ${FONT_SANS}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = p.clockColor;
    ctx.fillText(dateStr, x + w / 2, y + h * 0.105);

    ctx.globalAlpha = 0.99;
    ctx.font = `700 ${Math.round(w * 0.245)}px ${FONT_DISPLAY}`;
    ctx.fillText('9:41', x + w / 2, y + h * 0.188);
    ctx.shadowColor = 'transparent';

    const btnR = w * 0.062;
    const btnY = y + h * 0.912;
    [x + w * 0.165, x + w * 0.835].forEach((bx, idx) => {
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(bx, btnY, btnR, 0, Math.PI * 2);
      ctx.fillStyle = p.isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(17, 20, 26, 0.14)';
      ctx.fill();

      ctx.strokeStyle = p.isDark ? '#FFFFFF' : '#12151C';
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = Math.max(1.8, w * 0.0045);
      if (idx === 0) {
        ctx.strokeRect(bx - btnR * 0.16, btnY - btnR * 0.22, btnR * 0.32, btnR * 0.56);
        ctx.beginPath();
        ctx.moveTo(bx - btnR * 0.24, btnY - btnR * 0.26);
        ctx.lineTo(bx + btnR * 0.24, btnY - btnR * 0.26);
        ctx.stroke();
      } else {
        roundRectPath(ctx, bx - btnR * 0.36, btnY - btnR * 0.24, btnR * 0.72, btnR * 0.5, 4);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(bx, btnY + btnR * 0.02, btnR * 0.14, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    ctx.globalAlpha = 0.85;
    const homeW = w * 0.35;
    const homeH = h * 0.0065;
    roundRectPath(ctx, x + (w - homeW) / 2, y + h * 0.974, homeW, homeH, homeH / 2);
    ctx.fillStyle = p.isDark ? '#FFFFFF' : '#12151C';
    ctx.fill();
    ctx.restore();
  }

  function renderHandshakeCoverCanvas(canvas, state, options) {
    const opts = options || {};
    const W = 2400;
    const H = 1600;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    const p = getPalette(state);
    const now = opts.now || new Date();
    const metrics = DL.getCountdownMetrics(state.targetDate, now);
    const theme = DL.THEMES[state.theme] || DL.THEMES.metro;

    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    if (!p.isDark) {
      bgGrad.addColorStop(0, '#F5F3EE');
      bgGrad.addColorStop(1, '#E6E1D6');
    } else {
      bgGrad.addColorStop(0, '#0B0E14');
      bgGrad.addColorStop(0.55, '#131823');
      bgGrad.addColorStop(1, '#080A0F');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = p.grid;
    ctx.lineWidth = 1.5;
    for (let x = 80; x < W; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 80; y < H; y += 80) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    const glow = ctx.createRadialGradient(W * 0.76, H * 0.5, 40, W * 0.76, H * 0.5, 760);
    glow.addColorStop(0, p.accentSoft);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    const leftX = 124;
    const leftMaxW = 1140;

    const eyebrow = 'DEADLINE LINE  ·  T-MINUS COUNTDOWN LOCK SCREEN';
    ctx.font = `700 24px ${FONT_MONO}`;
    const ebW = ctx.measureText(eyebrow).width + 44;
    roundRectPath(ctx, leftX, 114, ebW, 52, 26);
    ctx.fillStyle = p.accentSoft;
    ctx.fill();
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = p.accent;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(eyebrow, leftX + 22, 140);

    ctx.font = `700 100px ${FONT_DISPLAY}`;
    ctx.fillStyle = p.textPrimary;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(fitText(ctx, state.title.toUpperCase(), leftMaxW), leftX, 304);

    ctx.font = `500 37px ${FONT_SANS}`;
    ctx.fillStyle = p.textSecondary;
    ctx.fillText(
      fitText(ctx, `T-${metrics.days} Days Left · ${theme.name} (${theme.tagline})`, leftMaxW),
      leftX,
      370,
    );

    const chips = ['CLOCK-SAFE LOCK SCREEN', 'T-MINUS CHECKBOXES', 'PHONE + 4K + .ICS'];
    let chipX = leftX;
    const chipY = 420;
    ctx.font = `700 20px ${FONT_MONO}`;
    chips.forEach((chip) => {
      const cw = ctx.measureText(chip).width + 36;
      roundRectPath(ctx, chipX, chipY, cw, 46, 10);
      ctx.fillStyle = p.surface;
      ctx.fill();
      ctx.strokeStyle = p.surfaceBorder;
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.fillStyle = p.textPrimary;
      ctx.textBaseline = 'middle';
      ctx.fillText(chip, chipX + 18, chipY + 23);
      chipX += cw + 16;
    });

    const deskCardX = leftX;
    const deskCardY = 532;
    const deskCardW = 1120;
    const deskCardH = 630;

    const offDesk = document.createElement('canvas');
    renderLockScreenCanvas(offDesk, { ...state, device: 'desktop' }, { width: 1920, height: 1080, now });

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 64;
    ctx.shadowOffsetY = 28;
    roundRectPath(ctx, deskCardX, deskCardY, deskCardW, deskCardH, 28);
    ctx.fillStyle = '#090B10';
    ctx.fill();
    ctx.restore();

    ctx.save();
    roundRectPath(ctx, deskCardX, deskCardY, deskCardW, deskCardH, 28);
    ctx.clip();
    ctx.drawImage(offDesk, deskCardX, deskCardY, deskCardW, deskCardH);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    ctx.fillStyle = p.clockColor;
    ctx.globalAlpha = 0.88;
    ctx.font = `600 22px ${FONT_SANS}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`, deskCardX + deskCardW / 2, deskCardY + 62);
    ctx.globalAlpha = 0.98;
    ctx.font = `700 84px ${FONT_DISPLAY}`;
    ctx.fillText('9:41', deskCardX + deskCardW / 2, deskCardY + 128);
    ctx.restore();

    roundRectPath(ctx, deskCardX, deskCardY, deskCardW, deskCardH, 28);
    ctx.strokeStyle = p.isDark ? 'rgba(255,255,255,0.22)' : 'rgba(17,20,26,0.18)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = `600 23px ${FONT_MONO}`;
    ctx.fillStyle = p.textMuted;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('4K DESKTOP LOCK SCREEN (3840×2160)  +  RETINA PHONE LOCK SCREEN (1290×2796)', leftX, 1218);

    ctx.strokeStyle = p.surfaceBorder;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(leftX, 1336);
    ctx.lineTo(leftX + deskCardW, 1336);
    ctx.stroke();

    ctx.font = `600 28px ${FONT_SANS}`;
    ctx.fillStyle = p.textPrimary;
    ctx.fillText(`Daily Focus: "${fitText(ctx, state.dailyFocus, 980)}"`, leftX, 1404);

    ctx.font = `700 22px ${FONT_MONO}`;
    ctx.fillStyle = p.accent;
    ctx.fillText('BUILT WITH GOOGLE GEMINI WORKFLOW · READY TO SET TODAY · LIVE WEB STUDIO', leftX, 1466);

    const phoneH = 1384;
    const phoneW = Math.round(phoneH * (1290 / 2796));
    const bezel = 22;
    const phoneX = W - 124 - phoneW - bezel * 2;
    const phoneY = Math.round((H - (phoneH + bezel * 2)) / 2);

    const offPhone = document.createElement('canvas');
    renderLockScreenCanvas(offPhone, { ...state, device: 'iphone' }, { width: 1290, height: 2796, now });

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    ctx.shadowBlur = 90;
    ctx.shadowOffsetY = 36;
    roundRectPath(ctx, phoneX, phoneY, phoneW + bezel * 2, phoneH + bezel * 2, 92);
    const frameGrad = ctx.createLinearGradient(phoneX, phoneY, phoneX + phoneW, phoneY + phoneH);
    frameGrad.addColorStop(0, '#414650');
    frameGrad.addColorStop(0.5, '#1D2026');
    frameGrad.addColorStop(1, '#333841');
    ctx.fillStyle = frameGrad;
    ctx.fill();
    ctx.restore();

    roundRectPath(ctx, phoneX + 7, phoneY + 7, phoneW + bezel * 2 - 14, phoneH + bezel * 2 - 14, 86);
    ctx.fillStyle = '#050608';
    ctx.fill();

    const scrX = phoneX + bezel;
    const scrY = phoneY + bezel;
    ctx.save();
    roundRectPath(ctx, scrX, scrY, phoneW, phoneH, 74);
    ctx.clip();
    ctx.drawImage(offPhone, scrX, scrY, phoneW, phoneH);
    drawIosChromeOverlay(ctx, scrX, scrY, phoneW, phoneH, p, now);
    ctx.restore();

    roundRectPath(ctx, phoneX, phoneY, phoneW + bezel * 2, phoneH + bezel * 2, 92);
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }

  DL.renderLockScreenCanvas = renderLockScreenCanvas;
  DL.renderHandshakeCoverCanvas = renderHandshakeCoverCanvas;
})(typeof globalThis !== 'undefined' ? globalThis : window);
