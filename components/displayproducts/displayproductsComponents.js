import { getProducts } from '../../api/productsApi.js';

class DisplayProductsComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = /*html*/`
            <style>
                @import url('/css/bootstrap/bootstrap.min.css');
                .grid-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    padding: 20px;
                }
                .card {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 10px;
                    text-align: center;
                    cursor: pointer;
                }
                .card img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                }
                .modal {
                    display: none;
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    justify-content: center;
                    align-items: center;
                }
                .modal-content {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    justify-content: center;
                }
                .close-btn {
                    background: red;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    cursor: pointer;
                }
                .imgModal {
                    max-width: 25%;
                    margin: 0 auto;
                }
            </style>
            <div class="container mt-4">
                <h2>Productos Disponibles</h2>
                <div class="grid-container" id="productGrid"></div>
            </div>
            <div class="modal" id="productModal">
                <div class="modal-content">
                    <button class="close-btn">Cerrar</button>
                    <h3 id="modalTitle"></h3>
                    <img id="modalImage" class="imgModal" src="" alt="">
                    <p><strong>Código:</strong> <span id="modalId"></span></p>
                    <p><strong>Precio por unidad:</strong> <span id="modalCost"></span></p>
                </div>
            </div>
        `;
    }

    async connectedCallback() {
        await this.loadProducts();
    }

    async loadProducts() {
        const products = await getProducts();
        const gridContainer = this.shadowRoot.querySelector('#productGrid');
        gridContainer.innerHTML = '';

        products.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src="${product.imgsrc}" alt="${product.name}">
                <h5>${product.name}</h5>
            `;
            card.addEventListener('click', () => this.showModal(product));
            gridContainer.appendChild(card);
        });
    }

    showModal(product) {
        const modal = this.shadowRoot.querySelector('#productModal');
        this.shadowRoot.querySelector('#modalTitle').textContent = product.name;
        this.shadowRoot.querySelector('#modalImage').src = product.imgsrc;
        this.shadowRoot.querySelector('#modalId').textContent = product.id;
        this.shadowRoot.querySelector('#modalCost').textContent = `$${product.unitCost}`;
        modal.style.display = 'flex';
        
        this.shadowRoot.querySelector('.close-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
}

customElements.define('display-products-component', DisplayProductsComponent);
