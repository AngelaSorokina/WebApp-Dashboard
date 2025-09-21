const alertBanner = document.getElementById("alert");
const trafficCanvas = document.getElementById("traffic-chart");
const dailyCanvas = document.getElementById("daily-chart");
const mobileCanvas = document.getElementById("mobile-chart");
const user = document.getElementById("userField");
const message = document.getElementById("messageField");
const send = document.getElementById("send");
const trafficNav = document.querySelectorAll(".traffic-nav-link");

const bellWrap = document.getElementById('bell');
const notifPanel = document.getElementById('notifications');

const userError = document.getElementById("userError");
const messageError = document.getElementById("messageError");

const form = document.getElementById("messageForm");

let notifData = [
  { id: 1, text: 'You have 6 unread messages' },
  { id: 2, text: 'You have 3 new followers' },
  { id: 3, text: 'Your password expires in 7 days' }
];

let notifOpenedOnce = false;

//Alert Banner

alertBanner.innerHTML =
    `<div class="alert-banner">
    <p><strong>Alert:</strong> You have unread messages</p>
    <p class="alert-banner-close">x</p>
    </div>
`

alertBanner.addEventListener('click', e => {
    const element = e.target;
    if (element.classList.contains("alert-banner-close")) {
    alertBanner.style.display = "none"
    }
});

//Chart Widgets

let trafficData = {
        labels: ["16-22", "23-29", "30-5", "6-12", "13-19", "20-26", "27-3",
        "4-10", "11-17", "18-24", "25-31"],
        datasets: [{
        data: [750, 1250, 1000, 2000, 1500, 1750, 1250, 1850, 2250, 1500,
        2500],
        backgroundColor: 'rgba(116, 119, 191, .3)',
        borderWidth: 1,
        tension: 0.4
    }]
};

let trafficOptions = {
backgroundColor: 'rgba(112, 104, 201, .5)',
fill: true,
aspectRatio: 2.5,
animation: {
    duration: 300,
    easing: 'easeInOutQuad'
    },
    scales: {
        y: {
        beginAtZero: true
        }
    },
    plugins: {
        legend: {
        display: false
        }
    }
};

let trafficChart = new Chart(trafficCanvas, {
    type: 'line',
    data: trafficData,
    options: trafficOptions
});

trafficNav.forEach(link => {
  link.addEventListener("click", e => {

    trafficNav.forEach(l => l.classList.remove("active"));

    e.target.classList.add("active");

    let newData;
    if (e.target.textContent === "Hourly") {
      newData = [750, 1250, 1000, 2000, 1500, 1750, 1250, 1850, 2250, 1500,
        2500];
    } else if (e.target.textContent === "Daily") {
      newData = [500, 350, 750, 600, 900, 700, 1200, 900, 1600, 1300,
        1700];
    } else if (e.target.textContent === "Weekly") {
      newData = [600, 900, 500, 1600, 700, 1700, 950, 1200, 800, 1600,
        1400];
    } else if (e.target.textContent === "Monthly") {
      newData = [100, 500, 200, 1100, 1800, 1500, 1300, 1600, 2200, 2000,
        2450];
    }

    trafficChart.data.datasets[0].data = newData;
    trafficChart.update();
  });
});

//Bar Graph

const dailyData = {
    labels: ["S", "M", "T", "W", "T", "F", "S"],
    datasets: [{
    label: '# of Hits',
    data: [75, 115, 175, 125, 225, 200, 100],
    backgroundColor: '#7477BF',
    borderWidth: 1
    }]
};

const dailyOptions = {
    scales: {
        y: {
        beginAtZero: true
        }
    },
    plugins: {
        legend: {
        display: false
        }
    }
};

let dailyChart = new Chart(dailyCanvas, {
    type: 'bar',
    data: dailyData,
    options: dailyOptions
});

//Doughnut Chart

const mobileData = {
    labels: ["Desktop", "Tablet", "Phones"],
    datasets: [{
        label: '# of Users',
        data: [2000, 550, 500],
        borderWidth: 0,
        backgroundColor: [
        '#7477BF',
        '#78CF82',
        '#51B6C8'
        ]
    }]
};

const mobileOptions = {
    aspectRatio: 1.9,
    plugins: {
        legend: {
        position: 'right',
            labels: {
            boxWidth: 20,
            fontStyle: 'bold'
            }
        }
    }
};

let mobileChart = new Chart(mobileCanvas, {
    type: 'doughnut',
    data: mobileData,
    options: mobileOptions
});


//Messaging Section

form.addEventListener("submit", (e) => {
  e.preventDefault();

  userError.textContent = "";
  userError.style.display = "none";
  messageError.textContent = "";
  messageError.style.display = "none";

  if (user.value === "" && message.value === "") {
    userError.textContent = "Please fill out user field before sending.";
    userError.style.display = "block";
    messageError.textContent = "Please fill out message field before sending.";
    messageError.style.display = "block";
  } else if (user.value === "") {
    userError.textContent = "Please fill out user field before sending.";
    userError.style.display = "block";
  } else if (message.value === "") {
    messageError.textContent = "Please fill out message field before sending.";
    messageError.style.display = "block";
  } else {
    alert(`Message successfully sent to: ${user.value}`);
    form.reset();
  }
});

// ===== Notifications =====


/** Render the popover and toggle green dot */
function renderNotifications() {
    notifPanel.innerHTML = notifData.length
        ? notifData.map(n => `
            <div class="notif-item" data-id="${n.id}">
            <span class="status-dot" aria-hidden="true"></span>
            <span>${n.text}</span>
            <button class="notif-close" aria-label="Dismiss notification">×</button>
            </div>
        `).join('')
        : `<div class="notif-empty">No notifications</div>`;
    if (notifData.length > 0 && !notifOpenedOnce) {
    bellWrap.classList.add('has-unread');
    } else {
        bellWrap.classList.remove('has-unread');
    }
}
renderNotifications();

/** Toggle popover on bell click; hide green dot after first open */
bellWrap.addEventListener('click', () => {
    notifPanel.classList.toggle('is-open');
    bellWrap.classList.remove('has-unread');
    notifOpenedOnce = true;
});

/** Close single notification (event delegation) */
notifPanel.addEventListener('click', (e) => {
  if (!e.target.classList.contains('notif-close')) return;
  e.stopPropagation();
  const row = e.target.closest('.notif-item');
  const id = Number(row.dataset.id);
  notifData = notifData.filter(n => n.id !== id);
  renderNotifications();
});

/** Optional: close popover when clicking outside */
document.addEventListener('click', (e) => {
  if (!bellWrap.contains(e.target)) {
    notifPanel.classList.remove('is-open');
  }
});


// ===== Autocomplete for User Search =====
const members = [
  "Victoria Chambers",
  "Dale Byrd",
  "Dawn Wood",
  "Dan Oliver"
];

const autocompleteBox = document.createElement("div");
autocompleteBox.classList.add("autocomplete-box");
user.parentNode.appendChild(autocompleteBox);

user.addEventListener("input", () => {
  const val = user.value.toLowerCase();
  autocompleteBox.innerHTML = "";

  if (!val) return;

  const matches = members.filter(m => m.toLowerCase().includes(val));
  matches.forEach(m => {
    const item = document.createElement("div");
    item.classList.add("autocomplete-item");
    item.textContent = m;
    item.addEventListener("click", () => {
      user.value = m;
      autocompleteBox.innerHTML = "";
    });
    autocompleteBox.appendChild(item);
  });
});

// Close tips when clicking outside
document.addEventListener("click", (e) => {
  if (!autocompleteBox.contains(e.target) && e.target !== user) {
    autocompleteBox.innerHTML = "";
  }
});

// ===== Settings with Local Storage =====
const emailToggle = document.getElementById("email-toggle");
const profileToggle = document.getElementById("profile-toggle");
const timezoneSelect = document.getElementById("timezone");
const saveBtn = document.getElementById("save");
const cancelBtn = document.getElementById("cancel");

// Load saved settings at startup
window.addEventListener("load", () => {
  const savedEmail = localStorage.getItem("emailToggle");
  const savedProfile = localStorage.getItem("profileToggle");
  const savedTimezone = localStorage.getItem("timezone");

  if (savedEmail !== null) {
    emailToggle.checked = savedEmail === "true";
  }
  if (savedProfile !== null) {
    profileToggle.checked = savedProfile === "true";
  }
  if (savedTimezone) {
    timezoneSelect.value = savedTimezone;
  }
});

// Save the settings
saveBtn.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.setItem("emailToggle", emailToggle.checked);
  localStorage.setItem("profileToggle", profileToggle.checked);
  localStorage.setItem("timezone", timezoneSelect.value);
  alert("Settings saved ✅");
});

// Cancel: clear storage and return default
cancelBtn.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.clear();

 // Default values
  emailToggle.checked = true;
  profileToggle.checked = true;
  timezoneSelect.selectedIndex = 0; // "Select a Timezone"

  alert("Settings reset");
});