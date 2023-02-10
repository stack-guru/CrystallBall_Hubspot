import React from 'react';
import { Link } from "react-router-dom";
import HttpClient from '../../utils/HttpClient';

export default class indexSettings extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showSuspendAccountModal: false,
            suspension_feedback: ''
        };

        this.toggleSuspendAccountModal = this.toggleSuspendAccountModal.bind(this);
        this.suspendAccount = this.suspendAccount.bind(this);
    }

    componentDidMount() {
        document.title = 'Settings';
    }

    toggleSuspendAccountModal(event) {
        if (this.props.user.user) {
            swal.fire("Unauthorized", "Only the admin can delete the account.", "error");
        } 
        else{
            this.setState({ showSuspendAccountModal: !this.state.showSuspendAccountModal });
        }
    }

    suspendAccount(event) {
        event.preventDefault();
    }

    render() {
        return (
            <div className="container-xl  component-wrapper">
                <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: this.state.showSuspendAccountModal ? 'block' : 'none' }}>
                    <div className="modal-dialog" role="document" >
                        <div className="modal-content" style={{ width: '450px' }}>
                            <form action="/user" method="POST">
                                <input type="hidden" name={"_token"} value={document.querySelector('meta[name="csrf-token"]').getAttribute('content')} />
                                <input type="hidden" name="_method" value="DELETE" />
                                <div className="modal-header">
                                    <h3>Delete Account</h3>
                                </div>
                                <div className="modal-body text-left">
                                    <label>Are you sure you want to delete your account? This action can not be undone. Why do you decided to delete your account?</label>
                                    <textarea required className="form-control" rows={5} name="deletion_reason" ></textarea>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-danger float-left" type="submit" >Delete Account</button>
                                    <button className="btn btn-secondary float-right" type="button" onClick={this.toggleSuspendAccountModal}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="row ml-0 mr-0">
                    <div className="col-12">
                        <div className="user-setting-head box-shadow gaa-text-color rounded">
                            <h1 className="mb-0 lh-100"><b>{this.props.user.name}</b></h1>
                            <small><b>Email: {this.props.user.email}</b></small><br />
                            <small><b>Price Plan: {this.props.user.price_plan.name}</b></small>
                        </div>

                        <div className="profile bg-white my-3  user-setting-box box-shadow rounded">
                            <h4 className="border-bottom gaa-text-primary"><b>Profile</b></h4>
                            <ul className='list-unstyled list-group mt-2 ml-4'>
                                {/*<li className='nav-item border-bottom'>
                                    <Link to="/">
                                       <span className="nav-link">Edit profile</span>
                                 </Link>
                                </li>*/}
                                <li className='nav-item border-bottom'>
                                    <Link to="/settings/profile">
                                        <span className="nav-link">Change password</span>
                                    </Link>
                                </li >
                                <li className='nav-item border-bottom'>
                                    <a href="#" onClick={this.toggleSuspendAccountModal}>
                                        <span className="nav-link text-danger">Delete Account</span>
                                    </a>
                                </li >
                            </ul>
                        </div>

                        <div className="plan bg-white my-3 user-setting-box  box-shadow rounded">
                            <h4 className="border-bottom gaa-text-primary"><b>Connected Accounts</b></h4>
                            <ul className='list-unstyled list-group mt-2 ml-4'>
                                <li className='nav-item border-bottom'>
                                    <Link to="/accounts">
                                        <span className="nav-link">Add google account</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>


                        <div className="plan bg-white my-3 user-setting-box  box-shadow rounded">
                            <h4 className="border-bottom gaa-text-primary"><b>Plan</b></h4>
                            <ul className='list-unstyled list-group mt-2 ml-4'>
                                <li className='nav-item border-bottom'>
                                    <Link to="/settings/price-plans">
                                        <span className="nav-link">Price Plans</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="payments bg-white my-3 user-setting-box  box-shadow rounded">
                            <h4 className="border-bottom gaa-text-primary"><b>Payments</b></h4>
                            <ul className='list-unstyled list-group mt-2 ml-4'>
                                <li className='nav-item border-bottom'>
                                    <Link to="/settings/payment-history" >
                                        <span className="nav-link">Payment History</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="developers bg-white my-3 user-setting-box  box-shadow rounded">
                            <h4 className="border-bottom gaa-text-primary"><b>Developers</b></h4>
                            <ul className='list-unstyled list-group mt-2 ml-4'>
                                <li className='nav-item border-bottom'>
                                    <a href="/documentation">
                                        <span className="nav-link">API Documentation</span>
                                    </a>
                                </li>

                            </ul>
                        </div>
                        {/*<ul className='list-unstyled list-group mt-3'>*/}
                        {/*    */}
                        {/*    <h4><b>Plans</b></h4>*/}
                        {/*    <li className='nav-item'>*/}
                        {/*      */}
                        {/*    </li>*/}
                        {/*    <h4><b>Payments</b></h4>*/}
                        {/*    <li className='nav-item'>*/}
                        {/*      */}
                        {/*    </li>*/}
                        {/*    <h4><b>Developers</b></h4>*/}
                        {/*    <li className='nav-item'>*/}
                        {/*        <a href="/documentation">*/}
                        {/*            <span className="nav-link">API Documentation</span>*/}
                        {/*        </a>*/}
                        {/*    </li>*/}
                        {/*</ul>*/}
                    </div>
                </div>
            </div>
        );
    }

}
