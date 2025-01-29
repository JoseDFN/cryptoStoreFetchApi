import '/js/bootstrap/bootstrap.min.js';  // Funcionalidades de Bootstrap
class HeaderComponent extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.innerHTML = /*html*/ `
      <style>
        @import url('/css/bootstrap/bootstrap.min.css');
      </style>
      <div class="container mt-4">
        <div class="card">
          <div class="card-header text-center">
            <h3>Nro Factura</h3>
            <input type="text" id="nroFactura" class="form-control text-center mt-2" placeholder="Número de factura generado" disabled readonly>
          </div>
          <div class="card-body">
            <form>
              <!-- Número de Identificación -->
              <div class="mb-3">
                <label for="identificacion" class="form-label">Número de Identificación</label>
                <input type="text" id="identificacion" class="form-control" placeholder="Ingrese su número de identificación">
              </div>

              <!-- Nombre y Apellido -->
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="nombre" class="form-label">Nombre</label>
                  <input type="text" id="nombre" class="form-control" placeholder="Ingrese su nombre">
                </div>
                <div class="col-md-6 mb-3">
                  <label for="apellido" class="form-label">Apellido</label>
                  <input type="text" id="apellido" class="form-control" placeholder="Ingrese su apellido">
                </div>
              </div>

              <!-- Dirección -->
              <div class="mb-3">
                <label for="direccion" class="form-label">Dirección</label>
                <input type="text" id="direccion" class="form-control" placeholder="Ingrese su dirección">
              </div>

              <!-- Email -->
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" id="email" class="form-control" placeholder="Ingrese su email">
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
    }
    connectedCallback() {
        // Generar el número de factura a partir de la fecha actual (timestamp en hexadecimal)
        const fecha = new Date();
        const timestamp = fecha.getTime();  // Obtener el timestamp en milisegundos
        const nroFactura = timestamp.toString(16).toUpperCase();  // Convertir a hexadecimal
    
        // Asignar el valor al input
        const inputFactura = this.shadowRoot.querySelector('#nroFactura');
        inputFactura.value = nroFactura;
      }
    
  }
  
  customElements.define('header-component', HeaderComponent);