const API_ORDENES = 'https://servicio-ordenes.onrender.com/api/ordenes';

document.getElementById('ordenForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const libroId = Number(document.getElementById('libroId').value);
  const cantidad = Number(document.getElementById('cantidad').value);
  const cliente = document.getElementById('cliente').value.trim();
  const resultado = document.getElementById('resultado');

  resultado.innerHTML = `<div class="result-entry"><div class="badge badge-pending">Procesando...</div><p style="color:#a0a3b8;">Enviando orden...</p></div>`;

  try {
    const response = await fetch(API_ORDENES, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ libroId, cantidad, cliente })
    });

    const data = await response.json();

    if (response.status === 201) {
      resultado.innerHTML = `
        <div class="result-entry success">
          <div class="badge badge-success">Compra exitosa</div>
          <h4>Resumen de compra</h4>
          <pre>${JSON.stringify(data, null, 2)}</pre>
        </div>`;
    } else {
      const badge = response.status === 400 || response.status === 404 ? 'Error' : 'Error del servidor';
      const badgeClass = response.status === 400 || response.status === 404 ? 'badge-error' : 'badge-error';
      const mensaje = data.error || 'Ocurrió un error inesperado';
      resultado.innerHTML = `
        <div class="result-entry error">
          <div class="badge ${badgeClass}">${badge} (${response.status})</div>
          <h4>${mensaje}</h4>
          <pre>${JSON.stringify(data, null, 2)}</pre>
        </div>`;
    }
  } catch (err) {
    resultado.innerHTML = `
      <div class="result-entry error">
        <div class="badge badge-error">Error de conexión</div>
        <h4>No se pudo conectar con el servidor</h4>
        <pre>${err.message}</pre>
      </div>`;
  }
});
