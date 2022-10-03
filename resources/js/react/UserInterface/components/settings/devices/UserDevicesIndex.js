import React from 'react';
import { toast } from 'react-toastify'
import { Redirect } from "react-router-dom";

import HttpClient from '../../../utils/HttpClient';
import ErrorAlert from '../../../utils/ErrorAlert'


export default class FacebookAccountsIndex extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            errors: [],
            user_active_devices: [],
            user_active_devices_extensions: [],
            devices_count: 0,
            redirectTo: null,
            user: {
                price_plan: {}
            }
        }

        this.getActiveDevices = this.getActiveDevices.bind(this);
        this.getUser = this.getUser.bind(this);

    }

    componentDidMount() {
        document.title = 'Manage User Devices';

        this.getUser();
        this.getActiveDevices();
    }

    render() {
        return (

            <div className="container-xl bg-white  d-flex flex-column justify-content-center component-wrapper" >

                <div className="container p-5">
                    <div className="row ml-0 mr-0 my-5">
                        <div className="col-12">
                            <h2 className="heading-section gaa-title">Manage your active devices/sessions</h2>
                            <p>
                                <b>Credits: </b> {this.state.devices_count}/{this.state.user.price_plan.users_devices_count} <br />
                                <b>Email: </b> {this.state.user.email}
                            </p>
                        </div>
                    </div>

                    <div className="row ml-0 mr-0">
                        <div className="col-12">
                            <ErrorAlert errors={this.state.errors} />
                        </div>
                    </div>
                    <div className="row ml-0 mr-0 pb-2 mb-5">
                        <div className="col-12">
                            <h4>
                                Active Browser Sessions
                            </h4>
                            <div className="table-responsive">
                                <table className="table table-hover gaa-hover table-bordered">
                                    <thead>
                                        <tr>
                                            <th width="20%">Email Account</th>
                                            <th width="20%">Browser Name</th>
                                            <th width="20%">Device Name</th>
                                            <th width="20%">Device Type</th>
                                            <th width="20%">IP Address</th>
                                            <th width="10%">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.user_active_devices.map(user_active_device => {
                                                return <tr key={user_active_device.id}>
                                                    <td>
                                                        {user_active_device.user.name}
                                                    </td>
                                                    <td>
                                                        {user_active_device.browser_name}
                                                    </td>
                                                    <td>
                                                        {user_active_device.platform_name}
                                                    </td>
                                                    <td>
                                                        {user_active_device.device_type}
                                                    </td>
                                                    <td>
                                                        {user_active_device.ip}
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-danger" onClick={() => this.disconnectUserDevice(user_active_device.id)} >Disconnect</button>
                                                    </td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <hr />

                    <div className="row ml-0 mt-5 pt-2 mr-0">
                        <div className="col-12">
                            <h4>
                                Active Extension Sessions
                            </h4>
                            <div className="table-responsive">
                                <table className="table table-hover gaa-hover table-bordered">
                                    <thead>
                                        <tr>
                                            <th width="20%">Email Account</th>
                                            <th width="20%">Browser Name</th>
                                            <th width="20%">Device Name</th>
                                            <th width="20%">Device Type</th>
                                            <th width="20%">IP Address</th>
                                            <th width="10%">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.user_active_devices_extensions.map(user_active_device => {
                                            return <tr key={user_active_device.id}>
                                                <td>
                                                    {user_active_device.user.name}
                                                </td>
                                                <td>
                                                    {user_active_device.browser_name}
                                                </td>
                                                <td>
                                                    {user_active_device.platform_name}
                                                </td>
                                                <td>
                                                    {user_active_device.device_type}
                                                </td>
                                                <td>
                                                    {user_active_device.ip}
                                                </td>
                                                <td>
                                                    <button className="btn btn-danger" onClick={() => this.disconnectUserDevice(user_active_device.id)} >Disconnect</button>
                                                </td>
                                            </tr>
                                        })
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }

    getActiveDevices() {
        this.setState({ isBusy: true })
        HttpClient.get('/settings/user-active-devices').then(resp => {
            this.setState({ user_active_devices: resp.data.user_active_devices_browsers, isBusy: false });
            this.setState({ user_active_devices_extensions: resp.data.user_active_devices_extensions, isBusy: false });
            this.setState({ devices_count: resp.data.user_active_devices_extensions.length + resp.data.user_active_devices_browsers.length, isBusy: false });
        }, (err) => {
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
            this.setState({ isBusy: false, errors: err });
        });
    }

    getUser() {
        this.setState({ isBusy: true })
        HttpClient.get('/user').then(resp => {
            this.setState({ user: resp.data.user, isBusy: false });
        }, (err) => {
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
            this.setState({ isBusy: false, errors: err });
        });
    }


    disconnectUserDevice(device_id) {
        this.setState({ isBusy: true })
        let params = {
            device_id: device_id
        }
        HttpClient.post('/settings/disconnect-user-device', params).then(resp => {
            this.setState({ user_active_devices: resp.data.user_active_devices_browsers, isBusy: false });
            this.setState({ user_active_devices_extensions: resp.data.user_active_devices_extensions, isBusy: false });
        }, (err) => {
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
            this.setState({ isBusy: false, errors: err });
        });
    }

}
