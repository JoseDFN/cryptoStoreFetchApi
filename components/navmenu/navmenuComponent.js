class MenuComponent extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
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
                            <a class="nav-link" href="#" id="hideOption">Otra Opción</a>
                        </li>
                    </ul>
                </div>
            </nav>
        `;
    }

    connectedCallback() {
        const sellOption = this.shadowRoot.getElementById('sellOption');
        const hideOption = this.shadowRoot.getElementById('hideOption');
        const mainContainer = document.getElementById('mainContainer');

        // Iniciar el contenedor principal como vacío
        mainContainer.style.display = 'none';

        // Función para mostrar los componentes dentro de mainContainer
        function showComponents() {
            mainContainer.style.display = 'block';
        }

        // Función para ocultar los componentes dentro de mainContainer
        function hideComponents() {
            mainContainer.style.display = 'none';
        }

        sellOption.addEventListener('click', showComponents);
        hideOption.addEventListener('click', hideComponents);
    }
}

customElements.define('nav-menu', MenuComponent);