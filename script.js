const API = "https://script.google.com/macros/s/AKfycbz-BdaDMKPpedfhEJM6XGy_F2752r_CFWXunEMli9fqS_l4FCKIS9wTp0_i-2Nxv2tq/exec";

const list = document.getElementById("petugasList");
let current = null;

let nilaiKualitas = 0;
let nilaiKomunikasi = 0;
let nilaiInformasi = 0;

/* ===== TANGGAL ===== */
function today() {
  return new Date().toISOString().slice(0,10);
}

/* ===== LOAD PETUGAS ===== */
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
          <button onclick='buka(${JSON.stringify(p)})'>Nilai</button>
        </div>
      `;
    });
  });

/* ===== BUKA MODAL ===== */
function buka(p) {
  const last = localStorage.getItem("last_rate_date");
  const now = today();

  if (last === now) {
    showToast("Anda sudah menilai hari ini 🙏");
    return;
  }

  current = p;
  nilaiKualitas = 0;
  nilaiKomunikasi = 0;
  nilaiInformasi = 0;

  document.querySelectorAll(".rating span").forEach(s => s.classList.remove("active"));

  document.getElementById("mFoto").src = p.foto;
  document.getElementById("mNama").innerText = p.nama;
  document.getElementById("mJabatan").innerText = p.jabatan;
  document.getElementById("komentar").value = "";
  document.getElementById("modal").style.display = "flex";
}

/* ===== PILIH BINTANG ===== */
function rate(tipe, n) {
  if (tipe === "kualitas") nilaiKualitas = n;
  if (tipe === "komunikasi") nilaiKomunikasi = n;
  if (tipe === "informasi") nilaiInformasi = n;

  document.querySelectorAll(`.rating.${tipe} span`).forEach((s,i)=>{
    s.classList.toggle("active", i < n);
  });
}

/* ===== KIRIM ===== */
function kirim() {
  if (nilaiKualitas===0 || nilaiKomunikasi===0 || nilaiInformasi===0) {
    showToast("Lengkapi semua penilaian ⭐");
    return;
  }

  fetch(API, {
    method: "POST",
    body: JSON.stringify({
      nama: current.nama,
      jabatan: current.jabatan,
      kualitas: nilaiKualitas,
      komunikasi: nilaiKomunikasi,
      informasi: nilaiInformasi,
      komentar: document.getElementById("komentar").value
    })
  }).then(() => {
    localStorage.setItem("last_rate_date", today());
    showToast("Terima kasih atas penilaian Anda 🙏");
    setTimeout(()=>location.reload(),2000);
  });
}

function tutup() {
  document.getElementById("modal").style.display = "none";
}

/* ===== TOAST ===== */
function showToast(text) {
  const t = document.getElementById("toast");
  t.innerText = text;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2000);
}
