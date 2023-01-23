import React, { Component } from 'react';

import HttpClient from "../utils/HttpClient";
import { toast } from "react-toastify";
import CountryCallingCodeSelect from '../utils/CountryCallingCodeSelect';
import AppsModal from '../components/AppsMarket/AppsModal';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Button } from 'reactstrap';


export default class ChangePhoneModal extends Component {

    constructor(props) {
        super(props)

        this.state = {
            callingCode: '',
            'phone': ''
        };

        this.handlePhoneSubmit = this.handlePhoneSubmit.bind(this);
        this.handleVerifyPhoneSubmit = this.handleVerifyPhoneSubmit.bind(this);
        this.resendVerificationCode = this.resendVerificationCode.bind(this);
        this.moveNext = this.moveNext.bind(this);
    }
    componentDidMount() {
        if (this.props.phoneNumber) {
            this.setState({ phone: this.props.phoneNumber })
        }
    }
    resendVerificationCode(e) {
        e.preventDefault();
        if (!this.state.isBusy) {
            this.setState({ isBusy: true });
            let statePhone = (this.state.phone || '').replaceAll('+', '');

            HttpClient({ method: 'POST', url: '/phone/resend', baseURL: "/", data: { phone: `+${statePhone}` } })
                .then(response => {
                    this.setState({ isBusy: false });
                }, (err) => {
                    this.setState({ errors: (err.response).data, isBusy: false });
                }).catch(err => {
                    this.setState({ errors: err, isBusy: false });
                });
        }
    }
    handlePhoneSubmit(e) {
        e.preventDefault();
        if (!this.state.isBusy) {
            this.setState({ isBusy: true });
            let statePhone = (this.state.phone || '').replaceAll('+', '');

            HttpClient.put('/settings/change-phone', { 'phone': `+${statePhone}` }).then(resp => {
                // toast.success("Phone changed successfully.");
                // (this.props.toggleCallback)();

                HttpClient({ method: 'POST', url: '/phone/resend', baseURL: "/", data: { phone: `+${statePhone}` } })
                    .then(response => {
                        this.setState({ isBusy: false });
                    }, (err) => {
                        this.setState({ errors: (err.response).data, isBusy: false });
                    }).catch(err => {
                        this.setState({ errors: err, isBusy: false });
                    });

            }, (err) => {

                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {

                this.setState({ isBusy: false, errors: err });
            })
        }
    }

    moveNext(e) {
        if (e.target.tagName == "INPUT") {
            var maxLength = parseInt(e.target.attributes["maxlength"].value, 10);
            var myLength = e.target.value.length;
            if (myLength >= maxLength) {
                var next = e.target;
                while (next = next.nextElementSibling) {
                    if (next == null)
                        break;
                    if (next.tagName == "INPUT") {
                        next.focus();
                        break;
                    }
                }
            }
            // Move to previous field if empty (user pressed backspace)
            else if (myLength === 0) {
                var previous = e.target;
                while (previous = previous.previousElementSibling) {
                    if (previous == null)
                        break;
                    if (previous.tagName == "INPUT") {
                        previous.focus();
                        break;
                    }
                }
            }
        }
    }


    handleVerifyPhoneSubmit(e) {
        e.preventDefault();
        var verificationCode = "";
        e.target.childNodes.forEach(function (i) { if (i.tagName == "INPUT" && i.type == "text") { verificationCode = verificationCode.concat(i.value); } });

        this.setState({ isBusy: true });
        HttpClient({ method: 'POST', url: '/phone/verify', baseURL: "/", data: { verification_code: verificationCode } })
            .then(response => {
                this.setState({ isBusy: false });
                swal.fire('Phone Verified', 'Your phone number has been verified.', 'success').then(b => {
                    (this.props.toggleCallback)();
                });
            }, (err) => {
                this.setState({ errors: (err.response).data, isBusy: false });
            }).catch(err => {
                this.setState({ errors: err, isBusy: false });
            });
    }

    render() {
        if (!this.props.show) return null;
        return (
            <AppsModal isOpen={this.props.show} popupSize={'md'} toggle={this.props.toggleCallback}>
                <div className="d-flex justify-content-between align-items-center">
                    <h1>Add phone number</h1>
                    <span onClick={this.props.toggleCallback} className="btn-close"><img className="inject-me" src="/close-icon.svg" width="26" height="26" alt="menu icon" /></span>
                </div>
                <form onSubmit={this.handlePhoneSubmit}>
                    <PhoneInput
                        country={'us'}
                        value={this.state.phone}
                        onChange={phone => this.setState({ phone })}
                        inputProps={{
                            name: 'phone',
                            required: true,
                            autoFocus: true
                        }}
                    />
                    {this.props.phoneNumber ? <button className="btn-theme" type="submit">Change</button> : <div>
                        <button onClick={this.props.toggleCallback} className="btn-theme" type="button">Cancel</button>
                        <button className="btn-theme" type="submit">Send Code</button>
                    </div>}
                </form>

                {this.props.phoneNumber ? <div className='alert alert-info border-0'>
                    <div>
                        <i><img src={'/icon-info.svg'} alt={'icon'} className="svg-inject" /></i>
                        <span>Verification code is sent to the given number</span>
                    </div>
                    <button onClick={this.resendVerificationCode}>Resend</button>
                </div> : null}

                {this.state.isBusy ?
                    <div className="fa-3x"><i className="fa fa-spinner fa-pulse"></i></div>
                    :
                    <form onSubmit={this.handleVerifyPhoneSubmit} id="form" onKeyUp={this.moveNext}>
                        <input type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" />
                        <input type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" />
                        <input type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" />
                        <input type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" />
                        <input type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" />
                        <input type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" />

                        <div>
                            <button onClick={this.props.toggleCallback} className="btn-theme" type="button">Cancel</button>
                            <button className="btn-theme" type="submit">Verify</button>
                        </div>
                    </form>
                }
            </AppsModal>
        )
    }
}
