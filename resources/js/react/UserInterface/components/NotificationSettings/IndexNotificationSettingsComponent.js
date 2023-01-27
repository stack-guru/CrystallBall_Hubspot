import React, { Component } from 'react'
import { Redirect } from 'react-router';

import HttpClient from "../../utils/HttpClient";

import PhoneVerificationModal from '../../helpers/PhoneVerificationModal';
import ChangePhoneModal from '../../helpers/ChangePhoneModal';
import { getCompanyName } from '../../helpers/CommonFunctions';
import { Container } from 'reactstrap';

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
            '<img src="/images/notification-upgrade-modal.png" class="img-fluid">' +
            '</div>'

        swal.fire({
            html: accountNotLinkedHtml,
            width: 1000,
            showCancelButton: true,
            showCloseButton: true,
            customClass: {
                popup: "themePlanAlertPopup",
                htmlContainer: "themePlanAlertPopupContent",
                closeButton: 'btn-closeplanAlertPopup',
            },
            cancelButtonClass: "btn-bookADemo",
            cancelButtonText: "Book a Demo",
            confirmButtonClass: "btn-subscribeNow",
            confirmButtonText: "Subscribe now",

        }).then(value => {
            if (value.isConfirmed) window.location.href = '/settings/price-plans'
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
                            {/* {this.props.user.phone_verified_at == null && this.props.user.phone_number ? <button className='btn-theme-outline bg-white' onClick={() => { this.setState({ showPhoneVerificationModal: true }); }}><i><img src={'/icon-phone.svg'} /></i><span>Verify now</span></button> : null} */}
                            {this.props.user.phone_number !== null ? <button className={`btn-theme-outline bg-white ${this.props.user.phone_verified_at == null ? "show-phone-un-verification-badge" : ""}`} onClick={() => { this.setState({ showChangePhoneModal: true }); }}><i><img src={'/icon-phone.svg'} /></i><span>Update Phone Number</span></button> : <button className='btn-theme-outline bg-white' onClick={() => { this.setState({ showChangePhoneModal: true }); }}><i><img src={'/icon-phone.svg'} /></i><span>Add Phone Number</span></button>}
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
                    <ChangePhoneModal phoneNumber={this.props.user.phone_number} reloadUser={this.props.reloadUser} show={this.state.showChangePhoneModal} toggleCallback={() => { this.setState({ showChangePhoneModal: false, showPhoneVerificationModal: false }); this.props.reloadUser(); }} />
                </Container>
            </div>
        );
    }
}
