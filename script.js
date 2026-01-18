const API = "https://script.google.com/macros/s/AKfycbzivYydza8C-X9eXjXPaHrJbcJH8DscG6l6e9haY5a33FRlpaGp92x5B79Q5zvU3yRD/exec";

const list = document.getElementById("petugasList");
let current = null;

let nilai = {
  kualitas: 0,
  komunikasi: 0,
  informasi: 0
};

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
  if (last === today()) {
    showToast("Anda sudah memberi penilaian hari ini 🙏");
    return;
  }

  current = p;
  nilai = { kualitas:0, komunikasi:0, informasi:0 };

  document.querySelectorAll(".rating span").forEach(s=>s.classList.remove("active"));

  mFoto.src = p.foto;
  mNama.innerText = p.nama;
  mJabatan.innerText = p.jabatan;
  komentar.value = "";
  modal.style.display = "flex";
}

/* ===== PILIH BINTANG ===== */
function rate(type, n) {
  nilai[type] = n;
  const box = document.querySelector("." + type);
  box.querySelectorAll("span").forEach((s,i)=>{
    s.classList.toggle("active", i < n);
  });
}

/* ===== KIRIM ===== */
function kirim() {
  if (!nilai.kualitas || !nilai.komunikasi || !nilai.informasi) {
    showToast("Semua kategori wajib diisi 🙏");
    return;
  }

  fetch(API, {
    method: "POST",
    body: JSON.stringify({
      nama: current.nama,
      jabatan: current.jabatan,
      kualitas: nilai.kualitas,
      komunikasi: nilai.komunikasi,
      informasi: nilai.informasi,
      komentar: komentar.value
    })
  }).then(() => {
    localStorage.setItem("last_rate_date", today());
    showToast("Terima kasih atas penilaian Anda 🙏");
    setTimeout(()=>location.reload(),2000);
  });
}

/* ===== TUTUP ===== */
function tutup() {
  modal.style.display = "none";
}

/* ===== TOAST ===== */
function showToast(text) {
  const t = document.getElementById("toast");
  t.innerText = text;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2000);
}
