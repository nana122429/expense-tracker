const API_URL = "/.netlify/functions/db";

// โหลดข้อมูลจาก DB มาแสดงในตาราง
async function loadExpenses() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    let table = document.getElementById("expenseTable");
    table.innerHTML = "<tr><th>รายการ</th><th>หมวด</th><th>จำนวนเงิน</th></tr>";
    let total = 0;

    data.forEach(e => {
      table.innerHTML += `
        <tr>
          <td>${e.description}</td>
          <td>${e.category}</td>
          <td>${e.amount}</td>
        </tr>`;
      total += Number(e.amount);
    });

    document.getElementById("total").innerText = total;

  } catch (err) {
    console.error("โหลดข้อมูลล้มเหลว:", err);
  }
}

// กดปุ่ม "บันทึก" เพื่อเพิ่มค่าใช้จ่ายใหม่
document.getElementById("saveBtn").addEventListener("click", async () => {
  const desc = document.getElementById("desc").value.trim();
  const amount = document.getElementById("amount").value.trim();
  const type = document.getElementById("type").value;

  if (!desc || !amount) {
    alert("กรอกข้อมูลให้ครบก่อนบันทึก");
    return;
  }

  try {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ description: desc, amount, category: type })
    });

    // ล้าง input
    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";

    // โหลดใหม่หลังบันทึกเสร็จ
    loadExpenses();

  } catch (err) {
    console.error("บันทึกข้อมูลล้มเหลว:", err);
  }
});

// โหลดข้อมูลทันทีเมื่อเปิดเว็บ
loadExpenses();