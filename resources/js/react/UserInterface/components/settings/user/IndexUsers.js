import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, FormGroup, Input, Label } from "reactstrap";
import { capitalizeFirstLetter } from "../../../helpers/CommonFunctions";
import HttpClient from "../../../utils/HttpClient";
import AppsModal from "../../AppsMarket/AppsModal";
import CreateUser from "./CreateUser";

export default class IndexUsers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            searchText: "",
            addUserPopup: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.checkSearchText = this.checkSearchText.bind(this);
    }

    componentDidMount() {
        document.title = "Users";
        HttpClient.get(`/settings/user`)
            .then(
                (response) => {
                    this.setState({ users: response.data.users });
                },
                (err) => {
                    this.setState({ errors: err.response.data });
                }
            )
            .catch((err) => {
                this.setState({ errors: err });
            });
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    checkSearchText(user) {
        if (this.state.searchText.length) {
            if (
                user.email.toLowerCase().indexOf(this.state.searchText) > -1 ||
                user.name.toLowerCase().indexOf(this.state.searchText) > -1
            ) {
                return true;
            }
            return false;
        }
        return true;
    }

    handleDelete(id) {
        HttpClient.delete(`/settings/user/${id}`)
            .then(
                (response) => {
                    this.setState({
                        users: this.state.users.filter((u) => u.id !== id),
                    });
                },
                (err) => {
                    this.setState({ errors: err.response.data });
                }
            )
            .catch((err) => {
                this.setState({ errors: err });
            });
    }

    render() {
        return (
            <>
                <div className="usersPage">
                    <Container>
                        <div className="pageHead">
                            <div className="d-flex justify-content-between align-items-center">
                                <h2 className="pageTitle m-0">Users</h2>

                                {this.props.user.user_level == "admin" ? (
                                    <>
                                        {this.props.user.price_plan
                                            .user_per_ga_account_count > -1 ? (
                                            <a onClick={() => this.setState({ addUserPopup: true })} href="javascript:void(0);" class="btn-adduser d-flex align-items-center justify-content-center">
                                                <i className="fa fa-plus"></i>
                                                <span>Add User</span>
                                            </a>
                                        ) : (
                                            <button onClick={() => {
                                                const accountNotLinkedHtml =
                                                    "" +
                                                    '<div class="">' +
                                                    '<img src="/images/banners/user_limit_banner.jpg" class="img-fluid">' +
                                                    "</div>";

                                                swal.fire({
                                                    html: accountNotLinkedHtml,
                                                    width: 700,
                                                    customClass: {
                                                        popup: "bg-light-red pb-5",
                                                        htmlContainer:
                                                            "m-0",
                                                    },
                                                    confirmButtonClass:
                                                        "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                                                    confirmButtonText:
                                                        "Upgrade Now" +
                                                        "<i class='ml-2 fa fa-caret-right'> </i>",
                                                }).then((value) => {
                                                    window.location.href =
                                                        "/settings/price-plans";
                                                });

                                            }}
                                                class="btn-adduser d-flex align-items-center justify-content-center"
                                            >
                                                <i className="fa fa-plus"></i>
                                                <span>Add User</span>
                                            </button>
                                        )}
                                    </>
                                ) : null}
                            </div>

                            <form className="pageFilters d-flex justify-content-between align-items-center">
                                <FormGroup className="filter-sort position-relative">
                                    <Label className="sr-only" for="dropdownFilters">sort by filter</Label>
                                    <i className="btn-searchIcon left-0">
                                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0 10V8.33333H4V10H0ZM0 5.83333V4.16667H8V5.83333H0ZM0 1.66667V0H12V1.66667H0Z" fill="#666666" />
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
                                </FormGroup>


                                <FormGroup className="filter-search position-relative">
                                    <Label className="sr-only" for="search">search</Label>
                                    <Input name="searchText" value={this.state.searchText} placeholder="Search..." onChange={this.handleChange} />
                                    <button className="btn-searchIcon"><img className="d-block" src="/search-new.svg" width="16" height="16" alt="Search" /></button>
                                </FormGroup>
                            </form>
                        </div>

                        <div className="dataTable dataTableusers d-flex flex-column">
                            <div className="dataTableHolder">
                                <div className="tableHead singleRow justify-content-between align-items-center">
                                    <div className="singleCol text-left">Email</div>
                                    <div className="singleCol text-left">Name</div>
                                    <div className="singleCol text-left">User Level</div>
                                    <div className="singleCol text-left">Department</div>
                                    <div className="singleCol text-left">Team</div>
                                    <div className="singleCol text-right">Actions</div>
                                </div>
                                <div className="tableBody">
                                    {this.state.users.filter(this.checkSearchText).map((user) => {
                                        return (
                                            <div key={user.id} className="singleRow justify-content-between align-items-center">
                                                <div className="singleCol text-left"><span>{user.email}</span></div>
                                                <div className="singleCol text-left"><span>{user.name}</span></div>
                                                <div className="singleCol text-left"><span>{capitalizeFirstLetter(user.user_level)}</span></div>
                                                <div className="singleCol text-left"><span>{user.department}</span></div>
                                                <div className="singleCol text-left"><span>{user.team_name}</span></div>
                                                <div className="singleCol text-right">
                                                    <span>{this.props.user.user_level == "admin" ? (
                                                        <>
                                                            <Link to={`/settings/user/${user.id}/edit`}><img src={`/icon-edit.svg`} /></Link>
                                                            <Link onClick={() => this.handleDelete(user.id)}><img src={`/icon-trash.svg`} /></Link>
                                                        </>
                                                    ) : null}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </Container>

                    <AppsModal isOpen={this.state.addUserPopup} popupSize={'md'} toggle={() => {this.setState({addUserPopup: false,});}}>
                        <div className="popupContent modal-createUser">
                            <div className="apps-modalHead">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex justify-content-start align-items-center"><h2>Add User</h2></div>
                                    <span onClick={() => this.setState({addUserPopup: false,})} className="btn-close">
                                        <img className="inject-me" src="/close-icon.svg" width="26" height="26" alt="menu icon"/>
                                    </span>
                                </div>
                            </div>

                            <CreateUser user={this.props.user} />
                        </div>
                    </AppsModal>
                </div>
            </>
        );
    }
}
