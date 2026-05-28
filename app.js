const PROGRESS = ["lead", "contacted", "qualified", "proposal made", "won", "lost"];
let state = { sales: [], customers: [], quotations: [] };
let session = null;

const byId = (arr, key) => arr.find((x) => Number(x.id) === Number(key));
const api = async (action, method = "GET", body) => {
  const res = await fetch(`api.php?action=${action}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
};

const loginView = document.getElementById("loginView");
const appView = document.getElementById("appView");
const adminModeChooser = document.getElementById("adminModeChooser");
const sessionInfo = document.getElementById("sessionInfo");

function salesColor(name) { let hash = 0; for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash); return `hsl(${Math.abs(hash) % 360}, 70%, 45%)`; }
function renderSalesOptions(){ quotationSales.innerHTML = state.sales.map(x=>`<option value="${x.id}">${x.name} (${x.category})</option>`).join(""); }
function renderCustomerOptions(){ quotationCustomer.innerHTML = state.customers.map(x=>`<option value="${x.id}">${x.name}</option>`).join(""); }
function renderProgressOptions(){ quotationProgress.innerHTML = PROGRESS.map(p=>`<option>${p}</option>`).join(""); }

function filteredQuotations(){
  return state.quotations.filter(q => session.role === "administrator"
      ? (byId(state.sales, q.sales_id)?.category === session.mode || byId(state.sales, q.sales_id)?.category === "administrator")
      : byId(state.sales, q.sales_id)?.username === session.username
  );
}

function renderSalesTable(){ salesTable.querySelector("tbody").innerHTML = state.sales.map(s=>`<tr><td>${s.name}</td><td>${s.email}</td><td>${s.phone}</td><td>${s.category}</td><td>${s.username}</td><td>••••••</td><td><button onclick="editSales('${s.id}')">Edit</button></td></tr>`).join(""); }
function renderCustomerTable(){ customerTable.querySelector("tbody").innerHTML = state.customers.map(c=>`<tr><td>${c.name}</td><td>${c.pic}</td><td>${c.country}</td><td>${c.state}</td><td>${c.email}</td><td>${c.phone}</td><td>${c.website}</td><td><button onclick="editCustomer('${c.id}')">Edit</button></td></tr>`).join(""); }
function renderQuotationTable(){ quotationTable.querySelector("tbody").innerHTML = filteredQuotations().map(q=>{ const s=byId(state.sales,q.sales_id), c=byId(state.customers,q.customer_id); return `<tr><td>${s?.name||"-"}</td><td>${c?.name||"-"}</td><td>${q.need_text}</td><td>${q.price}</td><td>${q.remark||""}</td><td>${q.deadline}</td><td>${q.progress}</td><td><button onclick="editQuotation('${q.id}')">Edit</button></td></tr>`; }).join(""); }
function renderKanban(){ kanban.innerHTML = PROGRESS.map(p=>`<div class="trello-col" ondragover="event.preventDefault()" ondrop="dropCard(event,'${p}')"><h5>${p}</h5><div class="trello-list">${filteredQuotations().filter(q=>q.progress===p).map(q=>{const s=byId(state.sales,q.sales_id);const c=byId(state.customers,q.customer_id);return `<div class='trello-card' draggable='true' ondragstart="dragCard(event,'${q.id}')" style="border-left-color:${salesColor(s?.name||'x')}">${q.need_text}<small>${s?.name||'-'} | ${c?.name||'-'} | ${q.deadline}</small></div>`;}).join("")}</div></div>`).join(""); }
window.dragCard = (ev,id)=>ev.dataTransfer.setData("text",id);
window.dropCard = async (ev,p)=>{ await api("move-quotation","POST",{id:ev.dataTransfer.getData("text"),progress:p}); await refreshData(); renderAll(); };
window.editSales=(id)=>{const s=byId(state.sales,id);salesId.value=s.id;salesName.value=s.name;salesEmail.value=s.email;salesPhone.value=s.phone;salesCategory.value=s.category;salesUsername.value=s.username;salesPassword.value=s.password||"";};
window.editCustomer=(id)=>{const c=byId(state.customers,id);customerId.value=c.id;customerName.value=c.name;customerPic.value=c.pic;customerCountry.value=c.country;customerState.value=c.state;customerEmail.value=c.email;customerPhone.value=c.phone;customerWebsite.value=c.website;};
window.editQuotation=(id)=>{const q=byId(state.quotations,id);quotationId.value=q.id;quotationSales.value=q.sales_id;quotationCustomer.value=q.customer_id;quotationNeed.value=q.need_text;quotationPrice.value=q.price;quotationRemark.value=q.remark;quotationDeadline.value=q.deadline;quotationProgress.value=q.progress;};

function renderAll(){renderSalesOptions();renderCustomerOptions();renderProgressOptions();renderSalesTable();renderCustomerTable();renderQuotationTable();renderKanban();}
async function refreshData(){ state = await api("bootstrap"); }

loginForm.onsubmit = async (e)=>{ e.preventDefault(); const res = await api("login","POST",{username:loginUsername.value,password:loginPassword.value}); if(res.error) return alert(res.error); const user = res.user; if(user.role==="administrator"){adminModeChooser.classList.remove("d-none");adminModeChooser.dataset.username=user.username;return;} session={username:user.username,role:user.role,mode:user.role}; await onLoginSuccess(); };
document.querySelectorAll(".mode-btn").forEach(btn=>btn.onclick=async()=>{session={username:adminModeChooser.dataset.username,role:"administrator",mode:btn.dataset.mode}; await onLoginSuccess();});
async function onLoginSuccess(){ loginView.classList.add("d-none"); appView.classList.remove("d-none"); sessionInfo.textContent=`Login: ${session.username} (${session.role}) - mode ${session.mode}`; await refreshData(); renderAll(); }
logoutBtn.onclick=()=>location.reload();
document.querySelectorAll(".tab-link").forEach(t=>t.onclick=(e)=>{e.preventDefault();document.querySelectorAll(".tab-link").forEach(x=>x.classList.remove("active"));t.classList.add("active");document.querySelectorAll(".tab-panel").forEach(p=>p.classList.add("d-none"));document.getElementById(`tab-${t.dataset.tab}`).classList.remove("d-none");});

salesForm.onsubmit=async(e)=>{e.preventDefault(); await api("save-sales","POST",{id:salesId.value||null,name:salesName.value,email:salesEmail.value,phone:salesPhone.value,category:salesCategory.value,username:salesUsername.value,password:salesPassword.value}); salesForm.reset();salesId.value="";await refreshData();renderAll();};
customerForm.onsubmit=async(e)=>{e.preventDefault(); await api("save-customer","POST",{id:customerId.value||null,name:customerName.value,pic:customerPic.value,country:customerCountry.value,state:customerState.value,email:customerEmail.value,phone:customerPhone.value,website:customerWebsite.value}); customerForm.reset();customerId.value="";await refreshData();renderAll();};
quotationForm.onsubmit=async(e)=>{e.preventDefault(); await api("save-quotation","POST",{id:quotationId.value||null,sales_id:quotationSales.value,customer_id:quotationCustomer.value,need_text:quotationNeed.value,price:quotationPrice.value,remark:quotationRemark.value,deadline:quotationDeadline.value,progress:quotationProgress.value}); quotationForm.reset();quotationId.value="";await refreshData();renderAll();};
salesReset.onclick=()=>{salesForm.reset();salesId.value=""}; customerReset.onclick=()=>{customerForm.reset();customerId.value=""}; quotationReset.onclick=()=>{quotationForm.reset();quotationId.value=""};
renderProgressOptions();
