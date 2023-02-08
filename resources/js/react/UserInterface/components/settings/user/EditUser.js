import React, { Component } from 'react'
import Toast from "../../../utils/Toast";

import HttpClient from '../../../utils/HttpClient'
import ErrorAlert from '../../../utils/ErrorAlert'
import GoogleAnalyticsAccountSelect from "../../../utils/GoogleAnalyticsAccountSelect";
import UserTeamNameSelect from "../../../utils/UserTeamNameSelect";

export default class EditUser extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: {
                name: '', email: '', password: '', password_confirmation: '', user_level: 'admin', department: '',
                google_analytics_account_id: [""], team_name: ""
            },
            showConfirmPassword: false,
            showPassword: false,
        }
        this.changeHandler = this.changeHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)

    }

    componentDidMount() {
        document.title = 'Edit User Account';

        if (this.props.editUserId) {
            let userId = this.props.editUserId;
            HttpClient.get(`/settings/user/${userId}`)
                .then(response => {
                    let uGAAIds = response.data.user.user_ga_accounts.map(uGAAA => uGAAA.google_analytics_account_id);
                    if (uGAAIds[0] == null) uGAAIds = [""];
                    this.setState({ user: { ...response.data.user, google_analytics_account_id: uGAAIds } });
                }, (err) => {
                    this.setState({ errors: (err.response).data });
                }).catch(err => {
                    this.setState({ errors: err });
                });
        }
    }


    changeHandler(e) {
        this.setState({ user: { ...this.state.user, [e.target.name]: e.target.value } });
    }

    submitHandler(e) {
        e.preventDefault();

        HttpClient.put(`/settings/user/${this.state.user.id}`, this.state.user)
            .then(response => {
                Toast.fire({
                    icon: 'success',
                    title: "User updated.",
                });
            }, (err) => {
                this.setState({ errors: (err.response).data });
            }).catch(err => {
                this.setState({ errors: err });
            });
    }

    render() {
        return (
            <div className="apps-bodyContent">
                <form onSubmit={this.submitHandler} id="editUserForm">
                    <ErrorAlert errors={this.state.errors} />
                    <div className='grid2layout'>
                        <div className="themeNewInputStyle">
                            <input placeholder='Full name' type="text" className="form-control" value={this.state.user.name} onChange={this.changeHandler} id="name" name="name" />
                        </div>
                        <div className="themeNewInputStyle">
                            <input placeholder='Email' type="text" className="form-control" value={this.state.user.email} onChange={this.changeHandler} id="email" name="email" />
                        </div>
                    </div>
                    <div className='grid2layout'>
                        <div className="themeNewInputStyle position-relative inputWithIcon">
                            <span className="fa cursor-pointer" onClick={() => this.setState({showPassword: !this.state.showPassword})} >{this.state.showPassword ? <img src={"/icon-eye-blue.svg"}/> : <img src={"/icon-eye-close.svg"}/>}</span>
                            <input placeholder='Password' type={this.state.showPassword ? "text" : "password"} className="form-control" value={this.state.user.password} onChange={this.changeHandler} id="password" name="password" />
                        </div>
                        <div className="themeNewInputStyle position-relative inputWithIcon">
                            <span className="fa cursor-pointer" onClick={() => this.setState({showConfirmPassword: !this.state.showConfirmPassword})} >{this.state.showConfirmPassword ? <img src={"/icon-eye-close.svg"}/> : <img src={"/icon-eye-blue.svg"}/>}</span>
                            <input placeholder='Confirm password' type={this.state.showConfirmPassword ? "text" : "password"} className="form-control" value={this.state.user.password_confirmation} onChange={this.changeHandler} id="password_confirmation" name="password_confirmation" />
                        </div>
                    </div>
                    <div className='grid2layout'>
                        <div className="themeNewInputStyle">
                            <select name="user_level" className="form-control" onChange={this.changeHandler} value={this.state.user.user_level}>
                                <option value="admin">Admin</option>
                                <option value="team">Read & Write</option>
                                <option value="viewer">Read</option>
                            </select>
                        </div>
                        <div className="themeNewInputStyle">
                            <input placeholder='Department' type="text" onChange={this.changeHandler} value={this.state.user.department} className="form-control" id="department" name="department" />
                        </div>
                    </div>
                    <div className='grid2layout'>
                        <div className="themeNewInputStyle">
                            <GoogleAnalyticsAccountSelect name="google_analytics_account_id" id="google_analytics_account_id" value={this.state.user.google_analytics_account_id} onChangeCallback={this.changeHandler} placeholder="Select GA Accounts" multiple></GoogleAnalyticsAccountSelect>
                        </div>
                        <div className="themeNewInputStyle">
                            <UserTeamNameSelect name="team_name" id="team_name" value={this.state.user.team_name} onChangeCallback={this.changeHandler} placeholder="Select Team or Create"></UserTeamNameSelect>
                        </div>
                    </div>
                    <div className="d-flex pt-3">
                        <button type="submit" className="btn-theme" title="submit">Save</button>
                    </div>
                </form>
            </div>
        );
    }

}
