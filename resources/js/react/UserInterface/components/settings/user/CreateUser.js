import React, { Component } from 'react'
import { toast } from 'react-toastify'
import { Redirect } from 'react-router-dom'

import ErrorAlert from '../../../utils/ErrorAlert'
import HttpClient from '../../../utils/HttpClient'
import GoogleAnalyticsAccountSelect from "../../../utils/GoogleAnalyticsAccountSelect";

export default class CreateUser extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: {
                name: '', email: '', password: '', password_confirmation: '', user_level: 'admin', department: '',
                google_analytics_account_id: [""]
            },
            errors: undefined,
            redirectTo: null
        }
        this.changeHandler = this.changeHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
        this.setDefaultState = this.setDefaultState.bind(this)
    }

    componentDidMount(){
        document.title = 'User Accounts';
    }

    setDefaultState() {
        this.setState({
            user: {
                name: '', email: '', password: '', password_confirmation: '', user_level: 'admin', department: ''
            },
            errors: undefined,
            redirectTo: null
        });
    }


    changeHandler(e) {
        this.setState({ user: { ...this.state.user, [e.target.name]: e.target.value } });
    }
    submitHandler(e) {
        e.preventDefault();

        HttpClient.post(`/settings/user`, this.state.user)
            .then(response => {
                toast.success("New user added.");
                this.setState({ redirectTo: "/settings/user" })
            }, (err) => {
                console.log(err);
                this.setState({ errors: (err.response).data });
            }).catch(err => {
                console.log(err)
                this.setState({ errors: err });
            });
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />
        return (
            <div className="container-xl bg-white  component-wrapper" >
                <section className="ftco-section" id="buttons">
                    <div className="container">
                        <div className="row mb-5">
                            <div className="col-md-12">
                                <h2 className="heading-section gaa-title">Add User</h2>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <ErrorAlert errors={this.state.errors} />
                            </div>
                        </div>

                        <form onSubmit={this.submitHandler}>
                            <div className="row">

                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group">
                                        <label htmlFor="name" className="form-control-placeholder">Name</label>
                                        <input type="text" className="form-control" value={this.state.user.name} onChange={this.changeHandler} id="name" name="name" />
                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group">
                                        <label htmlFor="email" className="form-control-placeholder">Email</label>
                                        <input type="text" className="form-control" value={this.state.user.email} onChange={this.changeHandler} id="email" name="email" />
                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group">
                                        <label htmlFor="password" className="form-control-placeholder">Password</label>
                                        <input type="password" className="form-control" value={this.state.user.password} onChange={this.changeHandler} id="password" name="password" />
                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group">
                                        <label htmlFor="password_confirmation" className="form-control-placeholder">Password Confirmation</label>
                                        <input type="password" className="form-control" value={this.state.user.password_confirmation} onChange={this.changeHandler} id="password_confirmation" name="password_confirmation" />
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group">
                                        <label htmlFor="user_level" className="form-control-placeholder">User Level</label>
                                        <select name="user_level" className="form-control" onChange={this.changeHandler}>
                                            <option value="admin">Admin</option>
                                            <option value="team">Team Member</option>
                                            <option value="viewer">Viewer</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group ">
                                        <label htmlFor="department" className="form-control-placeholder">Department</label>
                                        <input type="text" onChange={this.changeHandler} value={this.state.user.department} className="form-control" id="department" name="department" />
                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group ">
                                        <label htmlFor="show_at" className="form-control-placeholder">Google Accounts</label>
                                        <GoogleAnalyticsAccountSelect name="google_analytics_account_id" id="google_analytics_account_id" value={this.state.user.google_analytics_account_id} onChangeCallback={this.changeHandler} placeholder="Select GA Accounts" multiple></GoogleAnalyticsAccountSelect>

                                    </div>
                                </div>
                            </div>
                            <div className="row ml-0 mr-0 mt-3 mt-sm-3 mt-md-1 mt-lg-1">
                                <div className="col-12 text-right pr-0">
                                    <button type="submit" className="btn btn-primary btn-fab btn-round" title="submit">Save & Send Invitation</button>
                                </div>
                            </div>
                        </form>

                    </div>
                </section>
            </div>
        )
    }

}