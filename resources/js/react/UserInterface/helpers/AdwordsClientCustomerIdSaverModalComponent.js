import React from 'react'
import HttpClient from '../utils/HttpClient'
import { toast } from 'react-toastify'


export default function AdwordsClientCustomerIdSaverModal(props) {
    if (!props.show) return null;
    let searchParams = new URLSearchParams(document.location.search);

    return <div className="modal fade show" id="adwordsClientCustomerIdSaverModal" tabIndex="-1" role="dialog" aria-labelledby="adwordsClientCustomerIdSaverModalLabel" style={{ 'display': 'block', 'paddingRight': '12px' }}>
        <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="adwordsClientCustomerIdSaverModalLabel">Setup your Google AdWords Customer ID</h5>
                    <button type="button" className="close" aria-label="Close"
                        onClick={props.dismissCallback}
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="adwordsClientCustomerId">Your Google AdWords Customer Account ID</label>
                        <input type="text" className="form-control" id="adwordsClientCustomerId" aria-describedby="clientCustomerIdHelp" placeholder="Enter your adwords account id" />
                        <small id="clientCustomerIdHelp" className="form-text text-muted">It looks something like this: 123-123-1234</small>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary"
                        onClick={props.dismissCallback}
                    >Close</button>
                    <button type="submit" className="btn gaa-btn-primary" onClick={() => {
                        HttpClient.put('settings/google-account/' + searchParams.get('google_account_id'), {
                            'adwords_client_customer_id': document.getElementById("adwordsClientCustomerId").value
                        })
                            .then(response => {
                                toast.success("Google Account ID saved.");
                                (props.dismissCallback)()
                            }, (err) => {
                                
                            }).catch(err => {
                                
                            });
                    }}>Save</button>
                </div>
            </div>
        </div>
    </div>
}
