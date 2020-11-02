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
                            <h4><b>Profile</b>{this.props.user.email_verified_at == null ? <sub className="text-danger">Non-verified</sub>
                                : <sub className="text-success">Verified</sub>}</h4>
                            <li>
                                <Link to="/">
                                    <span>Edit profile</span>
                                </Link>
                            </li>
                            {
                                this.props.user.email_verified_at != null ? '' :
                                    <li>
                                        <Link to="/">
                                            <span >Verify Email</span>
                                        </Link>
                                    </li>
                            }
                            <li>
                                <Link to="/settings/change-password">
                                    <span >Change password</span>
                                </Link>
                            </li>

                            <li>
                                <Link to="/settings/price-plans">
                                    <span >Price Plans</span>
                                </Link>
                            </li>

                            <li>
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
