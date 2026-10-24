/* =========================================================
   Umanga Basnet | site behaviour
   Plain JavaScript, no libraries. Edit the data objects below
   to change stats, roles and the contact email.
   ========================================================= */

(function () {
  "use strict";

  const EMAIL = "umangabasnet87@gmail.com";

  /* ---------- Season stats: edit these numbers ---------- */
  const SEASONS = {
    s2526:  { goals: 9,  assists: 7,  apps: 14,  minutes: 1180,  dribbles: 4.1, chances: 3.2,
              note: "Season in progress. Updated after matchday 14." },
    s2425:  { goals: 15, assists: 12, apps: 26,  minutes: 2140,  dribbles: 3.8, chances: 2.9,
              note: "Full league season. Top assist provider in the squad." },
    career: { goals: 72, assists: 61, apps: 148, minutes: 11320, dribbles: 3.6, chances: 2.7,
              note: "All senior, academy and futsal competitive matches since 2016." }
  };

  /* ---------- Roles on the pitch (680 x 440 SVG, attacking right) ---------- */
  const ROLES = {
    winger: {
      note: "Hug the touchline, take on the full-back, then cut inside onto the right foot to shoot or slide a pass.",
      heat: [[480, 78, 70], [570, 96, 62], [400, 92, 58], [600, 160, 46], [530, 170, 40]],
      run: "M410 80 C 480 70, 540 90, 560 130 S 590 190, 600 205"
    },
    ten: {
      note: "Drop between the midfield and defence lines, turn, and play the final pass. Free to roam left and right.",
      heat: [[440, 210, 72], [500, 180, 56], [500, 250, 56], [380, 220, 48], [550, 215, 40]],
      run: "M380 230 C 430 250, 470 200, 520 205 S 580 215, 610 220"
    },
    nine: {
      note: "Start as the central striker, drop deep to pull a centre-back out, then spin in behind for the return pass.",
      heat: [[580, 220, 66], [530, 200, 52], [600, 170, 44], [600, 270, 44], [480, 220, 42]],
      run: "M590 220 C 540 230, 500 215, 490 195 S 560 170, 620 205"
    }
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- Year in footer ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header: background on scroll + mobile menu ---------- */
  const header = $(".site-header");
  const toggle = $(".nav-toggle");
  const links = $("#nav-links");

  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    $(".sr-only", toggle).textContent = open ? "Close menu" : "Open menu";
    links.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
  }
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  $$("a", links).forEach(a => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

  /* ---------- Highlight the current section in the nav ---------- */
  const navMap = new Map($$("a[href^='#']", links).map(a => [a.getAttribute("href").slice(1), a]));
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navMap.forEach(a => a.classList.remove("is-active"));
        const link = navMap.get(entry.target.id);
        if (link) link.classList.add("is-active");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    navMap.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- Tabs helper (arrow keys move between tabs) ---------- */
  function initTabs(container, onSelect) {
    const tabs = $$("[role='tab']", container);
    tabs.forEach((tab, i) => {
      tab.tabIndex = tab.getAttribute("aria-selected") === "true" ? 0 : -1;
      tab.addEventListener("click", () => select(i));
      tab.addEventListener("keydown", e => {
        if (e.key === "ArrowRight") { e.preventDefault(); select((i + 1) % tabs.length, true); }
        if (e.key === "ArrowLeft")  { e.preventDefault(); select((i - 1 + tabs.length) % tabs.length, true); }
      });
    });
    function select(i, focus) {
      tabs.forEach((t, j) => {
        t.setAttribute("aria-selected", String(i === j));
        t.tabIndex = i === j ? 0 : -1;
      });
      if (focus) tabs[i].focus();
      onSelect(tabs[i]);
    }
  }

  /* ---------- Playing style pitch ---------- */
  const SVG_NS = "http://www.w3.org/2000/svg";
  const heatLayer = $("#heat-layer");
  const runPath = $("#run-path");
  const roleNote = $("#role-note");

  function drawRole(key) {
    const role = ROLES[key];
    if (!role || !heatLayer) return;
    heatLayer.innerHTML = "";
    role.heat.forEach(([cx, cy, r]) => {
      const c = document.createElementNS(SVG_NS, "circle");
      c.setAttribute("cx", cx);
      c.setAttribute("cy", cy);
      c.setAttribute("r", r);
      c.setAttribute("fill", "url(#heat)");
      heatLayer.appendChild(c);
    });
    runPath.setAttribute("d", role.run);
    roleNote.textContent = role.note;

    if (!reduceMotion && runPath.getTotalLength) {
      const len = runPath.getTotalLength();
      runPath.animate(
        [{ strokeDashoffset: len, opacity: 0 }, { strokeDashoffset: 0, opacity: 1 }],
        { duration: 700, easing: "ease-out" }
      );
    }
  }
  const roleTabs = $(".role-tabs");
  if (roleTabs) {
    initTabs(roleTabs, tab => drawRole(tab.dataset.role));
    drawRole("winger");
  }

  /* ---------- Season stats ---------- */
  const statNote = $("#stat-note");

  function countTo(el, target, decimals) {
    const start = parseFloat(el.textContent) || 0;
    const fmt = v => decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString("en-US");
    if (reduceMotion) { el.textContent = fmt(target); return; }
    const t0 = performance.now();
    const dur = 600;
    (function step(now) {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(start + (target - start) * eased);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  function showSeason(key) {
    const data = SEASONS[key];
    if (!data) return;
    $$(".stat-value").forEach(el => {
      countTo(el, data[el.dataset.key], Number(el.dataset.decimals || 0));
    });
    statNote.textContent = data.note;
  }
  const seasonTabs = $(".season-tabs");
  if (seasonTabs) {
    initTabs(seasonTabs, tab => showSeason(tab.dataset.season));
    // format the initial numbers (adds thousands separators)
    $$(".stat-value").forEach(el => {
      const d = Number(el.dataset.decimals || 0);
      const v = parseFloat(el.textContent);
      el.textContent = d ? v.toFixed(d) : v.toLocaleString("en-US");
    });
  }

  /* ---------- Moments: mini pitches, filter, video ---------- */
  function miniPitch(points) {
    const pts = points.trim().split(/\s+/).map(p => p.split(",").map(Number));
    const d = pts.map((p, i) => (i ? "L" : "M") + p[0] + " " + p[1]).join(" ");
    const [sx, sy] = pts[0];
    const [ex, ey] = pts[pts.length - 1];
    return `
      <svg viewBox="0 0 100 64" aria-hidden="true">
        <g class="mini-lines">
          <rect x="3" y="3" width="94" height="58"/>
          <line x1="50" y1="3" x2="50" y2="61"/>
          <circle cx="50" cy="32" r="8"/>
          <rect x="3" y="18" width="14" height="28"/>
          <rect x="83" y="18" width="14" height="28"/>
          <rect x="91" y="26" width="6" height="12"/>
        </g>
        <path class="mini-run" d="${d}"/>
        <circle class="mini-start" cx="${sx}" cy="${sy}" r="1.6"/>
        <circle class="mini-end" cx="${ex}" cy="${ey}" r="2.4"/>
      </svg>`;
  }

  const moments = $$(".moment");
  moments.forEach(card => {
    const holder = $(".moment-pitch", card);
    if (holder && card.dataset.path) holder.innerHTML = miniPitch(card.dataset.path);

    const vid = (card.dataset.video || "").trim();
    if (vid) {
      card.classList.add("has-video");
      const btn = document.createElement("button");
      btn.className = "play";
      btn.type = "button";
      btn.textContent = "Watch";
      btn.setAttribute("aria-label", "Watch video: " + $("h3", card).textContent);
      btn.addEventListener("click", e => { e.stopPropagation(); openVideo(vid); });
      holder.appendChild(btn);
      card.addEventListener("click", () => openVideo(vid));
    }
  });

  const filterBtns = $$(".filter button");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter;
      filterBtns.forEach(b => b.setAttribute("aria-pressed", String(b === btn)));
      moments.forEach(card => { card.hidden = !(f === "all" || card.dataset.type === f); });
    });
  });

  const lightbox = $("#lightbox");
  const frame = $("#lightbox-frame");
  function openVideo(id) {
    if (!lightbox || typeof lightbox.showModal !== "function") {
      window.open("https://www.youtube.com/watch?v=" + encodeURIComponent(id), "_blank", "noopener");
      return;
    }
    frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1"
      title="Highlight video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    lightbox.showModal();
  }
  if (lightbox) {
    const close = () => { lightbox.close(); };
    $(".lightbox-close", lightbox).addEventListener("click", close);
    lightbox.addEventListener("click", e => { if (e.target === lightbox) close(); });
    lightbox.addEventListener("close", () => { frame.innerHTML = ""; });
  }

  /* ---------- Copy email ---------- */
  $$(".copy-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = "Copied";
      } catch (err) {
        btn.textContent = "Press Ctrl+C";
        const range = document.createRange();
        range.selectNodeContents($("#email-link"));
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
      setTimeout(() => { btn.textContent = "Copy"; }, 2000);
    });
  });

  /* ---------- Contact form: builds an email in the visitor's mail app ---------- */
  const form = $("#contact-form");
  const status = $("#form-status");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const name = form.name.value.trim();
      const topic = form.topic.value;
      const message = form.message.value.trim();

      $$(".field", form).forEach(f => f.classList.remove("has-error"));
      const missing = [];
      if (!name) { missing.push("your name"); form.name.closest(".field").classList.add("has-error"); }
      if (!message) { missing.push("a message"); form.message.closest(".field").classList.add("has-error"); }

      if (missing.length) {
        status.textContent = "Add " + missing.join(" and ") + " before sending.";
        status.classList.add("is-error");
        (name ? form.message : form.name).focus();
        return;
      }

      status.classList.remove("is-error");
      const subject = `${topic} from ${name}`;
      const body = `${message}\n\n${name}`;
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = "Your email app should open with the message ready. If it does not, write to " + EMAIL + ".";
    });
  }
})();
