const API = "https://script.google.com/macros/s/AKfycbzivYydza8C-X9eXjXPaHrJbcJH8DscG6l6e9haY5a33FRlpaGp92x5B79Q5zvU3yRD/exec";

const list = document.getElementById("petugasList");
let current = null;
let nilai = 0;

fetch(API)
  .then(res => res.json())
  .then(data => {
    list.innerHTML = "";
    data.forEach(p => {
      const key = `rated_${p.nama}`;
      const sudah = localStorage.getItem(key);

      list.innerHTML += `
        <div class="card">
          <img src="${p.foto}" onerror="this.src='img/default.png'">
          <h3>${p.nama}</h3>
          <p>${p.jabatan}</p>
          <button ${sudah ? "disabled style='opacity:.5'" : ""} 
            onclick='buka(${JSON.stringify(p)})'>
            ${sudah ? "Sudah Dinilai" : "Nilai"}
          </button>
        </div>
      `;
    });
  });

function buka(p) {
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

function rate(n) {
  nilai = n;
  document.querySelectorAll(".rating span").forEach((s,i)=>{
    s.classList.toggle("active", i < n);
  });
}

function kirim() {
  if (nilai === 0) {
    alert("Pilih rating dulu ya 🙏");
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
    localStorage.setItem(`rated_${current.nama}`, true);
    alert("Terima kasih atas penilaian Anda 🙏");
    location.reload();
  });
}

function tutup() {
  document.getElementById("modal").style.display = "none";
}