import React from 'react';
import CCDetector from "../../utils/CreditCardDetector";
import HttpClient from "../../utils/HttpClient";
import { toast } from "react-toastify";
import ErrorAlert from '../../utils/ErrorAlert';
export default class ChangePassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            passwords: {
                old_password: '',
                new_password: '',
                new_password_confirmation: '',
            },
            isDirty: false,
            isBusy: false,
            errors: '',
            validation: '',
        }
        this.changeHandler = this.changeHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
        this.setDefaultState = this.setDefaultState.bind(this)
    }
    componentDidMount() {
        document.title = 'Change Password'
    }

    changeHandler(e) {
        this.setState({ isDirty: true, passwords: { ...this.state.passwords, [e.target.name]: e.target.value } });
    }

    submitHandler(e) {
        e.preventDefault();

        if (this.validate() && !this.state.isBusy) {
            this.setState({ isBusy: true });
            HttpClient.post('/settings/change-password', this.state.passwords).then(resp => {
                toast.success("Password changed successfully.");
                this.setDefaultState();
                this.setState({ isBusy: false });

            }, (err) => {
                console.log(err);
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                console.log(err);
                this.setState({ isBusy: false, errors: err });
            })
        }

    }

    validate() {
        let old_password = this.state.passwords.old_password;
        let new_password = this.state.passwords.new_password;
        let new_password_confirmation = this.state.passwords.new_password_confirmation;


        let errors = {};
        let isValid = true;

        if (!old_password) {
            isValid = false;
            errors["old_password"] = "Please enter your last used password.";

        }
        if (!new_password) {
            isValid = false;
            errors["new_password"] = "Please enter your new password.";
        }
        if (new_password !== '' && new_password.length < 8) {
            isValid = false;
            errors["new_password"] = "Password can't be less then 8 characters";
        }

        if (!new_password_confirmation) {
            isValid = false;
            errors["new_password_confirmation"] = "Please re-type your new password.";
        }

        if (new_password_confirmation !== new_password) {
            isValid = false;
            errors["new_password_confirmation"] = "Repeat password should be same as new password";
        }

        this.setState({
            validation: errors
        });

        return isValid;
    }

    setDefaultState() {
        this.setState({
            passwords: {
                old_password: '',
                new_password: '',
                new_password_confirmation: '',
            },
            validation: {},
            isBusy: false,
            isDirty: false,
            errors: undefined
        });
    }

    render() {
        return (
            <div className="container-xl bg-white component-wrapper">
                <div className="row ml-0 mr-0">
                    <div className="col-12">
                        <h3 className="gaa-title">Change Password</h3>
                        <div className="row ml-0 mr-0">
                            <div className="col-md-12">
                                <ErrorAlert errors={this.state.errors} />
                            </div>
                        </div>
                        <form onSubmit={this.submitHandler}>
                            <div className="form-group my-3">
                                <label htmlFor="">Previous Password</label>
                                <input type="text" className="form-control" name="old_password" value={this.state.passwords.old_password} onChange={this.changeHandler} placeholder="old password" id="" />
                                {
                                    this.state.validation.old_password ?
                                        <span className="text-danger mt-1">{this.state.validation.old_password}</span> : ''
                                }
                            </div>
                            <div className="form-group my-3">
                                <label htmlFor="">Password</label>
                                <input type="text" className="form-control" name="new_password" value={this.state.passwords.new_password} onChange={this.changeHandler} placeholder="New Password" id="" />
                                {
                                    this.state.validation.new_password ?
                                        <span className="text-danger mt-1">{this.state.validation.new_password}</span> : ''
                                }
                            </div>
                            <div className="form-group my-3">
                                <label htmlFor="">Repeat-Password</label>
                                <input type="text" className="form-control" name="new_password_confirmation" value={this.state.passwords.new_password_confirmation} onChange={this.changeHandler} placeholder="Repeat Password" id="" />
                                {
                                    this.state.validation.new_password_confirmation ?
                                        <span className="text-danger mt-1">{this.state.validation.new_password_confirmation}</span> : ''
                                }
                            </div>
                            <div className="row ml-0 mr-0 my-3">
                                <div className="col-12 text-right p-0">
                                    <button className="btn btn-primary">Reset</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }


}
