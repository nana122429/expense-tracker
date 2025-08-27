const API_URL = "/.netlify/functions/db";

// โหลดข้อมูลตอนเปิดเว็บ
async function loadExpenses() {
  const res = await fetch(API_URL);
  const data = await res.json();

  let table = document.getElementById("expenseTable");
  table.innerHTML = "<tr><th>รายการ</th><th>หมวด</th><th>จำนวนเงิน</th></tr>";
  let total = 0;

  data.forEach(e => {
    table.innerHTML += `<tr><td>${e.description}</td><td>${e.category}</td><td>${e.amount}</td></tr>`;
    total += Number(e.amount);
  });

  document.getElementById("total").innerText = total;
}

// บันทึกข้อมูลใหม่
document.getElementById("saveBtn").addEventListener("click", async () => {
  const desc = document.getElementById("desc").value;
  const amount = document.getElementById("amount").value;
  const type = document.getElementById("type").value;

  if (!desc || !amount) return alert("กรอกข้อมูลให้ครบ");

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ description: desc, amount, category: type })
  });

  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";

  loadExpenses();
});

loadExpenses();