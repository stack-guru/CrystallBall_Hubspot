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
                // if($('.setting-menu-item.dropdown').hasClass('open'))
                // $('.setting-menu-item.dropdown').addClass('open')
            },

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

    render() {
        return (
            <div className="sidebar-inner OSXscroll" >
                <div className="sidebar-logo bg-white">
                    <div className="peers ai-c fxw-nw">
                        <div className="peer peer-greed">
                            <a className="sidebar-link td-n" href="/">
                                <div className="peers ai-c fxw-nw">
                                    <div className="peer">
                                        <div className="logo d-flex justify-content-center align-items-center" style={{ minHeight: 65 }}>
                                            <CompanyLogo width="40px" height="40px" alt="" />
                                        </div>
                                    </div>
                                    <div className="peer peer-greed ">
                                        <CompanyHeading className="lh-1 logo-text m-0" />
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="peer">
                            <div className="mobile-toggle sidebar-toggle">
                                <a href={null} className="td-n" type="button"><i
                                    className="ti-arrow-circle-left"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
                <ul className="sidebar-menu scrollable pos-r ">
                    <li className="nav-item gaa-menu-item">
                        <Link to="/analytics" onClick={(ev) => {
                            this.showBetaAlert(ev)
                        }}>
                            <span className="sidebar-link" >
                                <span className="icon-holder">
                                    <img src="/images/svg/google-analytics-icon.svg" width="25px" height="25px" />
                                </span>
                                <span className="title">Analytics</span>
                            </span>
                        </Link>
                    </li>
                    {/* <li className="nav-item gaa-menu-item">
                        <Link to="/dashboard/search-console" >
                            <span className="sidebar-link" >
                                <span className="icon-holder">
                                    <img src="/images/svg/google-search-console-icon.svg" width="25px" height="25px" />
                                </span>
                                <span className="title">Search Console</span>
                            </span>
                        </Link>
                    </li> */}
                    <li className="nav-item gaa-menu-item">
                        <Link to="/annotation" >
                            <span className="sidebar-link" >
                                <span className="icon-holder">
                                    <img src="/images/svg/annotation-icon.svg" width="25px" height="25px" />
                                </span>
                                <span className="title">Annotations</span>
                            </span>
                        </Link>
                    </li>
                    {
                        this.props.user.user_level == 'admin' || this.props.user.user_level == 'team' ?
                            <li className="nav-item gaa-menu-item">
                                <Link to="/annotation/create">
                                    <span className="sidebar-link" >
                                        <span className="icon-holder">
                                            <img src="/images/svg/addition-icon.svg" width="25px" height="25px" />
                                        </span>
                                        <span className="title">Add Annotation</span>
                                    </span>
                                </Link>
                            </li>
                            : null
                    }
                    {
                        this.props.user.user_level == 'admin' || this.props.user.user_level == 'team' ?
                            <li className="nav-item gaa-menu-item">
                                <Link to="/annotation/upload">
                                    <span className="sidebar-link" >
                                        <span className="icon-holder">
                                            <img src="/images/svg/upload-icon.svg" width="25px" height="25px" />
                                        </span>
                                        <span className="title">CSV Upload</span>
                                    </span>
                                </Link>
                            </li>
                            : null
                    }
                    <li className="nav-item gaa-menu-item">
                        <Link to="/data-source" >
                            <span className="sidebar-link" >
                                <span className="icon-holder">
                                    <img src="/images/svg/automation-icon.svg" width="25px" height="25px" />
                                </span>
                                <span className="title">Automations</span>
                            </span>
                        </Link>
                    </li>
                    <li className="nav-item gaa-menu-item">
                        <Link to="/integrations" >
                            <span className="sidebar-link" >
                                <span className="icon-holder">
                                    <img src="/images/svg/integration-icon.svg" width="25px" height="25px" />
                                </span>
                                <span className="title">Integrations</span>
                            </span>
                        </Link>
                    </li>
                    <li className="nav-item gaa-menu-item">
                        <Link to="/analytics-and-business-intelligence" >
                            <span className="sidebar-link" >
                                <span className="icon-holder">
                                    <img src="/images/svg/analytics-and-business-intelligence-icon.svg" width="25px" height="25px" />
                                </span>
                                <span className="title">Analytics &amp; BI tools</span>
                            </span>
                        </Link>
                    </li>
                    <li className="nav-item gaa-menu-item">
                        <Link to="/api-key" >
                            <span className="sidebar-link" >
                                <span className="icon-holder">
                                    <img src="/images/svg/key-icon.svg" width="25px" height="25px" />
                                </span>
                                <span className="title ">API Keys</span>
                            </span>
                        </Link>
                    </li>
                    <li className="nav-item gaa-menu-item">
                        <Link to="/notifications" >
                            <span className="sidebar-link" >
                                <span className="icon-holder">
                                    <img src="/images/svg/notification-icon.svg" width="25px" height="25px" />
                                </span>
                                <span className="title ">Notifications</span>
                            </span>
                        </Link>
                    </li>


                    <li className="nav-item gaa-menu-item setting-menu-item dropdown">
                        <a aria-expanded="false" data-target="#settings" aria-controls="settings" data-toggle="collapse"
                            className="dropdown-toggle" >
                            <div className="wrapper sidebar-link">
                                <span className="icon-holder">
                                    <img src="/images/svg/settings-icon.svg" width="25px" height="25px" />
                                </span>
                                <span className="title">Settings</span>
                                <span className="arrow">
                                    <i className="t ti-angle-right"></i>
                                </span>
                            </div>
                        </a>
                        <div className="collapse dropdown-menu setting-menu-content " id="settings ">
                            <ul className="list-unstyled" >
                                {
                                    this.props.user.user_level == 'admin' || this.props.user.user_level == 'team' ?
                                        <React.Fragment>
                                            <li className="nav-item dropdown">
                                                <Link to="/settings/google-account" className="sidebar-link" >
                                                    <span className="nav-link">Add Analytics Accounts</span>
                                                </Link>
                                            </li>
                                            <li className="nav-item dropdown">
                                                <Link to="/settings/user" className="sidebar-link" >
                                                    <span className="nav-link">Manage Users</span>
                                                </Link>
                                            </li>
                                            <li className="nav-item dropdown">
                                                <Link to="/settings/price-plans" className="sidebar-link">
                                                    <span className="nav-link">Plans</span>
                                                </Link>
                                            </li>
                                            <li className="nav-item dropdown">
                                                <Link to="/settings/payment-history" className="sidebar-link">
                                                    <span className="nav-link">Payment History</span>
                                                </Link>
                                            </li>
                                            <li className="nav-item dropdown">
                                                <div className="sidebar-link nav-link">
                                                    <a href="/documentation" target="_blank">API Documentation</a>
                                                </div>
                                            </li>
                                        </React.Fragment>
                                        : null
                                }
                                <li className="nav-item dropdown">
                                    <Link to="/settings/change-password" className="sidebar-link">
                                        <span className="nav-link ">Profile</span>
                                    </Link>
                                </li>
                                <li className="nav-item dropdown">

                                    <div className="sidebar-link nav-link">
                                        <a href="#" onClick={(e) => { e.preventDefault(); this.props.toggleInterfaceTour(true); }}>Take a Tour</a>
                                    </div>
                                </li>
                                <li className="nav-item dropdown">
                                    <div className="sidebar-link nav-link">
                                        <Link to="/settings/support" >Support</Link>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
                {/* <div className="nav-item sidebar-footer  gaa-menu-item gaa-text-danger ">
                    <a href="https://chrome.google.com/webstore/detail/google-analytics-annotati/jfkimpgkmamkdhamnhabohpeaplbpmom?hl=en&authuser=1" target="_blank" id="chrome-extension-download-button">
                        <span className="sidebar-link gaa-text-danger" >
                            <span className="icon-holder gaa-text-danger">
                                <i className="fa fa-cube"></i>
                            </span>
                            <span className="title">Chrome Extension</span>
                        </span>
                    </a>
                </div> */}
            </div>
        )
    }
}
export default Sidebar;
