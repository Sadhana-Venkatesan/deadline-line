/**
 * Deadline Line — Studio Controller
 * Works seamlessly via file:// double-click, GitHub Pages, Netlify Drop, or Vercel.
 */
(function (root) {
  const DL = root.DeadlineLine;
  const DEFAULT_PRESET = DL.PRESETS[0];

  const state = {
    presetId: DEFAULT_PRESET.id,
    theme: DEFAULT_PRESET.theme,
    mode: DEFAULT_PRESET.mode,
    device: 'iphone',
    lineCode: DEFAULT_PRESET.lineCode,
    title: DEFAULT_PRESET.title,
    subtitle: DEFAULT_PRESET.subtitle,
    targetDate: DEFAULT_PRESET.targetDate,
    dailyFocus: DEFAULT_PRESET.dailyFocus,
    reminderTime: DEFAULT_PRESET.reminderTime,
    milestones: DEFAULT_PRESET.milestones.map((m) => ({ ...m })),
    showOsChrome: true,
    showSafeZones: false,
    useLiveClock: false,
    activeStep: 1,
    bgImage: null,
    bgImageName: '',
  };

  // Query param overrides (supports ?preset=..., ?theme=..., ?mode=..., ?device=..., ?step=..., ?safe=1, ?export=iphone|desktop|cover|glass)
  const params = new URLSearchParams(window.location.search);
  const fromHash = DL.decodeStateFromHash(window.location.hash);
  if (fromHash) {
    Object.assign(state, fromHash);
    state.presetId = '';
  }

  if (params.get('preset')) {
    const found = DL.PRESETS.find((x) => x.id === params.get('preset'));
    if (found) {
      Object.assign(state, {
        presetId: found.id,
        theme: found.theme,
        mode: found.mode,
        lineCode: found.lineCode,
        title: found.title,
        subtitle: found.subtitle,
        targetDate: found.targetDate,
        dailyFocus: found.dailyFocus,
        reminderTime: found.reminderTime,
        milestones: found.milestones.map((m) => ({ ...m })),
      });
    }
  }
  if (params.get('theme') && DL.THEMES[params.get('theme')]) state.theme = params.get('theme');
  if (params.get('mode') === 'light' || params.get('mode') === 'dark') state.mode = params.get('mode');
  if (params.get('device') && DL.DEVICE_SPECS[params.get('device')]) state.device = params.get('device');
  if (params.get('step')) state.activeStep = Number(params.get('step')) || 1;
  if (params.get('safe') === '1') state.showSafeZones = true;

  // Direct full-bleed native canvas render mode (for pixel-exact headless export & verification!)
  const exportMode = params.get('export');
  if (exportMode) {
    document.body.innerHTML = '';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.background = '#000';
    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    document.body.appendChild(canvas);

    if (exportMode === 'cover') {
      DL.renderHandshakeCoverCanvas(canvas, state);
    } else if (exportMode === 'glass') {
      DL.renderLockScreenCanvas(canvas, { ...state, theme: 'glass', mode: 'light', device: 'iphone' }, { width: 1290, height: 2796 });
    } else {
      const spec = DL.DEVICE_SPECS[exportMode] || DL.DEVICE_SPECS.iphone;
      DL.renderLockScreenCanvas(canvas, { ...state, device: spec.id }, { width: spec.width, height: spec.height });
    }
    return;
  }

  const el = {
    stepPills: document.querySelectorAll('.step-pill'),
    stepPanels: document.querySelectorAll('.step-panel'),
    presetBar: document.getElementById('presetBar'),
    daysRemainingBadge: document.getElementById('daysRemainingBadge'),
    inputTitle: document.getElementById('inputTitle'),
    inputDate: document.getElementById('inputDate'),
    inputLineCode: document.getElementById('inputLineCode'),
    inputSubtitle: document.getElementById('inputSubtitle'),
    inputDailyFocus: document.getElementById('inputDailyFocus'),
    inputReminderTime: document.getElementById('inputReminderTime'),
    milestoneList: document.getElementById('milestoneList'),
    themeGrid: document.getElementById('themeGrid'),
    modeSegment: document.getElementById('modeSegment'),
    deviceSegment: document.getElementById('deviceSegment'),
    stageDeviceTabs: document.getElementById('stageDeviceTabs'),
    toggleOsChrome: document.getElementById('toggleOsChrome'),
    toggleSafeZones: document.getElementById('toggleSafeZones'),
    toggleLiveClock: document.getElementById('toggleLiveClock'),
    inputBgImage: document.getElementById('inputBgImage'),
    btnClearBgImage: document.getElementById('btnClearBgImage'),
    refFileStatus: document.getElementById('refFileStatus'),
    btnStageChrome: document.getElementById('btnStageChrome'),
    btnStageSafe: document.getElementById('btnStageSafe'),
    deviceFrame: document.getElementById('deviceFrame'),
    previewCanvas: document.getElementById('previewCanvas'),
    osOverlay: document.getElementById('osOverlay'),
    safeOverlay: document.getElementById('safeOverlay'),
    readinessCount: document.getElementById('readinessCount'),
    readinessRes: document.getElementById('readinessRes'),
    promptStep1: document.getElementById('promptStep1'),
    promptStep2: document.getElementById('promptStep2'),
    promptStep3Push: document.getElementById('promptStep3Push'),
    promptStep3Cal: document.getElementById('promptStep3Cal'),
    iosDate: document.getElementById('iosDate'),
    iosTime: document.getElementById('iosTime'),
    andDate: document.getElementById('andDate'),
    andTime: document.getElementById('andTime'),
    deskDate: document.getElementById('deskDate'),
    deskTime: document.getElementById('deskTime'),
    liveModal: document.getElementById('liveModal'),
    liveCanvas: document.getElementById('liveCanvas'),
    liveClockBlock: document.getElementById('liveClockBlock'),
    liveDate: document.getElementById('liveDate'),
    liveTime: document.getElementById('liveTime'),
    liveTicker: document.getElementById('liveTicker'),
    toast: document.getElementById('toast'),
  };

  let toastTimer = null;
  function showToast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove('show'), 2600);
  }

  function setStep(stepNum) {
    state.activeStep = Number(stepNum);
    el.stepPills.forEach((btn) => {
      btn.classList.toggle('active', Number(btn.dataset.step) === state.activeStep);
    });
    el.stepPanels.forEach((panel) => {
      panel.classList.toggle('active', Number(panel.dataset.panel) === state.activeStep);
    });
  }

  function renderPresets() {
    el.presetBar.innerHTML = '';
    DL.PRESETS.forEach((preset) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `preset-chip${state.presetId === preset.id ? ' active' : ''}`;
      btn.textContent = preset.label;
      btn.addEventListener('click', () => {
        state.presetId = preset.id;
        state.theme = preset.theme;
        state.mode = preset.mode;
        state.lineCode = preset.lineCode;
        state.title = preset.title;
        state.subtitle = preset.subtitle;
        state.targetDate = preset.targetDate;
        state.dailyFocus = preset.dailyFocus;
        state.reminderTime = preset.reminderTime;
        state.milestones = preset.milestones.map((m) => ({ ...m }));
        syncInputs();
        renderAll();
        showToast(`Loaded "${preset.label}" preset`);
      });
      el.presetBar.appendChild(btn);
    });
  }

  function renderThemes() {
    el.themeGrid.innerHTML = '';
    Object.values(DL.THEMES).forEach((theme) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `theme-card${state.theme === theme.id ? ' active' : ''}`;
      card.innerHTML = `
        <div class="theme-top">
          <span class="theme-name">${theme.name}</span>
          <span class="theme-tag">${theme.badge}</span>
        </div>
        <span class="theme-desc">${theme.tagline}</span>
        <div class="swatches">
          ${theme.previewColors.map((c) => `<span class="swatch" style="background:${c}"></span>`).join('')}
        </div>
      `;
      card.addEventListener('click', () => {
        state.theme = theme.id;
        if (theme.id === 'glass' || theme.id === 'editorial') {
          state.mode = 'light';
        }
        renderAll();
      });
      el.themeGrid.appendChild(card);
    });
  }

  function renderMilestonesEditor() {
    el.milestoneList.innerHTML = '';
    const activeIdx = DL.getActiveMilestoneIndex(state.milestones);

    state.milestones.forEach((m, idx) => {
      const isActive = idx === activeIdx && !m.done;
      const row = document.createElement('div');
      row.className = `milestone-row${isActive ? ' is-active' : ''}${m.done ? ' is-done' : ''}`;

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = Boolean(m.done);
      cb.title = 'Mark milestone complete';
      cb.addEventListener('change', () => {
        m.done = cb.checked;
        renderAll();
      });

      const tBadge = document.createElement('span');
      tBadge.className = 'tminus-pill';
      tBadge.textContent = DL.formatTMinusTag(m.date, state.targetDate, true);

      const dateIn = document.createElement('input');
      dateIn.type = 'date';
      dateIn.value = m.date;
      dateIn.addEventListener('change', () => {
        m.date = dateIn.value;
        renderAll();
      });

      const labelIn = document.createElement('input');
      labelIn.type = 'text';
      labelIn.maxLength = 34;
      labelIn.value = m.label;
      labelIn.placeholder = 'Short milestone (< 5 words)';
      labelIn.addEventListener('input', () => {
        m.label = labelIn.value;
        renderPreviewAndPrompts();
      });

      const iconSel = document.createElement('select');
      iconSel.title = 'Milestone icon';
      DL.MILESTONE_ICONS.forEach((ic) => {
        const opt = document.createElement('option');
        opt.value = ic.id;
        opt.textContent = ic.label;
        if ((m.icon || 'star') === ic.id) opt.selected = true;
        iconSel.appendChild(opt);
      });
      iconSel.addEventListener('change', () => {
        m.icon = iconSel.value;
        renderPreviewAndPrompts();
      });

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'milestone-del';
      delBtn.title = 'Remove milestone';
      delBtn.textContent = '×';
      delBtn.disabled = state.milestones.length <= 2;
      delBtn.addEventListener('click', () => {
        if (state.milestones.length <= 2) return;
        state.milestones.splice(idx, 1);
        renderAll();
      });

      row.append(cb, tBadge, dateIn, labelIn, iconSel, delBtn);
      el.milestoneList.appendChild(row);
    });
  }

  function syncInputs() {
    el.inputTitle.value = state.title;
    el.inputDate.value = state.targetDate;
    el.inputLineCode.value = state.lineCode;
    el.inputSubtitle.value = state.subtitle;
    el.inputDailyFocus.value = state.dailyFocus;
    el.inputReminderTime.value = state.reminderTime;
  }

  function updateOsClocks() {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const fullDate = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
    const shortDate = `${shortDays[now.getDay()]}, ${shortMonths[now.getMonth()]} ${now.getDate()} · 72°F`;

    const h = now.getHours();
    const h12 = h % 12 || 12;
    const m = String(now.getMinutes()).padStart(2, '0');
    const liveTimeStr = `${h12}:${m}`;
    const liveTimePadded = `${String(h12).padStart(2, '0')}:${m}`;

    el.iosDate.textContent = fullDate;
    el.deskDate.textContent = fullDate;
    el.andDate.textContent = shortDate;

    el.iosTime.textContent = state.useLiveClock ? liveTimeStr : '9:41';
    el.deskTime.textContent = state.useLiveClock ? liveTimeStr : '9:41';
    el.andTime.textContent = state.useLiveClock ? liveTimePadded : '09:41';

    if (!el.liveModal.hidden) {
      const metrics = DL.getCountdownMetrics(state.targetDate, now);
      el.liveDate.textContent = fullDate;
      el.liveTime.textContent = liveTimePadded;
      el.liveTicker.textContent = `${metrics.daysFloor}d · ${String(metrics.hours).padStart(2, '0')}h · ${String(metrics.minutes).padStart(2, '0')}m · ${String(metrics.seconds).padStart(2, '0')}s until ${metrics.formattedShortTarget}`;
    }
  }

  function renderPreviewAndPrompts() {
    const theme = DL.THEMES[state.theme] || DL.THEMES.metro;
    const palette = theme.modes[state.mode] || theme.modes.dark;
    const spec = DL.DEVICE_SPECS[state.device] || DL.DEVICE_SPECS.iphone;
    const metrics = DL.getCountdownMetrics(state.targetDate);

    el.daysRemainingBadge.textContent = metrics.isToday ? 'DEADLINE DAY' : `T-${metrics.days} DAYS`;

    el.deviceFrame.className = `device-frame device-${state.device}`;
    el.osOverlay.style.setProperty('--clock-color', palette.clockColor);
    el.osOverlay.style.setProperty('--clock-shadow', palette.clockShadow ? `0 2px 14px ${palette.clockShadow}` : 'none');
    el.osOverlay.style.setProperty('--shortcut-bg', palette.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(17,20,26,0.13)');
    el.osOverlay.style.setProperty('--shortcut-fg', palette.isDark ? '#FFFFFF' : '#12151C');

    el.osOverlay.classList.toggle('hidden', !state.showOsChrome);
    el.safeOverlay.classList.toggle('visible', state.showSafeZones);

    const scale = state.device === 'desktop' ? 0.5 : 0.65;
    DL.renderLockScreenCanvas(el.previewCanvas, state, {
      width: Math.round(spec.width * scale),
      height: Math.round(spec.height * scale),
    });

    el.readinessCount.innerHTML = `<span class="ok-dot">✓</span> ${state.milestones.length} T-Minus Milestones`;
    el.readinessRes.innerHTML = `<span class="ok-dot">✓</span> ${spec.width}×${spec.height} PNG`;

    const prompts = DL.buildGeminiPrompts(state);
    el.promptStep1.textContent = prompts.step1;
    el.promptStep2.textContent = prompts.step2;
    el.promptStep3Push.textContent = prompts.step3Push;
    el.promptStep3Cal.textContent = prompts.step3Cal;

    if (!el.liveModal.hidden) {
      DL.renderLockScreenCanvas(el.liveCanvas, { ...state, device: 'desktop' }, { width: 1920, height: 1080 });
      el.liveClockBlock.style.color = palette.clockColor;
    }

    updateOsClocks();
  }

  function renderAll() {
    setStep(state.activeStep);
    renderPresets();
    renderThemes();
    renderMilestonesEditor();

    el.modeSegment.querySelectorAll('.seg-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.mode === state.mode);
    });
    el.deviceSegment.querySelectorAll('.seg-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.device === state.device);
    });
    el.stageDeviceTabs.querySelectorAll('.stage-tab').forEach((b) => {
      b.classList.toggle('active', b.dataset.device === state.device);
    });
    el.toggleOsChrome.checked = state.showOsChrome;
    el.toggleSafeZones.checked = state.showSafeZones;
    el.toggleLiveClock.checked = state.useLiveClock;
    el.btnStageChrome.classList.toggle('active', state.showOsChrome);
    el.btnStageSafe.classList.toggle('active', state.showSafeZones);

    renderPreviewAndPrompts();
  }

  function downloadCanvasPng(canvas, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function exportAsset(kind) {
    const off = document.createElement('canvas');
    if (kind === 'cover') {
      DL.renderHandshakeCoverCanvas(off, state);
      downloadCanvasPng(off, 'handshake-cover-2400x1600.png');
      showToast('Downloaded 3:2 Handshake Cover (2400×1600 PNG)');
      return;
    }
    const spec = DL.DEVICE_SPECS[kind] || DL.DEVICE_SPECS[state.device];
    DL.renderLockScreenCanvas(off, { ...state, device: spec.id }, { width: spec.width, height: spec.height });
    downloadCanvasPng(off, spec.filename);
    showToast(`Downloaded ${spec.label} Lock Screen (${spec.width}×${spec.height} PNG)`);
  }

  function copyShareUrl() {
    const hash = DL.encodeStateToHash(state);
    try {
      window.history.replaceState(null, '', hash);
    } catch {
      // ignore file:// history restrictions
    }
    const url = `${window.location.href.split('#')[0]}${hash}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(
        () => showToast('Shareable lock screen URL copied to clipboard!'),
        () => showToast('Link encoded in address bar — copy URL to share!'),
      );
    } else {
      showToast('Link encoded in address bar — copy URL to share!');
    }
  }

  el.stepPills.forEach((btn) => btn.addEventListener('click', () => setStep(btn.dataset.step)));
  document.querySelectorAll('[data-goto]').forEach((btn) =>
    btn.addEventListener('click', () => {
      setStep(btn.dataset.goto);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }),
  );

  el.inputTitle.addEventListener('input', () => {
    state.title = el.inputTitle.value || 'MY DEADLINE';
    state.presetId = '';
    renderPreviewAndPrompts();
  });
  el.inputDate.addEventListener('change', () => {
    state.targetDate = el.inputDate.value;
    state.presetId = '';
    renderAll();
  });
  el.inputLineCode.addEventListener('input', () => {
    state.lineCode = el.inputLineCode.value;
    renderPreviewAndPrompts();
  });
  el.inputSubtitle.addEventListener('input', () => {
    state.subtitle = el.inputSubtitle.value;
    renderPreviewAndPrompts();
  });
  el.inputDailyFocus.addEventListener('input', () => {
    state.dailyFocus = el.inputDailyFocus.value;
    renderPreviewAndPrompts();
  });
  el.inputReminderTime.addEventListener('change', () => {
    state.reminderTime = el.inputReminderTime.value || '08:30';
    renderPreviewAndPrompts();
  });

  document.getElementById('btnAutoPlan').addEventListener('click', () => {
    state.milestones = DL.generateBackwardMilestones(state.title, state.targetDate);
    state.presetId = '';
    renderAll();
    showToast('Generated 5 backward T-minus milestones!');
  });

  document.getElementById('btnAddMilestone').addEventListener('click', () => {
    if (state.milestones.length >= 6) {
      showToast('Keep 5–6 milestones max so your lock screen stays scannable.');
      return;
    }
    state.milestones.push({
      id: `m-${Date.now()}`,
      date: state.targetDate,
      label: 'New milestone checkpoint',
      icon: 'spark',
      done: false,
    });
    renderAll();
  });

  el.modeSegment.querySelectorAll('.seg-btn').forEach((btn) =>
    btn.addEventListener('click', () => {
      state.mode = btn.dataset.mode;
      renderAll();
    }),
  );

  function switchDevice(dev) {
    state.device = dev;
    renderAll();
  }
  el.deviceSegment.querySelectorAll('.seg-btn').forEach((btn) =>
    btn.addEventListener('click', () => switchDevice(btn.dataset.device)),
  );
  el.stageDeviceTabs.querySelectorAll('.stage-tab').forEach((btn) =>
    btn.addEventListener('click', () => switchDevice(btn.dataset.device)),
  );

  el.toggleOsChrome.addEventListener('change', () => {
    state.showOsChrome = el.toggleOsChrome.checked;
    renderAll();
  });
  el.toggleSafeZones.addEventListener('change', () => {
    state.showSafeZones = el.toggleSafeZones.checked;
    renderAll();
  });
  el.toggleLiveClock.addEventListener('change', () => {
    state.useLiveClock = el.toggleLiveClock.checked;
    renderAll();
  });

  el.inputBgImage.addEventListener('change', () => {
    const file = el.inputBgImage.files && el.inputBgImage.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        state.bgImage = img;
        state.bgImageName = file.name;
        el.refFileStatus.textContent = `Active backdrop: ${file.name}`;
        el.btnClearBgImage.hidden = false;
        renderPreviewAndPrompts();
        showToast('Applied custom reference backdrop!');
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  el.btnClearBgImage.addEventListener('click', () => {
    state.bgImage = null;
    state.bgImageName = '';
    el.inputBgImage.value = '';
    el.refFileStatus.textContent = 'Using built-in procedural theme artwork';
    el.btnClearBgImage.hidden = true;
    renderPreviewAndPrompts();
    showToast('Restored theme artwork');
  });

  el.btnStageChrome.addEventListener('click', () => {
    state.showOsChrome = !state.showOsChrome;
    renderAll();
  });
  el.btnStageSafe.addEventListener('click', () => {
    state.showSafeZones = !state.showSafeZones;
    renderAll();
  });

  document.getElementById('btnQuickDownload').addEventListener('click', () => exportAsset(state.device));
  document.querySelectorAll('[data-export]').forEach((btn) =>
    btn.addEventListener('click', () => exportAsset(btn.dataset.export)),
  );

  document.getElementById('btnDownloadIcs').addEventListener('click', () => {
    const icsText = DL.generateRemindersICS(state);
    const blob = new Blob([icsText], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-reminders.ics`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded daily reminders (.ics) — open to add to Google/Apple Calendar!');
  });

  document.getElementById('btnShareLink').addEventListener('click', copyShareUrl);
  document.getElementById('btnShareLinkFooter').addEventListener('click', copyShareUrl);

  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const prompts = DL.buildGeminiPrompts(state);
      const txt = prompts[btn.dataset.copy] || '';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(() => showToast('Gemini prompt copied! Paste right into Gemini.'));
      } else {
        showToast('Select & copy the prompt text above.');
      }
    });
  });

  document.getElementById('btnLiveFullscreen').addEventListener('click', () => {
    el.liveModal.hidden = false;
    renderPreviewAndPrompts();
  });
  document.getElementById('btnCloseLive').addEventListener('click', () => {
    el.liveModal.hidden = true;
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !el.liveModal.hidden) el.liveModal.hidden = true;
  });

  syncInputs();
  renderAll();
  setInterval(updateOsClocks, 1000);
})(window);
