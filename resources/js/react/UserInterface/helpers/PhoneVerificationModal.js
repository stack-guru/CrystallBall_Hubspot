import React, { Component } from 'react';
import './PhoneVerificationModal.css'

export default class PhoneVerificationModal extends Component {

    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this);
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

    handleSubmit(e) {
        e.preventDefault();
        var verificationCode = "";
        e.target.childNodes.forEach(function (i) { if (i.tagName == "INPUT" && i.type == "text") { verificationCode = verificationCode.concat(i.value); } });
        (this.props.handePhoneVerification)(verificationCode);
    }

    render() {
        if (!this.props.show) return null;
        return (
            <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                <div className="modal-dialog" role="document" style={{ marginTop: '10%' }}>
                    <div className="modal-content" style={{ width: 'max-content' }}>
                        <div className="modal-body" style={{ padding: '0px' }}>
                            <div id="wrapper">
                                <div id="dialog">
                                    <h5>Please enter the 6-digit verification code we sent via SMS:</h5>
                                    <span>The code sent to {this.props.phoneNumber} is valid for 30 minutes only.</span>
                                    <form onSubmit={this.handleSubmit} id="form" onKeyUp={this.moveNext}>
                                        <input type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" />
                                        <input type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" />
                                        <input type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" />
                                        <input type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" />
                                        <input type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" />
                                        <input type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" />
                                        <button className="btn btn-primary btn-embossed" type="submit">Verify</button>
                                    </form>
                                    <div>
                                        {/* <p>Didn't receive the code? <a href="#">Send again</a></p> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}