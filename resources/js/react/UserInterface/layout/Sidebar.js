import React from 'react';
import { Link } from 'react-router-dom';
import * as $ from 'jquery';
import CompanyLogo from '../utils/CompanyLogo';
import CompanyHeading from '../utils/CompanyHeading';

class Sidebar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
        }

    }

    componentDidMount() {
        $('.sidebar').hover(
            function () {
                if ($('.setting-menu-item.dropdown').hasClass('open')) {
                    $('.setting-menu-item.dropdown').removeClass('open')
                    $('.arrow .t').removeClass('ti-angle-down');
                }
            }
        );
        $('.setting-menu-item').click(function () {
            $('.setting-menu-item.dropdown').toggleClass('open');
            $('.arrow .t').toggleClass('ti-angle-down');
        });

        $(".td-n").click(function (e) {
            $("body").toggleClass("is-collapsed");
        });

        const { SVGInjector } = window.SVGInjector
        SVGInjector(document.getElementsByClassName('inject-me'), {
            cacheRequests: false,
            evalScripts: 'once',
            httpRequestWithCredentials: false,
            renumerateIRIElements: false
        })
    }

    showBetaAlert(ev) {
        ev.preventDefault();
        let alreadyDisplayed = localStorage.getItem('analytics_popup_showed') === 'true';
        if (!alreadyDisplayed) {
            swal.fire({
                title: "",
                text: "This page is still on Beta, would you like to access anyway?",
                icon: "warning",
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                dangerMode: true,
            }).then(value => {
                // save state
                localStorage.setItem('analytics_popup_showed', 'true');
                if (value.isConfirmed) {
                    window.location.href = '/analytics';
                }
            })
        } else{
            window.location.href = '/analytics';
        }
    }

    toggleSidebar(e) {
        e.preventDefault();
        let body = document.getElementsByTagName("body")[0];
        if (body.classList.contains("is-collapsed")) {
            body.classList.remove("is-collapsed")
        } else {
            body.classList.add("is-collapsed")
        }
    }

    render() {
        return (
            <div className="sidebar-inner OSXscroll d-flex flex-column">
                <a id="sidebar-toggle" className="desktop-toggle sidebar-toggle text-center d-block btn btn-sm" href="#" onClick={this.toggleSidebar}><i className="ti-angle-right"></i></a>
                {/* <div className="sidebar-logo bg-white">
                    <div className="peers ai-c fxw-nw">
                        <div className="peer">
                            <div className="mobile-toggle sidebar-toggle"><a href={null} className="td-n" type="button"><i className="ti-arrow-circle-left"></i></a></div>
                        </div>
                    </div>
                </div> */}
                <nav className='flex-grow-1'>
                    <ul className="sidebar-menu scrollable pos-r border-0">
                        <li className="nav-item gaa-menu-item">
                            <Link to="/annotation">
                                <span className="sidebar-link d-flex align-items-center justify-content-start">
                                    <span><img className='inject-me' src='/allAnnotations.svg' width='26' height='26' alt='menu icon'/></span>
                                    <span className="title flex-grow-1">All Annotations</span>
                                </span>
                            </Link>
                        </li>
                        {this.props.user.user_level == "admin" ||
                        this.props.user.user_level == "team" ? (
                            <li className="nav-item gaa-menu-item">
                                <Link to="/annotation/create">
                                    <span className="sidebar-link d-flex align-items-center justify-content-start">
                                        <span><img className='inject-me' src='/addAnnotation.svg' width='26' height='26' alt='menu icon'/></span>
                                        <span className="title flex-grow-1">Add Annotation</span>
                                    </span>
                                </Link>
                            </li>
                        ) : null}
                        {this.props.user.user_level == "admin" ||
                        this.props.user.user_level == "team" ? (
                            <li className="nav-item gaa-menu-item">
                                <Link to="/annotation/upload">
                                    <span className="sidebar-link d-flex align-items-center justify-content-start">
                                        <span><img className='inject-me' src='/csvUpload.svg' width='26' height='26' alt='menu icon'/></span>
                                        <span className="title flex-grow-1">CSV Upload</span>
                                    </span>
                                </Link>
                            </li>
                        ) : null}
                        <li className="nav-item gaa-menu-item">
                            <Link to="/data-source">
                                <span className="sidebar-link d-flex align-items-center justify-content-start">
                                    <span><img className='inject-me' src='/appsMarket.svg' width='26' height='26' alt='menu icon'/></span>
                                    <span className="title flex-grow-1">Apps Market</span>
                                </span>
                            </Link>
                        </li>
                        <li className="nav-item gaa-menu-item">
                            <Link to="/integrations">
                                <span className="sidebar-link d-flex align-items-center justify-content-start">
                                    <span><img className='inject-me' src='/integrations.svg' width='26' height='26' alt='menu icon'/></span>
                                    <span className="title flex-grow-1">Integrations</span>
                                </span>
                            </Link>
                        </li>
                        <li className="nav-item gaa-menu-item">
                            <Link to="/settings/google-account">
                                <span className="sidebar-link d-flex align-items-center justify-content-start">
                                    <span><img className='inject-me' src='/addProperties.svg' width='26' height='26' alt='menu icon'/></span>
                                    <span className="title flex-grow-1">Add Properties</span>
                                </span>
                            </Link>
                        </li>
                        <li className="nav-item gaa-menu-item">
                            <Link to="/settings/user">
                                <span className="sidebar-link d-flex align-items-center justify-content-start">
                                    <span><img className='inject-me' src='/manageUsers.svg' width='26' height='26' alt='menu icon'/></span>
                                    <span className="title flex-grow-1">Manage Users</span>
                                </span>
                            </Link>
                        </li>
                        <li className="nav-item gaa-menu-item">
                            <Link to="/analytics-and-business-intelligence">
                                <span className="sidebar-link d-flex align-items-center justify-content-start">
                                    <span><img className='inject-me' src='/analyticsBiTools.svg' width='26' height='26' alt='menu icon'/></span>
                                    <span className="title flex-grow-1">Analytics &amp; BI tools</span>
                                </span>
                            </Link>
                        </li>
                        <li className="nav-item gaa-menu-item">
                            <Link to="/api-key">
                                <span className="sidebar-link d-flex align-items-center justify-content-start">
                                    <span><img className='inject-me' src='/apiKeys.svg' width='26' height='26' alt='menu icon'/></span>
                                    <span className="title flex-grow-1 ">API Keys</span>
                                </span>
                            </Link>
                        </li>
                        <li className="nav-item gaa-menu-item">
                            <Link to="/notifications">
                                <span className="sidebar-link d-flex align-items-center justify-content-start">
                                    <span><img className='inject-me' src='/notifications.svg' width='26' height='26' alt='menu icon'/></span>
                                    <span className="title flex-grow-1">Notifications</span>
                                </span>
                            </Link>
                        </li>
                        <li className="nav-item gaa-menu-item setting-menu-item dropdown">
                            <a aria-expanded="false" data-target="#settings" aria-controls="settings" data-toggle="collapse collapsed" className="dropdown-toggle">
                                <div className="wrapper sidebar-link d-flex align-items-center justify-content-start">
                                    <span><img className='inject-me' src='/settings.svg' width='26' height='26' alt='menu icon'/></span>
                                    <span className="title flex-grow-1">Settings</span>
                                    <span className="arrow"><i className="t ti-angle-right"></i></span>
                                </div>
                            </a>
                            <div className="collapse dropdown-menu setting-menu-content" id="settings">
                                <ul className="list-unstyled">
                                    {this.props.user.user_level == "admin" || this.props.user.user_level == "team" ? (
                                        <React.Fragment>
                                            <li className="nav-item dropdown"><Link to="/settings/google-account" className="sidebar-link"><span className="nav-link">Add Properties/Accounts</span></Link></li>
                                            <li className="nav-item dropdown"><Link to="/settings/user" className="sidebar-link"><span className="nav-link">Manage Users</span></Link></li>
                                            <li className="nav-item dropdown"><Link to="/settings/price-plans" className="sidebar-link"><span className="nav-link">Plans</span></Link></li>
                                            <li className="nav-item dropdown"><Link to="/settings/payment-history" className="sidebar-link"><span className="nav-link">Payment History</span></Link></li>
                                            <li className="nav-item dropdown"><div className="sidebar-link nav-link"><a href="/documentation" target="_blank">API Documentation</a></div></li>
                                        </React.Fragment>
                                    ) : null}
                                    <li className="nav-item dropdown"><Link to="/settings/change-password" className="sidebar-link"><span className="nav-link">Profile</span></Link></li>
                                    <li className="nav-item dropdown"><a href="#" onClick={(e) => { e.preventDefault(); this.props.toggleInterfaceTour(true);}}><span className="nav-link">Take a Tour</span></a></li>
                                    <li className="nav-item dropdown"><Link to="/settings/support" className="sidebar-link"><span className="nav-link">Support</span></Link></li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </nav>
                <div className='btn-holder'>
                    <a className='btn-addAnnotation btn btn-primary d-flex align-items-center justify-content-center' href="#">
                        <img src='/plus-new.svg' width='16' height='17' alt='plus icon'/>
                        <span>Add Annotation</span>
                    </a>
                </div>
            </div>
        );
    }
}
export default Sidebar;
