import React from 'react';
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router';

export default class IntegrationsIndex extends React.Component {

    constructor(props) {
        super(props);

        this.state = { redirectTo: null }
    }

    componentDidMount() {
        document.title = "Integrations";

        if (!this.props.user.price_plan.has_integrations) {
            setTimeout(() => {
                const accountNotLinkedHtml = '' +
                    '<div class="">' +
                    '<img src="/images/integrations-upgrade-modal.png" class="img-fluid">' +
                    '</div>'

                swal.fire({
                    html: accountNotLinkedHtml,
                    width: 1000,
                    showCancelButton: true,
                    showCloseButton: true,
                    customClass: {
                        popup: "themePlanAlertPopup",
                        htmlContainer: "themePlanAlertPopupContent",
                        closeButton: 'btn-closeplanAlertPopup',
                    },
                    cancelButtonClass: "btn-bookADemo",
                    cancelButtonText: "Book a Demo",
                    confirmButtonClass: "btn-subscribeNow",
                    confirmButtonText: "Subscribe now",

                }).then(value => {
                    if (value.isConfirmed) window.location.href = '/settings/price-plans'
                });
            }, 10000);
        }
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />

        return (
            <div className="container-xl bg-white d-flex flex-column justify-content-center component-wrapper data-source-container pt-0">
                <div className="row ml-0 mr-0">
                    <div className="col-12">
                        <h2 className="heading-section gaa-title">
                            <Link to="/my-integrations" className="btn gaa-btn-primary float-right">My Integrations</Link>
                        </h2>
                    </div>
                </div>
                <div className="row ml-0 mr-0 mt-0" id="integration-page-container">
                    <div className="col-12">
                        <div id="integration-page-top-options" style={{ minHeight: '80vh' }}>
                            <zapier-app-directory
                                app="crystal-ball"
                                link-target="same-tab"
                                theme="light"
                                introcopy="hide"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
