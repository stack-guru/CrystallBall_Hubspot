import React from 'react';
import { Link } from 'react-router-dom';
require('../Main.css');
class sidebar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }

    render() {
        return (
            <div className="sidebar-inner">
                <div className="sidebar-logo bg-white">
                    <div className="peers ai-c fxw-nw">
                        <div className="peer peer-greed"><a className="sidebar-link td-n" href="/">
                            <div className="peers ai-c fxw-nw">
                                <div className="peer">
                                    <div className="logo logo-margin"><img src="/images/company_logo.png" width="40px" height="40px" alt="" /></div>
                                </div>
                                <div className="peer peer-greed "><h5 className="lh-1 logo-text ">GAannotations</h5>
                                </div>
                            </div>
                        </a></div>
                        <div className="peer">
                            <div className="mobile-toggle sidebar-toggle"><a href={null} className="td-n"><i
                                className="ti-arrow-circle-left"></i></a></div>
                        </div>
                    </div>
                </div>
                <ul className="sidebar-menu scrollable pos-r "> {/*gaa-blue-gradient*/}
                    {/* <li className="nav-item mT-30 actived">
                        <Link to="/dashboard">
                        <span className="sidebar-link" >
                            <span className="icon-holder"><i className="c-blue-500 ti-home"></i> </span>
                            <span className="title">Dashboard</span>
                        </span>
                        </Link>
                    </li> */}
                    <li className="nav-item gaa-menu-item">
                        <Link to="/annotation" >
                            <span className="sidebar-link" >
                                <span className="icon-holder">
                                    <i className="ti-comment-alt"></i>
                                </span>
                                <span className="title">Annotations</span>
                            </span>
                        </Link>
                    </li>
                    <li className="nav-item gaa-menu-item">
                        <Link to="/annotation/create">
                            <span className="sidebar-link" >
                                <span className="icon-holder">
                                    <i className="fa fa-plus"></i>
                                </span>
                                <span className="title">Add Annotation</span>
                            </span>
                        </Link>
                    </li>
                    <li className="nav-item gaa-menu-item">
                        <Link to="/annotation/upload">
                            <span className="sidebar-link" >
                                <span className="icon-holder">
                                    <i className="fa fa-upload"></i>
                                </span>
                                <span className="title">CSV Upload</span>
                            </span>
                        </Link>
                    </li>
                    {/* <li className="nav-item">
                        <Link to="/price-plans" className="text-info">
                        <span className="sidebar-link" >
                            <span className="icon-holder">
                                <i className="fa fa-dollar"></i>
                            </span>
                            <span className="title">Choose plan</span>
                        </span>
                        </Link>
                    </li> */}
                    {/*onClick={e => e.preventDefault()}*/}
                    <li className="nav-item gaa-menu-item">
                        <Link to="/api-key" >
                            <span className="sidebar-link" >
                                <span className="icon-holder">
                                    <i className="fa fa-key"></i>
                                </span>
                                <span className="title ">API Keys</span>
                            </span>
                        </Link>
                    </li>
                    {/* <li className="nav-item">
                        <a href="https://datastudio.google.com">
                        <span className="sidebar-link" >
                            <span className="icon-holder">
                                <i className="c-brown-500 ti-stats-up"></i>
                            </span>
                            <span className="title">Google Studio</span>
                        </span>
                        </a>
                    </li> */}
                    {/* <li className="nav-item">
                        <Link to="/settings">
                        <span className="sidebar-link" >
                            <span className="icon-holder">
                                <i className="fa fa-cogs text-white"></i>
                            </span>
                            <span className="title">Settings</span>
                        </span>
                        </Link>
                    </li> */}
                    {/*<li className="nav-item gaa-menu-item gaa-text-danger">*/}
                    {/*    <a href="https://chrome.google.com/webstore/detail/google-analytics-annotati/jfkimpgkmamkdhamnhabohpeaplbpmom?hl=en&authuser=1" target="_blank">*/}
                    {/*        <span className="sidebar-link gaa-text-danger" >*/}
                    {/*            <span className="icon-holder gaa-text-danger">*/}
                    {/*                <i className="fa fa-cube"></i>*/}
                    {/*            </span>*/}
                    {/*            <span className="title">Add Chrome Extension</span>*/}
                    {/*        </span>*/}
                    {/*    </a>*/}
                    {/*</li>*/}
                    {/*<li className="nav-item">*/}
                    {/*    <a className="sidebar-link" href="">*/}
                    {/*        <span className="icon-holder">*/}
                    {/*            <i className="c-blue-500 ti-share"></i>*/}
                    {/*        </span>*/}
                    {/*        <span className="title">Compose</span>*/}
                    {/*    </a>*/}
                    {/*</li>*/}

                    <li className="nav-item dropdown collapseMenu">
                        <a className="dropdown-toggle"  id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                            <span className="icon-holder">
                              <i className="ti-settings "></i>
                            </span>
                            <span className="title">Settings</span>
                            <span className="arrow">
                            <i className="ti-angle-right"></i>
                            </span>
                        </a>
                        <ul className="dropdown-menu " aria-labelledby="dropdownMenuButton">
                            <li className="nav-item dropdown">
                                <Link to="/settings/change-password" className="sidebar-link">
                                    <span className="nav-link">Change password</span>
                                </Link>
                            </li>
                            <li className="nav-item dropdown">

                                <Link to="/settings/google-account"  className="sidebar-link" >
                                    <span className="nav-link">Add google account</span>
                                </Link>
                            </li>
                            {/*<li className="nav-item dropdown">*/}

                            {/*    <Link to="/settings/price-plans" className="sidebar-link">*/}
                            {/*        <span className="nav-link">Price Plans</span>*/}
                            {/*    </Link>*/}
                            {/*</li>*/}
                            <li className="nav-item dropdown">

                                <Link to="/settings/payment-history" className="sidebar-link">
                                    <span className="nav-link">Payment History</span>
                                </Link>
                            </li>
                            <li className="nav-item dropdown">
                                <div className="sidebar-link nav-link">
                                <a  href="/documentation" target="_blank">API Documentation</a>
                                </div>
                            </li>
                        </ul>
                    </li>


                    {/*<li className="nav-item dropdown"><a className="dropdown-toggle" href={null}><span*/}
                    {/*    className="icon-holder"><i className="c-teal-500 ti-view-list-alt"></i> </span><span*/}
                    {/*    className="title">Multiple Levels</span>*/}
                    {/*    <span className="arrow"><i className="ti-angle-right"></i></span></a>*/}
                    {/*    <ul className="dropdown-menu">*/}
                    {/*        <li className="nav-item dropdown"><a href={null}><span>Menu Item</span></a>*/}
                    {/*        </li>*/}
                    {/*        <li className="nav-item dropdown"><a href={null}><span>Menu Item</span> <span*/}
                    {/*            className="arrow"><i className="ti-angle-right"></i></span></a>*/}
                    {/*            <ul className="dropdown-menu">*/}
                    {/*                <li><a href={null}>Menu Item</a></li>*/}
                    {/*                <li><a href={null}>Menu Item</a></li>*/}
                    {/*            </ul>*/}
                    {/*        </li>*/}
                    {/*    </ul>*/}
                    {/*</li>*/}
                    <li className="nav-item align-bottom d-flex gaa-menu-item gaa-text-danger">
                        <a href="https://chrome.google.com/webstore/detail/google-analytics-annotati/jfkimpgkmamkdhamnhabohpeaplbpmom?hl=en&authuser=1" target="_blank">
                            <span className="sidebar-link gaa-text-danger" >
                                <span className="icon-holder gaa-text-danger">
                                    <i className="fa fa-cube"></i>
                                </span>
                                <span className="title">Add Chrome Extension</span>
                            </span>
                        </a>
                    </li>
                </ul>
                <div className="row ml-0 mr-0 ">

                </div>
            </div>
        )
    }
}
export default sidebar;
