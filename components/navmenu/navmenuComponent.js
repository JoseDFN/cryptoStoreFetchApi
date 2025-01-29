class MenuComponent extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
            <style>
                @import url('/css/bootstrap/bootstrap.min.css');
            </style>
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">Mi Logo</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <a class="nav-link" href="#" id="sellOption">Vender</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#" id="hideOption">Otra Opción</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        `;
    }

    connectedCallback() {
        const sellOption = this.shadowRoot.getElementById('sellOption');
        const hideOption = this.shadowRoot.getElementById('hideOption');
        const mainContainer = document.getElementById('mainContainer');
        const navbarToggler = this.shadowRoot.getElementById('navbarToggler');
        const navbarNav = this.shadowRoot.getElementById('navbarNav');


        function showComponents() {
            mainContainer.style.display = 'block';
        }

        function hideComponents() {
            mainContainer.style.display = 'none';
        }

        function toggleNavbar() {
            navbarNav.classList.toggle('collapse');
        }

        sellOption.addEventListener('click', showComponents);
        hideOption.addEventListener('click', hideComponents);
        navbarToggler.addEventListener('click', toggleNavbar);
    }
}

customElements.define('nav-menu', MenuComponent);