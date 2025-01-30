import { postProducts } from '../../api/productsApi.js';

class CreateProductComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = /*html*/`
            <style>
                @import url('/css/bootstrap/bootstrap.min.css');
            </style>
            <div class="container mt-4">
                <h2>Agregar Producto</h2>
                <form id="productForm" class="mb-3">
                    <div class="mb-2">
                        <label class="form-label">ID</label>
                        <input type="text" class="form-control" id="productId" required>
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="productName" required>
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Costo Unitario</label>
                        <input type="number" class="form-control" id="unitCost" required>
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Stock</label>
                        <input type="number" class="form-control" id="stock" required>
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Imagen URL</label>
                        <input type="url" class="form-control" id="imgsrc" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Agregar</button>
                </form>
                <p>Consigue enlaces para imágenes de productos en <a href="https://coinpaper.com/crypto-logos" target="_blank">coinpaper.com</a></p>
                <div id="message" class="mt-2"></div>
            </div>
        `;
    }

    connectedCallback() {
        this.shadowRoot.querySelector('#productForm').addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        const productData = {
            id: this.shadowRoot.querySelector('#productId').value,
            name: this.shadowRoot.querySelector('#productName').value,
            unitCost: parseFloat(this.shadowRoot.querySelector('#unitCost').value),
            stock: parseInt(this.shadowRoot.querySelector('#stock').value),
            imgsrc: this.shadowRoot.querySelector('#imgsrc').value
        };

        const response = await postProducts(productData);
        const messageElement = this.shadowRoot.querySelector('#message');
        
        if (response.ok) {
            messageElement.innerHTML = '<div class="alert alert-success">Producto agregado con éxito</div>';
        } else {
            messageElement.innerHTML = '<div class="alert alert-danger">Error al agregar producto</div>';
        }
    }
}

customElements.define('createprod-component', CreateProductComponent);
