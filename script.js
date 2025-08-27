let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDay = null;

// โหลดโน้ตจาก localStorage ถ้ามี
let notes = JSON.parse(localStorage.getItem("calendarNotes")) || {};
// รูปแบบ: {"2025-08-27": ["holiday","ot"]}

function updateDateTime() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateString = now.toLocaleDateString('th-TH', options);
  
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timeString = `${hours}:${minutes}:${seconds}`;
  
  document.getElementById("date").innerText = dateString;
  document.getElementById("time").innerText = timeString;
}

// ✅ ฟังก์ชันสร้างปฏิทิน
function generateCalendar(month, year) {
  const today = new Date();
  const monthNames = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  const dayNames = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  let calendarHTML = `<div class="calendar-header">${monthNames[month]} ${year + 543}</div>`;
  calendarHTML += `<div class="calendar-grid">`;
  
  for (let d of dayNames) {
    calendarHTML += `<div class="day-name">${d}</div>`;
  }
  
  for (let i = 0; i < firstDay; i++) {
    calendarHTML += `<div></div>`;
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    let classes = "day";
    let todayFlag = (day === today.getDate() && month === today.getMonth() && year === today.getFullYear());
    let noteList = notes[dateKey] || [];
    
    if (todayFlag && noteList.includes("holiday") && noteList.includes("ot")) {
      classes += " today-holiday-ot";
    } else if (noteList.includes("holiday") && noteList.includes("ot")) {
      classes += " holiday-ot";
    } else if (todayFlag) {
      classes += " today";
    } else if (noteList.includes("holiday")) {
      classes += " holiday";
    } else if (noteList.includes("ot")) {
      classes += " ot";
    }
    
    calendarHTML += `<div class="${classes}" onclick="selectDate(${day}, ${month}, ${year})">${day}</div>`;
  }
  
  calendarHTML += `</div>`;
  document.getElementById("calendar").innerHTML = calendarHTML;
}

function prevMonth() {
  if (currentMonth > 0) {
    currentMonth--;
    generateCalendar(currentMonth, currentYear);
  }
}

function nextMonth() {
  if (currentMonth < 11) {
    currentMonth++;
    generateCalendar(currentMonth, currentYear);
  }
}

function selectDate(day, month, year) {
  selectedDay = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  document.getElementById("selectedDate").innerText = `วันที่เลือก: ${day}/${month+1}/${year+543}`;
}

function addNote(type) {
  if (!selectedDay) {
    alert("กรุณาเลือกวันก่อน");
    return;
  }
  if (!notes[selectedDay]) {
    notes[selectedDay] = [];
  }
  if (!notes[selectedDay].includes(type)) {
    notes[selectedDay].push(type);
  }
  saveNotes();
  generateCalendar(currentMonth, currentYear);
}

function removeNote() {
  if (!selectedDay) {
    alert("กรุณาเลือกวันก่อน");
    return;
  }
  if (notes[selectedDay]) {
    delete notes[selectedDay];
    saveNotes();
    generateCalendar(currentMonth, currentYear);
  } else {
    alert("วันนั้นยังไม่มีโน้ต");
  }
}

function saveNotes() {
  localStorage.setItem("calendarNotes", JSON.stringify(notes));
}

// ✅ เริ่มต้น
updateDateTime();
setInterval(updateDateTime, 1000);
generateCalendar(currentMonth, currentYear);