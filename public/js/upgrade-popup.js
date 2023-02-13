const innerHTML = `
  <figure class="m-0"><img src="./images/apiFunctionality.svg" alt="api functionality image" /></figure>
  <div class="d-flex flex-column gaUpgradePopupContent">
    <h1>Upgrade to access <span>API Functionality</span></h1>
    <p>and get access to all amazing features</p>
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
      <button class="btn-bookAdemo">Book a Demo</button>
      <button class="btn-subscribeNow">Subscribe now</button>
    </div>
  </div>
`;


class TagComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = innerHTML;
  }
}

customElements.define(`ga-upgrade-popup`, TagComponent);
