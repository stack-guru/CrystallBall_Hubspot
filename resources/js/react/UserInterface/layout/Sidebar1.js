import React from 'react';
import { Link } from 'react-router-dom';
require('../Main.css');

import * as $ from 'jquery';
class sidebar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }

    componentDidMount() {
        $('.sidebar').hover(

            function () {
                // if($('.setting-menu-item.dropdown').hasClass('open'))
                // $('.setting-menu-item.dropdown').addClass('open')
            },

            function () {
                if($('.setting-menu-item.dropdown').hasClass('open')){
                    $('.setting-menu-item.dropdown').removeClass('open')
                    $('.arrow .t').removeClass('ti-angle-down');
                }
            }
        );
        $('.setting-menu-item').click(function(){
            $('.setting-menu-item.dropdown').toggleClass('open');
            $('.arrow .t').toggleClass('ti-angle-down');
        });
    }

    render() {

        return (
            <div className="sidebar-inner">
                <div className="sidebar-logo bg-white">
                    <div className="peers ai-c fxw-nw">
                        <div className="peer peer-greed"><a className="sidebar-link td-n" href="/">
                            <div className="peers ai-c fxw-nw">
                                <div className="peer">
                                    <div className="logo d-flex justify-content-center align-items-center" style={{minHeight: 65}}>
                                        <img src="/images/company_logo.png" width="40px" height="40px" alt="" />
                                    </div>
                                </div>
                                <div className="peer peer-greed "><h5 className="lh-1 logo-text m-0">GAannotations</h5>
                                </div>
                            </div>
                        </a></div>
                        <div className="peer">
                            <div className="mobile-toggle sidebar-toggle"><a href={null} className="td-n"><i
                                className="ti-arrow-circle-left"></i></a></div>
                        </div>
                    </div>
                </div>
                {/**/}
                <nav className="nav flex-column">
                <ul className="sidebar-menu scrollable pos-r ">

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
                    <li className="nav-item gaa-menu-item">
                        <Link to="/integrations" >
                            <span className="sidebar-link" >
                                <span className="icon-holder">

                                    <i className="fa fa-cogs"></i>
                                </span>
                                <span className="title">Integrations</span>
                            </span>
                        </Link>
                    </li>
                    <li className="nav-item gaa-menu-item">
                        <Link to="/data-source" >
                            <span className="sidebar-link" >
                                <span className="icon-holder">

                                    <i className="ti-server"></i>

                                </span>
                                <span className="title">Data Source</span>
                            </span>
                        </Link>
                    </li>


                    <li className="nav-item gaa-menu-item setting-menu-item dropdown">
                        <a  aria-expanded="false" data-target="#settings" aria-controls="settings" data-toggle="collapse"
                            className="dropdown-toggle" >
                            <div className="wrapper sidebar-link">
                            <span className="icon-holder">
                              <i className="ti-settings "></i>
                            </span>
                                <span className="title">Settings</span>
                                <span className="arrow">
                                    <i className="t ti-angle-right"></i>
                                </span>
                            </div>
                        </a>
                        <div  className="collapse dropdown-menu setting-menu-content " id="settings ">
                            <ul className="list-unstyled" >
                                <li className="nav-item dropdown">
                                    <Link to="/settings/change-password" className="sidebar-link">
                                        <span className="nav-link ">Change password</span>
                                    </Link>
                                </li>
                                <li className="nav-item dropdown">
                                    <Link to="/settings/google-account"  className="sidebar-link" >
                                        <span className="nav-link">Add google account</span>
                                    </Link>
                                </li>

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
                        </div>
                    </li>


                    <div className="nav-item gaa-menu-item gaa-text-danger ">
                        <a href="https://chrome.google.com/webstore/detail/google-analytics-annotati/jfkimpgkmamkdhamnhabohpeaplbpmom?hl=en&authuser=1" target="_blank">
                            <span className="sidebar-link gaa-text-danger" >
                                <span className="icon-holder gaa-text-danger">
                                    <i className="fa fa-cube"></i>
                                </span>
                                <span className="title">Add Chrome Extension</span>
                            </span>
                        </a>
                    </div>

                </ul>
                    {/*sidebar-footer*/}

                </nav>
            </div>
        )
    }
}
export default sidebar;
