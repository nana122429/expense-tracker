// โหลดข้อมูลจาก localStorage ถ้ามี
window.onload = function() {
  checkNewDay(); // ✅ reset ช่องกรอกใหม่ทุกวัน
  checkAutoMonthlyReset(); // ✅ reset รายเดือนทุกวันที่ 25 เวลา 03:00
  loadData();
  calcAll();
};

function saveData(field) {
  let data = JSON.parse(localStorage.getItem("pocketData")) || {};
  
  if (field === "income") {
    data["salary"] = Number(document.getElementById("salary").value) || 0;
    data["ot"] = Number(document.getElementById("ot").value) || 0;
    data["incentive"] = Number(document.getElementById("incentive").value) || 0;
  } else if (field === "electric") {
    data["electricStart"] = Number(document.getElementById("electricStart").value) || 0;
    data["electricNow"] = Number(document.getElementById("electricNow").value) || 0;
    data["electricRate"] = Number(document.getElementById("electricRate").value) || 7;
  } else {
    data[field] = Number(document.getElementById(field).value) || 0;
  }
  
  localStorage.setItem("pocketData", JSON.stringify(data));
  loadData();
  calcAll();
}

/* ===================== 🍚 ค่าอาหาร ===================== */
function saveFood() {
  let today = new Date();
  let key = today.toISOString().split("T")[0]; // YYYY-MM-DD
  let value = Number(document.getElementById("foodToday").value) || 0;
  
  let foodData = JSON.parse(localStorage.getItem("foodData")) || {};
  foodData[key] = value; // บันทึกค่าอาหารจริงของวันนั้น
  
  localStorage.setItem("foodData", JSON.stringify(foodData));
  calcAll();
}

function calcFood() {
  let today = new Date();
  let currentYear = today.getFullYear();
  let currentMonth = today.getMonth();
  let targetDate = new Date(currentYear, currentMonth + 1, 25);
  
  let foodData = JSON.parse(localStorage.getItem("foodData")) || {};
  let totalFood = 0;
  
  for (let d = new Date(today); d <= targetDate; d.setDate(d.getDate() + 1)) {
    let key = d.toISOString().split("T")[0];
    if (foodData[key] !== undefined) {
      totalFood += foodData[key]; // ใช้ค่าที่บันทึกจริง
    } else {
      totalFood += 200; // default = 200 บาท/วัน
    }
  }
  
  document.getElementById("foodNote").innerText = `${totalFood.toLocaleString()} บาท`;
  return totalFood;
}

/* ===================== ⛽ ค่าน้ำมัน ===================== */
function saveFuel() {
  let today = new Date();
  let key = today.toISOString().split("T")[0]; // YYYY-MM-DD
  let value = Number(document.getElementById("fuelToday").value) || 0;
  
  let fuelData = JSON.parse(localStorage.getItem("fuelData")) || {};
  fuelData[key] = value; // บันทึกค่าน้ำมันจริงของวันนั้น
  
  localStorage.setItem("fuelData", JSON.stringify(fuelData));
  calcAll();
}

function calcFuel() {
  let today = new Date();
  let currentYear = today.getFullYear();
  let currentMonth = today.getMonth();
  let targetDate = new Date(currentYear, currentMonth + 1, 25);
  
  let fuelData = JSON.parse(localStorage.getItem("fuelData")) || {};
  let totalFuel = 0;
  
  for (let d = new Date(today); d <= targetDate; d.setDate(d.getDate() + 1)) {
    let key = d.toISOString().split("T")[0];
    if (fuelData[key] !== undefined) {
      totalFuel += fuelData[key]; // ใช้ค่าที่บันทึกจริง
    } else {
      totalFuel += 20; // default = 20 บาท/วัน
    }
  }
  
  document.getElementById("fuelNote").innerText = `${totalFuel.toLocaleString()} บาท`;
  return totalFuel;
}

/* ======================================================= */

function loadData() {
  let data = JSON.parse(localStorage.getItem("pocketData")) || {};
  
  for (let key in data) {
    if (document.getElementById(key)) {
      document.getElementById(key).value = data[key];
    }
  }
  
  document.querySelectorAll("button").forEach(btn => {
    let id = btn.id.replace("btn-", "");
    if (
      (id === "income" && (data["salary"] || data["ot"] || data["incentive"])) ||
      (id === "electric" && (data["electricStart"] || data["electricNow"])) ||
      (data[id] !== undefined)
    ) {
      btn.innerText = "อัพเดท";
    } else if (btn.id.startsWith("btn-")) {
      btn.innerText = "บันทึก";
    }
  });
}

function calcAll() {
  let salary = Number(document.getElementById("salary").value) || 0;
  let ot = Number(document.getElementById("ot").value) || 0;
  let incentive = Number(document.getElementById("incentive").value) || 0;
  let income = salary + ot + incentive;
  document.getElementById("incomeResult").innerText =
    `รวมรายได้: ${income.toLocaleString()} บาท`;
  
  let start = Number(document.getElementById("electricStart").value) || 0;
  let now = Number(document.getElementById("electricNow").value) || 0;
  let rate = Number(document.getElementById("electricRate").value) || 7;
  let used = now - start;
  let electricCost = used > 0 ? used * rate : 0;
  document.getElementById("electricResult").innerText =
    `รวมค่าไฟฟ้า: ${electricCost.toLocaleString()} บาท`;
  
  let foodTotal = calcFood();
  let fuelTotal = calcFuel();
  
  let water = Number(document.getElementById("water").value) || 0;
  let rent = Number(document.getElementById("rent").value) || 0;
  
  let totalExpense = electricCost + water + foodTotal + fuelTotal + rent;
  let balance = income - totalExpense;
  
  document.getElementById("totalExpense").innerText =
    `ค่าใช้จ่ายรวม: ${totalExpense.toLocaleString()} บาท`;
  document.getElementById("balance").innerText =
    `เงินคงเหลือ: ${balance.toLocaleString()} บาท`;
}

function resetPocket() {
  localStorage.removeItem("pocketData");
  localStorage.removeItem("foodData");
  localStorage.removeItem("fuelData");
  localStorage.removeItem("lastDate");
  localStorage.removeItem("lastMonthlyReset");
  
  document.querySelectorAll("input").forEach(input => {
    input.value = "";
  });
  
  document.getElementById("incomeResult").innerText = "รวมรายได้: 0 บาท";
  document.getElementById("electricResult").innerText = "รวมค่าไฟฟ้า: 0 บาท";
  document.getElementById("foodNote").innerText = "0 บาท";
  document.getElementById("fuelNote").innerText = "0 บาท";
  document.getElementById("totalExpense").innerText = "ค่าใช้จ่ายรวม: 0 บาท";
  document.getElementById("balance").innerText = "เงินคงเหลือ: 0 บาท";
  
  document.querySelectorAll("button").forEach(btn => {
    if (btn.id.startsWith("btn-")) {
      btn.innerText = "บันทึก";
    }
  });
}

// ✅ รีเซ็ตช่องกรอกใหม่ทุกวัน
function checkNewDay() {
  let today = new Date().toISOString().split("T")[0];
  let lastDate = localStorage.getItem("lastDate");
  
  if (lastDate !== today) {
    document.getElementById("foodToday").value = "";
    document.getElementById("fuelToday").value = "";
    localStorage.setItem("lastDate", today);
  }
}

// ✅ รีเซ็ตอัตโนมัติทุกเดือน (25 เวลา 03:00)
function checkAutoMonthlyReset() {
  let now = new Date();
  let day = now.getDate();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  
  if (day === 25 && (hours > 3 || (hours === 3 && (minutes > 0 || seconds >= 0)))) {
    let lastReset = localStorage.getItem("lastMonthlyReset");
    let todayKey = now.toISOString().split("T")[0]; // YYYY-MM-DD
    
    if (lastReset !== todayKey) {
      resetPocket(); // ✅ รีเซ็ต pocket ทั้งหมด
      localStorage.setItem("lastMonthlyReset", todayKey);
      console.log("✅ รีเซ็ตค่า pocket อัตโนมัติประจำเดือนแล้ว");
    }
  }
}