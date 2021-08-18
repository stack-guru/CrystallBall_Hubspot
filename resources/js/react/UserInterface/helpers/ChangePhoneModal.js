import React, { Component } from 'react';

import HttpClient from "../utils/HttpClient";
import { toast } from "react-toastify";
import CountryCallingCodeSelect from '../utils/CountryCallingCodeSelect';


export default class ChangePhoneModal extends Component {

    constructor(props) {
        super(props)

        this.state = {
            callingCode: '',
            'phone': ''
        };

        this.handlePhoneSubmit = this.handlePhoneSubmit.bind(this);
    }

    handlePhoneSubmit(e) {
        e.preventDefault();
        if (!this.state.isBusy) {
            this.setState({ isBusy: true });
            HttpClient.put('/settings/change-phone', { 'phone': ("+").concat(this.state.callingCode).concat(this.state.phone) }).then(resp => {
                toast.success("Phone changed successfully.");
                (this.props.toggleCallback)();
            }, (err) => {

                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {

                this.setState({ isBusy: false, errors: err });
            })
        }
    }

    render() {
        if (!this.props.show) return null;
        return (
            <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                <div className="modal-dialog" role="document" >
                    <div className="modal-content" >
                        <form onSubmit={this.handlePhoneSubmit}>
                            <div className="modal-header">
                                Enter your mobile number
                            </div>
                            <div className="modal-body text-left">
                                We will use this number to send you a text message with a confirmation code.
                                <div className="form-group my-3">
                                    <label htmlFor="">Country Code</label>
                                    <CountryCallingCodeSelect onChange={(e) => { this.setState({ [e.target.name]: e.target.value }); }} className="form-control" name="callingCode" value={this.state.callingCode} />
                                </div>
                                <div className="form-group my-3">
                                    <label htmlFor="">Mobile Phone Number</label>
                                    <input type="text" className="form-control" name="phone" value={this.state.phone} onChange={(e) => { this.setState({ [e.target.name]: e.target.value }); }} placeholder="" id="" />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-primary">Verify Phone Number Now</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}