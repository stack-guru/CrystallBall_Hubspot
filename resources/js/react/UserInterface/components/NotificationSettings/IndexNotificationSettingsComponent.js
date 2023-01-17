import React, { Component } from 'react'
import { Redirect } from 'react-router';

import HttpClient from "../../utils/HttpClient";

import PhoneVerificationModal from '../../helpers/PhoneVerificationModal';
import ChangePhoneModal from '../../helpers/ChangePhoneModal';
import { getCompanyName } from '../../helpers/CommonFunctions';
import { Button, Container } from 'reactstrap';

export default class IndexNotificationSettings extends Component {

    constructor(props) {
        super(props)

        this.state = {
            notification_settings: [],
            redirectTo: null,
            showPhoneVerificationModal: false,
            showChangePhoneModal: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.sendVerificationEmail = this.sendVerificationEmail.bind(this);
        this.showPricePlanModal = this.showPricePlanModal.bind(this);
    }


    componentDidMount() {
        document.title = "Notifications";

        HttpClient.get(`/notification-setting`)
            .then(response => {
                this.setState({ notification_settings: response.data.notification_settings });
            }, (err) => {
                this.setState({ errors: (err.response).data });
            }).catch(err => {
                this.setState({ errors: err });
            });

        if (!this.props.user.price_plan.has_notifications) {
            setTimeout(this.showPricePlanModal, 5000);
        }

    }

    showPricePlanModal() {
        const accountNotLinkedHtml = '' +
            '<div class="">' +
            '<img src="/images/notification-upgrade-modal.jpg" class="img-fluid">' +
            '</div>'

        swal.fire({
            html: accountNotLinkedHtml,
            width: 700,
            customClass: {
                popup: 'bg-light-red pb-5',
                htmlContainer: 'm-0',
            },
            confirmButtonClass: "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
            confirmButtonText: "Upgrade Now" + "<i class='ml-2 fa fa-caret-right'> </i>",

        }).then(value => {
            this.setState({ redirectTo: '/settings/price-plans' });
        });
    }

    handleChange(e) {
        if (e.target.checked && !this.props.user.price_plan.has_notifications) {
            this.showPricePlanModal();
        } else {
            if (e.target.checked) {
                switch (e.target.getAttribute('notification-setting-name')) {
                    case 'web_monitors':
                        if (!this.props.user.is_ds_web_monitors_enabled) {
                            swal.fire("Activate the Automation", "To receive notifications, you need to activate and configure Website Monitoring on the automation page.", "info");
                        }
                        break;
                    case 'google_alerts':
                        if (!this.props.user.is_ds_google_alerts_enabled) {
                            swal.fire("Activate the Automation", "To receive notifications, you need to activate and configure News Alerts on the automation page.", "info");
                        }
                        break;
                }
                if (e.target.name == 'is_enabled') {
                    beamsClient.start()
                        .then(() => beamsClient.setUserId(this.props.user.id.toString(), window.beamsTokenProvider))
                        .catch((e) => {
                            console.error(e);
                            if (e.name == "NotAllowedError") {
                                swal.fire("Browser Notifications", "You need to allow push notifications inorder to receive browser notifcations from " + getCompanyName() + ".", "warning");
                            }
                        });

                }
            }

            HttpClient.put(`/notification-setting/` + e.target.getAttribute('notification-setting-id'), { [e.target.name]: e.target.checked })
                .then(response => {
                    let notificationSettings = this.state.notification_settings.map(nS => { if (nS.id == response.data.notification_setting.id) { return response.data.notification_setting; } else { return nS; } })
                    this.setState({ notification_settings: notificationSettings });
                }, (err) => {
                    this.setState({ errors: (err.response).data });
                }).catch(err => {
                    this.setState({ errors: err });
                });
        }
    }

    sendVerificationEmail() {
        HttpClient({ method: 'POST', url: '/email/resend', baseURL: "/", data: { email: this.props.user.email } })
            .then(response => {
                swal.fire('Verify Email', 'An email has been sent to your email address for verification.', 'info');
            }, (err) => {
                this.setState({ errors: (err.response).data });
            }).catch(err => {
                this.setState({ errors: err });
            });
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />
        return (
            <div id="notificationPage" className="notificationPage pageWrapper">
                <Container id="inputs">
                    <div className="pageHeader notificationPageHead">
                        <div className="d-flex justify-content-between">
                            <div className='d-flex flex-column'>
                                <h2 className="pageTitle mb-0">Notifications</h2>
                                <p className='mt-3 mb-0'>Set notifications you want to receive for each app</p>
                            </div>
                            {this.props.user.phone_verified_at == null && this.props.user.phone_number ? <Button className='btn-theme-outline bg-white' onClick={() => { this.setState({ showPhoneVerificationModal: true }); }}><i><img src={'/icon-phone.svg'} /></i><span>Verify now</span></Button> : null}
                            {this.props.user.phone_number !== null ? <Button className='btn-theme-outline bg-white' onClick={() => { this.setState({ showChangePhoneModal: true }); }}><i><img src={'/icon-phone.svg'} /></i><span>Change Phone Number</span></Button> : <Button className='btn-theme-outline bg-white' onClick={() => { this.setState({ showChangePhoneModal: true }); }}><i><img src={'/icon-phone.svg'} /></i><span>Add Phone Number</span></Button>}
                        </div>
                    </div>

                    <div className="dataTable dataTableNotifiction d-flex flex-column">
                        <div className="dataTableHolder text-center">
                            <div className="tableHead singleRow justify-content-between align-items-center">
                                <div className="singleCol text-left">&nbsp;</div>
                                <div className="singleCol text-left">Event day</div>
                                <div className="singleCol text-left">1 Days Before</div>
                                <div className="singleCol text-left">7 Days Before</div>
                            </div>
                            <div className="tableBody">
                                {this.state.notification_settings.map(notificationSetting => {
                                    return (
                                        <div key={notificationSetting.id} className="singleRow justify-content-between align-items-stretch">
                                            <div className="singleCol text-left d-flex align-items-center justify-content-start">
                                                <label className="themeSwitch">
                                                    <input type="checkbox"
                                                        checked={notificationSetting.is_enabled}
                                                        onChange={this.handleChange}
                                                        notification-setting-id={notificationSetting.id}
                                                        notification-setting-name={notificationSetting.name}
                                                        name="is_enabled"
                                                    />
                                                    <span className="themeSlider round" />
                                                </label>
                                                <span>{notificationSetting.label}</span>
                                            </div>
                                            <div className="singleCol text-left d-flex flex-column">
                                                {notificationSetting.browser_notification_on_event_day !== -1 ? <label className='d-flex align-items justify-content-end serviceCheckBox'>
                                                    <input name="browser_notification_on_event_day" notification-setting-id={notificationSetting.id} notification-setting-name={notificationSetting.name} onChange={this.handleChange} type="checkbox" checked={notificationSetting.browser_notification_on_event_day} />
                                                    <span>Push</span>
                                                </label> : null}
                                                {notificationSetting.sms_on_event_day !== -1 ? <label className='d-flex align-items justify-content-end serviceCheckBox'>
                                                    <input name="sms_on_event_day" notification-setting-id={notificationSetting.id} notification-setting-name={notificationSetting.name} onChange={this.handleChange} type="checkbox" checked={notificationSetting.sms_on_event_day} />
                                                    <span>SMS</span>
                                                </label>
                                                    : null}
                                                {notificationSetting.email_on_event_day !== -1 ? <label className='d-flex align-items justify-content-end serviceCheckBox'>
                                                    <input name="email_on_event_day" notification-setting-id={notificationSetting.id} notification-setting-name={notificationSetting.name} onChange={this.handleChange} type="checkbox" checked={notificationSetting.email_on_event_day} />
                                                    <span>Email</span>
                                                </label> : null}
                                            </div>
                                            <div className="singleCol text-left">
                                                {notificationSetting.email_one_days_before !== -1 ? <label className='d-flex align-items justify-content-end serviceCheckBox'>
                                                    <input name="email_one_days_before" notification-setting-id={notificationSetting.id} notification-setting-name={notificationSetting.name} onChange={this.handleChange} type="checkbox" checked={notificationSetting.email_one_days_before} />
                                                    <span>&nbsp;</span>
                                                </label>
                                                    : null}
                                            </div>
                                            <div className="singleCol text-left">
                                                {notificationSetting.email_seven_days_before !== -1 ? <label className='d-flex align-items justify-content-end serviceCheckBox'>
                                                    <input name="email_seven_days_before" notification-setting-id={notificationSetting.id} notification-setting-name={notificationSetting.name} onChange={this.handleChange} type="checkbox" checked={notificationSetting.email_seven_days_before} />
                                                    <span>&nbsp;</span>
                                                </label> : null}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <PhoneVerificationModal show={this.state.showPhoneVerificationModal} phoneNumber={this.props.user.phone_number} toggleCallback={() => { this.setState({ showPhoneVerificationModal: !this.state.showPhoneVerificationModal }); this.props.reloadUser(); }} />
                    <ChangePhoneModal show={this.state.showChangePhoneModal} toggleCallback={() => { this.setState({ showChangePhoneModal: false, showPhoneVerificationModal: true }); this.props.reloadUser(); }} />

                </Container>


                {/* <p>{this.props.user.email_verified_at == null ? <button className="btn btn-sm btn-success p-3 mr-2" onClick={this.sendVerificationEmail}>Verify now</button> : null}<strong>Email:</strong> {this.props.user.email} </p>
                                <p>{this.props.user.phone_verified_at == null && this.props.user.phone_number ? <button className="btn btn-sm btn-success p-3 mr-2" onClick={() => { this.setState({ showPhoneVerificationModal: true }); }}>Verify now</button> : null}<strong>Phone Number:</strong> {this.props.user.phone_number !== null ? this.props.user.phone_number : <button className="btn btn-sm gaa-btn-primary" onClick={() => { this.setState({ showChangePhoneModal: true }); }}>Add Phone Number</button>}</p> */}


            </div>
        );
    }
}
