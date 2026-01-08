const API = "https://script.google.com/macros/s/AKfycbzivYydza8C-X9eXjXPaHrJbcJH8DscG6l6e9haY5a33FRlpaGp92x5B79Q5zvU3yRD/exec";

const list = document.getElementById("petugasList");
let current = null;
let nilai = 0;

fetch(API)
  .then(res => res.json())
  .then(data => {
    data.forEach(p => {
      list.innerHTML += `
        <div class="card">
          <img src="${p.foto}" onerror="this.src='https://i.ibb.co/4pDNDk1/user.png'">
          <h3>${p.nama}</h3>
          <p>${p.jabatan}</p>
          <button onclick='buka(${JSON.stringify(p)})'>Nilai</button>
        </div>
      `;
    });
  });

function buka(p){
  current = p;
  nilai = 0;
  modal.style.display = "flex";
  mFoto.src = p.foto;
  mNama.innerText = p.nama;
  mJabatan.innerText = p.jabatan;
}

function rate(n){
  nilai = n;
  document.querySelectorAll(".rating span")
    .forEach((s,i)=>s.classList.toggle("active", i < n));
}

function kirim(){
  fetch(API,{
    method:"POST",
    body:JSON.stringify({
      nama:current.nama,
      jabatan:current.jabatan,
      rating:nilai,
      komentar:komentar.value
    })
  }).then(()=>{
    alert("Terima kasih 🙏");
    location.reload();
  });
}

function tutup(){
  modal.style.display = "none";
}
