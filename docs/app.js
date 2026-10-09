// ==========================================================================
// DayScore Web Application & Simulator Logic
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Presets Definition (Matching iOS QuickPresetBar)
    const PRESETS = [
        { title: "Kahve Keyfi ☕️", score: 2, category: "Kişisel & Keyif", icon: "☕️" },
        { title: "Spor Yaptım 🏃", score: 4, category: "Sağlık & Spor", icon: "🏃" },
        { title: "Trafik Stresi 🚗", score: -3, category: "Rutin & Günlük", icon: "🚗" },
        { title: "Verimli Çalışma 💻", score: 3, category: "İş / Üretim", icon: "💻" },
        { title: "Toplantı Uzadı ⏰", score: -2, category: "İş / Üretim", icon: "⏰" },
        { title: "Güzel Sohbet 💬", score: 3, category: "İlişkiler", icon: "💬" },
        { title: "Geç Uyandım 🥱", score: -2, category: "Rutin & Günlük", icon: "🥱" },
        { title: "Sağlıklı Öğün 🥗", score: 2, category: "Sağlık & Spor", icon: "🥗" },
        { title: "Fast Food 🍕", score: -2, category: "Sağlık & Spor", icon: "🍕" }
    ];

    const CATEGORY_ICONS = {
        "Kişisel & Keyif": "☕️",
        "İş / Üretim": "💻",
        "Sağlık & Spor": "🏃",
        "İlişkiler": "💬",
        "Zihin & Duygu": "🧠",
        "Rutin & Günlük": "📋"
    };

    // State
    const STORAGE_KEY = 'dayscore_web_events_v2';
    let events = loadEvents();
    let currentSelectedScore = 2;

    // DOM Elements
    const presetContainer = document.getElementById('presetButtonsContainer');
    const eventsListContainer = document.getElementById('eventsListContainer');
    const eventsCountBadge = document.getElementById('eventsCountBadge');
    
    // Gauge & Theme Elements
    const gaugeScoreNumber = document.getElementById('gaugeScoreNumber');
    const gaugeProgressArc = document.getElementById('gaugeProgressArc');
    const gaugeContainerCard = document.getElementById('gaugeContainerCard');
    const dayStatusBadge = document.getElementById('dayStatusBadge');
    const themeTitle = document.getElementById('themeTitle');
    const themeMessage = document.getElementById('themeMessage');
    const currentDateDisplay = document.getElementById('currentDateDisplay');
    const heroBannerTheme = document.getElementById('heroBannerTheme');
    
    // Metrics Elements
    const metricTotalEvents = document.getElementById('metricTotalEvents');
    const metricPosEvents = document.getElementById('metricPosEvents');
    const metricNegEvents = document.getElementById('metricNegEvents');
    
    // Form Elements
    const addEventForm = document.getElementById('addEventForm');
    const eventTitleInput = document.getElementById('eventTitleInput');
    const eventCategorySelect = document.getElementById('eventCategorySelect');
    const eventNoteInput = document.getElementById('eventNoteInput');
    const selectedScorePreview = document.getElementById('selectedScorePreview');
    const scorePills = document.querySelectorAll('.score-pill');
    const resetDayBtn = document.getElementById('resetDayBtn');

    // Initialize UI
    initDateDisplay();
    renderPresets();
    setupScorePillListeners();
    setupFormListener();
    setupResetListener();
    updateUI();

    // -------------------------------------------------------------------------
    // Initializers & Handlers
    // -------------------------------------------------------------------------

    function initDateDisplay() {
        const now = new Date();
        const options = { day: 'numeric', month: 'long', weekday: 'long' };
        const formatted = now.toLocaleDateString('tr-TR', options);
        if (currentDateDisplay) {
            currentDateDisplay.textContent = formatted.toUpperCase();
        }
    }

    function renderPresets() {
        if (!presetContainer) return;
        presetContainer.innerHTML = '';

        PRESETS.forEach(preset => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'preset-chip';
            
            const isPos = preset.score > 0;
            const sign = isPos ? `+${preset.score}` : `${preset.score}`;
            const pillClass = isPos ? 'pos' : 'neg';

            chip.innerHTML = `
                <span>${preset.title}</span>
                <span class="preset-score-pill ${pillClass}">${sign}</span>
            `;

            chip.addEventListener('click', () => {
                addEvent(preset.title, preset.score, preset.category, "");
                // Micro animation
                chip.style.transform = 'scale(0.92)';
                setTimeout(() => chip.style.transform = '', 150);
            });

            presetContainer.appendChild(chip);
        });
    }

    function setupScorePillListeners() {
        scorePills.forEach(pill => {
            pill.addEventListener('click', () => {
                scorePills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');

                const val = parseInt(pill.dataset.score, 10);
                currentSelectedScore = val;

                if (selectedScorePreview) {
                    const isPos = val > 0;
                    selectedScorePreview.textContent = isPos ? `+${val}` : `${val}`;
                    selectedScorePreview.className = isPos ? 'score-tag-pos' : 'score-tag-neg';
                }
            });
        });
    }

    function setupFormListener() {
        if (!addEventForm) return;

        addEventForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = eventTitleInput.value.trim();
            const category = eventCategorySelect.value;
            const note = eventNoteInput.value.trim();

            if (!title) return;

            addEvent(title, currentSelectedScore, category, note);
            eventTitleInput.value = '';
            eventNoteInput.value = '';
        });
    }

    function setupResetListener() {
        if (!resetDayBtn) return;
        resetDayBtn.addEventListener('click', () => {
            if (events.length === 0) return;
            if (confirm("Bugünün tüm olaylarını sıfırlamak istediğinden emin misin?")) {
                events = [];
                saveEvents();
                updateUI();
            }
        });
    }

    // -------------------------------------------------------------------------
    // State Operations
    // -------------------------------------------------------------------------

    function addEvent(title, score, category, note) {
        const newEvent = {
            id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            title,
            score,
            category,
            note,
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        };

        events.unshift(newEvent);
        saveEvents();
        updateUI();
    }

    function removeEvent(id) {
        events = events.filter(e => e.id !== id);
        saveEvents();
        updateUI();
    }

    function loadEvents() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                return JSON.parse(raw);
            }
        } catch (e) {
            console.error("Local storage error:", e);
        }

        // Default initial pleasant sample state
        return [
            {
                id: 'init_1',
                title: 'Güne erken başladım ☀️',
                score: 2,
                category: 'Rutin & Günlük',
                note: 'Güneş doğarken uyanıldı',
                time: '07:30'
            },
            {
                id: 'init_2',
                title: 'Kahve Keyfi ☕️',
                score: 2,
                category: 'Kişisel & Keyif',
                note: 'Taze filtre kahve',
                time: '08:45'
            },
            {
                id: 'init_3',
                title: 'Trafik Stresi 🚗',
                score: -3,
                category: 'Rutin & Günlük',
                note: 'Köprü çıkışı tıkalıydı',
                time: '09:20'
            },
            {
                id: 'init_4',
                title: 'Verimli Çalışma 💻',
                score: 4,
                category: 'İş / Üretim',
                note: 'Önemli teslimat tamamlandı',
                time: '11:15'
            }
        ];
    }

    function saveEvents() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
        } catch (e) {
            console.error("Failed to save to localStorage:", e);
        }
    }

    // -------------------------------------------------------------------------
    // UI Updating & Gauge Calculation
    // -------------------------------------------------------------------------

    function updateUI() {
        const totalScore = events.reduce((acc, curr) => acc + curr.score, 0);
        const posCount = events.filter(e => e.score > 0).length;
        const negCount = events.filter(e => e.score < 0).length;

        // 1. Update Metrics
        if (metricTotalEvents) metricTotalEvents.textContent = events.length;
        if (metricPosEvents) metricPosEvents.textContent = posCount;
        if (metricNegEvents) metricNegEvents.textContent = negCount;
        if (eventsCountBadge) eventsCountBadge.textContent = `${events.length} Kayıt`;

        // 2. Score & Theme Calculation (Matching ScoreTheme.swift)
        let title = "";
        let message = "";
        let badge = "DENGEDE";
        let badgeClass = "";
        let primaryColor = "#8c5cff"; // cyberViolet

        if (totalScore >= 10) {
            title = "Harika Bir Gün! 🚀";
            message = "Mükemmel bir ritim yakaladın! Günün enerjisi zirvede.";
            badge = "NET POZİTİF";
            badgeClass = "pos";
            primaryColor = "#00ff9d";
        } else if (totalScore >= 5) {
            title = "Oldukça Pozitif ☀️";
            message = "Günün artıdalarla dolu geçti. Enerjin çok yüksek.";
            badge = "NET POZİTİF";
            badgeClass = "pos";
            primaryColor = "#00ff9d";
        } else if (totalScore > 0) {
            title = "Pozitifteyiz ✨";
            message = "Günün artıların ağırlıkta olduğu dengeli bir ritimde.";
            badge = "NET POZİTİF";
            badgeClass = "pos";
            primaryColor = "#00f0ff";
        } else if (totalScore === 0) {
            title = "Nötr & Dengeli ⚖️";
            message = "Artılar ve eksiler eşitlendi, gün dengede seyrediyor.";
            badge = "DENGEDE";
            badgeClass = "";
            primaryColor = "#8c5cff";
        } else if (totalScore >= -4) {
            title = "Hafif Zorlayıcı ⛅️";
            message = "Küçük pürüzler oldu ama toparlanamayacak hiçbir şey yok.";
            badge = "NET NEGATİF";
            badgeClass = "neg";
            primaryColor = "#ffb703";
        } else {
            title = "Zor Bir Gün 🌧️";
            message = "Zorlayıcı bir gün geride kaldı. Kendine dinlenmek için alan aç.";
            badge = "NET NEGATİF";
            badgeClass = "neg";
            primaryColor = "#ff3366";
        }

        // 3. Update Theme Card
        if (themeTitle) themeTitle.textContent = title;
        if (themeMessage) themeMessage.textContent = message;
        if (dayStatusBadge) {
            dayStatusBadge.textContent = badge;
            dayStatusBadge.className = `status-badge ${badgeClass}`;
        }
        if (heroBannerTheme) {
            const sign = totalScore > 0 ? `+${totalScore}` : `${totalScore}`;
            heroBannerTheme.textContent = `${badge} (${sign})`;
        }

        // 4. Update Score Value Display
        if (gaugeScoreNumber) {
            const formattedScore = totalScore > 0 ? `+${totalScore}` : `${totalScore}`;
            gaugeScoreNumber.textContent = formattedScore;
            gaugeScoreNumber.style.color = primaryColor;
        }

        // 5. Update Gauge Arc Progress
        // Circle circumference: 2 * pi * 95 = 596.90
        const circumference = 596.9;
        let progressPercent = 0.5; // at 0 score, it is half
        
        // Scale score from -15 to +15 into 0.0 ... 1.0
        const clampedScore = Math.max(-15, Math.min(15, totalScore));
        progressPercent = 0.5 + (clampedScore / 30.0); // 0.0 to 1.0

        const strokeOffset = circumference - (circumference * progressPercent);
        if (gaugeProgressArc) {
            gaugeProgressArc.style.strokeDashoffset = strokeOffset;
            gaugeProgressArc.style.stroke = primaryColor;
        }

        // 6. Render Events List Feed
        renderEventsList();
    }

    function renderEventsList() {
        if (!eventsListContainer) return;
        eventsListContainer.innerHTML = '';

        if (events.length === 0) {
            eventsListContainer.innerHTML = `
                <div class="empty-events-state">
                    <img src="./assets/octo.png" alt="Boş Liste" class="empty-mascot-thumb">
                    <h4>Henüz Kayıtlı Olay Yok</h4>
                    <p>Yukarıdaki hızlı presetlerden birine tıkla veya kendi özel olayını oluşturarak gününü puanlamaya başla.</p>
                </div>
            `;
            return;
        }

        events.forEach(evt => {
            const card = document.createElement('div');
            card.className = 'event-row-card';

            const isPos = evt.score > 0;
            const sign = isPos ? `+${evt.score}` : `${evt.score}`;
            const pillClass = isPos ? 'pos' : 'neg';
            const icon = CATEGORY_ICONS[evt.category] || "📋";

            card.innerHTML = `
                <div class="event-left">
                    <span class="event-cat-icon">${icon}</span>
                    <div class="event-details">
                        <h4>${escapeHTML(evt.title)}</h4>
                        <small>${escapeHTML(evt.category)} • ${evt.time}${evt.note ? ` • "${escapeHTML(evt.note)}"` : ''}</small>
                    </div>
                </div>
                <div class="event-right">
                    <span class="event-score-badge ${pillClass}">${sign}</span>
                    <button type="button" class="btn-del-event" data-id="${evt.id}" title="Olayı Sil">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            `;

            const delBtn = card.querySelector('.btn-del-event');
            delBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                card.style.opacity = '0';
                card.style.transform = 'translateX(20px)';
                setTimeout(() => removeEvent(evt.id), 200);
            });

            eventsListContainer.appendChild(card);
        });
    }

    function escapeHTML(str) {
        if (!str) return '';
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
