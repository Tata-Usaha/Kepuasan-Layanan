const API = "https://script.google.com/macros/s/AKfycbyU1NAIpPFOO54BZq1lX_cNt5bDvS9Q9gkjuvaoRsJXXEHYcyZvXmusoQHRz92s8Asl/exec";

const list = document.getElementById("petugasList");
let current = null;

let nilaiKualitas = 0;
let nilaiKomunikasi = 0;
let nilaiInformasi = 0;

function today() {
  return new Date().toISOString().slice(0,10);
}

/* LOAD PETUGAS */
function loadPetugas() {
  const s = document.createElement("script");
  s.src = API + "?callback=renderPetugas";
  document.body.appendChild(s);
}

function renderPetugas(data) {
  list.innerHTML = "";
  data.forEach(p => {
    list.innerHTML += `
      <div class="card">
        <img src="${p.foto}" onerror="this.src='img/default.png'">
        <h3>${p.nama}</h3>
        <p>${p.jabatan}</p>
        <button onclick="buka('${p.nama}','${p.jabatan}','${p.foto}')">Nilai</button>
      </div>
    `;
  });
}

document.addEventListener("DOMContentLoaded", loadPetugas);

function buka(nama, jabatan, foto) {
  const last = localStorage.getItem("last_rate_date");
  const now = today();
  if (last === now) {
    showToast("Anda sudah menilai hari ini 🙏");
    return;
  }

  current = { nama, jabatan, foto };
  nilaiKualitas = 0;
  nilaiKomunikasi = 0;
  nilaiInformasi = 0;

  document.querySelectorAll(".rating span").forEach(s => s.classList.remove("active"));
  document.getElementById("mFoto").src = foto;
  document.getElementById("mNama").innerText = nama;
  document.getElementById("mJabatan").innerText = jabatan;
  document.getElementById("komentar").value = "";
  document.getElementById("modal").style.display = "flex";
}

function rate(tipe, n) {
  if (tipe === "kualitas") nilaiKualitas = n;
  if (tipe === "komunikasi") nilaiKomunikasi = n;
  if (tipe === "informasi") nilaiInformasi = n;

  document.querySelectorAll(`.rating.${tipe} span`).forEach((s,i)=>{
    s.classList.toggle("active", i < n);
  });
}

function kirim() {
  if (!current) return;

  if (nilaiKualitas===0 || nilaiKomunikasi===0 || nilaiInformasi===0) {
    showToast("Lengkapi semua penilaian ⭐");
    return;
  }

  // 1. Simpan tanggal dulu
  localStorage.setItem("last_rate_date", today());

  // 2. Tampilkan toast dulu
  showToast("Terima kasih atas penilaian Anda 🙏");

  // 3. Siapkan form
  const form = document.createElement("form");
  form.action = API;
  form.method = "POST";
  form.target = "hidden_iframe";

  const data = {
    nama: current.nama,
    jabatan: current.jabatan,
    kualitas: nilaiKualitas,
    komunikasi: nilaiKomunikasi,
    informasi: nilaiInformasi,
    komentar: document.getElementById("komentar").value
  };

  Object.keys(data).forEach(k => {
    const i = document.createElement("input");
    i.type = "hidden";
    i.name = k;
    i.value = data[k];
    form.appendChild(i);
  });

  document.body.appendChild(form);

  // 4. Submit setelah toast sempat muncul
  setTimeout(() => {
    form.submit();
    form.remove();
  }, 600);

  // 5. Reload agak lama biar user lihat toast
  setTimeout(() => {
    location.reload();
  }, 3500);
}

function tutup() {
  document.getElementById("modal").style.display = "none";
}

function showToast(text) {
  const t = document.getElementById("toast");
  t.innerText = text;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2000);
}
