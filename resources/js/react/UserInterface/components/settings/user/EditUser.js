import React, { Component } from 'react'
import { toast } from 'react-toastify'

import HttpClient from '../../../utils/HttpClient'
import ErrorAlert from '../../../utils/ErrorAlert'

export default class EditUser extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: {}
        }
        this.changeHandler = this.changeHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)

    }

    componentDidMount() {
        if (this.props.routeParams.match.params.id) {
            let userId = this.props.routeParams.match.params.id;
            HttpClient.get(`/settings/user/${userId}`)
                .then(response => {
                    this.setState({ user: response.data.user });
                }, (err) => {
                    console.log(err);
                    this.setState({ errors: (err.response).data });
                }).catch(err => {
                    console.log(err)
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
                toast.success("User updated.");
            }, (err) => {
                console.log(err);
                this.setState({ errors: (err.response).data });
            }).catch(err => {
                console.log(err)
                this.setState({ errors: err });
            });
    }

    render() {
        return (
            <div className="container-xl bg-white  component-wrapper" >
                <section className="ftco-section" id="buttons">
                    <div className="container">
                        <div className="row mb-5">
                            <div className="col-md-12">
                                <h2 className="heading-section gaa-title">Edit User</h2>
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
                                            <option value="user">User</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group ">
                                        <label htmlFor="department" className="form-control-placeholder">Department</label>
                                        <input type="text" onChange={this.changeHandler} value={this.state.user.department} className="form-control" id="department" name="department" />
                                    </div>
                                </div>

                            </div>
                            <div className="row ml-0 mr-0 mt-3 mt-sm-3 mt-md-1 mt-lg-1">
                                <div className="col-12 text-right pr-0">
                                    <button type="submit" className="btn btn-primary btn-fab btn-round" title="submit">
                                        <i className="fa fa-floppy-o mr-1"></i>Save
                                        </button>
                                </div>
                            </div>
                        </form>

                    </div>
                </section>
            </div>
        );
    }

}