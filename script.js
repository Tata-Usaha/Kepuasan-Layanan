const API = "https://script.google.com/macros/s/AKfycbzivYydza8C-X9eXjXPaHrJbcJH8DscG6l6e9haY5a33FRlpaGp92x5B79Q5zvU3yRD/exec";

const list = document.getElementById("petugasList");
let current = null;
let nilai = 0;

/* ===== TANGGAL HARI INI ===== */
function today() {
  return new Date().toISOString().slice(0,10);
}

/* ===== LOAD DATA PETUGAS ===== */
fetch(API)
  .then(res => res.json())
  .then(data => {
    list.innerHTML = "";
    data.forEach(p => {
      list.innerHTML += `
        <div class="card">
          <img src="${p.foto}" onerror="this.src='img/default.png'">
          <h3>${p.nama}</h3>
          <p>${p.jabatan}</p>
          <button onclick='buka(${JSON.stringify(p)})'>
            Nilai
          </button>
        </div>
      `;
    });
  });

/* ===== BUKA MODAL ===== */
function buka(p) {
  const last = localStorage.getItem("last_rate_date");
  const now = today();

  if (last === now) {
  showToast("Anda sudah memberi penilaian hari ini 🙏");
  return;
  }

  current = p;
  nilai = 0;

  document.querySelectorAll(".rating span")
    .forEach(s => s.classList.remove("active"));

  document.getElementById("mFoto").src = p.foto;
  document.getElementById("mNama").innerText = p.nama;
  document.getElementById("mJabatan").innerText = p.jabatan;
  document.getElementById("komentar").value = "";
  document.getElementById("modal").style.display = "flex";
}

/* ===== PILIH BINTANG ===== */
function rate(n) {
  nilai = n;
  document.querySelectorAll(".rating span").forEach((s,i)=>{
    s.classList.toggle("active", i < n);
  });
}

/* ===== KIRIM NILAI ===== */
function kirim() {
  if (nilai === 0) {
    showToast("Pilih rating dulu ya 🙏");
    return;
  }

  fetch(API, {
    method: "POST",
    body: JSON.stringify({
      nama: current.nama,
      jabatan: current.jabatan,
      rating: nilai,
      komentar: document.getElementById("komentar").value
    })
  }).then(() => {
    localStorage.setItem("last_rate_date", today());

    // tampilkan toast dulu
    showToast("Terima kasih atas penilaian Anda 🙏");

    // baru reload setelah 2 detik
    setTimeout(() => {
      location.reload();
    }, 2000);
  });
}

/* ===== TUTUP MODAL ===== */
function tutup() {
  document.getElementById("modal").style.display = "none";
}

function showToast(text) {
  const t = document.getElementById("toast");
  t.innerText = text;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2000);
}
