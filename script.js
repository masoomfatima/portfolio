// -- NAVBAR STICKY --
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) navbar.classList.add('sticky');
  else navbar.classList.remove('sticky');
});


// ------------------ LOAD RECORDS ON START ------------------
loadRecords();


// ------------------ VARIABLES ------------------
let editingRow = null;


// ------------------ ADD / UPDATE RECORD ------------------
function addRecord() {
  const id = document.querySelector("input[placeholder='Student ID']").value.trim();
  const first = document.querySelector("input[placeholder='First Name']").value.trim();
  const last = document.querySelector("input[placeholder='Last Name']").value.trim();
  const dept = document.querySelector("select[name='department']").value;
  const total = Number(document.querySelector("input[placeholder='Total Fees ($)']").value);
  const paid = Number(document.querySelector("input[placeholder='Fees Paid ($)']").value);

  if (!id || !first || !last) {
    alert("Please fill Student ID, First Name and Last Name");
    return;
  }

  const balance = total - paid;
  const status = balance === 0 ? "Paid" : "Partial";

  const tbody = document.getElementById("recordTableBody");

  if (editingRow !== null) {
    const row = tbody.rows[editingRow];
    row.cells[0].innerText = id;
    row.cells[1].innerText = `${first} ${last}`;
    row.cells[2].innerText = dept;
    row.cells[3].innerText = "$" + total;
    row.cells[4].innerText = "$" + paid;
    row.cells[5].innerText = "$" + balance;
    row.cells[6].innerText = status;

    editingRow = null;
    document.querySelector(".add-btn").innerText = "+ Add Record";
  } 
  else {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${id}</td>
      <td>${first} ${last}</td>
      <td>${dept}</td>
      <td>$${total}</td>
      <td>$${paid}</td>
      <td>$${balance}</td>
      <td>${status}</td>
      <td>
        <button onclick="editRecord(this)">✏️</button>
        <button onclick="deleteRecord(this)">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  }

  updateBudgetOverview();
  saveRecords();
  clearForm();
}


// ------------------ EDIT RECORD ------------------
function editRecord(btn) {
  const row = btn.closest("tr");
  editingRow = Array.from(row.parentElement.rows).indexOf(row);

  const [id, name, dept, total, paid] = row.cells;
  const parts = name.innerText.split(" ");

  document.querySelector("input[placeholder='Student ID']").value = id.innerText;
  document.querySelector("input[placeholder='First Name']").value = parts[0];
  document.querySelector("input[placeholder='Last Name']").value = parts[1];
  document.querySelector("select[name='department']").value = dept.innerText;
  document.querySelector("input[placeholder='Total Fees ($)']").value = Number(total.innerText.replace("$",""));
  document.querySelector("input[placeholder='Fees Paid ($)']").value = Number(paid.innerText.replace("$",""));

  document.querySelector(".add-btn").innerText = "Update Record";
}


// ------------------ DELETE RECORD ------------------
function deleteRecord(btn) {
  btn.closest("tr").remove();
  updateBudgetOverview();
  saveRecords();
}


// ------------------ FILL RANDOM ------------------
function fillRandom() {
  const names = ["Ali", "Ayesha", "Hassan", "Laiba", "Sara", "Bilal"];
  document.querySelector("input[placeholder='Student ID']").value = Math.floor(10000 + Math.random() * 90000);
  document.querySelector("input[placeholder='First Name']").value = names[Math.floor(Math.random() * names.length)];
  document.querySelector("input[placeholder='Last Name']").value = names[Math.floor(Math.random() * names.length)];
  document.querySelector("select[name='department']").value = "Engineering";
  document.querySelector("input[placeholder='Total Fees ($)']").value = 20000;
  document.querySelector("input[placeholder='Fees Paid ($)']").value = 5000;

  addRecord();
}


// ------------------ UPDATE BUDGET ------------------
function updateBudgetOverview() {
  const rows = document.querySelectorAll("#recordTableBody tr");
  let total = 0, collected = 0, pending = 0;

  rows.forEach(r => {
    total += Number(r.cells[3].innerText.replace("$",""));
    collected += Number(r.cells[4].innerText.replace("$",""));
    pending += Number(r.cells[5].innerText.replace("$",""));
  });

  const cards = document.querySelectorAll(".overview .card p");
  if (cards.length >= 4) {
    cards[0].innerText = "$" + total.toLocaleString();
    cards[1].innerText = "$" + collected.toLocaleString();
    cards[2].innerText = "$" + pending.toLocaleString();
    cards[3].innerText = rows.length;
  }
}


// ------------------ CLEAR FORM ------------------
function clearForm() {
  document.querySelectorAll("#studentForm input").forEach(i => i.value = "");
  document.querySelectorAll("#studentForm select").forEach(s => s.selectedIndex = 0);
  document.querySelector(".add-btn").innerText = "+ Add Record";
  editingRow = null;
}


// ------------------ SAVE TO LOCAL STORAGE ------------------
function saveRecords() {
  const rows = document.querySelectorAll("#recordTableBody tr");
  const data = [];

  rows.forEach(r => {
    const c = r.cells;
    data.push({
      id: c[0].innerText,
      name: c[1].innerText,
      dept: c[2].innerText,
      total: c[3].innerText,
      paid: c[4].innerText,
      balance: c[5].innerText,
      status: c[6].innerText
    });
  });

  localStorage.setItem("studentRecords", JSON.stringify(data));
}


// ------------------ LOAD FROM LOCAL STORAGE ------------------
function loadRecords() {
  const stored = JSON.parse(localStorage.getItem("studentRecords"));
  if (!stored) return;

  const tbody = document.getElementById("recordTableBody");

  stored.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.dept}</td>
      <td>${item.total}</td>
      <td>${item.paid}</td>
      <td>${item.balance}</td>
      <td>${item.status}</td>
      <td>
        <button onclick="editRecord(this)">✏️</button>
        <button onclick="deleteRecord(this)">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  updateBudgetOverview();
}


// ------------------ SMOOTH SCROLL ------------------
function goTo(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

document.querySelector(".nav-home").onclick = (e) => { e.preventDefault(); goTo("herotop"); };
document.querySelector(".nav-about").onclick = (e) => { e.preventDefault(); goTo("aboutsection"); };
document.querySelector(".nav-crud").onclick = (e) => { e.preventDefault(); goTo("crudsection"); };
document.querySelectorAll(".btn-outline")[0].onclick = () => goTo("aboutsection");
document.querySelectorAll(".btn-outline")[1].onclick = () => goTo("crudsection");
