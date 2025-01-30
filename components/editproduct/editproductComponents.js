import { getProducts, patchProducts } from '../../api/productsApi.js';

class EditProductComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.products = [];
        this.shadowRoot.innerHTML = /*html*/`
            <style>
                @import url('/css/bootstrap/bootstrap.min.css');
            </style>
            <div class="container mt-4">
                <h2>Editar Producto</h2>
                <div class="mb-3 d-flex">
                    <select id="productSelect" class="form-select me-2"></select>
                    <button id="viewProduct" class="btn btn-primary">Ver</button>
                </div>
                <form id="editProductForm" class="mb-3">
                    <div class="mb-2">
                        <label class="form-label">COD</label>
                        <input type="text" class="form-control" id="productId" disabled>
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="productName" required>
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Stock</label>
                        <input type="number" class="form-control" id="stock" required>
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Precio</label>
                        <input type="number" class="form-control" id="unitCost" required>
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Imagen URL</label>
                        <input type="url" class="form-control" id="imgsrc" required>
                    </div>
                    <button type="submit" class="btn btn-success">Editar</button>
                </form>
                <div id="message" class="mt-2"></div>
            </div>
        `;
    }

    connectedCallback() {
        this.loadProducts();
        this.shadowRoot.querySelector('#viewProduct').addEventListener('click', () => this.displayProduct());
        this.shadowRoot.querySelector('#editProductForm').addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async loadProducts() {
        this.products = await getProducts();
        this.populateDropdown();
    }

    populateDropdown() {
        const select = this.shadowRoot.querySelector('#productSelect');
        select.innerHTML = this.products.map(product =>
            `<option value="${product.id}">${product.name}</option>`
        ).join('');
    }

    displayProduct() {
        const selectedId = this.shadowRoot.querySelector('#productSelect').value;
        const product = this.products.find(p => p.id === selectedId);
        if (product) {
            this.shadowRoot.querySelector('#productId').value = product.id;
            this.shadowRoot.querySelector('#productName').value = product.name;
            this.shadowRoot.querySelector('#stock').value = product.stock;
            this.shadowRoot.querySelector('#unitCost').value = product.unitCost;
            this.shadowRoot.querySelector('#imgsrc').value = product.imgsrc;
        }
    }

    async handleSubmit(event) {
        event.preventDefault();

        const productId = this.shadowRoot.querySelector('#productId').value;
        const updatedData = {
            name: this.shadowRoot.querySelector('#productName').value,
            stock: parseInt(this.shadowRoot.querySelector('#stock').value),
            unitCost: parseFloat(this.shadowRoot.querySelector('#unitCost').value),
            imgsrc: this.shadowRoot.querySelector('#imgsrc').value
        };

        const response = await patchProducts(updatedData, productId);
        const messageElement = this.shadowRoot.querySelector('#message');

        if (response) {
            messageElement.innerHTML = '<div class="alert alert-success">Producto actualizado con éxito</div>';
            this.loadProducts(); // Recargar lista de productos
        } else {
            messageElement.innerHTML = '<div class="alert alert-danger">Error al actualizar el producto</div>';
        }
    }
}

customElements.define('edit-product-component', EditProductComponent);
