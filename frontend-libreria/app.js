const API_CATALOGO = 'https://servicio-catalogo.onrender.com/api/libros';
const API_ORDENES = 'https://servicio-ordenes.onrender.com/api/ordenes';

/* ── STATE ── */
let libros = [];
let ordenesHistorial = JSON.parse(localStorage.getItem('ordenes') || '[]');
let libroSeleccionado = null;
let ordenando = false;

/* ── DOM REFS ── */
const $ = (id) => document.getElementById(id);
const select = $('libroSelect');
const preview = $('bookPreview');
const previewAutor = $('previewAutor');
const previewPrecio = $('previewPrecio');
const previewStock = $('previewStock');
const cantidadInput = $('cantidad');
const clienteInput = $('cliente');
const totalPreview = $('totalPreview');
const btn = $('btnProcesar');
const btnText = btn.querySelector('.btn-text');
const btnLoader = btn.querySelector('.btn-loader');
const resultado = $('ultimaOrden');
const tbody = $('ordenesBody');
const table = $('ordenesTable');
const placeholder = $('historyPlaceholder');
const orderBadge = $('orderBadge');
const stockCount = $('stockCount');
const catalogGrid = $('catalogGrid');
const clientesList = $('clientesList');
const darkToggle = $('darkToggle');
const exportBtn = $('exportCSV');
const clearBtn = $('clearHistory');

/* ── TABS ── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    $(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

/* ── TEST MODE ── */
const testMethod = $('testMethod');
const testUrl = $('testUrl');
const testBody = $('testBody');
const testBodyGroup = $('testBodyGroup');
const btnTestSend = $('btnTestSend');
const btnTestSendText = btnTestSend.querySelector('.btn-send-text');
const btnTestSendLoader = btnTestSend.querySelector('.btn-loader');
const testResponse = $('testResponse');
const respStatus = $('respStatus');
const respTime = $('respTime');
const respBody = $('respBody');

testMethod.addEventListener('change', () => {
  testBodyGroup.style.display = testMethod.value === 'GET' ? 'none' : 'block';
});

document.querySelectorAll('.quick-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    testUrl.value = btn.dataset.url;
    testMethod.value = btn.dataset.method;
    testMethod.dispatchEvent(new Event('change'));
    if (btn.dataset.method === 'GET') {
      testBody.value = '';
    } else {
      testBody.value = '{"libroId":1,"cantidad":1,"cliente":"test"}';
    }
  });
});

btnTestSend.addEventListener('click', async () => {
  const method = testMethod.value;
  const url = testUrl.value.trim();
  if (!url) { toast('Ingresa una URL', 'warning'); return; }

  btnTestSend.disabled = true;
  btnTestSendText.textContent = 'Enviando...';
  btnTestSendLoader.classList.remove('hidden');
  testResponse.classList.add('hidden');

  const start = performance.now();

  try {
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (method === 'POST') {
      try {
        opts.body = JSON.stringify(JSON.parse(testBody.value));
      } catch {
        toast('JSON inválido en el body', 'error');
        btnTestSend.disabled = false;
        btnTestSendText.textContent = '▶ Enviar';
        btnTestSendLoader.classList.add('hidden');
        return;
      }
    }

    const res = await fetch(url, opts);
    const elapsed = Math.round(performance.now() - start);
    const data = await res.json();

    testResponse.classList.remove('hidden');

    const statusClass = res.status < 300 ? 'status-2xx' : res.status < 500 ? 'status-4xx' : 'status-5xx';
    respStatus.className = `response-status ${statusClass}`;
    respStatus.textContent = `${res.status} ${res.statusText}`;
    respTime.textContent = `${elapsed}ms`;
    respBody.textContent = JSON.stringify(data, null, 2);

  } catch (err) {
    const elapsed = Math.round(performance.now() - start);
    testResponse.classList.remove('hidden');
    respStatus.className = 'response-status status-0';
    respStatus.textContent = 'Error de conexión';
    respTime.textContent = `${elapsed}ms`;
    respBody.textContent = err.message;
  } finally {
    btnTestSend.disabled = false;
    btnTestSendText.textContent = '▶ Enviar';
    btnTestSendLoader.classList.add('hidden');
  }
});

/* ── DARK MODE ── */
const isDark = localStorage.getItem('dark') === 'true';
if (isDark) { document.body.classList.add('dark'); darkToggle.textContent = '☀️'; }
darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const d = document.body.classList.contains('dark');
  localStorage.setItem('dark', d);
  darkToggle.textContent = d ? '☀️' : '🌙';
});

/* ── TOAST SYSTEM ── */
function toast(msg, tipo = 'info') {
  const c = $('toast-container');
  const el = document.createElement('div');
  el.className = `toast ${tipo}`;
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  el.innerHTML = `${icons[tipo] || ''} ${msg}`;
  c.appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 350); }, 3000);
}

/* ── CONFETTI ── */
function confetti() {
  const canvas = $('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const particles = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: -10,
    w: Math.random() * 8 + 4,
    h: Math.random() * 6 + 3,
    color: ['#667eea','#764ba2','#2ed573','#ff4757','#f39c12','#ff6b81'][Math.floor(Math.random() * 6)],
    vx: (Math.random() - 0.5) * 3,
    vy: Math.random() * 3 + 2,
    rot: Math.random() * 360,
    vr: (Math.random() - 0.5) * 6,
  }));
  let frames = 0;
  function draw() {
    if (frames > 100) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.rot += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    frames++;
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── RENDER CATALOG ── */
function renderCatalog() {
  catalogGrid.innerHTML = '';
  const grid = document.createElement('div');
  grid.className = 'catalog-grid';

  let totalStock = 0;
  libros.forEach(l => {
    totalStock += l.stock;
    const card = document.createElement('div');
    card.className = 'book-card' + (l.stock <= 2 ? ' low-stock' : '');
    card.dataset.id = l.id;

    const ratio = Math.min(l.stock / 10, 1);
    const barClass = l.stock > 5 ? 'high' : l.stock > 2 ? 'medium' : 'low';

    card.innerHTML = `
      <div class="book-title">${l.titulo}</div>
      <div class="book-author">${l.autor}</div>
      <div class="book-meta">
        <span class="book-price">$${l.precio.toFixed(2)}</span>
        <div style="display:flex;align-items:center;">
          <div class="stock-bar"><div class="stock-bar-fill ${barClass}" style="width:${ratio * 100}%"></div></div>
          <span class="stock-label">${l.stock} uds.</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      document.querySelectorAll('.book-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      select.value = l.id;
      select.dispatchEvent(new Event('change'));
    });

    grid.appendChild(card);
  });

  catalogGrid.appendChild(grid);
  stockCount.textContent = `${libros.length} libros · ${totalStock} uds.`;
}

/* ── POPULATE SELECT ── */
function populateSelect() {
  select.innerHTML = '<option value="">— Seleccionar libro —</option>';
  libros.forEach(l => {
    const opt = document.createElement('option');
    opt.value = l.id;
    opt.textContent = `${l.id} · ${l.titulo} — $${l.precio.toFixed(2)}`;
    opt.dataset.stock = l.stock;
    select.appendChild(opt);
  });
}

/* ── UPDATE BOOK PREVIEW ── */
select.addEventListener('change', () => {
  const id = Number(select.value);
  libroSeleccionado = libros.find(l => l.id === id) || null;

  if (libroSeleccionado) {
    preview.classList.remove('hidden');
    previewAutor.textContent = libroSeleccionado.autor;
    previewPrecio.textContent = `$${libroSeleccionado.precio.toFixed(2)}`;
    previewStock.textContent = `${libroSeleccionado.stock} uds.`;
    cantidadInput.max = libroSeleccionado.stock;
    updateTotalPreview();
  } else {
    preview.classList.add('hidden');
    cantidadInput.max = 9999;
    totalPreview.innerHTML = 'Total estimado: <strong>$0.00</strong>';
  }
  validateForm();
});

/* ── LIVE TOTAL ── */
cantidadInput.addEventListener('input', updateTotalPreview);
function updateTotalPreview() {
  const cant = Number(cantidadInput.value) || 0;
  if (libroSeleccionado && cant > 0) {
    const total = (libroSeleccionado.precio * cant).toFixed(2);
    totalPreview.innerHTML = `Total estimado: <strong>$${total}</strong>`;
  } else {
    totalPreview.innerHTML = 'Total estimado: <strong>$0.00</strong>';
  }
  validateForm();
}

/* ── VALIDATION ── */
const cantidadError = $('cantidadError');
const clienteError = $('clienteError');

function validateForm() {
  let valid = true;

  if (!libroSeleccionado) { valid = false; }
  const cant = Number(cantidadInput.value);
  clienteError.textContent = '';

  if (!cant || cant < 1) {
    cantidadError.textContent = 'Ingresa una cantidad válida';
    valid = false;
  } else if (libroSeleccionado && cant > libroSeleccionado.stock) {
    cantidadError.textContent = `Stock insuficiente (disponible: ${libroSeleccionado.stock})`;
    valid = false;
  } else {
    cantidadError.textContent = '';
  }

  if (!clienteInput.value.trim()) {
    clienteError.textContent = 'El nombre del cliente es obligatorio';
    valid = false;
  }

  btn.disabled = !valid || ordenando;
  return valid;
}

clienteInput.addEventListener('input', validateForm);
cantidadInput.addEventListener('input', validateForm);

/* ── CLIENTE AUTOCOMPLETE ── */
function updateClientesDatalist() {
  const nombres = [...new Set(ordenesHistorial.map(o => o.cliente))];
  clientesList.innerHTML = nombres.map(n => `<option value="${n}">`).join('');
}

/* ── RENDER HISTORY ── */
function renderHistorial() {
  tbody.innerHTML = '';
  if (ordenesHistorial.length === 0) {
    table.classList.remove('visible');
    placeholder.classList.remove('hidden');
    orderBadge.textContent = '0 órdenes';
    return;
  }

  table.classList.add('visible');
  placeholder.classList.add('hidden');
  orderBadge.textContent = `${ordenesHistorial.length} órdenes`;

  ordenesHistorial.forEach(o => {
    const tr = document.createElement('tr');
    const fecha = new Date(o.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
    tr.innerHTML = `
      <td>${o.id}</td>
      <td>${o.cliente}</td>
      <td>${o.titulo || `Libro #${o.libroId}`}</td>
      <td>${o.cantidad}</td>
      <td>$${o.totalAPagar}</td>
      <td>${fecha}</td>
    `;
    tbody.appendChild(tr);
  });

  updateClientesDatalist();
}

/* ── SAVE HISTORY ── */
function saveHistorial() {
  localStorage.setItem('ordenes', JSON.stringify(ordenesHistorial));
  renderHistorial();
}

/* ── SUBMIT ── */
$('ordenForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateForm() || ordenando) return;

  ordenando = true;
  btn.disabled = true;
  btnText.textContent = 'Procesando...';
  btnLoader.classList.remove('hidden');

  resultado.innerHTML = `<div class="result-entry"><div class="badge badge-pending">Procesando...</div><p style="color:var(--text-muted)">Enviando orden...</p></div>`;

  try {
    const res = await fetch(API_ORDENES, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        libroId: libroSeleccionado.id,
        cantidad: Number(cantidadInput.value),
        cliente: clienteInput.value.trim()
      })
    });

    const data = await res.json();

    if (res.status === 201) {
      resultado.innerHTML = `
        <div class="result-entry success">
          <div class="badge badge-success">Compra exitosa</div>
          <h4>Resumen de compra</h4>
          <pre>${JSON.stringify(data, null, 2)}</pre>
        </div>`;
      data.id = ordenesHistorial.length + 1;
      ordenesHistorial.push(data);
      saveHistorial();
      toast('Compra realizada con éxito', 'success');
      confetti();
      $('ordenForm').reset();
      preview.classList.add('hidden');
      libroSeleccionado = null;
      totalPreview.innerHTML = 'Total estimado: <strong>$0.00</strong>';
      select.value = '';
      cantidadError.textContent = '';
      clienteError.textContent = '';
      document.querySelectorAll('.book-card').forEach(c => c.classList.remove('selected'));
      fetchCatalog();
    } else {
      const msg = data.error || 'Error inesperado';
      resultado.innerHTML = `
        <div class="result-entry error shake">
          <div class="badge badge-error">Error (${res.status})</div>
          <h4>${msg}</h4>
          <pre>${JSON.stringify(data, null, 2)}</pre>
        </div>`;
      toast(msg, 'error');
    }
  } catch (err) {
    resultado.innerHTML = `
      <div class="result-entry error shake">
        <div class="badge badge-error">Error de conexión</div>
        <h4>No se pudo conectar con el servidor</h4>
        <pre>${err.message}</pre>
      </div>`;
    toast('Error de conexión con el servidor', 'error');
  } finally {
    ordenando = false;
    btn.disabled = false;
    btnText.textContent = 'Procesar Orden';
    btnLoader.classList.add('hidden');
  }
});

/* ── FETCH CATALOG ── */
async function fetchCatalog() {
  catalogGrid.innerHTML = '<div class="loader"></div>';
  try {
    const res = await fetch(API_CATALOGO);
    if (!res.ok) throw new Error('Error al obtener catálogo');
    libros = await res.json();
    renderCatalog();
    populateSelect();
  } catch {
    catalogGrid.innerHTML = '<div class="placeholder"><p>Error al cargar el catálogo</p></div>';
    toast('No se pudo cargar el catálogo', 'error');
  }
}

/* ── EXPORT CSV ── */
exportBtn.addEventListener('click', () => {
  if (ordenesHistorial.length === 0) { toast('No hay órdenes para exportar', 'warning'); return; }
  const headers = ['ID', 'Cliente', 'Libro ID', 'Título', 'Cantidad', 'Total', 'Fecha'];
  const rows = ordenesHistorial.map(o => [
    o.id, o.cliente, o.libroId, `"${o.titulo || ''}"`, o.cantidad, o.totalAPagar, o.fecha
  ]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `ordenes_${new Date().toISOString().slice(0,10)}.csv`; a.click();
  URL.revokeObjectURL(url);
  toast('Historial exportado como CSV', 'success');
});

/* ── CLEAR HISTORY ── */
clearBtn.addEventListener('click', () => {
  if (ordenesHistorial.length === 0) { toast('No hay historial que limpiar', 'warning'); return; }
  ordenesHistorial = [];
  saveHistorial();
  resultado.innerHTML = '';
  toast('Historial limpiado', 'info');
});

/* ── KEYBOARD SHORTCUT ── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    $('ordenForm').reset();
    preview.classList.add('hidden');
    libroSeleccionado = null;
    totalPreview.innerHTML = 'Total estimado: <strong>$0.00</strong>';
    cantidadError.textContent = '';
    clienteError.textContent = '';
    document.querySelectorAll('.book-card').forEach(c => c.classList.remove('selected'));
    select.value = '';
    btn.disabled = true;
  }
});

/* ── INIT ── */
testMethod.dispatchEvent(new Event('change'));
renderHistorial();
fetchCatalog();
