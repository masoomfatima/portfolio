
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('sticky');
    } else {
      navbar.classList.remove('sticky');
    }
  });


  let table = document.getElementById("recordTable");
let tbody = table.querySelector("tbody");
let emptyMsg = document.getElementById("emptyMessage");

function addRecord() {
    emptyMsg.classList.add("hidden");
    table.classList.remove("hidden");

    let row = document.createElement("tr");

    row.innerHTML = `
        <td>${Math.floor(Math.random() * 10000)}</td>
        <td>Sample Student</td>
        <td>student@mail.com</td>
        <td>Computer Science</td>
        <td>2</td>
    `;

    tbody.appendChild(row);
}

function fillRandom() {
    alert("This button can be connected to auto-fill logic.");
}
