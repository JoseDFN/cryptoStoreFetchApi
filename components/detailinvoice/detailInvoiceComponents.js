class DetailComponent extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.innerHTML = /*html*/ `
      <style>
        @import url('/css/bootstrap/bootstrap.min.css');
      </style>
      <div class="container mt-4">
      <div class="card">
        <div class="card-body text-center">
          <h5 class="mb-3">Resumen de Factura</h5>
          <div class="mb-2">
            <strong>Subtotal:</strong> $<span id="subtotal">0.00</span>
          </div>
          <div class="mb-2">
            <strong>IVA (19%):</strong> $<span id="iva">0.00</span>
          </div>
          <div class="mb-3">
            <strong>Total a Pagar:</strong> $<span id="total">0.00</span>
          </div>
          <button type="button" id="btnPagar" class="btn btn-primary col-12 btn-lg">Pagar</button>
        </div>
      </div>
    </div>
    `;
    }
    connectedCallback() {
      const subtotalElem = this.shadowRoot.querySelector('#subtotal');
      const ivaElem = this.shadowRoot.querySelector('#iva');
      const totalElem = this.shadowRoot.querySelector('#total');
      const btnPagar = this.shadowRoot.querySelector('#btnPagar');
  
      // Escuchar eventos para actualizar los totales
      document.addEventListener('resumen-actualizado', (event) => {
          const subtotal = event.detail.subtotal;
          const iva = subtotal * 0.19;
          const total = subtotal + iva;
  
          subtotalElem.textContent = subtotal.toFixed(2);
          ivaElem.textContent = iva.toFixed(2);
          totalElem.textContent = total.toFixed(2);
      });
  
      // Manejar el clic en el botón "Pagar"
      btnPagar.addEventListener('click', () => {
          const factura = this.generarFactura();
  
          if (factura) {
              this.guardarLocalStorage(factura);
              alert('Factura guardada exitosamente.');
              this.limpiarCampos();
          } else {
              alert('Error: Verifique que todos los campos estén completos.');
          }
      });
  }
  
  obtenerProductosTabla() {
      const summaryComponent = document.querySelector('summary-component');
      const filas = summaryComponent.shadowRoot.querySelectorAll('tbody tr');
  
      const productos = Array.from(filas).map(fila => {
          const codigo = fila.querySelector('td:nth-child(1)').textContent;
          const nombre = fila.querySelector('td:nth-child(2)').textContent;
          const vUnidad = parseFloat(fila.querySelector('td:nth-child(3)').textContent);
          const cantidad = parseInt(fila.querySelector('td:nth-child(4)').textContent, 10);
          const subtotal = parseFloat(fila.querySelector('td:nth-child(5)').textContent);
  
          return { codigo, nombre, vUnidad, cantidad, subtotal };
      });
  
      return productos;
  }
  
  generarFactura() {
      const headerComponent = document.querySelector('header-component');
      const nroFactura = headerComponent.shadowRoot.querySelector('#nroFactura').value;
      const identificacion = headerComponent.shadowRoot.querySelector('#identificacion').value;
      const nombre = headerComponent.shadowRoot.querySelector('#nombre').value;
      const apellido = headerComponent.shadowRoot.querySelector('#apellido').value;
      const direccion = headerComponent.shadowRoot.querySelector('#direccion').value;
      const email = headerComponent.shadowRoot.querySelector('#email').value;
  
      const productos = this.obtenerProductosTabla();
      const subtotal = parseFloat(this.shadowRoot.querySelector('#subtotal').textContent);
      const iva = parseFloat(this.shadowRoot.querySelector('#iva').textContent);
      const total = parseFloat(this.shadowRoot.querySelector('#total').textContent);
  
      if (!nroFactura || !identificacion || !nombre || !apellido || !direccion || !email || productos.length === 0) {
          return null;
      }
  
      return {
          nroFactura,
          header: { identificacion, nombre, apellido, direccion, email },
          detailFact: productos,
          summary: { subtotal, iva, total }
      };
  }
  
  guardarLocalStorage(factura) {
      const facturas = JSON.parse(localStorage.getItem('facturas')) || [];
      facturas.push(factura);
      localStorage.setItem('facturas', JSON.stringify(facturas));
  }
  
  limpiarCampos() {
      const headerComponent = document.querySelector('header-component');
      const summaryComponent = document.querySelector('summary-component');
  
      // Limpiar campos del HeaderComponent
      headerComponent.shadowRoot.querySelector('#nroFactura').value = new Date().getTime().toString(16).toUpperCase();
      headerComponent.shadowRoot.querySelector('#identificacion').value = '';
      headerComponent.shadowRoot.querySelector('#nombre').value = '';
      headerComponent.shadowRoot.querySelector('#apellido').value = '';
      headerComponent.shadowRoot.querySelector('#direccion').value = '';
      headerComponent.shadowRoot.querySelector('#email').value = '';
  
      // Limpiar la tabla del SummaryComponent
      const tabla = summaryComponent.shadowRoot.querySelector('#tablaProductos');
      tabla.innerHTML = '';
  
      // Reiniciar los totales
      this.shadowRoot.querySelector('#subtotal').textContent = '0.00';
      this.shadowRoot.querySelector('#iva').textContent = '0.00';
      this.shadowRoot.querySelector('#total').textContent = '0.00';
  }
  
  }
  
  customElements.define('detail-component', DetailComponent);