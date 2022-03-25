import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { capitalizeFirstLetter } from '../../../helpers/CommonFunctions';
import HttpClient from '../../../utils/HttpClient'

export default class IndexUsers extends Component {
    constructor(props) {
        super(props)

        this.state = {
            users: [],
            searchText: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.checkSearchText = this.checkSearchText.bind(this);
    }

    componentDidMount() {
        HttpClient.get(`/settings/user`)
            .then(response => {
                this.setState({ users: response.data.users });
            }, (err) => {

                this.setState({ errors: (err.response).data });
            }).catch(err => {

                this.setState({ errors: err });
            });
    }


    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    checkSearchText(user) {
        if (this.state.searchText.length) {
            if (user.email.toLowerCase().indexOf(this.state.searchText) > -1
                || user.name.toLowerCase().indexOf(this.state.searchText) > -1) {
                return true;
            }
            return false;
        }
        return true;
    }

    handleDelete(id) {
        HttpClient.delete(`/settings/user/${id}`)
            .then(response => {
                this.setState({ users: this.state.users.filter(u => u.id !== id) });
            }, (err) => {

                this.setState({ errors: (err.response).data });
            }).catch(err => {

                this.setState({ errors: err });
            });
    }

    render() {
        return (
            <div className="container-xl bg-white anno-container  d-flex flex-column justify-content-center component-wrapper" >
                <section className="ftco-section" id="inputs">
                    <div className="container-xl p-0">
                        <div className="row ml-0 mr-0 mb-5">
                            <div className="col-md-12">
                                <h2 className="heading-section gaa-title">Users</h2>
                            </div>
                        </div>
                        <div id="annotation-index-container">
                            {
                                this.props.user.user_level == 'admin' ?
                                    <div className="row mb-4 ml-3 mr-3">
                                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 pt-4 pt-sm-0 p-md-0 pt-lg-0 text-center text-sm-center text-md-right text-lg-right">
                                            {this.props.user.price_plan.user_per_ga_account_count > -1 ?
                                                <Link to="/settings/user/create" className="btn btn-sm gaa-btn-primary text-white mr-2"><i className=" mr-2 fa fa-plus"></i>Add User</Link>
                                                :
                                                <button onClick={() => {
                                                    swal.fire("Upgrade Your Plan!", "Multiple users are not available in this plan.", "warning");
                                                }} className="btn btn-sm gaa-btn-primary text-white mr-2"><i className=" mr-2 fa fa-plus"></i>Add User</button>
                                            }
                                        </div>
                                    </div>
                                    : null
                            }
                            <div className="row mb-4 ml-0 mr-0">
                                <div className="col-sm-12 col-md-3 col-lg-3  text-center text-sm-center text-md-right text-lg-right">
                                    <input name="searchText" value={this.state.searchText} className="form-control" placeholder="Search..." onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="row ml-0 mr-0">
                                <div className="col-12">
                                    <div className="table-responsive">
                                        <table className="table table-hover gaa-hover table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Email</th>
                                                    <th>Name</th>
                                                    <th>User Level</th>
                                                    <th>Department</th>
                                                    <th>Team</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.state.users.filter(u => this.checkSearchText(u)).map((user) => {
                                                        return <tr key={user.id} >
                                                            <td>{user.email}</td>
                                                            <td>{user.name}</td>
                                                            <td>{capitalizeFirstLetter(user.user_level)}</td>
                                                            <td>{user.department}</td>
                                                            <td>{user.team_name}</td>
                                                            <td>
                                                                {
                                                                    this.props.user.user_level == 'admin' ?
                                                                        <React.Fragment>
                                                                            <Link className="btn gaa-btn-primary btn-sm" to={`/settings/user/${user.id}/edit`}><i className="fa fa-edit"></i></Link>
                                                                            <button className="btn gaa-btn-danger btn-sm ml-2" onClick={() => this.handleDelete(user.id)}><i className="fa fa-trash"></i></button>
                                                                        </React.Fragment>
                                                                        : null
                                                                }
                                                            </td>
                                                        </tr>
                                                    })
                                                }


                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </section>
            </div>
        );
    }

}