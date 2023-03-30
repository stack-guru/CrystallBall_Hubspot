import React, {Component} from 'react'
import Toast from "../../../utils/Toast";
import {Redirect} from 'react-router-dom'

import ErrorAlert from '../../../utils/ErrorAlert'
import HttpClient from '../../../utils/HttpClient'
import GoogleAnalyticsAccountSelect from "../../../utils/GoogleAnalyticsAccountSelect";
import UserTeamNameSelect from "../../../utils/UserTeamNameSelect";
import SpinningLoader from '../../../utils/SpinningLoader'
import {Button} from 'reactstrap';
import CreatableSelect from "react-select/creatable";

export default class CreateUser extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: {
                name: '', email: '', password: '', password_confirmation: '', user_level: 'admin', department: '',
                google_analytics_account_id: [""], team_name: ""
            },
            errors: undefined,
            redirectTo: null,
            showConfirmPassword: false,
            showPassword: false,
            departmentNames: [],

        }
        this.changeHandler = this.changeHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
        this.setDefaultState = this.setDefaultState.bind(this)
        this.getUsers = this.getUsers.bind(this)
    }

    componentDidMount() {
        document.title = 'User Accounts';
        this.getUsers();
    }

    setDefaultState() {
        this.setState({
            user: {
                name: '', email: '', password: '', password_confirmation: '', user_level: 'admin', department: '',
                team_name: ""
            },
            errors: undefined,
            redirectTo: null,
            loading: false
        });
    }


    changeHandler(e) {
        this.setState({user: {...this.state.user, [e.target.name]: e.target.value}});
    }

    getUsers() {
        HttpClient.get(`/settings/user`)
            .then(
                (response) => {
                    // filter out unique department names from response.data.users
                    let departmentNames = response.data.users.map(user => user.department).filter((value, index, self) => self.indexOf(value) === index);
                    this.setState({ departmentNames: departmentNames.map(tN => { return { label: tN, value: tN } }) });
                },
                (err) => {
                    this.setState({ errors: err.response.data });
                }
            )
            .catch((err) => {
                this.setState({ errors: err });
            });
    }

    submitHandler(e) {
        e.preventDefault();
        this.setState({loading: true});
        HttpClient.post(`/settings/user`, this.state.user)
            .then(response => {
                Toast.fire({
                    icon: 'success',
                    title: "New user added.",
                });

                this.setState({loading: false}, () => {
                    this.setDefaultState();
                });

                if(!this.props.userStartupConfig) {
                    // this.setState({redirectTo: "/settings/user"})
                    this.props.getUsers();
                    this.props.toggle();
                }
            }, (err) => {
                this.setState({loading: false});
                this.setState({errors: (err.response).data});
            }).catch(err => {
            this.setState({loading: false});
            this.setState({errors: err});
        });
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo}/>
        return (
            <div className="apps-bodyContent">
                <form onSubmit={this.submitHandler} id="create-user-form">
                    <ErrorAlert errors={this.state.errors}/>
                    <div className='grid2layout'>
                        <div className="themeNewInputStyle">
                            <input type="text" className="form-control" placeholder='Full name'
                                   value={this.state.user.name} onChange={this.changeHandler} id="name" name="name"/>
                        </div>

                        <div className="themeNewInputStyle">
                            <input type="email" className="form-control" placeholder='Email'
                                   value={this.state.user.email} onChange={this.changeHandler} id="email" name="email"/>
                        </div>
                    </div>

                    {/* <div className='grid2layout'>
                        <div className="themeNewInputStyle position-relative inputWithIcon">
                            <span className="fa cursor-pointer"
                                  onClick={() => this.setState({showPassword: !this.state.showPassword})}>{this.state.showPassword ?
                                <img src={"/icon-eye-close.svg"}/> : <img src={"/icon-eye-open.svg"}/>}</span>
                            <input type={this.state.showPassword ? "text" : "password"} className="form-control"
                                   placeholder='Password' value={this.state.user.password} onChange={this.changeHandler}
                                   id="password" name="password"/>
                        </div>

                        <div className="themeNewInputStyle position-relative inputWithIcon">
                            <span className="fa cursor-pointer"
                                  onClick={() => this.setState({showConfirmPassword: !this.state.showConfirmPassword})}>{this.state.showConfirmPassword ?
                                <img src={"/icon-eye-close.svg"}/> : <img src={"/icon-eye-open.svg"}/>}</span>
                            <input type={this.state.showConfirmPassword ? "text" : "password"} className="form-control"
                                   placeholder='Confirm password' value={this.state.user.password_confirmation}
                                   onChange={this.changeHandler} id="password_confirmation"
                                   name="password_confirmation"/>
                        </div>
                    </div> */}

                    <div className='grid2layout'>
                        <div className="themeNewInputStyle">
                            <select name="user_level" className="form-control" placeholder='User level'
                                    onChange={this.changeHandler} value={this.state.user.user_level}>
                                <option value="admin">Admin</option>
                                <option value="team">Read & Write</option>
                                <option value="viewer">Read</option>
                            </select>
                        </div>

                        <div className="themeNewInputStyle">
                            {/*<input type="text" onChange={this.changeHandler} value={this.state.user.department}
                                   className="form-control" placeholder='Department' id="department" name="department"/>*/}
                            <CreatableSelect
                                name={"department"}
                                disabled={false}
                                value={this.state.user.department ? { label: this.state.user.department, value: this.state.user.department }: []}
                                id={"department"}
                                isMulti={false}
                                onChange={(sOption) => {
                                    this.changeHandler({ target: { name: 'department', value: sOption.value } });
                                }}
                                options={this.state.departmentNames}
                                placeholder={"Department"}
                            >
                            </CreatableSelect>
                        </div>
                    </div>

                    <div className='grid2layout'>
                        <div className="themeNewInputStyle">
                            <GoogleAnalyticsAccountSelect name="google_analytics_account_id"
                                                          id="google_analytics_account_id"
                                                          value={this.state.user.google_analytics_account_id}
                                                          onChangeCallback={this.changeHandler}
                                                          placeholder="Select Properties"
                                                          multiple></GoogleAnalyticsAccountSelect>
                        </div>

                        <div className="themeNewInputStyle">
                            <UserTeamNameSelect name="team_name" id="team_name" value={this.state.user.team_name}
                                                onChangeCallback={this.changeHandler}
                                                placeholder="Team"></UserTeamNameSelect>
                        </div>
                    </div>

                    <div
                        className={`d-flex ${this.props.userStartupConfig ? 'justify-content-between align-items-center' : 'pt-3'}`}>
                        {/* <button type="submit" className="btn-cancel mr-3" title="submit">Cancel</button> */}
                        {/* <button type="submit" className="btn-theme mr-3" title="submit">Add</button> */}
                        {this.props.userStartupConfig ? <>
                            <Button onClick={() => {
                                this.props.skipInvite();
                                // this.recordStepResponse('IMPORT_OLD_ANNOTATIONS', false);
                                // this.incrementStep(1)
                            }} className="btn-cancel">Skip this</Button>
                        </> : null}
                        <button type="submit" disabled={this.state.loading} className="btn-theme"
                                title="submit">{this.state.loading ?
                            <SpinningLoader/> : "Save & Send Invitation"}</button>
                    </div>
                </form>
            </div>
        )
    }

}
