import React, { Component } from 'react'
import { Redirect } from 'react-router';
import HttpClient from "../../utils/HttpClient";

export default class IndexNotificationSettings extends Component {

    constructor(props) {
        super(props)

        this.state = {
            notification_settings: [],
            redirectTo: null,
        }

        this.handleChange = this.handleChange.bind(this);
        this.sendVerificationEmail = this.sendVerificationEmail.bind(this);
        this.sendVerificationPhone = this.sendVerificationPhone.bind(this);
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
            swal("Upgrade Your Plan!", "Notifications feature is not available in this plan.", "warning").then((b) => {
                this.setState({ redirectTo: '/settings/price-plans' });
            });
        }

    }

    handleChange(e) {
        if (e.target.checked) {
            switch (e.target.getAttribute('notification-setting-name')) {
                case 'web_monitors':
                    if (!this.props.user.is_ds_web_monitors_enabled) {
                        swal("Activate the Automation", "To receive notifications, you need to activate and configure Website Monitoring on the automation page first.", "info");
                    }
                    break;
                case 'google_alerts':
                    if (!this.props.user.is_ds_google_alerts_enabled) {
                        swal("Activate the Automation", "To receive notifications, you need to activate and configure News Alerts on the automation page first.", "info");
                    }
                    break;
            }
            if (e.target.name == 'is_enabled') {
                beamsClient.start()
                    .then(() => beamsClient.setUserId(this.props.user.id.toString(), window.beamsTokenProvider))
                    .catch((e) => {
                        console.error(e);
                        if (e.name == "NotAllowedError") {
                            swal("Browser Notifications", "You need to allow push notifications inorder to receive browser notifcations from GAannotations.", "warning");
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

    sendVerificationEmail() {
        HttpClient({ method: 'POST', url: '/email/resend', baseURL: "/", data: { email: this.props.user.email } })
            .then(response => {
                swal('Verify Email', 'An email has been sent to your email address for verification. Please click the link in that email to verify your email.', 'info');
            }, (err) => {
                this.setState({ errors: (err.response).data });
            }).catch(err => {
                this.setState({ errors: err });
            });
    }

    sendVerificationPhone() {
        HttpClient({ method: 'POST', url: '/phone/resend', baseURL: "/", data: { phone: this.props.user.phone_number } })
            .then(response => {
                swal('Verify Phone', 'An phone has been sent to your phone address for verification. Please click the link in that phone to verify your phone.', 'info');
            }, (err) => {
                this.setState({ errors: (err.response).data });
            }).catch(err => {
                this.setState({ errors: err });
            });
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />
        return (
            <div className="container-xl bg-white anno-container  d-flex flex-column justify-content-center component-wrapper" >
                <section className="ftco-section" id="inputs">
                    <div className="container-xl p-0">
                        <div id="notification-settings-container">
                            <div className="row ml-0 mr-0">
                                <div className="offset-8 col-4 text-right">
                                    <p>{this.props.user.email_verified_at == null ? <button className="btn btn-sm btn-success p-3 mr-2" onClick={this.sendVerificationEmail}>Verify now</button> : null}<strong>Email:</strong> {this.props.user.email} </p>
                                    <p>{this.props.user.phone_verified_at == null ? <button className="btn btn-sm btn-success p-3 mr-2" onClick={this.sendVerificationPhone}>Verify now</button> : null}<strong>Phone Number:</strong> {this.props.user.phone_number}</p>
                                </div>
                            </div>
                            <div className="row ml-0 mr-0">
                                <div className="col-12">
                                    <div className="table-responsive">
                                        <table className="table table-hover table-borderless text-center">
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th></th>
                                                    <th>SMS</th>
                                                    <th>Browser Notification</th>
                                                    <th colSpan="3">Email</th>
                                                </tr>
                                                <tr>
                                                    <th></th>
                                                    <th></th>
                                                    <th className="border-top border-bottom dark-gray-border thin-border">Event day</th>
                                                    <th className="border-top border-bottom dark-gray-border thin-border">Event day</th>
                                                    <th className="border-top border-bottom dark-gray-border thin-border">Event day</th>
                                                    <th className="border-top border-bottom dark-gray-border thin-border">1 Days Before</th>
                                                    <th className="border-top border-bottom dark-gray-border thin-border">7 Days Before</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.notification_settings.map(notificationSetting => {
                                                    return (<tr>
                                                        <td>
                                                            <label className="trigger switch">
                                                                <input type="checkbox"
                                                                    checked={notificationSetting.is_enabled}
                                                                    onChange={this.handleChange}
                                                                    notification-setting-id={notificationSetting.id}
                                                                    notification-setting-name={notificationSetting.name}
                                                                    name="is_enabled"
                                                                />
                                                                <span className="slider round" />
                                                            </label>
                                                        </td>
                                                        <td className="text-left">{notificationSetting.label}</td>
                                                        <td className="border-left light-gray-border thin-border">{notificationSetting.sms_on_event_day !== -1 ? <input name="sms_on_event_day" notification-setting-id={notificationSetting.id} notification-setting-name={notificationSetting.name} onChange={this.handleChange} type="checkbox" checked={notificationSetting.sms_on_event_day} /> : null}</td>
                                                        <td className="border-left light-gray-border thin-border">{notificationSetting.browser_notification_on_event_day !== -1 ? <input name="browser_notification_on_event_day" notification-setting-id={notificationSetting.id} notification-setting-name={notificationSetting.name} onChange={this.handleChange} type="checkbox" checked={notificationSetting.browser_notification_on_event_day} /> : null}</td>
                                                        <td className="border-left light-gray-border thin-border">{notificationSetting.email_on_event_day !== -1 ? <input name="email_on_event_day" notification-setting-id={notificationSetting.id} notification-setting-name={notificationSetting.name} onChange={this.handleChange} type="checkbox" checked={notificationSetting.email_on_event_day} /> : null}</td>
                                                        <td>{notificationSetting.email_one_days_before !== -1 ? <input name="email_one_days_before" notification-setting-id={notificationSetting.id} notification-setting-name={notificationSetting.name} onChange={this.handleChange} type="checkbox" checked={notificationSetting.email_one_days_before} /> : null}</td>
                                                        <td className="border-right light-gray-border thin-border">{notificationSetting.email_seven_days_before !== -1 ? <input name="email_seven_days_before" notification-setting-id={notificationSetting.id} notification-setting-name={notificationSetting.name} onChange={this.handleChange} type="checkbox" checked={notificationSetting.email_seven_days_before} /> : null}</td>
                                                    </tr>)
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </section>
            </div >
        );
    }
}
