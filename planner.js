/**
 * Deadline Line — Backward Milestone Planner, Presets, T-Minus Engine, URL State & Gemini Prompt Kit
 * Dual-mode module: works directly in browsers (even via file://) AND in Node.js for testing.
 */
(function (root) {
  const DL = (root.DeadlineLine = root.DeadlineLine || {});

  const DEVICE_SPECS = {
    iphone: {
      id: 'iphone',
      label: 'iPhone 16 Pro',
      shortLabel: 'iPhone',
      width: 1290,
      height: 2796,
      aspectLabel: '9:19.5 · 1290×2796',
      filename: 'phone-lockscreen-1290x2796.png',
    },
    android: {
      id: 'android',
      label: 'Android Pixel',
      shortLabel: 'Android',
      width: 1440,
      height: 3120,
      aspectLabel: '9:19.5 · 1440×3120',
      filename: 'android-lockscreen-1440x3120.png',
    },
    desktop: {
      id: 'desktop',
      label: 'Desktop 4K',
      shortLabel: 'Desktop 4K',
      width: 3840,
      height: 2160,
      aspectLabel: '16:9 · 3840×2160',
      filename: 'desktop-lockscreen-3840x2160.png',
    },
  };

  const MILESTONE_ICONS = [
    { id: 'compass', label: 'Scope' },
    { id: 'code', label: 'Build' },
    { id: 'shield', label: 'Test' },
    { id: 'deck', label: 'Present' },
    { id: 'rocket', label: 'Launch' },
    { id: 'book', label: 'Study' },
    { id: 'timer', label: 'Practice' },
    { id: 'spark', label: 'Polish' },
    { id: 'calendar', label: 'Plan' },
    { id: 'star', label: 'Celebrate' },
  ];

  const THEMES = {
    metro: {
      id: 'metro',
      name: 'Metro Line',
      tagline: 'Swiss Transit Route Map',
      badge: 'SIGNATURE',
      description: 'Every T-minus milestone is a numbered station stop along a bold express route to your deadline.',
      previewColors: ['#0C0F14', '#FF4F2B', '#3DD68C'],
      modes: {
        dark: {
          bg: '#0B0E14',
          bgSecondary: '#141A24',
          surface: 'rgba(255, 255, 255, 0.052)',
          surfaceSolid: '#141923',
          surfaceBorder: 'rgba(255, 255, 255, 0.13)',
          grid: 'rgba(255, 255, 255, 0.036)',
          textPrimary: '#F7F6F1',
          textSecondary: '#A4ACBC',
          textMuted: '#6A7385',
          accent: '#FF4F2B',
          accentSoft: 'rgba(255, 79, 43, 0.18)',
          accentGlow: 'rgba(255, 79, 43, 0.36)',
          secondaryAccent: '#3DD68C',
          trackMuted: 'rgba(255, 255, 255, 0.16)',
          clockColor: '#F7F6F1',
          isDark: true,
        },
        light: {
          bg: '#F4F1EA',
          bgSecondary: '#E9E3D7',
          surface: 'rgba(255, 255, 255, 0.76)',
          surfaceSolid: '#FAF8F3',
          surfaceBorder: 'rgba(17, 20, 26, 0.13)',
          grid: 'rgba(17, 20, 26, 0.045)',
          textPrimary: '#12151C',
          textSecondary: '#4E5563',
          textMuted: '#7E8694',
          accent: '#E23A1C',
          accentSoft: 'rgba(226, 58, 28, 0.11)',
          accentGlow: 'rgba(226, 58, 28, 0.24)',
          secondaryAccent: '#0D9468',
          trackMuted: 'rgba(18, 21, 28, 0.15)',
          clockColor: '#12151C',
          isDark: false,
        },
      },
    },
    glass: {
      id: 'glass',
      name: 'Daylight Glass',
      tagline: 'Frosted Botanical Bokeh',
      badge: 'CLASSIC',
      description: 'Luminous frosted glass card over serene bokeh with clean top clock space and crisp T-minus checkboxes.',
      previewColors: ['#C5DFC9', '#E69F45', '#274C3B'],
      modes: {
        light: {
          bg: '#DCEBD8',
          bgSecondary: '#F2E7CF',
          surface: 'rgba(255, 252, 245, 0.82)',
          surfaceSolid: '#FBF8F0',
          surfaceBorder: 'rgba(255, 255, 255, 0.88)',
          grid: 'rgba(34, 66, 49, 0.04)',
          textPrimary: '#1D2922',
          textSecondary: '#475A4F',
          textMuted: '#6D7F74',
          accent: '#B45309',
          accentSoft: 'rgba(180, 83, 9, 0.13)',
          accentGlow: 'rgba(180, 83, 9, 0.25)',
          secondaryAccent: '#2B6E4F',
          trackMuted: 'rgba(29, 41, 34, 0.16)',
          clockColor: '#FFFFFF',
          clockShadow: 'rgba(20, 38, 28, 0.42)',
          isDark: false,
        },
        dark: {
          bg: '#0E1F1D',
          bgSecondary: '#1E2C27',
          surface: 'rgba(18, 30, 27, 0.74)',
          surfaceSolid: '#152421',
          surfaceBorder: 'rgba(255, 246, 224, 0.18)',
          grid: 'rgba(255, 246, 224, 0.04)',
          textPrimary: '#F8F4EA',
          textSecondary: '#B9C7BE',
          textMuted: '#7E9487',
          accent: '#F59E0B',
          accentSoft: 'rgba(245, 158, 11, 0.18)',
          accentGlow: 'rgba(245, 158, 11, 0.34)',
          secondaryAccent: '#4ADE80',
          trackMuted: 'rgba(248, 244, 234, 0.18)',
          clockColor: '#F8F4EA',
          isDark: true,
        },
      },
    },
    flight: {
      id: 'flight',
      name: 'Flight Deck',
      tagline: 'Braun Aerospace Telemetry',
      badge: 'PRECISION',
      description: 'Dieter Rams-inspired T-minus telemetry HUD with precision horizon ticks and checklist milestones.',
      previewColors: ['#111316', '#FF6B1A', '#2DD4BF'],
      modes: {
        dark: {
          bg: '#101215',
          bgSecondary: '#181C21',
          surface: 'rgba(255, 255, 255, 0.045)',
          surfaceSolid: '#171B20',
          surfaceBorder: 'rgba(255, 255, 255, 0.13)',
          grid: 'rgba(255, 255, 255, 0.045)',
          textPrimary: '#F3F4F6',
          textSecondary: '#9CA3AF',
          textMuted: '#68707D',
          accent: '#FF6B1A',
          accentSoft: 'rgba(255, 107, 26, 0.18)',
          accentGlow: 'rgba(255, 107, 26, 0.36)',
          secondaryAccent: '#2DD4BF',
          trackMuted: 'rgba(255, 255, 255, 0.16)',
          clockColor: '#F3F4F6',
          isDark: true,
        },
        light: {
          bg: '#E8EAED',
          bgSecondary: '#DBDDE2',
          surface: 'rgba(255, 255, 255, 0.76)',
          surfaceSolid: '#F4F5F7',
          surfaceBorder: 'rgba(17, 19, 22, 0.14)',
          grid: 'rgba(17, 19, 22, 0.05)',
          textPrimary: '#13161B',
          textSecondary: '#4E5663',
          textMuted: '#7C8491',
          accent: '#E05206',
          accentSoft: 'rgba(224, 82, 6, 0.13)',
          accentGlow: 'rgba(224, 82, 6, 0.24)',
          secondaryAccent: '#0D9488',
          trackMuted: 'rgba(19, 22, 27, 0.16)',
          clockColor: '#13161B',
          isDark: false,
        },
      },
    },
    editorial: {
      id: 'editorial',
      name: 'Swiss Blueprint',
      tagline: 'Editorial Poster & Grid',
      badge: 'GALLERY',
      description: 'High-contrast Swiss museum typography framed in a cobalt architectural drafting grid.',
      previewColors: ['#F7F4ED', '#1D4ED8', '#111520'],
      modes: {
        light: {
          bg: '#F7F4ED',
          bgSecondary: '#ECE7DC',
          surface: 'rgba(255, 255, 255, 0.78)',
          surfaceSolid: '#FCFBF7',
          surfaceBorder: 'rgba(17, 24, 39, 0.16)',
          grid: 'rgba(29, 78, 216, 0.065)',
          textPrimary: '#111520',
          textSecondary: '#445066',
          textMuted: '#788296',
          accent: '#1D4ED8',
          accentSoft: 'rgba(29, 78, 216, 0.11)',
          accentGlow: 'rgba(29, 78, 216, 0.22)',
          secondaryAccent: '#0F766E',
          trackMuted: 'rgba(17, 21, 32, 0.15)',
          clockColor: '#111520',
          isDark: false,
        },
        dark: {
          bg: '#0A152B',
          bgSecondary: '#112242',
          surface: 'rgba(255, 255, 255, 0.055)',
          surfaceSolid: '#11203D',
          surfaceBorder: 'rgba(147, 197, 253, 0.2)',
          grid: 'rgba(147, 197, 253, 0.075)',
          textPrimary: '#F0F6FF',
          textSecondary: '#9EC0EC',
          textMuted: '#6588BA',
          accent: '#60A5FA',
          accentSoft: 'rgba(96, 165, 250, 0.18)',
          accentGlow: 'rgba(96, 165, 250, 0.34)',
          secondaryAccent: '#34D399',
          trackMuted: 'rgba(147, 197, 253, 0.22)',
          clockColor: '#F0F6FF',
          isDark: true,
        },
      },
    },
    botanical: {
      id: 'botanical',
      name: 'Botanical Zen',
      tagline: 'Deep Pine & Warm Gold',
      badge: 'CALM',
      description: 'Serene evergreen & warm gold composition designed for steady, zero-burnout momentum.',
      previewColors: ['#0E1B16', '#DFC17E', '#74C69D'],
      modes: {
        dark: {
          bg: '#0D1A15',
          bgSecondary: '#152720',
          surface: 'rgba(243, 238, 226, 0.055)',
          surfaceSolid: '#14251E',
          surfaceBorder: 'rgba(243, 238, 226, 0.14)',
          grid: 'rgba(243, 238, 226, 0.035)',
          textPrimary: '#F4EFE3',
          textSecondary: '#ABBCAE',
          textMuted: '#72877C',
          accent: '#DFC17E',
          accentSoft: 'rgba(223, 193, 126, 0.17)',
          accentGlow: 'rgba(223, 193, 126, 0.3)',
          secondaryAccent: '#74C69D',
          trackMuted: 'rgba(243, 238, 226, 0.17)',
          clockColor: '#F4EFE3',
          isDark: true,
        },
        light: {
          bg: '#F3F0E6',
          bgSecondary: '#E7E2D3',
          surface: 'rgba(255, 255, 255, 0.76)',
          surfaceSolid: '#FAF8F2',
          surfaceBorder: 'rgba(20, 44, 34, 0.14)',
          grid: 'rgba(20, 44, 34, 0.04)',
          textPrimary: '#142920',
          textSecondary: '#476155',
          textMuted: '#7A9186',
          accent: '#2D6A4F',
          accentSoft: 'rgba(45, 106, 79, 0.13)',
          accentGlow: 'rgba(45, 106, 79, 0.22)',
          secondaryAccent: '#B5832A',
          trackMuted: 'rgba(20, 41, 32, 0.16)',
          clockColor: '#142920',
          isDark: false,
        },
      },
    },
    monochrome: {
      id: 'monochrome',
      name: 'Minimal Ink',
      tagline: 'Pure E-Ink Monochrome',
      badge: 'MINIMAL',
      description: 'Zero-distraction high-contrast black & ivory ink typography built for pure focus.',
      previewColors: ['#0A0A0A', '#FFFFFF', '#737373'],
      modes: {
        dark: {
          bg: '#080808',
          bgSecondary: '#111111',
          surface: 'rgba(255, 255, 255, 0.048)',
          surfaceSolid: '#121212',
          surfaceBorder: 'rgba(255, 255, 255, 0.16)',
          grid: 'rgba(255, 255, 255, 0.03)',
          textPrimary: '#FAFAFA',
          textSecondary: '#A3A3A3',
          textMuted: '#6B6B6B',
          accent: '#FFFFFF',
          accentSoft: 'rgba(255, 255, 255, 0.12)',
          accentGlow: 'rgba(255, 255, 255, 0.28)',
          secondaryAccent: '#D4D4D4',
          trackMuted: 'rgba(255, 255, 255, 0.16)',
          clockColor: '#FAFAFA',
          isDark: true,
        },
        light: {
          bg: '#FAFAFA',
          bgSecondary: '#F1F1EF',
          surface: 'rgba(255, 255, 255, 0.92)',
          surfaceSolid: '#FFFFFF',
          surfaceBorder: 'rgba(10, 10, 10, 0.16)',
          grid: 'rgba(10, 10, 10, 0.035)',
          textPrimary: '#0A0A0A',
          textSecondary: '#525252',
          textMuted: '#8A8A8A',
          accent: '#0A0A0A',
          accentSoft: 'rgba(10, 10, 10, 0.08)',
          accentGlow: 'rgba(10, 10, 10, 0.18)',
          secondaryAccent: '#404040',
          trackMuted: 'rgba(10, 10, 10, 0.14)',
          clockColor: '#0A0A0A',
          isDark: false,
        },
      },
    },
  };

  const PRESETS = [
    {
      id: 'capstone',
      label: 'Capstone Demo Day',
      category: 'Project Launch',
      theme: 'metro',
      mode: 'dark',
      lineCode: 'LINE 26',
      title: 'CAPSTONE DEMO DAY',
      subtitle: 'Ship & Present v1.0',
      targetDate: '2026-12-18',
      dailyFocus: 'Ship one visible piece before 9 PM.',
      reminderTime: '08:30',
      milestones: [
        { id: 'm1', date: '2026-11-22', label: 'Lock scope & wireframes', icon: 'compass', done: true },
        { id: 'm2', date: '2026-12-04', label: 'Build core prototype', icon: 'code', done: false },
        { id: 'm3', date: '2026-12-11', label: 'Run user tests', icon: 'shield', done: false },
        { id: 'm4', date: '2026-12-15', label: 'Record pitch & demo', icon: 'deck', done: false },
        { id: 'm5', date: '2026-12-18', label: 'Ship v1.0 live', icon: 'rocket', done: false },
      ],
    },
    {
      id: 'finals',
      label: 'Finals Week Express',
      category: 'Final Exam',
      theme: 'editorial',
      mode: 'light',
      lineCode: 'TERM 04',
      title: 'FINAL EXAMS',
      subtitle: 'Systems & Algorithms Mastery',
      targetDate: '2026-12-15',
      dailyFocus: 'Two timed practice sets before noon.',
      reminderTime: '08:00',
      milestones: [
        { id: 'f1', date: '2026-12-01', label: 'Audit weak syllabus topics', icon: 'compass', done: true },
        { id: 'f2', date: '2026-12-05', label: 'Make 1-page cheat sheets', icon: 'book', done: false },
        { id: 'f3', date: '2026-12-08', label: 'Take timed practice exam', icon: 'timer', done: false },
        { id: 'f4', date: '2026-12-12', label: 'Drill error log gaps', icon: 'spark', done: false },
        { id: 'f5', date: '2026-12-15', label: 'Ace final exam', icon: 'star', done: false },
      ],
    },
    {
      id: 'client',
      label: 'Client Launch v1.0',
      category: 'Client Deliverable',
      theme: 'flight',
      mode: 'dark',
      lineCode: 'FLT-104',
      title: 'CLIENT LAUNCH V1.0',
      subtitle: 'Production Handoff & QA',
      targetDate: '2026-12-12',
      dailyFocus: 'Close the top blocker before standup.',
      reminderTime: '09:00',
      milestones: [
        { id: 'c1', date: '2026-11-28', label: 'Approve final design specs', icon: 'compass', done: true },
        { id: 'c2', date: '2026-12-02', label: 'Deploy staging preview', icon: 'code', done: false },
        { id: 'c3', date: '2026-12-05', label: 'Complete client revisions', icon: 'shield', done: false },
        { id: 'c4', date: '2026-12-09', label: 'Finalize QA & docs', icon: 'spark', done: false },
        { id: 'c5', date: '2026-12-12', label: 'Go live & handoff', icon: 'rocket', done: false },
      ],
    },
    {
      id: 'holiday',
      label: 'Winter Showcase Gala',
      category: 'Holiday / Event',
      theme: 'glass',
      mode: 'light',
      lineCode: 'DEC · 20',
      title: 'WINTER SHOWCASE',
      subtitle: 'Warm, Stress-Free Gathering',
      targetDate: '2026-12-20',
      dailyFocus: 'Confirm one detail early each morning.',
      reminderTime: '08:30',
      milestones: [
        { id: 'h1', date: '2026-12-06', label: 'Send guest invitations', icon: 'calendar', done: true },
        { id: 'h2', date: '2026-12-10', label: 'Plan menu & seating', icon: 'book', done: false },
        { id: 'h3', date: '2026-12-13', label: 'Buy ingredients & decor', icon: 'spark', done: false },
        { id: 'h4', date: '2026-12-18', label: 'Prep dishes & playlist', icon: 'timer', done: false },
        { id: 'h5', date: '2026-12-20', label: 'Host & enjoy night', icon: 'star', done: false },
      ],
    },
  ];

  function parseLocalDate(isoStr) {
    if (!isoStr || !/^\d{4}-\d{2}-\d{2}$/.test(isoStr)) {
      const d = new Date();
      d.setDate(d.getDate() + 21);
      return d;
    }
    const [y, m, d] = isoStr.split('-').map(Number);
    return new Date(y, m - 1, d, 0, 0, 0, 0);
  }

  function formatIsoDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function formatShortDate(isoStr) {
    const d = parseLocalDate(isoStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}`;
  }

  function formatShortUpperDate(isoStr) {
    return formatShortDate(isoStr).toUpperCase();
  }

  function formatFullDate(isoStr) {
    const d = parseLocalDate(isoStr);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }

  function getTMinusOffset(milestoneIso, targetIso) {
    const m = parseLocalDate(milestoneIso);
    const t = parseLocalDate(targetIso);
    return Math.round((t.getTime() - m.getTime()) / 86400000);
  }

  function formatTMinusTag(milestoneIso, targetIso, compact) {
    const diff = getTMinusOffset(milestoneIso, targetIso);
    if (diff < 0) return compact ? `T+${Math.abs(diff)}D` : `T+${Math.abs(diff)} Days`;
    if (compact) return `T-${diff}D`;
    return diff === 1 ? 'T-1 Day' : `T-${diff} Days`;
  }

  function getCountdownMetrics(targetIso, now) {
    const current = now || new Date();
    const target = parseLocalDate(targetIso);
    const todayStart = new Date(current.getFullYear(), current.getMonth(), current.getDate(), 0, 0, 0, 0);
    const dayDiff = Math.round((target.getTime() - todayStart.getTime()) / 86400000);

    const targetEnd = new Date(target.getFullYear(), target.getMonth(), target.getDate(), 23, 59, 59, 999);
    const msRemaining = Math.max(0, targetEnd.getTime() - current.getTime());
    const totalSeconds = Math.floor(msRemaining / 1000);
    const daysFloor = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      days: Math.max(0, dayDiff),
      isToday: dayDiff === 0,
      isPast: dayDiff < 0,
      daysFloor,
      hours,
      minutes,
      seconds,
      formattedTarget: formatFullDate(targetIso),
      formattedShortTarget: formatShortUpperDate(targetIso),
    };
  }

  function generateBackwardMilestones(title, targetIso) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = parseLocalDate(targetIso);
    const totalDays = Math.max(5, Math.round((target.getTime() - today.getTime()) / 86400000));

    const lower = (title || '').toLowerCase();
    let items;
    if (/exam|final|test|cert|gre|gmat|sat|study|thesis/.test(lower)) {
      items = [
        { label: 'Audit weak syllabus topics', icon: 'compass' },
        { label: 'Build 1-page cheat sheets', icon: 'book' },
        { label: 'Take timed practice exam', icon: 'timer' },
        { label: 'Drill error log gaps', icon: 'spark' },
        { label: 'Ace final exam', icon: 'star' },
      ];
    } else if (/client|launch|ship|release|sprint|product|portfolio|demo|capstone/.test(lower)) {
      items = [
        { label: 'Lock scope & wireframes', icon: 'compass' },
        { label: 'Build core prototype', icon: 'code' },
        { label: 'Run user tests', icon: 'shield' },
        { label: 'Polish pitch & demo', icon: 'deck' },
        { label: 'Ship v1.0 live', icon: 'rocket' },
      ];
    } else if (/party|gala|wedding|trip|holiday|showcase|dinner|thanksgiving|friendsgiving/.test(lower)) {
      items = [
        { label: 'Send guest invitations', icon: 'calendar' },
        { label: 'Plan menu & details', icon: 'book' },
        { label: 'Buy ingredients & supplies', icon: 'spark' },
        { label: 'Prep venue & checklist', icon: 'timer' },
        { label: 'Host & enjoy event', icon: 'star' },
      ];
    } else {
      items = [
        { label: 'Define scope & outline', icon: 'compass' },
        { label: 'Finish first core draft', icon: 'code' },
        { label: 'Review & fix gaps', icon: 'shield' },
        { label: 'Final polish & buffer', icon: 'spark' },
        { label: 'Deliver final goal', icon: 'rocket' },
      ];
    }

    let tOffsets;
    if (totalDays >= 18) {
      tOffsets = [Math.min(totalDays, 21), 14, 7, 3, 0];
    } else if (totalDays >= 10) {
      tOffsets = [totalDays, Math.round(totalDays * 0.7), Math.round(totalDays * 0.4), 1, 0];
    } else {
      tOffsets = [totalDays, Math.max(3, totalDays - 1), Math.max(2, Math.floor(totalDays / 2)), 1, 0];
    }

    for (let i = 1; i < tOffsets.length - 1; i++) {
      if (tOffsets[i] >= tOffsets[i - 1]) {
        tOffsets[i] = Math.max(1, tOffsets[i - 1] - 1);
      }
    }

    return items.map((item, idx) => {
      const d = new Date(target.getTime() - tOffsets[idx] * 86400000);
      return {
        id: `bp-${Date.now()}-${idx}`,
        date: formatIsoDate(d),
        label: item.label,
        icon: item.icon,
        done: idx === 0,
      };
    });
  }

  function getActiveMilestoneIndex(milestones) {
    const idx = milestones.findIndex((m) => !m.done);
    return idx === -1 ? Math.max(0, milestones.length - 1) : idx;
  }

  function buildGeminiPrompts(state) {
    const theme = THEMES[state.theme] || THEMES.metro;
    const device = DEVICE_SPECS[state.device] || DEVICE_SPECS.iphone;
    const metrics = getCountdownMetrics(state.targetDate);

    const tLines = state.milestones
      .map((m) => `${m.done ? '[x]' : '[ ]'} ${formatTMinusTag(m.date, state.targetDate)} (${formatShortDate(m.date)}): ${m.label}`)
      .join('\n');

    const step1 = `I am planning for ${state.title} (${state.subtitle}) on ${metrics.formattedTarget}. Ask me three quick questions about my schedule, then build a simple plan working backward from my target date with clear "T-minus" milestones, such as T-14, T-7, T-3, and T-1 days. Keep each milestone description under five words.`;

    const devicePhrase =
      device.id === 'desktop'
        ? `horizontal 16:9 laptop wallpaper (${device.width}x${device.height})`
        : `vertical 9:19.5 ${device.label} lock screen (${device.width}x${device.height})`;

    const step2 = `Generate a high-resolution ${devicePhrase} titled "T-MINUS COUNTDOWN: ${state.title.toUpperCase()}" featuring only the biggest milestones from our chat earlier with checkboxes:\n${tLines}\nUse a ${theme.name} (${theme.tagline}, ${state.mode} mode) color palette, style, and vibe. Leave clean space at the top for my clock or icons and at the bottom for lock screen shortcuts.`;

    const step3Push = `Every day at ${state.reminderTime} until ${metrics.formattedTarget}, check the ${state.title} countdown in this chat, and send a push notification with any milestone scheduled for today or tomorrow.`;

    const step3Cal = `Add each milestone from our ${state.title} countdown above to my Google Calendar on its scheduled date, with a reminder notification set for ${state.reminderTime}.`;

    return { step1, step2, step3Push, step3Cal };
  }

  function encodeStateToHash(state) {
    try {
      const compact = {
        t: state.theme,
        m: state.mode,
        d: state.device,
        lc: state.lineCode,
        ti: state.title,
        su: state.subtitle,
        td: state.targetDate,
        df: state.dailyFocus,
        rt: state.reminderTime,
        ms: state.milestones.slice(0, 6).map((item) => [item.date, item.label, item.done ? 1 : 0, item.icon || 'star']),
      };
      const json = JSON.stringify(compact);
      const bytes = new TextEncoder().encode(json);
      let binary = '';
      bytes.forEach((b) => {
        binary += String.fromCharCode(b);
      });
      const b64 = typeof btoa === 'function' ? btoa(binary) : Buffer.from(bytes).toString('base64');
      return `#s=${b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')}`;
    } catch {
      return '';
    }
  }

  function decodeStateFromHash(hash) {
    try {
      if (!hash || !hash.startsWith('#s=')) return null;
      let b64 = hash.slice(3).replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      const bytes =
        typeof atob === 'function'
          ? Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
          : new Uint8Array(Buffer.from(b64, 'base64'));
      const parsed = JSON.parse(new TextDecoder().decode(bytes));
      if (!parsed || !parsed.ti || !Array.isArray(parsed.ms)) return null;
      return {
        theme: THEMES[parsed.t] ? parsed.t : 'metro',
        mode: parsed.m === 'light' ? 'light' : 'dark',
        device: DEVICE_SPECS[parsed.d] ? parsed.d : 'iphone',
        lineCode: String(parsed.lc || 'LINE 26').slice(0, 14),
        title: String(parsed.ti || 'CAPSTONE DEMO DAY').slice(0, 42),
        subtitle: String(parsed.su || '').slice(0, 56),
        targetDate: /^\d{4}-\d{2}-\d{2}$/.test(parsed.td) ? parsed.td : '2026-12-18',
        dailyFocus: String(parsed.df || '').slice(0, 90),
        reminderTime: /^\d{2}:\d{2}$/.test(parsed.rt) ? parsed.rt : '08:30',
        milestones: parsed.ms.slice(0, 6).map((row, i) => ({
          id: `sh-${i}`,
          date: /^\d{4}-\d{2}-\d{2}$/.test(row[0]) ? row[0] : '2026-12-18',
          label: String(row[1] || 'Milestone').slice(0, 42),
          done: Boolean(row[2]),
          icon: String(row[3] || 'star'),
        })),
      };
    } catch {
      return null;
    }
  }

  Object.assign(DL, {
    DEVICE_SPECS,
    MILESTONE_ICONS,
    THEMES,
    PRESETS,
    parseLocalDate,
    formatIsoDate,
    formatShortDate,
    formatShortUpperDate,
    formatFullDate,
    getTMinusOffset,
    formatTMinusTag,
    getCountdownMetrics,
    generateBackwardMilestones,
    getActiveMilestoneIndex,
    buildGeminiPrompts,
    encodeStateToHash,
    decodeStateFromHash,
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DL;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
