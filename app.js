
const SUPABASE_URL = "https://ldjmnbcsnkeisuwhdpto.supabase.co";
const SUPABASE_PUBLISHABLE_KEY ="sb_publishable_bdxpf1zcROvegSWqSDlMEQ_-gJDNGod";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

function getSession(){ 
  return
JSON.parse(localStorage.getltem(KEYS.sesson) || "null");
                     }

function uid(prefix){ return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

function seed(){
  if(!localStorage.getItem(KEYS.rooms)){
    const rooms = [
      {id:uid("r"), number:"01", name:"Garden Single", price:6000, capacity:"1 guest", desc:"Quiet room facing the courtyard, attached bath.", available:true},
      {id:uid("r"), number:"02", name:"Terrace Double", price:9500, capacity:"2 guests", desc:"Corner room with balcony access and a work desk.", available:true},
      {id:uid("r"), number:"03", name:"The Loft", price:13000, capacity:"3 guests", desc:"Top-floor room, sloped ceiling, extra bedding on request.", available:false}
    ];
    localStorage.setItem(KEYS.rooms, JSON.stringify(rooms));
  }
  if(!localStorage.getItem(KEYS.bookings)) localStorage.setItem(KEYS.bookings, JSON.stringify([]));
  if(!localStorage.getItem(KEYS.users)) localStorage.setItem(KEYS.users, JSON.stringify([]));
}
seed();

// ---- rooms ----
function getRooms(){ return JSON.parse(localStorage.getItem(KEYS.rooms) || "[]"); }
function saveRooms(rooms){ localStorage.setItem(KEYS.rooms, JSON.stringify(rooms)); }
function getRoom(id){ return getRooms().find(r=>r.id===id); }

// ---- bookings ----
function getBookings(){ return JSON.parse(localStorage.getItem(KEYS.bookings) || "[]"); }
function saveBookings(list){ localStorage.setItem(KEYS.bookings, JSON.stringify(list)); }

// ---- users ----
function getUsers(){ return JSON.parse(localStorage.getItem(KEYS.users) || "[]"); }
function saveUsers(list){ localStorage.setItem(KEYS.users, JSON.stringify(list)); }

// ---- session ----
function getSession(){ return JSON.parse(localStorage.getItem(KEYS.session) || "null"); }
function setSession(s){ localStorage.setItem(KEYS.session, JSON.stringify(s)); }
function clearSession(){ localStorage.removeItem(KEYS.session); }

function requireUser(){
  const s = getSession();
  if(!s || s.role!=="user"){ window.location.href = "login.html"; return null; }
  return s;
}
function requireAdmin(){
  const s = getSession();
  if(!s || s.role!=="admin"){ window.location.href = "admin.html"; return null; }
  return s;
}

function esc(s){ return (s==null?"":String(s)).replace(/[&<>]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c])); }

// ---- nav ----
function renderNav(active){
  const s = getSession();
  const el = document.getElementById("nav");
  if(!el) return;

  let right;

  if(s && s.role==="user"){
    right = `<span>Hi, ${esc(s.name)}</span> <a href="my-bookings.html" class="${active==='mybookings'?'active':''}">My Bookings</a> <a href="#" onclick="doLogout(event)">Logout</a>`;

  } else if(s && s.role==="admin"){
    right = `<span>Admin: ${esc(s.name)}</span> <a href="manage-rooms.html">Manage Rooms</a> <a href="manage-bookings.html">Manage Bookings</a> <a href="#" onclick="doLogout(event)">Logout</a>`;

  } else {
    right = `<a href="login.html" class="${active==="login"?'active':''}">Login</a> <a href="admin.html" class="pill">Admin</a>`;
  }

  el.innerHTML = `<nav class="site"><div class="container">
    <a href="index.html" class="brand">The Register</a>
    <div class="links">
      <a href="index.html" class="${active==='home'?'active':''}">Home</a>
      <a href="rooms.html" class="${active==='rooms'?'active':''}">Rooms</a>
      ${right}
    </div>
  </div></nav>`;
}

async function doLogout(e){
  if(e) e.preventDefault();

  await supabaseClient.auth.signOut();

  clearSession();
  window.location.href = "index.html";
}
