import React, { Component } from 'react'
import HttpClient from "../../utils/HttpClient";

export default class IndexNotificationSettings extends Component {

    constructor(props) {
        super(props)

        this.state = {
            notification_settings: []
        }

        this.handleChange = this.handleChange.bind(this);
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
    }

    handleChange(e) {
        if (e.target.checked) {
            switch (e.target.getAttribute('notification-setting-name')) {
                case 'web_monitors':
                    if (!this.props.user.is_ds_web_monitors_enabled) {
                        swal("Configure Data Source for this Notification", "You must configure web monitors in data sources page before you configure notifications for them.", "info");
                    }
                    break;
                case 'google_alerts':
                    if (!this.props.user.is_ds_google_alerts_enabled) {
                        swal("Configure Data Source for this Notification", "You must configure news alert tags in data sources page before you configure notifications for them.", "info");
                    }
                    break;
            }
            if (e.target.name == 'is_enabled') {
                beamsClient.start()
                    .then(() => beamsClient.setUserId(this.props.user.id.toString(), beamsTokenProvider))
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

    render() {
        return (
            <div className="container-xl bg-white anno-container  d-flex flex-column justify-content-center component-wrapper" >
                <section className="ftco-section" id="inputs">
                    <div className="container-xl p-0">
                        <div className="row ml-0 mr-0 mb-1">
                            <div className="col-md-12">
                                <h2 className="heading-section gaa-title">Notifications</h2>
                            </div>
                        </div>
                        <div id="annotation-index-container">
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
