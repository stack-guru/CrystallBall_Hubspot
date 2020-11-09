import React from 'react';
import { Link } from "react-router-dom";

export default class indexSettings extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="container-xl bg-white component-wrapper">
                <div className="row ml-0 mr-0">
                    <div className="col-12">
                        <h1><b>{this.props.user.name}</b></h1>
                        <span>Email: {this.props.user.email}</span><br />
                        <span>Price Plan: {this.props.user.price_plan.name}</span>
                        <ul className='list-unstyled list-group mt-3'>
                            <h4><b>Profile</b></h4>
                            <li className='nav-item'>
                                <Link to="/">
                                    <span>Edit profile</span>
                                </Link>
                            </li>
                            <li className='nav-item'>
                                <Link to="/settings/change-password">
                                    <span >Change password</span>
                                </Link>
                            </li >

                            <li className='nav-item'>
                                <Link to="/settings/price-plans">
                                    <span >Price Plans</span>
                                </Link>
                            </li>

                            <li className='nav-item'>
                                <Link to="/settings/payment-history" >
                                    <span >Payment History</span>
                                </Link>
                            </li>

                            <li className='nav-item'>
                                <a href="/documentation">
                                    <span >API Documentation</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

}
