/* =============================================
   PG FINDER CHENNAI — APP LOGIC
   Handles filtering, rendering, modals, events
   ============================================= */

/* ── STATE ── */
let state = {
  filtered: [...PG_DATA],
  activeGender: "",
  activeType: "",
  searchLoc: "",
  searchPrice: "",
  searchGender: "",
  modalOpen: false
};

/* ── DOM READY ── */
document.addEventListener("DOMContentLoaded", () => {
  renderCards(state.filtered);
  renderAreas();
  renderTestimonials();
  initNavbar();
  initCounters();
  initScrollReveal();
});

/* ── RENDER CARDS ── */
function renderCards(data) {
  const grid = document.getElementById("listings-grid");
  if (!grid) return;

  if (!data.length) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="icon">🔍</div>
        <p>No PGs found matching your criteria.<br>Try adjusting your filters.</p>
      </div>`;
    return;
  }

  grid.innerHTML = data.map((pg, i) => {
    const gClass = pg.gender === "Male" ? "gender-male" : pg.gender === "Female" ? "gender-female" : "gender-any";
    const stars = "★".repeat(Math.floor(pg.rating));
    const availBadge = pg.available
      ? `<span style="color:var(--success);font-size:11px;font-weight:600">● Available</span>`
      : `<span style="color:var(--accent-red);font-size:11px;font-weight:600">● Full</span>`;
    const tagsHtml = pg.amenities.slice(0, 4).map(a => `<span class="tag">${a}</span>`).join("");

    return `
    <div class="pg-card fade-in" style="animation-delay:${i * 0.07}s" onclick="openDetailModal(${pg.id})">
      <div class="card-thumb">
        <img
          src="${pg.image}"
          alt="${pg.name}"
          class="card-thumb-img"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
        />
        <div class="card-thumb-fallback" style="display:none">
          <span style="font-size:52px">${pg.emoji}</span>
        </div>
        <div class="card-badge-rating">★ ${pg.rating} <span style="color:var(--text-2);font-weight:400">(${pg.reviews})</span></div>
        <div class="card-badge-gender ${gClass}">${pg.gender}</div>
      </div>
      <div class="card-body">
        <div class="card-name">${pg.name}</div>
        <div class="card-location">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2.5">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
          ${pg.area}, Chennai
        </div>
        <div class="card-tags">${tagsHtml}</div>
        <div class="card-footer">
          <div>
            <div class="card-price">₹${pg.price.toLocaleString()}<small>/month</small></div>
            ${availBadge}
          </div>
          <button class="btn-enquire" onclick="event.stopPropagation(); openEnquireModal(${pg.id})">Enquire</button>
        </div>
      </div>
    </div>`;
  }).join("");
}

/* ── RENDER AREAS ── */
function renderAreas() {
  const grid = document.getElementById("areas-grid");
  if (!grid) return;
  grid.innerHTML = AREAS.map(a => `
    <div class="area-card" onclick="filterByArea('${a.name}')">
      <div class="area-icon">${a.emoji}</div>
      <div class="area-name">${a.name}</div>
      <div class="area-count">${a.count} PGs</div>
    </div>`).join("");
}

/* ── RENDER TESTIMONIALS ── */
function renderTestimonials() {
  const grid = document.getElementById("testi-grid");
  if (!grid) return;
  grid.innerHTML = TESTIMONIALS.map(t => `
    <div class="testi-card">
      <div class="testi-stars">${"★".repeat(t.rating)}</div>
      <p class="testi-text">"${t.text}"</p>
      <div class="testi-author">
        <div class="testi-avatar">${t.initials}</div>
        <div>
          <div class="testi-name">${t.name}</div>
          <div class="testi-loc">${t.loc}</div>
        </div>
      </div>
    </div>`).join("");
}

/* ── SEARCH FILTER ── */
function applySearch() {
  const loc   = document.getElementById("s-loc")?.value || "";
  const price = parseInt(document.getElementById("s-price")?.value) || Infinity;
  const gender = document.getElementById("s-gender")?.value || "";

  state.searchLoc    = loc;
  state.searchPrice  = price;
  state.searchGender = gender;
  state.activeGender = "";
  state.activeType   = "";

  document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
  const allPill = document.querySelector('.pill[data-gender=""]');
  if (allPill) allPill.classList.add("active");

  applyAllFilters();

  // Scroll to listings
  document.getElementById("listings")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ── PILL FILTER ── */
function setGenderFilter(el, gender) {
  document.querySelectorAll('.pill[data-gender]').forEach(p => p.classList.remove("active"));
  el.classList.add("active");
  state.activeGender = gender;
  applyAllFilters();
}

function setTypeFilter(el, type) {
  document.querySelectorAll('.pill[data-type]').forEach(p => p.classList.remove("active"));
  el.classList.add("active");
  state.activeType = type;
  applyAllFilters();
}

/* ── AREA FILTER ── */
function filterByArea(area) {
  document.getElementById("s-loc").value = area;
  state.searchLoc = area;
  applyAllFilters();
  document.getElementById("listings")?.scrollIntoView({ behavior: "smooth", block: "start" });
  showToast(`📍 Showing PGs in ${area}`);
}

/* ── COMBINE ALL FILTERS ── */
function applyAllFilters() {
  const price = state.searchPrice || Infinity;

  state.filtered = PG_DATA.filter(pg => {
    const locMatch    = !state.searchLoc    || pg.area === state.searchLoc;
    const priceMatch  = pg.price <= price;
    const genderMatch = !state.searchGender || pg.gender === state.searchGender || pg.gender === "Any";
    const pillGender  = !state.activeGender || pg.gender === state.activeGender || pg.gender === "Any";
    const typeMatch   = !state.activeType   || pg.type === state.activeType;
    return locMatch && priceMatch && genderMatch && pillGender && typeMatch;
  });

  renderCards(state.filtered);
}

/* ── DETAIL MODAL ── */
function openDetailModal(id) {
  const pg = PG_DATA.find(p => p.id === id);
  if (!pg) return;

  const gClass  = pg.gender === "Male" ? "gender-male" : pg.gender === "Female" ? "gender-female" : "gender-any";
  const amenHtml = pg.amenities.map(a => `<span class="tag" style="font-size:13px;padding:5px 12px">${a}</span>`).join("");
  const stars   = "★".repeat(Math.floor(pg.rating));
  const avail   = pg.available
    ? `<span style="color:var(--success);font-weight:600">✔ Available Now</span>`
    : `<span style="color:var(--accent-red);font-weight:600">✖ Currently Full</span>`;

  document.getElementById("modal-detail-content").innerHTML = `
    <div style="position:relative;border-radius:var(--r-sm);overflow:hidden;margin-bottom:1.5rem;height:220px;background:var(--bg-3)">
      <img src="${pg.image}" alt="${pg.name}" style="width:100%;height:100%;object-fit:cover;display:block"
        onerror="this.style.display='none';document.getElementById('modal-emoji-fallback').style.display='flex'" />
      <div id="modal-emoji-fallback" style="display:none;position:absolute;inset:0;align-items:center;justify-content:center;font-size:64px">${pg.emoji}</div>
      <div style="position:absolute;bottom:0;left:0;right:0;height:80px;background:linear-gradient(transparent,rgba(15,13,11,0.85))"></div>
      <div style="position:absolute;bottom:12px;left:14px;font-family:var(--font-display);font-size:20px;font-weight:800;color:#fff">${pg.name}</div>
    </div>
    <div style="display:flex;align-items:start;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin-bottom:1rem">
      <div>
        <h3 style="font-family:var(--font-display);font-size:22px;font-weight:800;color:var(--text)">${pg.name}</h3>
        <p style="font-size:13px;color:var(--text-2);margin-top:4px">📍 ${pg.address}</p>
      </div>
      <span class="card-badge-gender ${gClass}" style="position:static">${pg.gender}</span>
    </div>
    <p style="font-size:14px;color:var(--text-2);line-height:1.8;margin-bottom:1.25rem">${pg.description}</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:1.25rem">
      <div style="background:var(--bg-3);border-radius:var(--r-sm);padding:12px">
        <div style="font-size:11px;color:var(--gold);font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">Monthly Rent</div>
        <div style="font-family:var(--font-display);font-size:24px;font-weight:800;color:var(--gold)">₹${pg.price.toLocaleString()}</div>
      </div>
      <div style="background:var(--bg-3);border-radius:var(--r-sm);padding:12px">
        <div style="font-size:11px;color:var(--gold);font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px">Rating</div>
        <div style="font-size:18px;font-weight:700;color:var(--text)">${stars} <span style="font-size:13px;color:var(--text-2)">(${pg.reviews} reviews)</span></div>
      </div>
    </div>
    <div style="margin-bottom:1.25rem">
      <div style="font-size:11px;color:var(--gold);font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">Amenities</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">${amenHtml}</div>
    </div>
    <div style="margin-bottom:1.5rem">${avail}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <button class="btn-enquire" style="padding:12px;font-size:14px;border-radius:var(--r-sm)" onclick="closeDetailModal();openEnquireModal(${pg.id})">Send Enquiry</button>
      <a href="https://wa.me/91${pg.phone}?text=Hi, I'm interested in ${encodeURIComponent(pg.name)} PG in ${pg.area}" target="_blank" class="btn-submit" style="display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;border-radius:var(--r-sm)">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        WhatsApp
      </a>
    </div>`;

  document.getElementById("modal-detail").classList.add("open");
}

function closeDetailModal() {
  document.getElementById("modal-detail").classList.remove("open");
}

/* ── ENQUIRE MODAL ── */
function openEnquireModal(id) {
  const pg = PG_DATA.find(p => p.id === id);
  if (pg) {
    document.getElementById("enquire-pg-name").textContent = pg.name + " — " + pg.area;
    document.getElementById("enquire-pg-id").value = id;
  }
  document.getElementById("modal-enquire").classList.add("open");
}

function closeEnquireModal() {
  document.getElementById("modal-enquire").classList.remove("open");
}

function submitEnquiry() {
  const name  = document.getElementById("eq-name").value.trim();
  const phone = document.getElementById("eq-phone").value.trim();
  const email = document.getElementById("eq-email").value.trim();

  if (!name || !phone) {
    showToast("⚠️ Please fill your name and phone number", "warn");
    return;
  }
  if (phone.length !== 10 || isNaN(phone)) {
    showToast("⚠️ Enter a valid 10-digit phone number", "warn");
    return;
  }

  closeEnquireModal();
  showToast(`✅ Enquiry sent! Owner will call ${name} shortly.`);

  // Reset form
  document.getElementById("eq-name").value  = "";
  document.getElementById("eq-phone").value = "";
  document.getElementById("eq-email").value = "";
}

/* ── LIST PG MODAL ── */
function openListModal() {
  document.getElementById("modal-list").classList.add("open");
}

function closeListModal() {
  document.getElementById("modal-list").classList.remove("open");
}

function submitListing() {
  const pgName = document.getElementById("list-pg-name").value.trim();
  const owner  = document.getElementById("list-owner").value.trim();
  const phone  = document.getElementById("list-phone").value.trim();

  if (!pgName || !owner || !phone) {
    showToast("⚠️ Please fill all required fields", "warn");
    return;
  }

  closeListModal();
  showToast(`🏠 "${pgName}" submitted for review! We'll contact you within 24 hours.`);

  document.getElementById("list-pg-name").value = "";
  document.getElementById("list-owner").value   = "";
  document.getElementById("list-phone").value   = "";
}

/* ── TOAST ── */
function showToast(msg, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.style.background = type === "warn" ? "var(--accent-red)" : "var(--success)";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3500);
}

/* ── NAVBAR ── */
function initNavbar() {
  const ham = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");

  if (ham && mobileMenu) {
    ham.addEventListener("click", () => mobileMenu.classList.add("open"));
    document.getElementById("mobile-close")?.addEventListener("click", () => mobileMenu.classList.remove("open"));
  }

  // Active link
  const path = window.location.pathname;
  document.querySelectorAll(".nav-links a").forEach(a => {
    if (a.getAttribute("href") === path || (path.endsWith("index.html") && a.getAttribute("href") === "index.html")) {
      a.classList.add("active");
    }
  });
}

/* ── COUNTER ANIMATION ── */
function initCounters() {
  const counters = document.querySelectorAll(".stat-num[data-target]");
  counters.forEach(el => {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    let current = 0;
    const step = Math.ceil(target / 60);
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString() + suffix;
      if (current >= target) clearInterval(interval);
    }, 20);
  });
}

/* ── SCROLL REVEAL ── */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity  = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".step-card, .area-card, .testi-card").forEach(el => {
    el.style.opacity   = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(el);
  });
}

/* ── CLOSE MODALS ON BG CLICK ── */
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-overlay")) {
    document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("open"));
  }
});

/* ── KEYBOARD ESC ── */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("open"));
  }
});
