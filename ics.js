/**
 * Standards-compliant RFC 5545 (.ics) Daily Reminder & Milestone Alert Generator
 * Works directly in browsers (including file://) AND Node.js.
 */
(function (root) {
  const DL = (root.DeadlineLine = root.DeadlineLine || {});

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function formatIcsDateTime(date, hour, minute) {
    return `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}T${pad2(hour)}${pad2(minute)}00`;
  }

  function formatIcsDateOnly(date) {
    return `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}`;
  }

  function escapeIcsText(str) {
    return String(str || '')
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;');
  }

  function generateRemindersICS(state) {
    const [remHour, remMin] = (state.reminderTime || '08:30').split(':').map((v) => parseInt(v, 10) || 0);
    const now = new Date();
    const stamp = `${now.getUTCFullYear()}${pad2(now.getUTCMonth() + 1)}${pad2(now.getUTCDate())}T${pad2(now.getUTCHours())}${pad2(now.getUTCMinutes())}${pad2(now.getUTCSeconds())}Z`;

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = DL.parseLocalDate(state.targetDate);
    const untilStr = `${target.getFullYear()}${pad2(target.getMonth() + 1)}${pad2(target.getDate())}T235959`;

    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Deadline Line//Countdown Lock Screen Studio//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      `X-WR-CALNAME:${escapeIcsText(`${state.title} · Countdown Reminders`)}`,
    ];

    const milestoneOverview = state.milestones
      .map((m) => `${DL.formatTMinusTag(m.date, state.targetDate)} (${DL.formatShortDate(m.date)}): ${m.label}`)
      .join('\n');
    const dailyDesc = `Daily Focus: ${state.dailyFocus}\n\nT-Minus Roadmap:\n${milestoneOverview}\n\nCreated with Deadline Line.`;

    const dailyStart = formatIcsDateTime(today, remHour, remMin);
    const endMinTotal = remHour * 60 + remMin + 15;
    const dailyEnd = formatIcsDateTime(today, Math.floor(endMinTotal / 60) % 24, endMinTotal % 60);

    lines.push(
      'BEGIN:VEVENT',
      `UID:daily-checkin-${state.targetDate}@deadlineline.app`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${dailyStart}`,
      `DTEND:${dailyEnd}`,
      `RRULE:FREQ=DAILY;UNTIL=${untilStr}`,
      `SUMMARY:${escapeIcsText(`${state.title} — Daily 5-Min Check-In`)}`,
      `DESCRIPTION:${escapeIcsText(dailyDesc)}`,
      'BEGIN:VALARM',
      'TRIGGER:-PT5M',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapeIcsText(`Check your ${state.title} lock screen milestone for today!`)}`,
      'END:VALARM',
      'END:VEVENT',
    );

    state.milestones.forEach((m, index) => {
      const mDate = DL.parseLocalDate(m.date);
      const nextDay = new Date(mDate.getTime() + 86400000);
      const tTag = DL.formatTMinusTag(m.date, state.targetDate);

      lines.push(
        'BEGIN:VEVENT',
        `UID:milestone-${index + 1}-${m.date}@deadlineline.app`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${formatIcsDateOnly(mDate)}`,
        `DTEND;VALUE=DATE:${formatIcsDateOnly(nextDay)}`,
        `SUMMARY:${escapeIcsText(`[${tTag}] ${m.label} — ${state.title}`)}`,
        `DESCRIPTION:${escapeIcsText(`Milestone ${index + 1} of ${state.milestones.length} for ${state.title}.\nDaily Focus: ${state.dailyFocus}`)}`,
        'BEGIN:VALARM',
        'TRIGGER:-PT14H',
        'ACTION:DISPLAY',
        `DESCRIPTION:${escapeIcsText(`Tomorrow (${tTag}): ${m.label}`)}`,
        'END:VALARM',
        'END:VEVENT',
      );
    });

    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }

  DL.generateRemindersICS = generateRemindersICS;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateRemindersICS };
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
