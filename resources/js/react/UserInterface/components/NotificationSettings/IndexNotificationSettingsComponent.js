import React, { Component } from 'react'
import HttpClient from "../../utils/HttpClient";

export default class IndexNotificationSettings extends Component {
    
    constructor(props) {
        super(props)
    
        this.state = {
             notification_settings: []
        }
    }
    

    componentDidMount(){
        HttpClient.get(`/notification-setting`)
        .then(response => {
            this.setState({ notification_settings: response.data.notification_settings});
        }, (err) => {
            this.setState({ errors: (err.response).data });
        }).catch(err => {
            this.setState({ errors: err });
        });
    }
    
    render(){
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
                                                    <th colSpan="3">Email</th>
                                                    <th>Browser Notification</th>
                                                    <th>SMS</th>
                                                </tr>
                                                <tr>
                                                    <th></th>
                                                    <th></th>
                                                    <th>7 Days Before</th>
                                                    <th>1 Days Before</th>
                                                    <th>Event day</th>
                                                    <th>Event day</th>
                                                    <th>Event day</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.notification_settings.map(notificationSetting => {
                                                    return (<tr>
                                                        <td>
                                                            <label className="trigger switch">
                                                                <input type="checkbox"
                                                                    checked={notificationSetting.is_enabled}
                                                                    onChange={() => {}}
                                                                />
                                                                <span className="slider round" />
                                                            </label>
                                                        </td>
                                                        <td className="text-left">{notificationSetting.label}</td>
                                                        <td>{notificationSetting.email_seven_days_before !== -1 ?<input type="checkbox" checked={notificationSetting.email_seven_days_before} /> : null}</td>
                                                        <td>{notificationSetting.email_one_days_before !== -1 ?<input type="checkbox" checked={notificationSetting.email_one_days_before} /> : null}</td>
                                                        <td>{notificationSetting.email_on_event_day !== -1 ?<input type="checkbox" checked={notificationSetting.email_on_event_day} /> : null}</td>
                                                        <td>{notificationSetting.browser_notification_on_event_day !== -1 ?<input type="checkbox" checked={notificationSetting.browser_notification_on_event_day} /> : null}</td>
                                                        <td>{notificationSetting.sms_on_event_day !== -1 ?<input type="checkbox" checked={notificationSetting.sms_on_event_day} /> : null}</td>
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
