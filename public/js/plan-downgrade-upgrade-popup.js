class TagComponentGAPDUP extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<figure class="m-0"><img src="${this.getAttribute(
            "bannerImg"
        )}" alt="api functionality image" /></figure>
    <div class="d-flex flex-column gaUpgradePopupContent">
        ${this.getAttribute("heading")}
        ${this.getAttribute("subHeading")}

        <p>You’re being redirected in 3 seconds</p>
    </div>
  `;
    }
}

customElements.define(`ga-plan-downgrade-upgrade-popup`, TagComponentGAPDUP);
