class TagComponentGAEP extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<figure class="m-0"><img src="${this.getAttribute(
            "bannerImg"
        )}" alt="error image" /></figure>
    <div class="d-flex flex-column gaErrorPopupContent">
        ${this.getAttribute("heading")}
        ${this.getAttribute("subHeading")}
    </div>
  `;
    }
}

customElements.define(`ga-error-popup`, TagComponentGAEP);
