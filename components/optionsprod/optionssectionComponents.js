class ProductOptionsComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = /*html*/`
            <style>
                @import url('/css/bootstrap/bootstrap.min.css');
                .btn-group {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 1rem;
                }
            </style>
            <div class="btn-group">
                <button class="btn btn-primary" data-target="createProd">Crear</button>
                <button class="btn btn-secondary" data-target="modifyProd">Editar</button>
                <button class="btn btn-danger" data-target="deleteProd">Eliminar</button>
                <button class="btn btn-success" data-target="displayProd">Listar</button>
            </div>
        `;
    }

    connectedCallback() {
        this.shadowRoot.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => this.toggleSection(e.target.dataset.target));
        });
        
        // Ocultar todos los divs de prodOptions al iniciar
        this.toggleSection(null);
    }

    toggleSection(sectionId) {
        const sections = ["createProd", "modifyProd", "deleteProd", "displayProd"];
        sections.forEach(id => {
            const section = document.querySelector(`.${id}`);
            if (section) {
                section.style.display = (id === sectionId) ? 'block' : 'none';
            }
        });
    }
}

customElements.define('product-options', ProductOptionsComponent);
