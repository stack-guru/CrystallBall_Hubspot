import React from 'react'
import HttpClient from '../utils/HttpClient'
import Toast from "../utils/Toast";


export default class AdwordsClientCustomerIdSaverModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            googleAdsAccountIds: []
        };
    }

    componentDidMount() {
        const searchParams = new URLSearchParams(document.location.search);
        if (searchParams.get('google_account_id')) {
            HttpClient.get('settings/google-ads-account-ids?google_account_id=' + searchParams.get('google_account_id'))
                .then(response => {
                    this.setState({ googleAdsAccountIds: response.data.google_ads_account_ids });
                }, (err) => {

                }).catch(err => {

                });
        }
    }

    render() {
        if (!this.props.show) return null;
        let searchParams = new URLSearchParams(document.location.search);

        return <div className="modal fade show" id="adwordsClientCustomerIdSaverModal" tabIndex="-1" role="dialog" aria-labelledby="adwordsClientCustomerIdSaverModalLabel" style={{ 'display': 'block', 'paddingRight': '12px' }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="adwordsClientCustomerIdSaverModalLabel">Setup your Google AdWords Customer ID</h5>
                        <button type="button" className="close" aria-label="Close"
                            onClick={this.props.dismissCallback}
                        >
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="adwordsClientCustomerId">Your Google AdWords Customer Account ID</label>
                            <input type="text" className="form-control" id="adwordsClientCustomerId" aria-describedby="clientCustomerIdHelp" placeholder="Enter your adwords account id" />
                            <small id="clientCustomerIdHelp" className="form-text text-muted">It looks something like this: 123-123-1234</small>
                            <img src="/images/adwords-client-customer-id-sample.png" />
                        </div>
                        <div className="form-group">
                            <label>Customer Account Ids revealed through Google Ads API:</label><br />
                            {this.state.googleAdsAccountIds.map(id =>
                                <React.Fragment><label>{id}</label><br /></React.Fragment>
                            )}
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary"
                            onClick={this.props.dismissCallback}
                        >Close</button>
                        <button type="submit" className="btn gaa-btn-primary" onClick={() => {
                            HttpClient.put('settings/google-account/' + searchParams.get('google_account_id'), {
                                'adwords_client_customer_id': document.getElementById("adwordsClientCustomerId").value
                            })
                                .then(response => {
                                    Toast.fire({
                                        icon: 'success',
                                        title: "Google Account ID saved.",
                                    });
                                    (this.props.dismissCallback)()
                                }, (err) => {

                                }).catch(err => {

                                });
                        }}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    }
}
