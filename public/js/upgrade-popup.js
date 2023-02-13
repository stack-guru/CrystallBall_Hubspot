const innerHTML = `
<div class="ga-upgrade-popup">
<h1>Upgrade Popup</h1>
</div>`;


class TagComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = innerHTML;
  }
}

customElements.define(`ga-upgrade-popup`, TagComponent);
