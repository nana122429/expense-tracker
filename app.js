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
      const categoryClass = `category-${e.category}`;
      table.innerHTML += `
        <tr class="${categoryClass}">
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