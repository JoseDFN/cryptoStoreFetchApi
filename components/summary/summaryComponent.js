class SummaryComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = /*html*/ `
      <style>
          @import url('/css/bootstrap/bootstrap.min.css');
      </style>
      <div class="container mt-4">
          <h4 class="mb-3">Productos Agregados</h4>
          <table class="table">
              <thead>
                  <tr>
                      <th>Código</th>
                      <th>Nombre</th>
                      <th>V/Unidad</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th>Acciones</th>
                  </tr>
              </thead>
              <tbody id="tablaProductos">
                  <!-- Aquí se llenarán las filas dinámicamente -->
              </tbody>
          </table>
      </div>
      `;
  }

  connectedCallback() {
    const tablaProductos = this.shadowRoot.querySelector('#tablaProductos');

    // Escucha el evento 'producto-agregado'
    document.addEventListener('producto-agregado', (event) => {
        const { codigo, nombre, vUnidad, cantidad, subtotal } = event.detail;

        // Buscar si el producto ya existe en la tabla
        const filaExistente = this.shadowRoot.querySelector(`#producto-${codigo}`);

        if (filaExistente) {
            // Actualizar la cantidad y subtotal si el producto ya existe
            const cantidadActual = parseInt(filaExistente.querySelector('.cantidad').textContent, 10);
            const nuevaCantidad = cantidadActual + cantidad;
            const nuevoSubtotal = nuevaCantidad * vUnidad;

            filaExistente.querySelector('.cantidad').textContent = nuevaCantidad;
            filaExistente.querySelector('.subtotal').textContent = nuevoSubtotal.toFixed(2);
        } else {
            // Crear una nueva fila si el producto no existe
            const fila = document.createElement('tr');
            fila.id = `producto-${codigo}`;
            fila.innerHTML = `
                <td>${codigo}</td>
                <td>${nombre}</td>
                <td>${vUnidad.toFixed(2)}</td>
                <td class="cantidad">${cantidad}</td>
                <td class="subtotal">${subtotal.toFixed(2)}</td>
                <td>
                    <button type="button" class="btn btn-danger btn-sm">X</button>
                </td>
            `;

            // Botón para eliminar la fila
            const btnEliminar = fila.querySelector('.btn-danger');
            btnEliminar.addEventListener('click', () => {
                fila.remove();
                this.recalcularResumen(); // Llamar a recalcular resumen al eliminar
            });

            tablaProductos.appendChild(fila);
        }

        // Actualizar el resumen después de agregar un producto
        this.recalcularResumen();
    });
}

recalcularResumen() {
    const filas = this.shadowRoot.querySelectorAll('tbody tr');
    let subtotal = 0;

    // Calcular el subtotal sumando los subtotales de todas las filas
    filas.forEach(fila => {
        const subtotalElem = fila.querySelector('.subtotal');
        if (subtotalElem) {
            subtotal += parseFloat(subtotalElem.textContent) || 0; // Asegurar que sea un número válido
        }
    });

    // Emitir un evento con el nuevo subtotal
    this.dispatchEvent(new CustomEvent('resumen-actualizado', {
        detail: { subtotal },
        bubbles: true,
        composed: true
    }));
}

}

customElements.define('summary-component', SummaryComponent);
