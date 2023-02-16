import React from 'react'
import HttpClient from '../utils/HttpClient'
import Toast from "../utils/Toast";
import ErrorAlert from '../utils/ErrorAlert';
import { loadStateFromLocalStorage, saveStateToLocalStorage, removeStateFromLocalStorage } from '../helpers/CommonFunctions';
import ModalHeader from '../components/AppsMarket/common/ModalHeader';
import { Redirect } from 'react-router';

export default class AddNewPasswordModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                name: '',
                password: '',
                password_confirmation: '',
            },
            validation: {},
            resp: '',
            error: '',
            isBusy: false,
            isDirty: false,
            redirectTo: null,
        };
        this.submitHandler = this.submitHandler.bind(this)
        this.setDefaultState = this.setDefaultState.bind(this)
        this.changeHandler = this.changeHandler.bind(this)

    }
    componentDidMount() {
        document.title = 'Add New Password'
        setTimeout(() => {
            this.setState(loadStateFromLocalStorage("AddNewPasswordModal"));
        }, 1000);
    }

    setDefaultState() {
        this.setState({
            user: {
                name: '',
                password: '',
                password_confirmation: '',
            },
            validation: {},
            resp: '',
            error: '',
            isBusy: false,
            isDirty: false,
            errors: undefined
        });
    }

    submitHandler(e) {
        e.preventDefault();

        if (this.validate() && !this.state.isBusy) {
            this.setState({ isBusy: true, errors: '' });
            let fd = new FormData;
            for (var key in this.state.user) {
                fd.append(key, this.state.user[key])
            }

            HttpClient.post('/generate-password', fd)
                .then(response => {
                    removeStateFromLocalStorage("AddNewPasswordModal");
                    Toast.fire({
                        icon: 'success',
                        title: "Password added.",
                    });
                    this.setState({ redirectTo: "/annotation" });
                    this.props.togglePopup('');
                }, (err) => {
                    if (err.response.status == 402) {
                        swal.fire({
                            icon: "warning",
                            title: "Limit Reached",
                            html: err.response.data.message,
                        });
                    }
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {

                    this.setState({ isBusy: false, errors: err });
                });
        }

    }

    changeHandler(e) {
        switch (e.target.name) {
            default:
                this.setState({ isDirty: true, user: { ...this.state.user, [e.target.name]: e.target.value } },
                    () => {
                        setTimeout(() => {
                            saveStateToLocalStorage("AddNewPasswordModal", { user: this.state.user });
                        }, 500);
                    });
                break;
        }
    }
    validate() {
        let name = this.state.user.name;
        let password = this.state.user.password;
        let password_confirmation = this.state.user.password_confirmation;
        let errors = {};
        let isValid = true;

        if (!name) {
            isValid = false;
            errors["name"] = "Please enter your name.";
        }

        if (!password) {
            isValid = false;
            errors["password"] = "Please enter your password.";
        }
        if (!password_confirmation) {
            isValid = false;
            errors["password_confirmation"] = "Please enter your confirmed password.";
        }


        this.setState({
            validation: errors
        });

        return isValid;
    }
    render() {
        if (!this.props.show) return null;
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />

        const validation = this.state.validation;

        return (
            <div className="modal fade show" id="addNewPasswordModal" tabIndex="-1" role="dialog" aria-labelledby="adwordsClientCustomerIdSaverModalLabel" style={{ 'display': 'block', 'paddingRight': '12px' }}>
                <div className="modal-dialog modal-dialog-centered " role="document">
                    <div className="modal-content  border-0 shadow " style={{ borderRadius: "5%" }}>
                        <div className='mt-4 text-center'>
                            <h3 style={{ color: "#2A74E7", fontWeight: "bolder" }} >Almost there...</h3>
                        </div>
                        <form onSubmit={this.submitHandler} id="add-new-password-form">
                            <ErrorAlert errors={this.state.errors} />
                            <div className="modal-body">

                                <div className='my-4 d-flex gap-5 flex-column align-items-center'>
                                    <div className="form-group" style={{ width: "70%" }}>
                                        <input type="text" className="form-control" value={this.state.user.name} onChange={this.changeHandler} id="name" name="name" placeholder='Full name' />
                                        {validation.name ? <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.name}</span> : ''}
                                    </div>
                                    <div className="form-group" style={{ width: "70%" }}>
                                        <input type="password" className="form-control" value={this.state.user.password} onChange={this.changeHandler} id="password" name="password" placeholder='Set password' />
                                        {validation.password ? <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.password}</span> : ''}
                                    </div>
                                    <div className="form-group" style={{ width: "70%" }}>
                                        <input type="password" className="form-control" value={this.state.user.password_confirmation} onChange={this.changeHandler} id="password_confirmation" name="password_confirmation" placeholder='Confirm password' />
                                        {validation.password_confirmation ? <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.password_confirmation}</span> : ''}
                                    </div>
                                </div>


                                <div className='mt-4 text-center'>
                                    <button type="submit" className="btn-theme" title="submit">Add</button>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
