function calcOT() {
  let salary = Number(document.getElementById("salary").value) || 0;
  let date = document.getElementById("otDate").value;
  let start = document.getElementById("startTime").value;
  let end = document.getElementById("endTime").value;
  let rate = Number(document.getElementById("otRate").value) || 1;
  let note = document.getElementById("note").value;
  
  if (!date || !start || !end || salary <= 0) {
    alert("กรุณากรอกข้อมูลให้ครบ");
    return;
  }
  
  // แปลงเวลาเป็นชั่วโมง
  let startTime = new Date(`2000-01-01T${start}:00`);
  let endTime = new Date(`2000-01-01T${end}:00`);
  let diffMs = endTime - startTime;
  let hours = diffMs / 1000 / 60 / 60; // ชั่วโมง
  
  if (hours <= 0) {
    alert("เวลาออกต้องมากกว่าเวลาเข้า");
    return;
  }
  
  // คำนวณค่า OT
  let hourlyRate = salary / 30 / 8;
  let otPay = hourlyRate * rate * hours;
  
  document.getElementById("otResult").innerText =
    `รวมค่า OT: ${otPay.toLocaleString()} บาท`;
  
  // ✅ บันทึกลง localStorage
  let otData = JSON.parse(localStorage.getItem("otData")) || [];
  otData.push({
    date: date,
    start: start,
    end: end,
    hours: hours,
    rate: rate,
    pay: otPay,
    note: note
  });
  localStorage.setItem("otData", JSON.stringify(otData));
  
  renderOT();
}

// แสดงรายการ OT
function renderOT() {
  let otData = JSON.parse(localStorage.getItem("otData")) || [];
  let list = document.getElementById("otList");
  list.innerHTML = "";
  
  otData.forEach(item => {
    let li = document.createElement("li");
    li.textContent = `${item.date} [${item.start}-${item.end}] ⏱ ${item.hours} ชม. ×${item.rate} = ${item.pay.toLocaleString()} บาท ${item.note ? "📝 " + item.note : ""}`;
    list.appendChild(li);
  });
}

// โหลดรายการตอนเปิดเว็บ
window.onload = function() {
  renderOT();
};