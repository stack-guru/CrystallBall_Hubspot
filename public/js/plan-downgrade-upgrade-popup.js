class TagComponentGAPDUP extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<figure class="m-0"><img src="${this.getAttribute(
            "bannerImg"
        )}" alt="api functionality image" /></figure>
    <div class="d-flex flex-column gaUpgradePopupContent">
        ${this.getAttribute("heading")}
        ${this.getAttribute("subHeading")}
      <div class="d-flex keyPoints">
        <ul class="w-50">
          <li>
            <span><svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.75421 4.20265L4.06658 6.51502L9.32921 1.25239C9.52412 1.05748 9.77219 0.960022 10.0734 0.960022C10.3747 0.960022 10.6227 1.05748 10.8176 1.25239C11.0125 1.4473 11.1146 1.69077 11.1238 1.98278C11.1323 2.2755 11.0391 2.51932 10.8442 2.71423L4.81079 8.74765C4.61588 8.94257 4.36781 9.04002 4.06658 9.04002C3.76535 9.04002 3.51728 8.94257 3.32237 8.74765L0.292369 5.71765C0.0974565 5.52274 0 5.27467 0 4.97344C0 4.67222 0.0974565 4.42414 0.292369 4.22923C0.487281 4.03432 0.731098 3.93261 1.02382 3.92411C1.31584 3.91489 1.5593 4.00774 1.75421 4.20265Z" fill="#0BD25F"/>
                </svg>
            </span>
            <span>Analytics &amp; Insights</span>
          </li>
          <li>
            <span><svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.75421 4.20265L4.06658 6.51502L9.32921 1.25239C9.52412 1.05748 9.77219 0.960022 10.0734 0.960022C10.3747 0.960022 10.6227 1.05748 10.8176 1.25239C11.0125 1.4473 11.1146 1.69077 11.1238 1.98278C11.1323 2.2755 11.0391 2.51932 10.8442 2.71423L4.81079 8.74765C4.61588 8.94257 4.36781 9.04002 4.06658 9.04002C3.76535 9.04002 3.51728 8.94257 3.32237 8.74765L0.292369 5.71765C0.0974565 5.52274 0 5.27467 0 4.97344C0 4.67222 0.0974565 4.42414 0.292369 4.22923C0.487281 4.03432 0.731098 3.93261 1.02382 3.92411C1.31584 3.91489 1.5593 4.00774 1.75421 4.20265Z" fill="#0BD25F"/>
                </svg>
            </span>
            <span>Unlimited Annotations</span>
          </li>
          <li>
            <span><svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.75421 4.20265L4.06658 6.51502L9.32921 1.25239C9.52412 1.05748 9.77219 0.960022 10.0734 0.960022C10.3747 0.960022 10.6227 1.05748 10.8176 1.25239C11.0125 1.4473 11.1146 1.69077 11.1238 1.98278C11.1323 2.2755 11.0391 2.51932 10.8442 2.71423L4.81079 8.74765C4.61588 8.94257 4.36781 9.04002 4.06658 9.04002C3.76535 9.04002 3.51728 8.94257 3.32237 8.74765L0.292369 5.71765C0.0974565 5.52274 0 5.27467 0 4.97344C0 4.67222 0.0974565 4.42414 0.292369 4.22923C0.487281 4.03432 0.731098 3.93261 1.02382 3.92411C1.31584 3.91489 1.5593 4.00774 1.75421 4.20265Z" fill="#0BD25F"/>
                </svg>
            </span>
            <span>Teamwork</span>
          </li>
          <li>
            <span><svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.75421 4.20265L4.06658 6.51502L9.32921 1.25239C9.52412 1.05748 9.77219 0.960022 10.0734 0.960022C10.3747 0.960022 10.6227 1.05748 10.8176 1.25239C11.0125 1.4473 11.1146 1.69077 11.1238 1.98278C11.1323 2.2755 11.0391 2.51932 10.8442 2.71423L4.81079 8.74765C4.61588 8.94257 4.36781 9.04002 4.06658 9.04002C3.76535 9.04002 3.51728 8.94257 3.32237 8.74765L0.292369 5.71765C0.0974565 5.52274 0 5.27467 0 4.97344C0 4.67222 0.0974565 4.42414 0.292369 4.22923C0.487281 4.03432 0.731098 3.93261 1.02382 3.92411C1.31584 3.91489 1.5593 4.00774 1.75421 4.20265Z" fill="#0BD25F"/>
                </svg>
            </span>
            <span>API</span>
          </li>
        </ul>
        <ul class="w-50">
          <li>
            <span><svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.75421 4.20265L4.06658 6.51502L9.32921 1.25239C9.52412 1.05748 9.77219 0.960022 10.0734 0.960022C10.3747 0.960022 10.6227 1.05748 10.8176 1.25239C11.0125 1.4473 11.1146 1.69077 11.1238 1.98278C11.1323 2.2755 11.0391 2.51932 10.8442 2.71423L4.81079 8.74765C4.61588 8.94257 4.36781 9.04002 4.06658 9.04002C3.76535 9.04002 3.51728 8.94257 3.32237 8.74765L0.292369 5.71765C0.0974565 5.52274 0 5.27467 0 4.97344C0 4.67222 0.0974565 4.42414 0.292369 4.22923C0.487281 4.03432 0.731098 3.93261 1.02382 3.92411C1.31584 3.91489 1.5593 4.00774 1.75421 4.20265Z" fill="#0BD25F"/>
                </svg>
            </span>
            <span>Social Media Channels</span>
          </li>
          <li>
            <span><svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.75421 4.20265L4.06658 6.51502L9.32921 1.25239C9.52412 1.05748 9.77219 0.960022 10.0734 0.960022C10.3747 0.960022 10.6227 1.05748 10.8176 1.25239C11.0125 1.4473 11.1146 1.69077 11.1238 1.98278C11.1323 2.2755 11.0391 2.51932 10.8442 2.71423L4.81079 8.74765C4.61588 8.94257 4.36781 9.04002 4.06658 9.04002C3.76535 9.04002 3.51728 8.94257 3.32237 8.74765L0.292369 5.71765C0.0974565 5.52274 0 5.27467 0 4.97344C0 4.67222 0.0974565 4.42414 0.292369 4.22923C0.487281 4.03432 0.731098 3.93261 1.02382 3.92411C1.31584 3.91489 1.5593 4.00774 1.75421 4.20265Z" fill="#0BD25F"/>
                </svg>
            </span>
            <span>Website Changes</span>
          </li>
          <li>
            <span><svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.75421 4.20265L4.06658 6.51502L9.32921 1.25239C9.52412 1.05748 9.77219 0.960022 10.0734 0.960022C10.3747 0.960022 10.6227 1.05748 10.8176 1.25239C11.0125 1.4473 11.1146 1.69077 11.1238 1.98278C11.1323 2.2755 11.0391 2.51932 10.8442 2.71423L4.81079 8.74765C4.61588 8.94257 4.36781 9.04002 4.06658 9.04002C3.76535 9.04002 3.51728 8.94257 3.32237 8.74765L0.292369 5.71765C0.0974565 5.52274 0 5.27467 0 4.97344C0 4.67222 0.0974565 4.42414 0.292369 4.22923C0.487281 4.03432 0.731098 3.93261 1.02382 3.92411C1.31584 3.91489 1.5593 4.00774 1.75421 4.20265Z" fill="#0BD25F"/>
                </svg>
            </span>
            <span>Rank Tracking (SERP)</span>
          </li>
          <li>
            <span><svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.75421 4.20265L4.06658 6.51502L9.32921 1.25239C9.52412 1.05748 9.77219 0.960022 10.0734 0.960022C10.3747 0.960022 10.6227 1.05748 10.8176 1.25239C11.0125 1.4473 11.1146 1.69077 11.1238 1.98278C11.1323 2.2755 11.0391 2.51932 10.8442 2.71423L4.81079 8.74765C4.61588 8.94257 4.36781 9.04002 4.06658 9.04002C3.76535 9.04002 3.51728 8.94257 3.32237 8.74765L0.292369 5.71765C0.0974565 5.52274 0 5.27467 0 4.97344C0 4.67222 0.0974565 4.42414 0.292369 4.22923C0.487281 4.03432 0.731098 3.93261 1.02382 3.92411C1.31584 3.91489 1.5593 4.00774 1.75421 4.20265Z" fill="#0BD25F"/>
                </svg>
            </span>
            <span>Zapier</span>
          </li>
        </ul>
      </div>
      <div class="btns-upgradePopup">
        <a href="https://calendly.com/crystal-ball/30min" target="_blank" class="btn-bookAdemo">Book a Demo</a>
        <a href="/settings/price-plans" class="btn-subscribeNow">Subscribe now</a>
      </div>
    </div>
  `;
    }
}

customElements.define(`ga-plan-downgrade-upgrade-popup`, TagComponentGAPDUP);
