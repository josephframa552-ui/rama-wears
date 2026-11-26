const U = (id, w=800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const products = [
  {id:1,name:"Heavy Box Tee",cat:"tops",price:48,img:"photo-1521572163474-6864f9cf17ab",alt:"photo-1503342217505-b0a15ec3261c",colors:["#F4EFE4","#1F3A2E","#C7B08A"],badge:"Bestseller"},
  {id:2,name:"Loop Hoodie",cat:"tops",price:98,img:"photo-1556821840-3a63f95609a7",alt:"photo-1620799140408-edc6dcb6d633",colors:["#2C4D3E","#EAD9BC","#2A2622"]},
  {id:3,name:"Leather Rider Jacket",cat:"outer",price:289,img:"photo-1551028719-00167b16eac5",alt:"photo-1591047139829-d91aecb6caea",colors:["#2A2622","#6D5A3F"],badge:"New"},
  {id:4,name:"Selvedge Denim",cat:"bottoms",price:132,img:"photo-1542272604-787c3835535d",alt:"photo-1594633312681-425c7b97ccd1",colors:["#2F3B4F","#1A2620"]},
  {id:5,name:"Merino Crew Knit",cat:"tops",price:124,img:"photo-1620799140408-edc6dcb6d633",alt:"photo-1576566588028-4147f3842f27",colors:["#EAD9BC","#B39459","#1F3A2E"],badge:"New"},
  {id:6,name:"Field Overshirt",cat:"outer",price:168,img:"photo-1591047139829-d91aecb6caea",alt:"photo-1551028719-00167b16eac5",colors:["#5B6650","#C7B08A"]},
  {id:7,name:"Pleated Trouser",cat:"bottoms",price:112,img:"photo-1594633312681-425c7b97ccd1",alt:"photo-1542272604-787c3835535d",colors:["#D8C6A4","#2A2622"]},
  {id:8,name:"Essential Crew Tee",cat:"tops",price:42,img:"photo-1576566588028-4147f3842f27",alt:"photo-1618354691373-d851c5c3a990",colors:["#FAF6EC","#2C4D3E"],badge:"Low stock"},
];
const looks = ["photo-1469334031218-e382a71b716b","photo-1539109136881-3be0616acf4b","photo-1434389677669-e08b4cac3105","photo-1487222477894-8943e31ef7b2","photo-1503342217505-b0a15ec3261c","photo-1618354691373-d851c5c3a990"];

const $ = id => document.getElementById(id);
let cart = [];
try { cart = (JSON.parse(localStorage.getItem("rama-cart")) || []).filter(i => products.some(p => p.id === i.id)); } catch(e) {}
const save = () => { try { localStorage.setItem("rama-cart", JSON.stringify(cart)); } catch(e) {} };

// Keep the chosen light/dark theme across pages.
try { const t = localStorage.getItem("rama-theme"); if (t) document.documentElement.dataset.theme = t; } catch(e) {}

function renderGrid(filter="all"){
  const grid = $("grid");
  if (!grid) return; // page has no product grid
  const limit = +grid.dataset.limit || products.length;
  grid.innerHTML = products.filter(p => filter==="all" || p.cat===filter).slice(0, limit).map(p => `
    <article class="card">
      <div class="thumb">
        ${p.badge?`<span class="badge">${p.badge}</span>`:""}
        <img src="${U(p.img,700)}" alt="${p.name}" loading="lazy">
        <img class="alt" src="${U(p.alt,700)}" alt="" loading="lazy">
        <button class="add" data-id="${p.id}">Add to bag</button>
      </div>
      <div class="meta">
        <div><div class="name">${p.name}</div><div class="swatches">${p.colors.map(c=>`<i style="background:${c}"></i>`).join("")}</div></div>
        <div class="price">$${p.price}</div>
      </div>
    </article>`).join("");
}
if ($("look")) $("look").innerHTML = looks.map(id => `<a href="#"><img src="${U(id,500)}" alt="Customer look" loading="lazy"></a>`).join("");

function renderCart(){
  $("count").textContent = cart.reduce((a,i)=>a+i.qty,0);
  $("subtotal").textContent = "$" + cart.reduce((a,i)=>a+i.qty*products.find(p=>p.id===i.id).price,0);
  $("items").innerHTML = cart.length ? cart.map(i => {
    const p = products.find(x=>x.id===i.id);
    return `<div class="item">
      <img src="${U(p.img,200)}" alt="">
      <div><div class="n">${p.name}</div><div class="qty"><button data-dec="${p.id}" aria-label="Decrease">−</button>${i.qty}<button data-inc="${p.id}" aria-label="Increase">+</button></div></div>
      <div style="color:var(--accent)">$${p.price*i.qty}</div></div>`;
  }).join("") : `<div class="empty">Your bag is empty.</div>`;
  save();
}

function toast(msg){ const t=$("toast"); t.textContent=msg; t.classList.add("show"); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove("show"),1800); }
const openCart = v => document.body.classList.toggle("open", v);

document.addEventListener("click", e => {
  const add = e.target.closest("[data-id]");
  if (add){ const id=+add.dataset.id; const f=cart.find(i=>i.id===id); f?f.qty++:cart.push({id,qty:1}); renderCart(); toast(products.find(p=>p.id===id).name+" added to bag"); }
  const inc = e.target.closest("[data-inc]"); if (inc){ cart.find(i=>i.id===+inc.dataset.inc).qty++; renderCart(); }
  const dec = e.target.closest("[data-dec]"); if (dec){ const it=cart.find(i=>i.id===+dec.dataset.dec); it.qty--; if(!it.qty) cart=cart.filter(i=>i!==it); renderCart(); }
  const chip = e.target.closest(".chip");
  if (chip){ document.querySelectorAll(".chip").forEach(c=>c.setAttribute("aria-pressed", c===chip)); renderGrid(chip.dataset.f); }
});
$("cartBtn").onclick = () => openCart(true);
$("closeCart").onclick = $("scrim").onclick = () => openCart(false);
document.addEventListener("keydown", e => { if(e.key==="Escape") openCart(false); });
$("checkout").onclick = () => toast(cart.length ? "Checkout coming soon" : "Add something first");
$("menuBtn").onclick = () => $("links").classList.toggle("show");
$("links").onclick = e => { if(e.target.tagName==="A") $("links").classList.remove("show"); };
$("themeBtn").onclick = () => {
  const r=document.documentElement, dark = r.dataset.theme ? r.dataset.theme==="dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  r.dataset.theme = dark ? "light" : "dark";
  try { localStorage.setItem("rama-theme", r.dataset.theme); } catch(e) {}
};
// Lead form: submissions are emailed via FormSubmit (https://formsubmit.co).
// The first real submission triggers a one-time activation email to LEAD_EMAIL; click the link in it to start receiving leads.
// After activation, FormSubmit emails you a random alias string. Put it in place of the address below to hide your email from the page source.
// Note: FormSubmit rejects submissions from pages opened as file://. Test from a web server or the live site.
const LEAD_EMAIL = "ramawears@gmail.com";
const LEAD_ENDPOINT = `https://formsubmit.co/ajax/${LEAD_EMAIL}`;

if ($("leadForm")) $("leadForm").onsubmit = async e => {
  e.preventDefault();
  const f = e.target, msg = $("leadMsg"), btn = f.querySelector('button[type="submit"]');
  if (f._honey.value) return; // bot filled the hidden field
  const checks = [
    [f.name, v => v.trim().length > 1],
    [f.email, v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)],
    [f.service, v => v !== ""],
  ];
  let ok = true;
  checks.forEach(([el, test]) => { const good = test(el.value); el.closest(".field").classList.toggle("bad", !good); ok = ok && good; });
  if (!ok) { msg.textContent = "Please fill in your name, a valid email and a service."; return; }

  const data = {
    name: f.name.value.trim(),
    email: f.email.value.trim(),
    phone: f.phone.value.trim() || "—",
    service: f.service.value,
    preferred_date: f.date.value || "—",
    budget: f.budget.value,
    notes: f.notes.value.trim() || "—",
    newsletter_opt_in: f.optin.checked ? "Yes" : "No",
    _subject: `New RAMA WEARS lead: ${f.service.value} — ${f.name.value.trim()}`,
    _replyto: f.email.value.trim(),
    _template: "table",
    _captcha: "false"
  };

  btn.disabled = true; btn.textContent = "Sending…"; msg.textContent = "";
  try {
    const res = await fetch(LEAD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(data)
    });
    const out = await res.json().catch(() => ({}));
    if (!res.ok || String(out.success) === "false") throw new Error(out.message || res.status);
    msg.textContent = `Thank you, ${data.name.split(" ")[0]}. A stylist will contact you within one business day.`;
    f.reset();
  } catch (err) {
    console.error("Lead form error:", err);
    msg.textContent = "Sorry, we couldn't send your request. Please try again or email us at ramawears@gmail.com.";
  } finally {
    btn.disabled = false; btn.textContent = "Request appointment";
  }
};
$("yr").textContent = new Date().getFullYear();

const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(en => { if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } }), {threshold:.12}) : null;
document.querySelectorAll(".reveal").forEach(el => io ? io.observe(el) : el.classList.add("in"));

renderGrid(); renderCart();
