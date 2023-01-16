import React, { Component } from 'react';
import { toast } from "react-toastify";

import HttpClient from "../../utils/HttpClient";
import TimezoneSelect from "../../utils/TimezoneSelect";
import ErrorAlert from '../../utils/ErrorAlert';
import { Button, Container, Input } from 'reactstrap';
import { Link } from 'react-router-dom';

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
            swal.fire("Set Password", "You need to set a password for your account inorder to use full functionality.", "info");
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
            <div id="profilePage" className="profilePage pageWrapper">
                <Container>
                    <div className="pageHeader profilePageHead">
                        <h2 className="pageTitle mb-0">Profile</h2>
                    </div>

                    <ul class="themeTabNav nav nav-pills" id="pills-tab" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="pills-personalInfo-tab" data-toggle="pill" href="#pills-personalInfo" role="tab" aria-controls="pills-personalInfo" aria-selected="true">Personal Info</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="pills-security-tab" data-toggle="pill" href="#pills-security" role="tab" aria-controls="pills-security" aria-selected="false">Security</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="pills-subscription-tab" data-toggle="pill" href="#pills-subscription" role="tab" aria-controls="pills-subscription" aria-selected="false">Subscription</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="pills-payments-tab" data-toggle="pill" href="#pills-payments" role="tab" aria-controls="pills-payments" aria-selected="false">Payments</a>
                        </li>
                    </ul>
                    <div class="themeTabContent tab-content mb-5" id="pills-tabContent">
                        <div class="tab-pane fade show active" id="pills-personalInfo" role="tabpanel" aria-labelledby="pills-personalInfo-tab">
                            <form className='profileForm personalInfoForm' onSubmit={this.timezoneChangeHandler}>
                                <div className="themeNewInputStyle mb-4 pb-2">
                                    <label htmlFor='addPhoto' className='addPhoto'>
                                        <i><img src='/icon-photo.svg'/></i>
                                        <span>Add photo</span>
                                    </label>
                                </div>
                                <div className="themeNewInputStyle mb-3">
                                    <Input type='text' className="form-control" name='' placeholder='Adil Aijaz' value=''/>
                                </div>
                                <div className="themeNewInputStyle mb-3 position-relative">
                                    <a className='btn-update' href='#'>Update</a>
                                    <Input type='email' className="form-control" name='' placeholder='adilaijaz@gmail.com' value=''/>
                                </div>
                                <div className="themeNewInputStyle position-relative inputWithIcon mb-3">
                                    <i className='fa fa-link'></i>
                                    <Input type='url' className="form-control" name='' placeholder='https://awesomecompany.com' value=''/>
                                </div>
                                <div className="themeNewInputStyle mb-3 position-relative">
                                    <a className='btn-update' href='#'>Update</a>
                                    <input type="text" className="form-control" name="phone" value={this.state.phone} onChange={(e) => {this.setState({ [e.target.name]: e.target.value });}} placeholder="(551) 456-1234"/>
                                </div>
                                <div className="themeNewInputStyle mb-4 pb-2">
                                    <TimezoneSelect className='form-control' value={this.state.timezone} name='timezone' onChange={(e) => {this.setState({ timezone: e.target.value })}}/>
                                </div>
                                <Button className='btn-theme'>Update</Button>
                            </form>
                        </div>
                        <div class="tab-pane fade" id="pills-security" role="tabpanel" aria-labelledby="pills-security-tab">
                            <form className='profileForm securityForm' onSubmit={this.timezoneChangeHandler}>
                                <div className="themeNewInputStyle mb-3 d-flex justify-content-between align-items-center">
                                    <p className='mb-0'>Enable 2-Factor Verification:</p>
                                    <div className="singleCol text-left d-flex align-items-center justify-content-start">
                                        <label className="themeSwitch">
                                            <input type="checkbox" name="is_enabled" checked/>
                                            <span className="themeSlider" />
                                        </label>
                                    </div>
                                </div>
                                <h2>Change password</h2>
                                <div className="themeNewInputStyle mb-3">
                                    <input type="password" className="form-control" name="currentPassword" value='' placeholder="Current password" id="" />
                                </div>
                                <div className="themeNewInputStyle mb-3">
                                    <input type="password" className="form-control" name="new_password" value={this.state.passwords.new_password} onChange={this.changeHandler} placeholder="New Password" id="" />
                                    {this.state.validation.new_password ? <span className="text-danger mt-1">{this.state.validation.new_password}</span> : ''}
                                </div>
                                <div className="themeNewInputStyle mb-4 pb-2">
                                    <input type="password" className="form-control" name="new_password_confirmation" value={this.state.passwords.new_password_confirmation} onChange={this.changeHandler} placeholder="Confirm new password" id="" />
                                    {this.state.validation.new_password_confirmation ? <span className="text-danger mt-1">{this.state.validation.new_password_confirmation}</span> : ''}
                                </div>
                                <Button className='btn-theme'>Update</Button>
                            </form>
                        </div>
                        <div class="tab-pane fade" id="pills-subscription" role="tabpanel" aria-labelledby="pills-subscription-tab">
                            <div className='gridBox'>
                                <div className="column">
                                    <h2>Current subscription</h2>
                                    <h3>Business <span>(Yearly)</span></h3>
                                    <p>Renew date: 12 Nov, 2024</p>
                                    <h2>Features in Business plan</h2>
                                    <ul>
                                        <li className='d-flex align-items-center'><i className='pr-2'><img src='/icon-listTick.svg'/></i>Up to 10 properties</li>
                                        <li className='d-flex align-items-center'><i className='pr-2'><img src='/icon-listTick.svg'/></i>Unlimited Annotations</li>
                                        <li className='d-flex align-items-center'><i className='pr-2'><img src='/icon-listTick.svg'/></i>Up to 11 users</li>
                                        <li className='d-flex align-items-center'><i className='pr-2'><img src='/icon-listTick.svg'/></i>Integrations</li>
                                        <li className='d-flex align-items-center'><i className='pr-2'><img src='/icon-listTick.svg'/></i>Notifications</li>
                                        <li className='d-flex align-items-center'><i className='pr-2'><img src='/icon-listTick.svg'/></i>Annotations API</li>
                                    </ul>
                                    <button className='btn-theme'>Upgrade membership</button>
                                </div>
                                <div className="column">
                                    <h2>Features in Business plan</h2>
                                    <ul>
                                        <li>News Alerts: <span>3/5</span></li>
                                        <li>Website Monitoring: <span>2/3</span></li>
                                        <li>Website Monitoring: <span>2/3</span></li>
                                        <li>Weather Alerts: <span>5/5</span></li>
                                        <li>Weather Alerts: <span>5/5</span></li>
                                        <li>News Alerts: <span>3/5</span></li>
                                        <li>Website Monitoring: <span>2/3</span></li>
                                        <li>Weather Alerts: <span>5/5</span></li>
                                        <li>Website Monitoring: <span>2/3</span></li>
                                        <li>Weather Alerts: <span>5/5</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="pills-payments" role="tabpanel" aria-labelledby="pills-payments-tab">
                            <div className="pageHeader paymentHistoryPageHead d-flex justify-content-between">
                                <h2 className="pageTitle mb-0">Payments</h2>
                                <Link to="/settings/payment-detail/create" className='btn-theme-outline bg-white'>
                                    <i><img src={'/icon-cc.svg'} /></i>
                                    <span>Update card</span>
                                </Link>
                            </div>

                            <div className="dataTable dataTablePaymentHistory d-flex flex-column">
                                <div className="dataTableHolder">
                                    <div className="tableHead singleRow align-items-center">
                                        <div className="singleCol text-left">&nbsp;</div>
                                        <div className="singleCol text-left">Transaction Id</div>
                                        <div className="singleCol text-left">Plan</div>
                                        <div className="singleCol text-left">Amount</div>
                                        <div className="singleCol text-left">Credit date</div>
                                        <div className="singleCol text-left">Paid by</div>
                                        <div className="singleCol text-right">&nbsp;</div>
                                    </div>
                                    <div className="tableBody">
                                        <div className="singleRow align-items-center">
                                            <div className="singleCol text-left"><span>#4</span></div>
                                            <div className="singleCol text-left"><span>44125</span></div>
                                            <div className="singleCol text-left"><span>Pro (Yearly)</span></div>
                                            <div className="singleCol text-left"><span>79.00 USD</span></div>
                                            <div className="singleCol text-left"><span>1/7/2022</span></div>
                                            <div className="singleCol text-left"><span>Card ending with 3124</span></div>
                                            <div className="singleCol text-right">
                                                <Link to={`#`} className='d-flex align-items-center'>
                                                    <img src={`/icon-getInvoice.svg`} />
                                                    <span className='pl-2'>Get Invoice</span>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="singleRow align-items-center">
                                            <div className="singleCol text-left"><span>#4</span></div>
                                            <div className="singleCol text-left"><span>44125</span></div>
                                            <div className="singleCol text-left"><span>Pro (Yearly)</span></div>
                                            <div className="singleCol text-left"><span>79.00 USD</span></div>
                                            <div className="singleCol text-left"><span>1/7/2022</span></div>
                                            <div className="singleCol text-left"><span>Card ending with 3124</span></div>
                                            <div className="singleCol text-right">
                                                <Link to={`#`} className='d-flex align-items-center'>
                                                    <img src={`/icon-getInvoice.svg`} />
                                                    <span className='pl-2'>Get Invoice</span>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="singleRow align-items-center">
                                            <div className="singleCol text-left"><span>#4</span></div>
                                            <div className="singleCol text-left"><span>44125</span></div>
                                            <div className="singleCol text-left"><span>Pro (Yearly)</span></div>
                                            <div className="singleCol text-left"><span>79.00 USD</span></div>
                                            <div className="singleCol text-left"><span>1/7/2022</span></div>
                                            <div className="singleCol text-left"><span>Card ending with 3124</span></div>
                                            <div className="singleCol text-right">
                                                <Link to={`#`} className='d-flex align-items-center'>
                                                    <img src={`/icon-getInvoice.svg`} />
                                                    <span className='pl-2'>Get Invoice</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>





                    <div className="">
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
                </Container>
            </div>
        );
    }


}
