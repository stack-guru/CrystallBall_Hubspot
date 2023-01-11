import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Container, FormGroup, Input, Label } from "reactstrap";
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
        document.title = 'Users';
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
            <>
                <div className="annotationPage">
                    <Container>
                        <div className="pageHead">
                            <div className="d-flex justify-content-between align-items-center">
                                <h2 className="pageTitle m-0">Users</h2>
                                <Link href="/annotation/create">
                                    <img className='inject-me' src='/manual.svg' width='16' height='16' alt='menu icon'/>
                                </Link>
                                <button type="button" class="btn-addAnnotation btn btn-primary d-flex align-items-center justify-content-center dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                    <img src='/plus-new.svg' width='16' height='17' alt='plus icon'/>
                                    <span>Add User</span>
                                </button>
                            </div>

                            <form className="pageFilters d-flex justify-content-between align-items-center">
                                <FormGroup className="filter-sort position-relative">
                                    <Label className="sr-only" for="dropdownFilters">sort by filter</Label>
                                    <i className="btn-searchIcon left-0">
                                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0 10V8.33333H4V10H0ZM0 5.83333V4.16667H8V5.83333H0ZM0 1.66667V0H12V1.66667H0Z" fill="#666666"/>
                                        </svg>
                                    </i>
                                    <i className="btn-searchIcon right-0 fa fa-angle-down"></i>
                                    <select name="sortBy" id="sort-by" value={this.state.sortBy} className="form-control" onChange={this.sort}>
                                        <option value="Null">Sort By</option>
                                        <option value="added">Added</option>
                                        <option value="date">By Date</option>
                                        <option value="category">By Category</option>
                                        <option value="ga-property">By GA Property</option>
                                    </select>
                                    {this.state.selectedRows.length ? (
                                        <button className="btn btn-danger btn-sm mt-2" onClick={this.handleDeleteSelected}>Delete</button>
                                    ) : null}
                                </FormGroup>

                                <FormGroup>
                                    {this.state.sortBy == "ga-property" ? (
                                        <GoogleAnalyticsPropertySelect
                                            name={"googleAnalyticsProperty"}
                                            id={"googleAnalyticsProperty"}
                                            value={this.state.googleAnalyticsProperty}
                                            onChangeCallback={(e) => {this.sortByProperty(e.target.value);}}/>
                                    ) : null}
                                    {this.state.sortBy == "category" ? (
                                        <select name="category" id="category" value={this.state.category} className="form-control" onChange={(e) => {this.sortByCategory(e.target.value);}}>
                                            <option value="select-category">Select Category</option>
                                            {categories.map((cats) => (
                                                <option value={cats.category} key={cats.category}>{cats.category}</option>
                                            ))}
                                        </select>
                                    ) : null}
                                </FormGroup>

                                <FormGroup className="filter-search position-relative">
                                    <Label className="sr-only" for="search">search</Label>
                                    <Input name="searchText" value={this.state.searchText} placeholder="Search..." onChange={this.handleChange}/>
                                    <button className="btn-searchIcon"><img className="d-block" src="/search-new.svg" width="16" height="16" alt="Search"/></button>
                                </FormGroup>

                            </form>

                        </div>

                        
                    </Container>
                </div>

                <div className="container-xl bg-white anno-container  d-flex flex-column justify-content-center component-wrapper">
                    <section className="ftco-section" id="inputs">
                        <div className="container-xl p-0">
                            <div className="row ml-0 mr-0 mb-5">
                                <div className="col-md-12">
                                    <h2 className="heading-section gaa-title">Users</h2>
                                </div>
                            </div>
                            <div id="annotation-index-container">
                                {/* <div className="row mb-4 ml-3 mr-3">
                                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 pt-4 pt-sm-0 p-md-0 pt-lg-0 text-center text-sm-center text-md-right text-lg-right">
                                        <Link to="/settings/devices" className="text-primary mr-2">Manage Device</Link>
                                    </div>
                                </div> */}

                                {this.props.user.user_level == "admin" ? (
                                    <div className="row mb-4 ml-3 mr-3">
                                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 pt-4 pt-sm-0 p-md-0 pt-lg-0 text-center text-sm-center text-md-right text-lg-right">
                                            {this.props.user.price_plan
                                                .user_per_ga_account_count > -1 ? (
                                                <Link
                                                    to="/settings/user/create"
                                                    className="btn btn-sm gaa-btn-primary text-white mr-2"
                                                >
                                                    <i className=" mr-2 fa fa-plus"></i>
                                                    Add User
                                                </Link>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        const accountNotLinkedHtml = '' +
                                                            '<div class="">' +
                                                            '<img src="/images/banners/user_limit_banner.jpg" class="img-fluid">' +
                                                            '</div>'

                                                        swal.fire({
                                                            html: accountNotLinkedHtml,
                                                            width: 700,
                                                            customClass: {
                                                                popup: 'bg-light-red pb-5',
                                                                htmlContainer: 'm-0',
                                                            },
                                                            confirmButtonClass: "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                                                            confirmButtonText: "Upgrade Now" + "<i class='ml-2 fa fa-caret-right'> </i>",

                                                        }).then(value => {
                                                            window.location.href = "/settings/price-plans";
                                                            // <Redirect to="/settings/price-plans"/>
                                                            // this.setState({redirectTo: "/settings/price-plans"});
                                                        });
                                                            
                                                        // swal.fire(
                                                        //     {
                                                        //         icon: 'warning',
                                                        //         title: 'To add more users, please upgrade your account',
                                                        //         confirmButtonText: "<a href='/settings/price-plans' style='color:white;'> Upgrade </a>"
                                                        //     }
                                                        // );
                                                    }}
                                                    className="btn btn-sm gaa-btn-primary text-white mr-2"
                                                >
                                                    <i className=" mr-2 fa fa-plus"></i>
                                                    Add User
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ) : null}

                                <div className="row mb-4 ml-0 mr-0">
                                    <div className="col-sm-12 col-md-3 col-lg-3  text-center text-sm-center text-md-right text-lg-right">
                                        <input name="searchText" value={this.state.searchText} className="form-control" placeholder="Search..." onChange={this.handleChange}/>
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
                                                    {this.state.users
                                                        .filter(
                                                            this.checkSearchText
                                                        )
                                                        .map((user) => {
                                                            return (
                                                                <tr key={user.id}>
                                                                    <td>
                                                                        {user.email}
                                                                    </td>
                                                                    <td>
                                                                        {user.name}
                                                                    </td>
                                                                    <td>
                                                                        {capitalizeFirstLetter(
                                                                            user.user_level
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            user.department
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            user.team_name
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {this.props
                                                                            .user
                                                                            .user_level ==
                                                                        "admin" ? (
                                                                            <React.Fragment>
                                                                                <Link
                                                                                    className="btn gaa-btn-primary btn-sm"
                                                                                    to={`/settings/user/${user.id}/edit`}
                                                                                >
                                                                                    <i className="fa fa-edit"></i>
                                                                                </Link>
                                                                                <button
                                                                                    className="btn gaa-btn-danger btn-sm ml-2"
                                                                                    onClick={() =>
                                                                                        this.handleDelete(
                                                                                            user.id
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <i className="fa fa-trash"></i>
                                                                                </button>
                                                                            </React.Fragment>
                                                                        ) : null}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </>
        );
    }

}
