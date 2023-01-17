import React, { Component } from 'react';
import { toast } from "react-toastify";
import { UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';

import HttpClient from "../../utils/HttpClient";
import TimezoneSelect from "../../utils/TimezoneSelect";
import ErrorAlert from '../../utils/ErrorAlert';
import { Button, Container, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';

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
                                        <i><img src='/icon-photo.svg' /></i>
                                        <span>Add photo</span>
                                    </label>
                                </div>
                                <div className="themeNewInputStyle mb-3">
                                    <Input type='text' className="form-control" name='' placeholder='Adil Aijaz' value='' />
                                </div>
                                <div className="themeNewInputStyle mb-3 position-relative">
                                    <a className='btn-update' href='#'>Update</a>
                                    <Input type='email' className="form-control" name='' placeholder='adilaijaz@gmail.com' value='' />
                                </div>
                                <div className="themeNewInputStyle position-relative inputWithIcon mb-3">
                                    <i className='fa fa-link'></i>
                                    <Input type='url' className="form-control" name='' placeholder='https://awesomecompany.com' value='' />
                                </div>
                                <div className="themeNewInputStyle mb-3 position-relative">
                                    <a className='btn-update' onClick={this.handlePhoneSubmit} href='javascript:void(0);'>Update</a>
                                    <input type="text" className="form-control" name="phone" value={this.state.phone} onChange={(e) => { this.setState({ [e.target.name]: e.target.value }); }} placeholder="(551) 456-1234" />
                                </div>
                                <div className="themeNewInputStyle mb-4 pb-2">
                                    <TimezoneSelect className='form-control' value={this.state.timezone} name='timezone' onChange={(e) => { this.setState({ timezone: e.target.value }) }} />
                                </div>
                                <Button className='btn-theme'>Update</Button>
                            </form>
                        </div>
                        <div class="tab-pane fade" id="pills-security" role="tabpanel" aria-labelledby="pills-security-tab">
                            <form className='profileForm securityForm' onSubmit={this.handlePasswordSubmit}>
                                <div className="themeNewInputStyle mb-3 d-flex justify-content-between align-items-center">
                                    <p className='mb-0'>Enable 2-Factor Verification:</p>
                                    <div className="singleCol text-left d-flex align-items-center justify-content-start">
                                        <label className="themeSwitch">
                                            <input type="checkbox" name="is_enabled" checked />
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
                                    <h3>{this.props.user.price_plan.name} <span>(Yearly)</span></h3>
                                    <p>Renew date: {moment(this.props.user.price_plan_expiry_date).format('DD MMM, YYYY')}</p>
                                    <h2>Features in {this.props.user.price_plan.name} plan</h2>
                                    <ul>

                                        {this.props.user.price_plan.google_analytics_property_count == 1 ?
                                            <li className='d-flex align-items-center'><i className='pr-2'><img src='/icon-listTick.svg' /></i> One Property/Website</li>
                                            :
                                            this.props.user.price_plan.google_analytics_property_count > 0 ? <li className='d-flex align-items-center'><i className='pr-2'><img src='/icon-listTick.svg' /></i> Up to {this.props.user.price_plan.google_analytics_property_count} Properties</li> : (this.props.user.price_plan.google_analytics_property_count == -1 ? <li className='d-flex align-items-center'><i className='pr-2'><img src='/icon-listTick.svg' /></i>  No Property Filters</li> : <li className='d-flex align-items-center'><i className='pr-2'><img src='/icon-listTick.svg' /></i>  Unlimited Property Filters</li>)}
                                        {this.props.user.price_plan.annotations_count > 0 ? <li className='d-flex align-items-center'><i className='pr-2'><img src='/icon-listTick.svg' /></i> Up to {this.props.user.price_plan.annotations_count} Annotations</li> : <li className='d-flex align-items-center'><i className='pr-2'><img src='/icon-listTick.svg' /></i> Unlimited Annotations</li>}
                                        {this.props.user.price_plan.has_chrome_extension == 1 ? <li className='d-flex align-items-center'><i className='pr-2'><img src='/icon-listTick.svg' /></i> Chrome extension</li> : null}
                                        {this.props.user.price_plan.has_google_data_studio == 1 ? <li className='d-flex align-items-center'><i className='pr-2'><img src='/icon-listTick.svg' /></i>Data Studio Connector</li> : null}
                                        {this.props.user.price_plan.user_per_ga_account_count == 0 ? <li className='d-flex align-items-center'><i className='pr-2'><img src='/icon-listTick.svg' /></i>Unlimited Users</li> : (this.props.user.price_plan.user_per_ga_account_count == -1 ? <li className='d-flex align-items-center'><i className='pr-2'><img src='/icon-listTick.svg' /></i>Up to 1 User</li> : (this.props.user.price_plan.user_per_ga_account_count >= 1 ? <li className='d-flex align-items-center'><i className='pr-2'><img src='/icon-listTick.svg' /></i>Up to {this.props.user.price_plan.user_per_ga_account_count + 1} User</li> : (<span></span>)))}
                                        {this.props.user.price_plan.ga_account_count == 0 ? <li className='d-flex align-items-center'><i className='pr-2'><img src='/icon-listTick.svg' /></i>Unlimited GA accounts</li> : this.props.user.price_plan.ga_account_count >= 1 ? <li className='d-flex align-items-center'><i className='pr-2'><img src='/icon-listTick.svg' /></i>Up to {this.props.user.price_plan.ga_account_count == 1 ? <span>{this.props.user.price_plan.ga_account_count} GA account</span> : <span>{this.props.user.price_plan.ga_account_count} GA accounts</span>}</li> : ''}
                                        {this.props.user.price_plan.has_manual_add ? <li className='d-flex align-items-center'><i className='pr-2'><img src='/icon-listTick.svg' /></i>Manual Annotations</li> : null}

                                        {this.props.user.price_plan.has_csv_upload ? <li className='d-flex align-items-center'><i className='pr-2'><img src='/icon-listTick.svg' /></i>CSV Upload</li> : null}

                                        {this.props.user.price_plan.has_api ? <li className='d-flex align-items-center'><i className='pr-2'><img src='/icon-listTick.svg' /></i>Annotations API</li> : null}
                                        {this.props.user.price_plan.has_integrations ? <li className='d-flex align-items-center'><i className='pr-2'><img src='/icon-listTick.svg' /></i>Integrations</li> : null}
                                        {this.props.user.price_plan.has_data_sources ? <li className='d-flex align-items-center'><i className='pr-2'><img src='/icon-listTick.svg' /></i>
                                            Automations
                                            {/* <img id={"automation-feature-hint-" + this.props.user.price_plan.id} className="hint-button" src="/images/info-logo-grey.png" onClick={() => { this.setState({ showHintFor: 'automation-hint-' + this.props.user.price_plan.id }) }} />
                                            <UncontrolledPopover trigger="legacy" placement="right" isOpen={this.state.showHintFor == 'automation-hint-' + this.props.user.price_plan.id} target={"automation-feature-hint-" + this.props.user.price_plan.id} toggle={() => { this.setState({ showHintFor: null }) }} onClick={() => { this.changeShownHint(null) }}>
                                                <PopoverHeader>{this.props.user.price_plan.name}</PopoverHeader>
                                                <PopoverBody>
                                                    {this.props.user.price_plan.keyword_tracking_count == -1 ? null : <span>Rank Tracking: {this.props.user.price_plan.keyword_tracking_count == 0 ? 'Unlimited' : this.props.user.price_plan.keyword_tracking_count} Credits<br /></span>}
                                                    Website Monitoring: {this.props.user.price_plan.web_monitor_count} URLs<br />
                                                    Weather Alerts: {this.props.user.price_plan.owm_city_count == 0 ? 'Unlimited' : (this.props.user.price_plan.owm_city_count > 0 ? this.props.user.price_plan.owm_city_count : 0)} cities<br />
                                                    News Alerts: {this.props.user.price_plan.google_alert_keyword_count == 0 ? 'Unlimited' : (this.props.user.price_plan.google_alert_keyword_count > 0 ? this.props.user.price_plan.google_alert_keyword_count : 0)} keywords<br />
                                                    Retail Marketing Dates<br />
                                                    Google Updates<br />
                                                    WordPress Updates<br />
                                                    Holidays<br />
                                                </PopoverBody>
                                            </UncontrolledPopover> */}
                                        </li> : null}
                                        {this.props.user.price_plan.has_notifications ? <li className='d-flex align-items-center'><i className='pr-2'><img src='/icon-listTick.svg' /></i>Notifications</li> : null}
                                    </ul>
                                        <a href='/settings/price-plans'><Button className='btn-theme'>Upgrade membership</Button></a>
                                </div>
                                <div className="column">
                                    <h2>Features in {this.props.user.price_plan.name} plan</h2>
                                    <ul>
                                        {this.props.user.price_plan.keyword_tracking_count == -1 ? null : <li>Rank Tracking: <span>/{this.props.user.price_plan.keyword_tracking_count == 0 ? 'Unlimited' : this.props.user.price_plan.keyword_tracking_count}</span> </li>}
                                        <li>Website Monitoring: <span>/{this.props.user.price_plan.web_monitor_count}</span></li>
                                        <li>Weather Alerts: <span>/{this.props.user.price_plan.owm_city_count == 0 ? 'Unlimited' : (this.props.user.price_plan.owm_city_count > 0 ? this.props.user.price_plan.owm_city_count : 0)}</span></li>
                                        <li>News Alerts: <span>/{this.props.user.price_plan.google_alert_keyword_count == 0 ? 'Unlimited' : (this.props.user.price_plan.google_alert_keyword_count > 0 ? this.props.user.price_plan.google_alert_keyword_count : 0)}</span></li>
                                        <li>Retail Marketing Dates: <span>∞</span></li>
                                        <li>Google Updates: <span>∞</span></li>
                                        <li>WordPress Updates: <span>∞</span></li>
                                        <li>Holidays: <span>∞</span></li>
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
                </Container>
            </div>
        );
    }


}
