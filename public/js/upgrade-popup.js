class TagComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<figure class="m-0"><img src="${this.getAttribute('bannerImg')}" alt="api functionality image" /></figure>
    <div class="d-flex flex-column gaUpgradePopupContent">
        ${this.getAttribute('heading')}
        ${this.getAttribute('subHeading')}
      <div class="d-flex keyPoints">
        <ul class="w-50">
          <li>
            <span><img src="./images/tick-green.svg" alt="tick icon" /></span>
            <span>Analytics &amp; Insights</span>
          </li>
          <li>
            <span><img src="./images/tick-green.svg" alt="tick icon" /></span>
            <span>Unlimited Annotations</span>
          </li>
          <li>
            <span><img src="./images/tick-green.svg" alt="tick icon" /></span>
            <span>Teamwork</span>
          </li>
          <li>
            <span><img src="./images/tick-green.svg" alt="tick icon" /></span>
            <span>API</span>
          </li>
        </ul>
        <ul class="w-50">
          <li>
            <span><img src="./images/tick-green.svg" alt="tick icon" /></span>
            <span>Social Media Channels</span>
          </li>
          <li>
            <span><img src="./images/tick-green.svg" alt="tick icon" /></span>
            <span>Website Changes</span>
          </li>
          <li>
            <span><img src="./images/tick-green.svg" alt="tick icon" /></span>
            <span>Rank Tracking (SERP)</span>
          </li>
          <li>
            <span><img src="./images/tick-green.svg" alt="tick icon" /></span>
            <span>Zapier</span>
          </li>
        </ul>
      </div>
      <div class="btns-upgradePopup">
        <a href="https://calendly.com/crystal-ball/30min" target="_blank" class="btn-bookAdemo">Book a Demo</a>
        <a href="/settings/price-plans" class="btn-subscribeNow">Subscribe now</a>
      </div>
    </div>
  `
  }
}

customElements.define(`ga-upgrade-popup`, TagComponent);
