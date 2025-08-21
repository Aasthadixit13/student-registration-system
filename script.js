// Elements
const tbody = document.getElementById('studentTableBody');
const addBtn = document.getElementById('addStudentBtn');
const clearAllBtn = document.getElementById('clearAllBtn');

// Inputs
const nameInp = document.getElementById('studentName');
const idInp = document.getElementById('studentId');
const emailInp = document.getElementById('email');
const contactInp = document.getElementById('contact');

// Load saved students
let students = JSON.parse(localStorage.getItem('students')) || [];

// Import static rows ONCE if localStorage empty
if (students.length === 0) {
  const staticRows = Array.from(tbody.querySelectorAll('tr'));
  staticRows.forEach(r => {
    const c = r.querySelectorAll('td');
    if (c.length >= 4) {
      students.push({
        uid: Date.now() + Math.random(),
        name: c[0].innerText.trim(),
        id: c[1].innerText.trim(),
        email: c[2].innerText.trim(),
        contact: c[3].innerText.trim()
      });
    }
  });
}

// Save to localStorage
function save() {
  localStorage.setItem('students', JSON.stringify(students));
}

// Render table
function render() {
  tbody.innerHTML = students.map(s => `
    <tr data-uid="${s.uid}">
      <td>${s.name}</td>
      <td>${s.id}</td>
      <td>${s.email}</td>
      <td>${s.contact}</td>
      <td><button class="btn btn-danger btn-sm delete-row">Delete</button></td>
    </tr>
  `).join('');
  save();
}

// Validate inputs
function validate() {
  const name = nameInp.value.trim();
  const id = idInp.value.trim();
  const email = emailInp.value.trim();
  const contact = contactInp.value.trim();

  if (!/^[A-Za-z ]+$/.test(name)) { alert('Name: letters & spaces only'); return null; }
  if (!/^\d+$/.test(id)) { alert('Student ID: numbers only'); return null; }
  if (!/^\S+@\S+\.\S+$/.test(email)) { alert('Invalid email'); return null; }
  if (!/^\d{10,}$/.test(contact)) { alert('Contact: at least 10 digits'); return null; }

  return { uid: Date.now() + Math.random(), name, id, email, contact };
}

// Add student
addBtn.addEventListener('click', () => {
  const v = validate();
  if (!v) return;
  students.push(v);
  render();
  nameInp.value = idInp.value = emailInp.value = contactInp.value = '';
});

// Delete row
tbody.addEventListener('click', e => {
  if (e.target.classList.contains('delete-row')) {
    const uid = e.target.closest('tr').dataset.uid;
    students = students.filter(s => String(s.uid) !== uid);
    render();
  }
});

// Clear all
clearAllBtn.addEventListener('click', () => {
  if (!confirm('Delete ALL records?')) return;
  students = [];
  render();
});

// Initial render
render();
