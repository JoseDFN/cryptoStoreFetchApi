import{postInvoices, patchProducts, getProducts} from '../../api/productsApi.js'

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
    async connectedCallback() {
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
      btnPagar.addEventListener('click', async () => {
        const factura = this.generarFactura();
    
        if (factura) {
            await this.actualizarStockProductos();
            await this.saveInvoiceToServer(factura);
            

            alert('Factura guardada exitosamente.');
            this.limpiarCampos();
        } else {
            alert('Error: Verifique que todos los campos estén completos.');
        }
    });
  }

  async saveInvoiceToServer(invoice) {
    try {
        const response = await postInvoices(invoice);
        if (response && response.ok) {
            console.log("Factura guardada en el servidor con éxito.");
        } else {
            console.error("Error al guardar la factura en el servidor.");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error.message);
    }
  };

  async actualizarStockProductos() {
    try {
        const productosDB = await getProducts();
        console.log("📌 Productos en la base de datos:", productosDB);

        const productosTabla = this.obtenerProductosTabla();
        console.log("📌 Productos comprados:", productosTabla);

        const actualizaciones = productosTabla
            .map(productoTabla => {
                const productoDB = productosDB.find(p => p.id === productoTabla.id);
                if (!productoDB) {
                    console.warn(`⚠ Producto con ID ${productoTabla.id} no encontrado en la base de datos.`);
                    return null;
                }

                const nuevoStock = productoDB.stock - productoTabla.cantidad;
                if (nuevoStock < 0) {
                    console.warn(`⚠ Stock insuficiente para el producto ${productoDB.id}. No se actualizará.`);
                    return null;
                }

                return { id: productoDB.id, stock: nuevoStock };
            })
            .filter(update => update !== null);

        if (actualizaciones.length === 0) {
            console.warn("⚠ No hay productos para actualizar.");
            return;
        }

        // Ejecutar las actualizaciones en paralelo
        await Promise.all(actualizaciones.map(({ id, stock }) => patchProducts({ stock }, id)));

        console.log("✅ Stock actualizado exitosamente.");
    } catch (error) {
        console.error("❌ Error al actualizar stock:", error);
    }
}
  
  obtenerProductosTabla() {
      const summaryComponent = document.querySelector('summary-component');
      const filas = summaryComponent.shadowRoot.querySelectorAll('tbody tr');
  
      const productos = Array.from(filas).map(fila => {
          const id = fila.querySelector('td:nth-child(1)').textContent;
          const nombre = fila.querySelector('td:nth-child(2)').textContent;
          const vUnidad = parseFloat(fila.querySelector('td:nth-child(3)').textContent);
          const cantidad = parseInt(fila.querySelector('td:nth-child(4)').textContent, 10);
          const subtotal = parseFloat(fila.querySelector('td:nth-child(5)').textContent);
  
          return { id, nombre, vUnidad, cantidad, subtotal };
      });
  
      return productos;
  };
  
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
          id:nroFactura,
          header: { identificacion, nombre, apellido, direccion, email },
          detailFact: productos,
          summary: { subtotal, iva, total }
      };
  }
  
  // guardarLocalStorage(factura) {
  //     const facturas = JSON.parse(localStorage.getItem('facturas')) || [];
  //     facturas.push(factura);
  //     localStorage.setItem('facturas', JSON.stringify(facturas));
  // }
  
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