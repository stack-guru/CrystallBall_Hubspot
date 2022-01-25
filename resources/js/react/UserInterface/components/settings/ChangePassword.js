import React, { Component } from 'react';
import { toast } from "react-toastify";

import HttpClient from "../../utils/HttpClient";
import TimezoneSelect from "../../utils/TimezoneSelect";
import ErrorAlert from '../../utils/ErrorAlert';

export default class ChangePassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            passwords: {
                new_password: '',
                new_password_confirmation: '',

            },
            isDirty: false,
            isBusy: false,
            errors: '',
            validation: '',

        }
        this.changeHandler = this.changeHandler.bind(this);
        this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
        this.timezoneChangeHandler = this.timezoneChangeHandler.bind(this);
        this.setDefaultState = this.setDefaultState.bind(this);
        this.handlePhoneSubmit = this.handlePhoneSubmit.bind(this);
    }
    componentDidMount() {
        document.title = 'Change Password'
        if (this.props.user) this.setState({ timezone: this.props.user.timezone, phone: this.props.user.phone_number });

        var searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has('identification-code') || this.props.user.do_require_password_change == true) {
            swal("Set Password", "You need to set a password for your account inorder to use full functionality.", "info");
        }

    }

    changeHandler(e) {
        this.setState({ isDirty: true, passwords: { ...this.state.passwords, [e.target.name]: e.target.value } });
    }

    handlePasswordSubmit(e) {
        e.preventDefault();

        if (this.validate() && !this.state.isBusy) {
            this.setState({ isBusy: true });
            HttpClient.post('/settings/change-password', this.state.passwords).then(resp => {
                toast.success("Update successfully.");
                this.setDefaultState();
                this.setState({ isBusy: false });

            }, (err) => {

                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {

                this.setState({ isBusy: false, errors: err });
            })
        }

    }

    validate() {
        let new_password = this.state.passwords.new_password;
        let new_password_confirmation = this.state.passwords.new_password_confirmation;


        let errors = {};
        let isValid = true;

        if (!new_password) {
            isValid = false;
            errors["new_password"] = "Please enter your new password.";
        }
        if (new_password !== '' && new_password.length < 8) {
            isValid = false;
            errors["new_password"] = "Password can't be less then 8 characters";
        }

        if (!new_password_confirmation) {
            isValid = false;
            errors["new_password_confirmation"] = "Please re-type your new password.";
        }

        if (new_password_confirmation !== new_password) {
            isValid = false;
            errors["new_password_confirmation"] = "Repeat password should be same as new password";
        }

        this.setState({
            validation: errors
        });

        return isValid;
    }

    timezoneChangeHandler(e) {
        e.preventDefault();

        if (!this.state.isBusy) {
            this.setState({ isBusy: true });
            HttpClient.put('/settings/change-timezone', { 'timezone': this.state.timezone }).then(resp => {
                toast.success("Timezone changed successfully.");
                this.setDefaultState();
                (this.props.reloadUser)();
            }, (err) => {

                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {

                this.setState({ isBusy: false, errors: err });
            })
        }
    }

    setDefaultState() {
        this.setState({
            passwords: {
                new_password: '',
                new_password_confirmation: '',
            },
            validation: {},
            isBusy: false,
            isDirty: false,
            errors: undefined
        });
    }

    handlePhoneSubmit(e) {
        e.preventDefault();
        if (!this.state.isBusy) {
            this.setState({ isBusy: true });
            HttpClient.put('/settings/change-phone', { 'phone': this.state.phone }).then(resp => {
                toast.success("Phone changed successfully.");
                this.setDefaultState();
                (this.props.reloadUser)();
            }, (err) => {

                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {

                this.setState({ isBusy: false, errors: err });
            })
        }
    }

    render() {
        return (
            <div className="container-xl bg-white component-wrapper">
                <div className="row ml-0 mr-0">
                    <div className="col-6">
                        <h3 className="gaa-title">Password</h3>
                        <div className="row ml-0 mr-0">
                            <div className="col-md-12">
                                <ErrorAlert errors={this.state.errors} />
                            </div>
                        </div>
                        <form onSubmit={this.handlePasswordSubmit}>


                            <div className="form-group my-3">
                                <label htmlFor="">Password</label>
                                <input type="password" className="form-control" name="new_password" value={this.state.passwords.new_password} onChange={this.changeHandler} placeholder="New Password" id="" />
                                {
                                    this.state.validation.new_password ?
                                        <span className="text-danger mt-1">{this.state.validation.new_password}</span> : ''
                                }
                            </div>
                            <div className="form-group my-3">
                                <label htmlFor="">Repeat-Password</label>
                                <input type="password" className="form-control" name="new_password_confirmation" value={this.state.passwords.new_password_confirmation} onChange={this.changeHandler} placeholder="Repeat Password" id="" />
                                {
                                    this.state.validation.new_password_confirmation ?
                                        <span className="text-danger mt-1">{this.state.validation.new_password_confirmation}</span> : ''
                                }
                            </div>
                            <div className="row ml-0 mr-0 my-3">
                                <div className="col-12 text-right p-0">
                                    <button className="btn gaa-btn-primary">Reset</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="col-6">
                        <h3 className="gaa-title">Phone</h3>
                        <form onSubmit={this.handlePhoneSubmit}>


                            <div className="form-group my-3">
                                <label htmlFor="">Phone</label>
                                <input type="text" className="form-control" name="phone" value={this.state.phone} onChange={(e) => { this.setState({ [e.target.name]: e.target.value }); }} placeholder="+XXXXX" id="" />
                            </div>
                            <div className="row ml-0 mr-0 my-3">
                                <div className="col-12 text-right p-0">
                                    <button className="btn gaa-btn-primary">Save</button>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>

                <div className="row ml-0 mr-0">
                    <div className="col-6">
                        <h3 className="gaa-title">Timezone</h3>
                        <form onSubmit={this.timezoneChangeHandler}>
                            <div className="form-group my-3">
                                <TimezoneSelect className='form-control' value={this.state.timezone} name='timezone' onChange={(e) => { this.setState({ timezone: e.target.value }) }} />

                            </div>

                            <div className="row ml-0 mr-0 my-3">
                                <div className="col-12 text-right p-0">
                                    <button className="btn gaa-btn-primary">Change</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }


}
