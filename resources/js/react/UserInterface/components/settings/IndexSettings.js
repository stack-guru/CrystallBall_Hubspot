import React from 'react';
import { Link } from "react-router-dom";

export default class indexSettings extends React.Component {

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        document.title = 'Settings';
    }

    render() {
        return (
            <div className="container-xl  component-wrapper">
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
                                    <Link to="/settings/change-password">
                                        <span className="nav-link">Change password</span>
                                    </Link>
                                </li >
                            </ul>
                        </div>

                        <div className="plan bg-white my-3 user-setting-box  box-shadow rounded">
                            <h4 className="border-bottom gaa-text-primary"><b>Accounts</b></h4>
                            <ul className='list-unstyled list-group mt-2 ml-4'>
                                <li className='nav-item border-bottom'>
                                    <Link to="/settings/google-account">
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
