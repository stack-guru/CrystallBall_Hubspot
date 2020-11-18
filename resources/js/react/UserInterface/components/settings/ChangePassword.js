import React from 'react';
import CCDetector from "../../utils/CreditCardDetector";
import HttpClient from "../../utils/HttpClient";
import {toast} from "react-toastify";
export default class ChangePassword extends React.Component{

    constructor(props) {
        super(props);
        this.state={
            passwords:{
                prePassword:'',
                password:'',
                rPassword:'',
            },
            isDirty:false,
            isBusy:false,
            errors:'',
            validation:'',
        }
        this.changeHandler = this.changeHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
    }
    componentDidMount() {
        document.title='Change Password'
    }

    changeHandler(e) {
        this.setState({ isDirty: true, passwords: { ...this.state.passwords, [e.target.name]: e.target.value } });
    }

    submitHandler(e){
        e.preventDefault();

        if (this.validate() && !this.state.isBusy) {
            this.setState({isBusy: true});
            HttpClient.post('/settings/change-password', this.state.passwords).then(resp=>{
                console.log(resp.data)
                toast.success(resp.data.message);
                this.setState({isBusy:false});
            },(err)=>{
                console.log(err);
                this.setState({ isBusy: false, errors: (err.response).data });
            }).then(err=>{
                console.log(err);
                this.setState({ isBusy: false, errors: err });
            })
        }

    }

    validate() {
        let prePassword = this.state.passwords.prePassword;
        let password = this.state.passwords.password;
        let rPassword = this.state.passwords.rPassword;


        let errors = {};
        let isValid = true;

        if (!prePassword) {
            isValid = false;
            errors["prePassword"] = "Please enter your last used password.";

        }
        if (!password) {
            isValid = false;
            errors["password"] = "Please enter your new password.";
        }
        if (password!=='' && password.length < 8) {
            isValid = false;
            errors["password"] = "Password can't be less then 8 characters";
        }

        if (!rPassword) {
            isValid = false;
            errors["rPassword"] = "Please re-type your new password.";
        }

        if (rPassword!==password) {
            isValid = false;
            errors["rPassword"] = "Repeat-password should be same as password";
        }

        this.setState({
            validation: errors
        });

        return isValid;
    }

    render() {
        return (
            <div className="container-xl bg-white component-wrapper">
                <div className="row ml-0 mr-0">
                    <div className="col-12">
                        <h3 className="gaa-title">Change Password</h3>
                        {
                            this.state.errors?
                                <span className="text-danger">{this.state.errors}</span>
                                :''
                        }
                        <form onSubmit={this.submitHandler}>
                            <div className="form-group my-3">
                                <label htmlFor="">Previous Password</label>
                                <input type="text" className="form-control" name="prePassword" value={this.state.passwords.prePassword} onChange={this.changeHandler} placeholder="your last used Password" id=""/>
                                {
                                    this.state.validation.prePassword?
                                        <span className="text-danger mt-1">{this.state.validation.prePassword}</span>:''
                                }
                            </div>
                            <div className="form-group my-3">
                                <label htmlFor="">Password</label>
                                <input type="text" className="form-control" name="password" value={this.state.passwords.password} onChange={this.changeHandler} placeholder="New Password" id=""/>
                                {
                                    this.state.validation.password?
                                        <span className="text-danger mt-1">{this.state.validation.password}</span>:''
                                }
                            </div>
                            <div className="form-group my-3">
                                <label htmlFor="">Repeat-Password</label>
                                <input type="text"  className="form-control"  name="rPassword" value={this.state.passwords.rPassword} onChange={this.changeHandler} placeholder="Repeat Password" id=""/>
                                {
                                    this.state.validation.rPassword?
                                        <span className="text-danger mt-1">{this.state.validation.rPassword}</span>:''
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
