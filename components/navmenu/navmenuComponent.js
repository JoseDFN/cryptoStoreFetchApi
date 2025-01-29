class MenuComponent extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = /*html*/ `
            <style>
                @import url('/css/bootstrap/bootstrap.min.css');
                nav .navbar-nav {
                    flex-direction: row;
                    justify-content: flex-end;
                    gap: 15px;
                }
                nav .nav-link {
                    padding: 0.5rem 1rem;
                }
            </style>
            <nav class="navbar navbar-dark bg-dark">
                <div class="container-fluid d-flex justify-content-between align-items-center">
                    <a class="navbar-brand" href="#">Mi Logo</a>
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="#" id="sellOption">Vender</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" id="productsOption">Productos</a>
                        </li>
                    </ul>
                </div>
            </nav>
        `;
    }

    connectedCallback() {
        const sellOption = this.shadowRoot.getElementById('sellOption');
        const productsOption = this.shadowRoot.getElementById('productsOption');
        const mainContainer = document.getElementById('mainContainer');
        const productsContainer = document.getElementById('productsContainer');

        // Iniciar el contenedor principal como vacío
        mainContainer.style.display = 'none';
        productsContainer.style.display = 'none';

        // Función para mostrar los componentes dentro de mainContainer
        function showComponents() {
            mainContainer.style.display = 'block';
            productsContainer.style.display = 'none';
        }

        // Función para ocultar los componentes dentro de mainContainer
        function hideComponents() {
            mainContainer.style.display = 'none';
            productsContainer.style.display = 'block';
        }

        sellOption.addEventListener('click', showComponents);
        productsOption.addEventListener('click', hideComponents);
    }
}

customElements.define('nav-menu', MenuComponent);