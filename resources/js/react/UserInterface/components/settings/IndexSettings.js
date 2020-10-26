import React from 'react';
import {Link} from "react-router-dom";

export default class indexSettings extends React.Component{

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        console.log(this.props)
    }

    render() {
        return (
            <div className="container-xl bg-white component-wrapper">
               <div className="row ml-0 mr-0">
                    <div className="col-12">
                        <h1><b>{this.props.user==undefined?'':this.props.user.name}</b></h1>
                        <span>Email: {this.props.user==undefined?'':this.props.user.email}</span>
                        <ul className='list-unstyled list-group mt-3'>
                            <h4><b>Profile</b>{this.props.user.email_verified_at==null?<sub className="text-danger">Non-varified</sub>
                                :<sub className="text-success">Verified</sub>}</h4>
                            <li>
                                <Link to="/">
                                <span>Edit profile</span>
                                </Link>
                            </li>
                            {
                                this.props.user.email_verified_at!=null?'':
                                    <li>
                                    <Link to="/">
                                        <span >Verify Email</span>
                                    </Link>
                                </li>
                            }
                            <li>
                                <Link to="/change-password">
                                <span >Change password</span>
                                    </Link>
                            </li>

                            <li>

                            </li>
                        </ul>
                    </div>
               </div>
            </div>
        );
    }

}
