import React, {Component} from "react";
import {Link} from "react-router-dom";
import {Container, FormGroup, Input, Label} from "reactstrap";
import HttpClient from "../../../utils/HttpClient";
import AppsModal from "../../AppsMarket/AppsModal";
import CreateUser from "./CreateUser";
import EditUser from "./EditUser";
import Toast from "../../../utils/Toast";
import {CustomTooltip} from "../../annotations/IndexAnnotation";

export default class IndexUsers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            searchText: "",
            addUserPopup: false,
            editUserId: '',
            google_analytics_properties: [],
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.checkSearchText = this.checkSearchText.bind(this);
        this.saveRole = this.saveRole.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.getUserStatus = this.getUserStatus.bind(this);
        this.reInvite = this.reInvite.bind(this);
    }

    componentDidMount() {
        document.title = "Users";
        this.getUsers();
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    reInvite(user) {
        if (this.getUserStatus(user).status !== 'Re-Invite') return

        HttpClient.post(`settings/re-invite-user`, {userId: user.id})
            .then(response => {
                Toast.fire({
                    icon: 'success',
                    title: "User is Re-Invited."
                });
                this.setState({users: response.data.users});
            }, (err) => {

                this.setState({isBusy: false, errors: (err.response).data});
            }).catch(err => {

            this.setState({isBusy: false, errors: err});
        });

    }

    getUserStatus(user) {

        var diff = moment.duration(
            moment(user.created_at, "YYYY-MM-DD").diff(moment().format("YYYY-MM-DD"))
        ).asDays();

        let status = 'Invited';
        let btnStyle = 'text-orange';
        if (!user.email_verified_at && diff <= -10) {
            status = "Re-Invite";
            btnStyle = 'text-danger';
        }
        if (user.email_verified_at) {
            status = "Accepted";
            btnStyle = "text-success";
        }

        return {status, btnStyle};
    }

    getUsers() {
        HttpClient.get(`/settings/user`)
            // HttpClient.get('/ui/settings/google-analytics-property?keyword=')
            .then(
                (response) => {
                    this.setState({users: response.data.users});
                },
                (err) => {
                    this.setState({errors: err.response.data});
                }
            )
            .catch((err) => {
                this.setState({errors: err});
            });
    }

    checkSearchText(user) {
        if (this.state.searchText.length) {
            return user.email.toLowerCase().indexOf(this.state.searchText) > -1 ||
                user.name.toLowerCase().indexOf(this.state.searchText) > -1;
        }
        return true;
    }

    saveRole(user_level, user) {
        user.user_level = user_level
        HttpClient.put(`/settings/user/${user.id}`, user)
            .then(() => {
                Toast.fire({
                    icon: 'success',
                    title: "User updated.",
                });
                this.getUsers();
            }, (err) => {
                this.setState({errors: (err.response).data});
            }).catch(err => {
            this.setState({errors: err});
        });
    }

    handleDelete(id) {
        HttpClient.delete(`/settings/user/${id}`)
            .then(
                () => {
                    this.setState({
                        users: this.state.users.filter((u) => u.id !== id),
                    });

                    this.getUsers();
                },
                (err) => {
                    this.setState({errors: err.response.data});
                }
            )
            .catch((err) => {
                this.setState({errors: err});
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
                                            .user_per_ga_account_count > -1 && this.props.user.price_plan
                                            .name != "Trial Ended" ? (
                                            <a onClick={() => this.setState({addUserPopup: true})}
                                               href="javascript:void(0);"
                                               className="btn-adduser d-flex align-items-center justify-content-center">
                                                <i className="fa fa-plus"></i>
                                                <span>Add User</span>
                                            </a>
                                        ) : (
                                            <button onClick={() => {
                                                this.props.upgradePopup('more-users');
                                            }}
                                                    className="btn-adduser d-flex align-items-center justify-content-center"
                                            >
                                                <i className="fa fa-plus"></i>
                                                <span>Add User</span>
                                            </button>
                                        )}
                                    </>
                                ) : null}
                            </div>

                            {this.state.users.length ?
                                <form className="pageFilters d-flex justify-content-end align-items-center">
                                    {/* <FormGroup className="filter-sort position-relative form-group">
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
                                </FormGroup> */}


                                    <FormGroup className="filter-search position-relative">
                                        <Label className="sr-only" for="search">search</Label>
                                        <Input name="searchText" value={this.state.searchText} placeholder="Search..."
                                               onChange={this.handleChange}/>
                                        <button className="btn-searchIcon"><img className="d-block"
                                                                                src="/search-new.svg" width="16"
                                                                                height="16" alt="Search"/></button>
                                    </FormGroup>
                                </form> : null}
                        </div>

                        <div className="dataTable dataTableusers d-flex flex-column">
                            {/* {this.state.users.length ?  */}
                            <div className="dataTableHolder">
                                <div className="tableHead singleRow justify-content-between align-items-center">
                                    <div className="singleCol text-left">Email</div>
                                    <div className="singleCol text-left">Name</div>
                                    <div className="singleCol text-left">User Level</div>
                                    <div className="singleCol text-left">Department</div>
                                    <div className="singleCol text-left">Team</div>
                                    <div className="singleCol text-left">Properties</div>
                                    <div className="singleCol text-right">Actions</div>
                                </div>
                                <div className="tableBody">

                                    {this.props.user.user ?
                                        (
                                            <>
                                                <div key={this.props.user.user.id}
                                                     className="singleRow justify-content-between align-items-center">
                                                    <div className="singleCol text-left">
                                                        <span>{this.props.user.user.email}</span></div>
                                                    <div className="singleCol text-left">
                                                        <span>{this.props.user.user.name}</span></div>
                                                    <div className="singleCol text-left"><span>Super Admin</span></div>
                                                    <div className="singleCol text-left">
                                                        <span>{this.props.user.user.department}</span></div>
                                                    <div className="singleCol text-left">
                                                        <span>{this.props.user.user.team_name}</span></div>
                                                    <div className="singleCol text-left"><span>
                                                            All Properties
                                                    </span></div>
                                                    <div className="singleCol text-right">
                                                        {/* <span>
                                                                <Link  to="/settings/profile"><img src={`/icon-edit.svg`} /></Link>
                                                        </span> */}
                                                    </div>
                                                </div>
                                            </>
                                        ) :
                                        <>
                                            <div key={this.props.user.id}
                                                 className="singleRow justify-content-between align-items-center">
                                                <div className="singleCol text-left">
                                                    <span>{this.props.user.email}</span></div>
                                                <div className="singleCol text-left"><span>{this.props.user.name}</span>
                                                </div>
                                                <div className="singleCol text-left"><span>Super Admin</span></div>
                                                <div className="singleCol text-left">
                                                    <span>{this.props.user.department}</span></div>
                                                <div className="singleCol text-left">
                                                    <span>{this.props.user.team_name}</span></div>
                                                <div className="singleCol text-left"><span>All Properties</span></div>
                                                <div className="singleCol text-right">
                                                    <span>
                                                            <Link to="/settings/profile"><img alt="icon-edit"
                                                                                              src={`/icon-edit.svg`}/></Link>
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    }
                                    {this.state.users.filter(this.checkSearchText).map((user) => {
                                        const hasProperties = user.google_analytics_properties && user.google_analytics_properties.length > 0;
                                        const propertyNames = user.google_analytics_properties.map(property => property.name);
                                        const annoPropertyString = propertyNames.join(', ');

                                        let displayString = "";
                                        if (propertyNames.length > 0) {
                                            displayString = propertyNames[0];

                                            if (propertyNames.length > 1) {
                                                displayString += ` <span>+${propertyNames.length - 1}<span>`;
                                            }
                                        }
                                        return (
                                            <div key={user.id}
                                                 className="singleRow justify-content-between align-items-center">
                                                <div className="singleCol text-left"><span>{user.email}</span></div>
                                                <div className="singleCol text-left"><span>{user.name}</span></div>
                                                <div className="singleCol text-left">
                                                    {/* <span>
                                                        <div className="themeNewInputStyle">
                                                            <select name="user_level" className="form-control" onChange={(ev) => this.saveRole(ev.target.value, user)} value={user.user_level}>
                                                                <option value="">User level</option>
                                                                <option value="admin">Admin</option>
                                                                <option value="team">Read & Write</option>
                                                                <option value="viewer">Read</option>
                                                            </select>
                                                        </div>
                                                    </span> */}
                                                    {/* {capitalizeFirstLetter(`${user.user_level}` || '-')} */}
                                                    {user.user_level === 'admin' ? 'Admin' : user.user_level === 'team' ? 'Read & Write' : user.user_level === 'viewer' ? 'Read' : '-'}
                                                </div>
                                                <div className="singleCol text-left"><span>{user.department}</span>
                                                </div>
                                                <div className="singleCol text-left"><span>{user.team_name}</span></div>
                                                <div className="singleCol text-left">
                                                    <span className="properties dd-tooltip">{hasProperties ? <CustomTooltip tooltipText={annoPropertyString} maxLength={50}><p dangerouslySetInnerHTML={{__html: displayString}}></p></CustomTooltip> : "All Properties"}</span>
                                                </div>
                                                <div className="singleCol text-right">
                                                    <span>{this.props.user.user_level == "admin" ? (
                                                        <div
                                                            className="d-flex justify-content-center align-items-center">
                                                            <span onClick={() => this.reInvite(user)}
                                                                  className={`${this.getUserStatus(user).btnStyle} mr-2`}>
                                                                <span
                                                                    className={this.getUserStatus(user).btnStyle === 'text-danger' ? 'text-decoration-underline cursor-pointer' : ''}>{this.getUserStatus(user).status}</span>
                                                            </span>
                                                            <div className="cursor-pointer"
                                                                 onClick={() => this.setState({editUserId: user.id})}>
                                                                <img alt={"icon-edit"} src={`/icon-edit.svg`}/></div>
                                                            <Link onClick={() => this.handleDelete(user.id)}><img
                                                                alt={"icon-trash"} src={`/icon-trash.svg`}/></Link>
                                                        </div>
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

                    <AppsModal isOpen={this.state.addUserPopup} popupSize={'md'} toggle={() => {
                        this.setState({addUserPopup: false,});
                    }}>
                        <div className="popupContent modal-createUser">
                            <div className="apps-modalHead">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex justify-content-start align-items-center"><h2>Add User</h2>
                                    </div>
                                    <span onClick={() => this.setState({addUserPopup: false,})} className="btn-close">
                                        <img className="inject-me" src="/close-icon.svg" width="26" height="26"
                                             alt="menu icon"/>
                                    </span>
                                </div>
                            </div>

                            <CreateUser toggle={() => {
                                this.setState({addUserPopup: false,});
                            }} getUsers={this.getUsers} user={this.props.user}/>
                        </div>
                    </AppsModal>
                    <AppsModal isOpen={this.state.editUserId} popupSize={'md'} toggle={() => {
                        this.setState({editUserId: '',});
                    }}>
                        <div className="popupContent modal-createUser">
                            <div className="apps-modalHead">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex justify-content-start align-items-center"><h2>Edit User</h2>
                                    </div>
                                    <span onClick={() => this.setState({editUserId: '',})} className="btn-close">
                                        <img className="inject-me" src="/close-icon.svg" width="26" height="26"
                                             alt="menu icon"/>
                                    </span>
                                </div>
                            </div>

                            <EditUser toggle={() => {
                                this.setState({editUserId: '',});
                                this.getUsers();
                            }} getUsers={this.getUsers} editUserId={this.state.editUserId} user={this.props.user}/>
                        </div>
                    </AppsModal>
                </div>
            </>
        );
    }
}
