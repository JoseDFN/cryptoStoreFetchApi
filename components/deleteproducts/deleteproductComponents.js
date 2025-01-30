import { getProducts, deleteProducts } from '../../api/productsApi.js';

class DeleteProductComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = /*html*/`
            <style>
                @import url('/css/bootstrap/bootstrap.min.css');
            </style>
            <div class="container mt-4">
                <h2>Eliminar Producto</h2>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody id="productTableBody"></tbody>
                </table>
                <div id="message" class="mt-2"></div>
            </div>
        `;
    }

    async connectedCallback() {
        await this.loadProducts();
    }

    async loadProducts() {
        const products = await getProducts();
        const tableBody = this.shadowRoot.querySelector('#productTableBody');
        tableBody.innerHTML = '';

        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td><button class="btn btn-danger btn-sm" data-id="${product.id}">Eliminar</button></td>
            `;
            tableBody.appendChild(row);
        });

        this.shadowRoot.querySelectorAll('.btn-danger').forEach(button => {
            button.addEventListener('click', (e) => this.confirmDelete(e.target.dataset.id));
        });
    }

    async confirmDelete(productId) {
        if (confirm(`¿Estás seguro de que quieres eliminar el producto con ID ${productId}?`)) {
            await deleteProducts(productId);
            this.showMessage('Producto eliminado con éxito', 'success');
            await this.loadProducts();
        }
    }

    showMessage(message, type) {
        const messageElement = this.shadowRoot.querySelector('#message');
        messageElement.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
        setTimeout(() => messageElement.innerHTML = '', 3000);
    }
}

customElements.define('deleteprod-component', DeleteProductComponent);
