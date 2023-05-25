import React from 'react';
import Toast from "../../utils/Toast";
import {Redirect} from "react-router-dom";

import HttpClient from '../../utils/HttpClient';
import ErrorAlert from '../../utils/ErrorAlert'
// import AdwordsClientCustomerIdSaverModal from '../../../helpers/AdwordsClientCustomerIdSaverModalComponent';
import VideoModalBox from '../../utils/VideoModalBox';
import GooglePermissionPopup from '../../utils/GooglePermissionPopup';
import {Container, FormGroup, Label, Input} from 'reactstrap';
import {Link} from "react-router-dom";


export default class Accounts extends React.Component {

    constructor(props) {
        super(props);
        let redirectTo = localStorage.getItem('frontend_redirect_to');
        if (redirectTo && redirectTo !== "/annotation") {
            redirectTo = null;
        }

        this.state = {
            isBusy: false,
            googleAccounts: [],
            facebookAccounts: [],
            googleAnalyticsAccounts: [],
            googleAnalyticsProperties: [],
            googleSearchConsoleSites: [],
            redirectTo: redirectTo,
            isPermissionPopupOpened: false,
            user: props.user
        }

        this.handleDelete = this.handleDelete.bind(this);
        this.handleFacebookDelete = this.handleFacebookDelete.bind(this);
        this.fetchGAAccounts = this.fetchGAAccounts.bind(this);
        this.getGAAccounts = this.getGAAccounts.bind(this);
        this.getGoogleAccounts = this.getGoogleAccounts.bind(this);
        this.restrictionHandler = this.restrictionHandler.bind(this);

        this.handleGAADelete = this.handleGAADelete.bind(this);

        this.closeACCISModal = this.closeACCISModal.bind(this);

        this.getGAProperties = this.getGAProperties.bind(this);

        this.fetchGSCSites = this.fetchGSCSites.bind(this);
        this.getGSCSites = this.getGSCSites.bind(this);
        this.handleGSCSDelete = this.handleGSCSDelete.bind(this);
        this.updateUserService = this.updateUserService.bind(this);

    }

    componentDidMount() {
        document.title = 'Accounts';
        const redirectTo = localStorage.getItem('frontend_redirect_to');
        if (redirectTo && redirectTo !== "/annotation") {


            let autoRedirectDelay = 3000;
            let searchParams = new URLSearchParams(document.location.search);
            if (searchParams.has('do-refresh') && searchParams.has('google_account_id')) {
                if (searchParams.get('do-refresh') == "1") {
                    autoRedirectDelay = 10000;
                    this.fetchGSCSites(searchParams.get('google_account_id'))
                    this.fetchGAAccounts(searchParams.get('google_account_id'))
                    history.pushState({}, null, "/accounts");
                }
            }

            if (redirectTo && redirectTo !== "/accounts") {
                localStorage.removeItem('frontend_redirect_to');
                Toast.fire({
                    icon: 'info',
                    title: "Redirecting you in 10 seconds, please wait.",
                    autoClose: autoRedirectDelay
                });
                setTimeout(() => {
                    window.location = redirectTo;
                }, autoRedirectDelay)
            }

            if (searchParams.has('message') && searchParams.has('success')) {
                let success = searchParams.get('success');
                let message = searchParams.get('message');
                swal.fire("Error", message, success == "false" ? "error" : "success");
            }
            this.setState({showACCISModal: searchParams && searchParams.has('do-refresh') && searchParams.has('google_account_id')})
        }
        this.getGoogleAccounts();
        this.getFacebookAccounts();
        this.getGAAccounts();
        this.getGAProperties();
        this.getGSCSites();

        if (this.state.user.google_accounts_tour_showed_at == null && this.state.user.last_login_at !== null) {
            setTimeout(function () {
                document.getElementById("properties-video-modal-button").click();
            }, 3000)
            HttpClient.put(`/data-source/mark-google-accounts-tour`, {google_accounts_tour_showed_at: true})
                .then(response => {
                    (this.props.reloadUser)();
                }, (err) => {
                }).catch(err => {
            });

        }
    }

    updateUserService(value) {
        HttpClient.post("/userService", {
            [value]: 0,
        }).then((resp) => {
                Toast.fire({
                    icon: 'info',
                    title: "Service deactivated successfully.",
                });
                this.setState({user: resp.data.user_services})
            },
            (err) => {
                this.setState({isBusy: false, errors: err.response.data});
            }
        )
            .catch((err) => {
                this.setState({isBusy: false, errors: err});
            });
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo}/>

        return (<>
            <div id="googleAccountPage" className="googleAccountPage pageWrapper">
                <Container>
                    <div className="pageHeader googleAccountPageHead">
                        <div className="d-flex justify-content-between align-items-center">
                            <h2 className="pageTitle">Accounts</h2>
                            <a href="javascript:void(0);"
                               onClick={this.restrictionHandler}
                               className="btn-adduser d-flex align-items-center justify-content-center">
                                <i><img style={{width: 16, height: 16}} src={'/google-small.svg'} alt={'icon'}
                                        className="svg-inject socialImage"/></i>
                                <span>Connect New Account</span>
                            </a>
                        </div>


                    </div>

                    {/* <div className="alert alert-danger border-0">
                            <i><img src={'/icon-info-red.svg'} alt={'icon'} className="svg-inject" /></i>
                            <span>One of your Google accounts doesn’t  have required permissions given. Please remove and reconnect the account.</span>
                        </div> */}
                    {/* <div className="row ml-0 mr-0 my-5">
                        <div className="col-12 text-center text-md-right text-lg-right">
                            <a href="#"
                                onClick={this.restrictionHandler}
                                className="btn gaa-btn-primary text-white" >
                                Connect New Account
                            </a>
                        </div>
                    </div> */}
                    <section className='accountsHolder'>
                        <h3>Google accounts</h3>
                        <div className="accounts socialAccounts">
                            {
                                this.state.googleAccounts.map(googleAccount => {
                                    // className: reconnect
                                    return <div className='account'>
                                        {/* <figure><img className='w-100' src={googleAccount.avatar} alt='user image' /></figure> */}
                                        <figure><img className='socialImage' src='/google-small.svg' alt='user image'/>
                                        </figure>
                                        <div className='nameAndEmail'>
                                            <h4>{googleAccount.name}</h4>
                                            <span>{googleAccount.email}</span>
                                        </div>
                                        <div className='btns'>
                                            <button className='btn-change'>Change</button>
                                            <button className='btn-disconnect'
                                                    onClick={() => this.handleDelete(googleAccount.id)}
                                            >Disconnect
                                            </button>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    </section>
                    <section className='accountsHolder'>
                        <h3>Social accounts</h3>
                        <div className="accounts socialAccounts">
                            {/* {
                                this.state.user.is_ds_twitter_tracking_enabled ?
                                    <div className='account'>
                                        <figure><img className='socialImage' src='/twitter-small.svg' alt='user image'/>
                                        </figure>
                                        <div className='nameAndEmail'>
                                            <h4>Twitter</h4>
                                            <span>{this.state.user.email}</span>
                                        </div>
                                        <div className='btns'>
                                            <button className='btn-change'>Change</button>
                                            <button className='btn-disconnect'
                                                    onClick={() => this.updateUserService('is_ds_twitter_tracking_enabled')}
                                            >Disconnect
                                            </button>
                                        </div>
                                    </div>
                                    : ''}
                            {
                                this.state.user.is_ds_bitbucket_tracking_enabled ?
                                    <div className='account'>
                                        <figure><img className='socialImage' src='/bitbucket-small.svg'
                                                     alt='user image'/></figure>
                                        <div className='nameAndEmail'>
                                            <h4>Bitbucket</h4>
                                            <span>{this.state.user.email}</span>
                                        </div>
                                        <div className='btns'>
                                            <button className='btn-change'>Change</button>
                                            <button className='btn-disconnect'
                                                    onClick={() => this.updateUserService('is_ds_bitbucket_tracking_enabled')}
                                            >Disconnect
                                            </button>
                                        </div>
                                    </div>
                                    : ''}
                            {
                                this.state.user.is_ds_github_tracking_enabled ?
                                    <div className='account'>
                                        <figure><img className='socialImage' src='/images/icons/github.png'
                                                     alt='user image'/></figure>
                                        <div className='nameAndEmail'>
                                            <h4>Github</h4>
                                            <span>{this.state.user.email}</span>
                                        </div>
                                        <div className='btns'>
                                            <button className='btn-change'>Change</button>
                                            <button className='btn-disconnect'
                                                    onClick={() => this.updateUserService('is_ds_github_tracking_enabled')}
                                            >Disconnect
                                            </button>
                                        </div>
                                    </div>
                                    : ''}
                            {
                                this.state.user.is_ds_instagram_tracking_enabled ?
                                    <div className='account'>
                                        <figure><img className='socialImage' src='/images/icons/instagram.png'
                                                     alt='user image'/></figure>
                                        <div className='nameAndEmail'>
                                            <h4>Instagram</h4>
                                            <span>{this.state.user.email}</span>
                                        </div>
                                        <div className='btns'>
                                            <button className='btn-change'>Change</button>
                                            <button className='btn-disconnect'
                                                    onClick={() => this.updateUserService('is_ds_instagram_tracking_enabled')}
                                            >Disconnect
                                            </button>
                                        </div>
                                    </div>
                                    : ''} */}

                            {
                                this.state.facebookAccounts.map(facebookAccount => {
                                    // className: reconnect
                                    return <div className='account'>
                                        <figure><img className='socialImage' src='/images/icons/facebook.png'
                                                     alt='user image'/></figure>
                                        <div className='nameAndEmail'>
                                            <h4>{facebookAccount.name}</h4>
                                            <span>{facebookAccount.email}</span>
                                        </div>
                                        <div className='btns'>
                                            <button className='btn-change'>Change</button>
                                            <button className='btn-disconnect'
                                                    onClick={() => this.handleFacebookDelete(facebookAccount.id)}
                                            >Disconnect
                                            </button>
                                        </div>
                                    </div>
                                })
                            }
                            {/* {
                                this.state.user.is_ds_facebook_tracking_enabled ?
                                    <div className='account'>
                                        <figure><img className='socialImage' src='/images/icons/facebook.png'
                                                     alt='user image'/></figure>
                                        <div className='nameAndEmail'>
                                            <h4>Facebook</h4>
                                            <span>{this.state.user.email}</span>
                                        </div>
                                        <div className='btns'>
                                            <button className='btn-change'>Change</button>
                                            <button className='btn-disconnect'
                                                    onClick={() => this.updateUserService('is_ds_facebook_tracking_enabled')}
                                            >Disconnect
                                            </button>
                                        </div>
                                    </div>
                                    : ''} */}
                        </div>
                    </section>
                    {/*<section className='accountsHolder'>
                        <h3>Recommended for you</h3>
                        <div className="accounts recommendedForYour">
                            <div className='account'>
                                <figure><img className='socialImage' src='/images/icons/github.png' alt='user image'/>
                                </figure>
                                <div className='nameAndEmail'>
                                    <h4>Connect Github</h4>
                                </div>
                            </div>
                            <div className='account'>
                                <figure><img className='socialImage' src='/images/icons/spotify.svg' alt='user image'/>
                                </figure>
                                <div className='nameAndEmail'>
                                    <h4>Connect Spotify</h4>
                                </div>
                            </div>
                            <div className='account'>
                                <figure><img className='socialImage' src='/images/icons/adwords.png' alt='user image'/>
                                </figure>
                                <div className='nameAndEmail'>
                                    <h4>Connect Google Analytics</h4>
                                </div>
                            </div>
                        </div>
                    </section>*/}
                    <section className='accountsHolder'>
                        {/*<h3>Analytics Accounts</h3>*/}

                        <div className='btn-goToAnalyticsAccount'>
                            <span className='mb-3'>
                                <a href='/ga-accounts'>
                                Go to Analytics accounts
                                <i className='ml-2'><svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                         xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M13.3 17.275C13.1 17.075 13.004 16.8333 13.012 16.55C13.0207 16.2667 13.125 16.025 13.325 15.825L16.15 13H5C4.71667 13 4.479 12.904 4.287 12.712C4.09567 12.5207 4 12.2833 4 12C4 11.7167 4.09567 11.479 4.287 11.287C4.479 11.0957 4.71667 11 5 11H16.15L13.3 8.14999C13.1 7.94999 13 7.71232 13 7.43699C13 7.16232 13.1 6.92499 13.3 6.72499C13.5 6.52499 13.7377 6.42499 14.013 6.42499C14.2877 6.42499 14.525 6.52499 14.725 6.72499L19.3 11.3C19.4 11.4 19.471 11.5083 19.513 11.625C19.5543 11.7417 19.575 11.8667 19.575 12C19.575 12.1333 19.5543 12.2583 19.513 12.375C19.471 12.4917 19.4 12.6 19.3 12.7L14.7 17.3C14.5167 17.4833 14.2877 17.575 14.013 17.575C13.7377 17.575 13.5 17.475 13.3 17.275Z"
                                        fill="#096DB7"/>
                                </svg></i>
                                </a>
                            </span>
                            <span>link search console to properties and much more...</span>
                        </div>
                    </section>
                </Container>
            </div>

            {/* <div id="analaticsAccountPage" className="analaticsAccountPage pageWrapper">
                <Container>
                    <div className="pageHeader analaticsAccountPageHead">
                        <h2 className="pageTitle">Analytics Accounts</h2>
                        <form className="pageFilters d-flex justify-content-between align-items-center">
                            <FormGroup className="filter-sort position-relative">
                                <Label className="sr-only" for="dropdownFilters">sort by filter</Label>
                                <i className="btn-searchIcon left-0">
                                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 10V8.33333H4V10H0ZM0 5.83333V4.16667H8V5.83333H0ZM0 1.66667V0H12V1.66667H0Z" fill="#666666" />
                                    </svg>
                                </i>
                                <i className="btn-searchIcon right-0 fa fa-angle-down"></i>
                                <select name="sortBy" id="sort-by" value='' className="form-control">
                                    <option value="Null">Sort By</option>
                                    <option value="added">Added</option>
                                    <option value="date">By Date</option>
                                    <option value="category">By Category</option>
                                    <option value="ga-property">By GA Property</option>
                                </select>
                            </FormGroup>

                            <FormGroup className="filter-search position-relative">
                                <Label className="sr-only" for="search">search</Label>
                                <Input name="searchText" value='' placeholder="Search..." />
                                <button className="btn-searchIcon"><img className="d-block" src="/search-new.svg" width="16" height="16" alt="Search" /></button>
                            </FormGroup>
                        </form>
                    </div>

                    <div className="dataTable dataTableAnalyticsAccount d-flex flex-column">
                        <div className="dataTableHolder">
                            <div className="tableHead singleRow justify-content-between align-items-center">
                                <div className="singleCol text-left">ID for API</div>
                                <div className="singleCol text-left">Analytics Accounts</div>
                                <div className="singleCol text-left">Properties &amp; Apps</div>
                                <div className="singleCol text-left">Search Console <i className='fa fa-exclamation-circle ml-2' data-toggle="tooltip" data-placement="top" title="Please remove and reconnect account"></i></div>
                                <div className="singleCol text-left">Google Account</div>
                                <div className="singleCol text-right">&nbsp;</div>
                            </div>
                            <div className="tableBody">

                                {this.state.googleAnalyticsProperties.map(gAP => {
                                    return <div className="singleRow justify-content-between align-items-center" key={gAP.id}>
                                        <div className="singleCol text-left"><span>{gAP.id}</span></div>
                                        <div className="singleCol text-left"><span className='w-100 d-flex justify-content-start'>{(gAP.google_analytics_account) ? gAP.google_analytics_account.name : ''}{gAP.is_in_use ? <em className='tag-inuse'><i className='fa fa-check'></i><i>In use</i></em> : null}</span></div>
                                        <div className="singleCol text-left">
                                            <span className='d-flex justify-content-between w-100'>
                                                <span>{gAP.name}</span>
                                                {gAP.is_in_use ? <i><img src={'/icon-link-green.svg'} /></i> : <i><img src={'/icon-unlink-red.svg'} /></i>}
                                            </span>
                                        </div>
                                        <div className="singleCol text-left d-flex flex-column">
                                            <div className="themeNewInputStyle position-relative w-100">
                                                <i className="btn-searchIcon right-0 fa fa-angle-down"></i>
                                                <select name="" value='' className="form-control selected">
                                                    <option value="Null">Select website</option>
                                                </select>
                                                <i className="btn-searchIcon left-0 fa fa-check-circle"></i>
                                            </div>
                                        </div>
                                        <div className="singleCol text-left"><span>{gAP.google_account.name}</span></div>
                                        <div className="singleCol text-right"><span><img src={`/icon-trash.svg`} onClick={() => this.handleGAPDelete(gAP.id)} /></span></div>
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                </Container>
            </div> */}

            {/*<AdwordsClientCustomerIdSaverModal*/}
            {/*    show={this.state.showACCISModal}*/}
            {/*    dismissCallback={this.closeACCISModal}*/}
            {/*/>*/}
            {/* <div className="container p-5">
                <div className="row ml-0 mr-0">
                    <div className="col-12">
                        <h2 className="heading-section gaa-title">Connect Multiple GA Accounts/Properties</h2>
                    </div>
                </div>

                <div className="row ml-0 mr-0">
                    <div className="col-md-12">
                        <a id="properties-video-modal-button" className="float-right" href="#" target="_blank" data-toggle="modal" data-target="#properties-video-modal">How to use the properties</a>
                    </div>
                    <VideoModalBox id="properties-video-modal" src="https://www.youtube.com/embed/4tRGhuK7ZWQ" />
                </div>
                <div className="row ml-0 mr-0">
                    <div className="col-12">
                        <ErrorAlert errors={this.state.errors} />
                    </div>
                </div>
                <div className="row ml-0 mr-0 my-5">
                    <div className="col-12 text-center text-md-right text-lg-right">
                        <a href="#"
                            onClick={this.restrictionHandler}
                            className="btn gaa-btn-primary text-white" >
                            Connect New Account
                        </a>
                    </div>
                </div>
                <div className="row ml-0 mr-0">
                    <div className="col-12">
                        <div className="table-responsive">
                            <table className="table table-hover gaa-hover table-bordered">
                                <thead>
                                    <tr>
                                        <th className="col-1">Profile Image</th>
                                        <th>Google Account</th>
                                        <th>Email</th>
                                        <th className="col-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.googleAccounts.map(googleAccount => {
                                            const scopes = JSON.parse(googleAccount.scopes) ?? [];
                                            return <tr key={googleAccount.id}>
                                                <td><img src={googleAccount.avatar} className="social-profile-picture" /></td>
                                                <td>
                                                    {googleAccount.name}<br />
                                                    {scopes.indexOf("https://www.googleapis.com/auth/analytics.readonly") != -1 ? <span className="badge badge-success">Google Analytics Access <i className="fa fa-check"></i></span> : ""}
                                                    {scopes.indexOf("https://www.googleapis.com/auth/webmasters") != -1 || scopes.indexOf("https://www.googleapis.com/auth/webmasters.readonly") != -1 ? <span className="badge badge-success">Search Console Access <i className="fa fa-check"></i></span> : ""}
                                                    {scopes.indexOf("https://www.googleapis.com/auth/adwords") != -1 ? <span className="badge badge-success">Google Ads Access <i className="fa fa-check"></i></span> : ""}
                                                </td>
                                                <td>{googleAccount.email}</td>
                                                <td className="text-center">
                                                    <button onClick={() => this.handleDelete(googleAccount.id)} className="btn ad-ga-action gaa-btn-danger">
                                                        <i className="fa fa-unlink mr-0 mr-md-2 mr-lg"></i>
                                                        <span className="ad-ga-action-text">Disconnect</span>
                                                    </button>
                                                    <button onClick={() => { this.fetchGAAccounts(googleAccount.id); this.fetchGSCSites(googleAccount.id); }} className="btn ad-ga-action gaa-btn-primary ml-1">
                                                        <i className="fa fa-search mr-0 mr-md-2 mr-lg"></i>
                                                        <span className="ad-ga-action-text">Search Accounts</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        })
                                    }

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="row ml-0 mr-0 mt-5">
                    <div className="col-12">
                        <div className="table-responsive">
                            <table className="table table-hover gaa-hover table-bordered">
                                <thead>
                                    <tr>
                                        <th>Google Analytics Name</th>
                                        <th>Google Analytics ID</th>
                                        <th>Property Type</th>
                                        <th>Added On</th>
                                        <th>Google Account</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.googleAnalyticsAccounts.map(gAA => {
                                        return <tr key={gAA.id}>
                                            <td>{gAA.name}</td>
                                            <td>{gAA.ga_id}</td>
                                            <td>{gAA.property_type}</td>
                                            <td>{moment(gAA.created_at).format('YYYY-MM-DD HH:mm:ss')}</td>
                                            <td>{gAA.google_account.name}</td>
                                            <td className="text-center"><button className="btn btn-danger" onClick={() => this.handleGAADelete(gAA.id)}><i className="fa fa-trash-o"></i></button></td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="row ml-0 mr-0 mt-5">
                    <div className="col-12">
                        <div className="table-responsive">
                            <table className="table table-hover gaa-hover table-bordered">
                                <thead>
                                    <tr>
                                        <th>ID for API</th>
                                        <th>Analytics Accounts</th>
                                        <th>Properties &amp; Apps</th>
                                        <th>Google Account</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.googleAnalyticsProperties.map(gAP => {
                                        return <tr key={gAP.id}>
                                            <td>{gAP.id}</td>
                                            <td>{(gAP.google_analytics_account) ? gAP.google_analytics_account.name : ''}</td>
                                            <td>
                                                {gAP.name}&nbsp;&nbsp;&nbsp;
                                                {gAP.is_in_use ? <span className="badge badge-pill badge-success">In use</span> : null}
                                            </td>
                                            <td>{gAP.google_account.name}</td>
                                            <td className="text-center"><button className="btn btn-danger" onClick={() => this.handleGAPDelete(gAP.id)}><i className="fa fa-trash-o"></i></button></td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="row ml-0 mr-0 mt-5">
                    <div className="col-12">
                        <div className="table-responsive">
                            <table className="table table-hover gaa-hover table-bordered">
                                <thead>
                                    <tr>
                                        <th>Site URL</th>
                                        <th>Permission Level</th>
                                        <th>Google Account</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.googleSearchConsoleSites.map(gSCS => {
                                        return <tr key={gSCS.id}>
                                            <td>{gSCS.site_url}</td>
                                            <td>{gSCS.permission_level}</td>
                                            <td>{gSCS.google_account.name}</td>
                                            <td className="text-center"><button className="btn btn-danger" onClick={() => this.handleGSCSDelete(gSCS.id)}><i className="fa fa-trash-o"></i></button></td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div> */}

            {this.state.isPermissionPopupOpened ? <GooglePermissionPopup/> : ''}
        </>);
    }

    getGoogleAccounts() {
        this.setState({isBusy: true})
        HttpClient.get('/settings/google-account').then(resp => {
            this.setState({googleAccounts: resp.data.google_accounts, isBusy: false});
        }, (err) => {

            this.setState({isBusy: false, errors: (err.response).data});
        }).catch(err => {

            this.setState({isBusy: false, errors: err});
        });
    }

    getFacebookAccounts() {
        this.setState({isBusy: true})
        HttpClient.get('/settings/facebook-accounts').then(resp => {
            this.setState({facebookAccounts: resp.data.facebook_accounts, isBusy: false});
        }, (err) => {

            this.setState({isBusy: false, errors: (err.response).data});
        }).catch(err => {

            this.setState({isBusy: false, errors: err});
        });
    }

    handleDelete(id) {
        this.setState({isBusy: true});
        HttpClient.delete(`/settings/google-account/${id}`).then(resp => {
            Toast.fire({
                icon: 'success',
                title: "Account removed.",
            });
            let googleAccounts = this.state.googleAccounts;
            googleAccounts = googleAccounts.filter(ga => ga.id != id);
            this.setState({isBusy: false, googleAccounts: googleAccounts})
        }, (err) => {
            this.setState({isBusy: false, errors: (err.response).data});
        }).catch(err => {
            this.setState({isBusy: false, errors: err});
        });
    }

    handleFacebookDelete(id) {
        this.setState({isBusy: true});
        HttpClient.delete(`/settings/facebook-account/${id}`).then(resp => {
            Toast.fire({
                icon: 'success',
                title: "Account removed.",
            });
            let facebookAccounts = this.state.facebookAccounts;
            facebookAccounts = facebookAccounts.filter(ga => ga.id != id);
            this.setState({isBusy: false, facebookAccounts: facebookAccounts})
        }, (err) => {
            this.setState({isBusy: false, errors: (err.response).data});
        }).catch(err => {
            this.setState({isBusy: false, errors: err});
        });
    }

    fetchGAAccounts(id) {
        this.setState({isBusy: true});
        return HttpClient.post(`/settings/google-analytics-account/google-account/${id}`).then(resp => {
            Toast.fire({
                icon: 'success',
                title: "Accounts fetched.",
            });
            this.setState({isBusy: false})
            return this.getGAAccounts() && this.getGAProperties();
        }, (err) => {
            this.setState({isBusy: false, errors: (err.response).data});
            return false;
        }).catch(err => {
            this.setState({isBusy: false, errors: err});
            return false;
        });
    }

    fetchGSCSites(id) {
        this.setState({isBusy: true});
        return HttpClient.post(`/settings/google-search-console-site/google-account/${id}`).then(resp => {
            Toast.fire({
                icon: 'success',
                title: "Sites fetched.",
            });
            this.setState({isBusy: false})
            return this.getGSCSites();
        }, (err) => {
            this.setState({isBusy: false, errors: (err.response).data});
            return false;
        }).catch(err => {
            this.setState({isBusy: false, errors: err});
            return false;
        });
    }

    getGAAccounts() {
        this.setState({isBusy: true});
        return HttpClient.get(`/settings/google-analytics-account`).then(response => {
            this.setState({isBusy: false, googleAnalyticsAccounts: response.data.google_analytics_accounts})
            return true;
        }, (err) => {
            this.setState({isBusy: false, errors: (err.response).data});
            return false;
        }).catch(err => {
            this.setState({isBusy: false, errors: err});
            return false;
        });
    }

    getGSCSites() {
        this.setState({isBusy: true});
        return HttpClient.get(`/settings/google-search-console-site`).then(response => {
            this.setState({isBusy: false, googleSearchConsoleSites: response.data.google_search_console_sites})
            return true;
        }, (err) => {
            this.setState({isBusy: false, errors: (err.response).data});
            return false;
        }).catch(err => {
            this.setState({isBusy: false, errors: err});
            return false;
        });
    }

    restrictionHandler(e) {
        e.preventDefault();
        if (this.state.user.price_plan.ga_account_count > this.state.googleAccounts.length || this.state.user.price_plan.ga_account_count == 0) {
            this.setState({isPermissionPopupOpened: true});
        } else {

            this.props.upgradePopup('increase-limits')
        }
    }

    handleGAADelete(gAAId) {
        if (!this.state.isBusy) {
            this.setState({isBusy: true})
            HttpClient.delete(`/settings/google-analytics-account/${gAAId}`).then(response => {
                this.setState({
                    isBusy: false,
                    googleAnalyticsAccounts: this.state.googleAnalyticsAccounts.filter(g => g.id !== gAAId)
                })
                Toast.fire({
                    icon: 'success',
                    title: "Account removed.",
                });
            }, (err) => {
                this.setState({isBusy: false, errors: (err.response).data});
            }).catch(err => {
                this.setState({isBusy: false, errors: err});
            });
        }
    }

    handleGAPDelete(gAPId) {
        if (!this.state.isBusy) {
            this.setState({isBusy: true})
            HttpClient.delete(`/settings/google-analytics-property/${gAPId}`).then(response => {
                this.setState({
                    isBusy: false,
                    googleAnalyticsProperties: this.state.googleAnalyticsProperties.filter(g => g.id !== gAPId)
                })
                Toast.fire({
                    icon: 'success',
                    title: "Property removed.",
                });
            }, (err) => {
                this.setState({isBusy: false, errors: (err.response).data});
            }).catch(err => {
                this.setState({isBusy: false, errors: err});
            });
        }
    }

    handleGSCSDelete(gSCS) {
        if (!this.state.isBusy) {
            this.setState({isBusy: true})
            HttpClient.delete(`/settings/google-search-console-site/${gSCS}`).then(response => {
                this.setState({
                    isBusy: false,
                    googleSearchConsoleSites: this.state.googleSearchConsoleSites.filter(g => g.id !== gSCS)
                })
                Toast.fire({
                    icon: 'success',
                    title: "Site removed.",
                });
            }, (err) => {
                this.setState({isBusy: false, errors: (err.response).data});
            }).catch(err => {
                this.setState({isBusy: false, errors: err});
            });
        }
    }

    closeACCISModal() {
        this.setState({showACCISModal: false})
    }

    getGAProperties() {
        this.setState({isBusy: true});
        return HttpClient.get(`/settings/google-analytics-property`).then(response => {
            this.setState({isBusy: false, googleAnalyticsProperties: response.data.google_analytics_properties})
            return true;
        }, (err) => {
            this.setState({isBusy: false, errors: (err.response).data});
            return false;
        }).catch(err => {
            this.setState({isBusy: false, errors: err});
            return false;
        });
    }

}
