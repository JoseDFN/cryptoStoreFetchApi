import '/js/bootstrap/bootstrap.min.js';  // Funcionalidades de Bootstrap
import {productos} from '../../data/productos.js'
class ProductsComponent extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.innerHTML = /*html*/ `
      <style>
        @import url('/css/bootstrap/bootstrap.min.css');
      </style>
      <div class="container mt-4">
      <div class="card">
        <div class="card-body">
          <form>
            <!-- Select de productos -->
            <div class="mb-3">
              <label for="nombre" class="form-label">Nombre Producto</label>
              <select class="form-select" id="nombre" aria-label="Etiqueta nombre producto">
                <option value="" selected disabled>Seleccione un producto</option>
              </select>
            </div>
            <!-- Código del producto -->
            <div class="mb-3">
              <label for="codProducto" class="form-label">Código Producto</label>
              <input type="text" id="codProducto" class="form-control" placeholder="Código del producto" readonly>
            </div>
            <!-- Valor por unidad y cantidad -->
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="valorUnidad" class="form-label">Valor Unidad</label>
                <input type="text" id="valorUnidad" class="form-control" placeholder="Valor por unidad" readonly>
              </div>
              <div class="col-md-6 mb-3">
                <label for="cantidad" class="form-label">Cantidad</label>
                <input type="number" id="cantidad" class="form-control" placeholder="Cantidad" min="1">
              </div>
            </div>
            <!-- Botón para agregar -->
            <button type="button" id="btnAgregar" class="btn btn-success col-12 btn-lg">+</button>
          </form>
        </div>
      </div>
    </div>
    `;
    }
    connectedCallback() {
        // Referencias a los elementos del formulario
    const selectNombre = this.shadowRoot.querySelector('#nombre');
    const inputCodigo = this.shadowRoot.querySelector('#codProducto');
    const inputValorUnidad = this.shadowRoot.querySelector('#valorUnidad');
    const inputCantidad = this.shadowRoot.querySelector('#cantidad');
    const btnAgregar = this.shadowRoot.querySelector('#btnAgregar');
    
    // Rellenar el select con los nombres de los productos
    productos.forEach(producto => {
        const {nombre, codigo, vUnidad} = producto
      const option = document.createElement('option');
      option.value = codigo; // Usamos el código como valor único
      option.textContent = nombre;
      selectNombre.appendChild(option);
    });

    // Actualizar los campos automáticamente al seleccionar un producto
    selectNombre.addEventListener('change', () => {
      const productoSeleccionado = productos.find(producto => producto.codigo === selectNombre.value);
      const {nombre, codigo, vUnidad} = productoSeleccionado
      if (productoSeleccionado) {
        inputCodigo.value = codigo;
        inputValorUnidad.value = '$' + vUnidad;
      }
    });

    // Manejar el clic del botón "Agregar"
    btnAgregar.addEventListener('click', () => {
      const cantidad = parseInt(inputCantidad.value, 10);

      if (selectNombre.value && cantidad > 0) {
        const productoSeleccionado = productos.find(producto => producto.codigo === selectNombre.value);
        const subtotal = productoSeleccionado.vUnidad * cantidad;

        // Emitir un evento personalizado con los datos del producto seleccionado
        this.dispatchEvent(new CustomEvent('producto-agregado', {
          detail: {
            codigo: productoSeleccionado.codigo,
            nombre: productoSeleccionado.nombre,
            vUnidad: productoSeleccionado.vUnidad,
            cantidad,
            subtotal
          },
          bubbles: true,
          composed: true
        }));

        // Opcional: Limpiar el campo de cantidad después de agregar
        inputCantidad.value = '';
      } else {
        alert('Por favor, seleccione un producto y una cantidad válida.');
      }
    });
    }
  }
  
  customElements.define('products-component', ProductsComponent);