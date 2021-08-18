import React, { Component } from 'react';

import HttpClient from "../utils/HttpClient";
import { toast } from "react-toastify";


export default class ChangePhoneModal extends Component {

    constructor(props) {
        super(props)

        this.state = {
            'phone': ''
        };

        this.handlePhoneSubmit = this.handlePhoneSubmit.bind(this);
    }

    handlePhoneSubmit(e) {
        e.preventDefault();
        if (!this.state.isBusy) {
            this.setState({ isBusy: true });
            HttpClient.put('/settings/change-phone', { 'phone': this.state.phone }).then(resp => {
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
                                Change Phone
                            </div>
                            <div className="modal-body">
                                <div className="form-group my-3 text-left">
                                    <label htmlFor="">Enter phone number below:</label>
                                    <input type="text" className="form-control" name="phone" value={this.state.phone} onChange={(e) => { this.setState({ [e.target.name]: e.target.value }); }} placeholder="+XXXXX" id="" />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}