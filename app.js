const $=s=>document.querySelector(s);
const KEY='wimp-parcels-v1', PREF='wimp-prefs-v1';
const events=['Out for delivery','Delivered','Delivery exceptions','In transit','Delivery attempted'];
const defaults={events:Object.fromEntries(events.map(e=>[e,true]))};
let parcels=JSON.parse(localStorage.getItem(KEY)||'[]');
let prefs={...defaults,...JSON.parse(localStorage.getItem(PREF)||'{}')};
function save(){localStorage.setItem(KEY,JSON.stringify(parcels));render()}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2300)}
function carrierUrl(c,n){const urls={USPS:'https://tools.usps.com/go/TrackConfirmAction?tLabels=',UPS:'https://www.ups.com/track?tracknum=',FedEx:'https://www.fedex.com/fedextrack/?trknbr=',DHL:'https://www.dhl.com/global-en/home/tracking.html?tracking-id='};return (urls[c]||'https://www.google.com/search?q=track+package+')+encodeURIComponent(n)}
function render(){
 $('#totalCount').textContent=parcels.length;
 $('#movingCount').textContent=parcels.filter(p=>!['Delivered'].includes(p.status)).length;
 $('#deliveredCount').textContent=parcels.filter(p=>p.status==='Delivered').length;
 $('#emptyState').style.display=parcels.length?'none':'block';
 $('#parcelList').innerHTML=parcels.map(p=>`<article class="parcel"><div class="parcel-top"><div><div class="carrier">${esc(p.carrier)}</div><h4>${esc(p.name||'Your parcel')}</h4><div class="number">${esc(p.number)}</div>${p.note?`<div class="number">Note: ${esc(p.note)}</div>`:''}</div><span class="status ${statusClass(p.status)}">${esc(p.status)}</span></div><div class="parcel-actions"><a href="${carrierUrl(p.carrier,p.number)}" target="_blank" rel="noopener">Track with carrier ↗</a><button data-action="status" data-id="${p.id}">Update status</button><button class="delete" data-action="delete" data-id="${p.id}">Remove</button></div></article>`).join('');
 $('#notificationOptions').innerHTML=events.map(e=>`<label class="check"><input type="checkbox" data-event="${e}" ${prefs.events?.[e]!==false?'checked':''}> ${e}</label>`).join('');
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function statusClass(s){return s==='Delivered'?'delivered':s==='Delivery exceptions'?'exception':s==='Delivery attempted'?'attempted':s==='Out for delivery'?'out':''}
$('#addForm').addEventListener('submit',e=>{e.preventDefault();const number=$('#tracking').value.trim();if(!number)return;let c=$('#carrier').value;if(c==='Auto-detect')c='Carrier not selected';if(parcels.some(p=>p.number===number)){toast('That tracking number is already saved.');return}parcels.unshift({id:Date.now().toString(),number,carrier:c,name:$('#nickname').value.trim(),note:$('#locker').value.trim(),status:'Added — awaiting scan',created:new Date().toISOString()});e.target.reset();save();toast('Parcel added to your list.')});
$('#parcelList').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const p=parcels.find(x=>x.id===b.dataset.id);if(!p)return;if(b.dataset.action==='delete'){parcels=parcels.filter(x=>x.id!==p.id);save();toast('Parcel removed.')}if(b.dataset.action==='status'){const options=['Added — awaiting scan','In transit','Out for delivery','Delivered','Delivery exceptions','Delivery attempted'];const next=prompt('Enter a status exactly as shown:\\n'+options.join('\\n'),p.status);if(next&&options.includes(next)){p.status=next;save();notifyLocal(p,next);toast('Status updated.')}else if(next)toast('Please choose one of the listed statuses.')}});
$('#clearBtn').addEventListener('click',()=>{if(parcels.length&&confirm('Remove all saved parcels from this device?')){parcels=[];save()}});
$('#notificationOptions').addEventListener('change',e=>{if(e.target.dataset.event){prefs.events[e.target.dataset.event]=e.target.checked;localStorage.setItem(PREF,JSON.stringify(prefs))}});
function notifyLocal(p,status){if(prefs.events?.[status]&&'Notification'in window&&Notification.permission==='granted'){new Notification('Where Is My Parcel',{body:`${p.name||p.number}: ${status}`})}}
$('#enableNotifications').addEventListener('click',async()=>{if(!('Notification'in window)){toast('Notifications are not supported in this browser.');return}const result=await Notification.requestPermission();$('#notificationStatus').textContent=result==='granted'?'Notifications are allowed on this device.':'Notification permission was not granted.';if(result==='granted')toast('Notifications enabled for status changes made in this app.')});
const root=document.documentElement;let theme=localStorage.getItem('wimp-theme')||'auto';function setTheme(t){theme=t;root.removeAttribute('data-theme');if(t!=='auto')root.dataset.theme=t;localStorage.setItem('wimp-theme',t);$('#themeBtn').title='Appearance: '+t}
$('#themeBtn').addEventListener('click',()=>{setTheme(theme==='auto'?'dark':theme==='dark'?'light':'auto');toast('Appearance: '+theme)});
setTheme(theme);
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
render();
