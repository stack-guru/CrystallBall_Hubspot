import React from 'react';
import { Link } from 'react-router-dom';

class sidebar extends React.Component{

    constructor(props) {
        super(props);

    }

    render() {
        return(
            <div className="sidebar-inner">
                <div className="sidebar-logo bg-white">
                    <div className="peers ai-c fxw-nw">
                        <div className="peer peer-greed"><a className="sidebar-link td-n" href="/">
                            <div className="peers ai-c fxw-nw">
                                <div className="peer">
                                    <div className="logo"><img src="/images/company_logo.png"  width="65px" height="65px" alt=""/></div>
                                </div>
                                <div className="peer peer-greed "><h5 className="lh-1 mB-0 logo-text ">GAannotations</h5>
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
                    <li className="nav-item">
                        <Link to="/annotation" >
                        <span className="sidebar-link" >
                            <span className="icon-holder text-danger">
                                 <i className="ti-comment-alt"></i>
                            </span>
                            <span className="title gaa-menu-item">GAannotations</span>
                        </span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/annotation/create">
                        <span className="sidebar-link" >
                            <span className="icon-holder text-success">
                                <i className="fa fa-plus"></i>
                            </span>
                            <span className="title gaa-menu-item">Add Annotation</span>
                        </span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/annotation/upload">
                        <span className="sidebar-link" >
                            <span className="icon-holder text-warning">
                                <i className="fa fa-upload"></i>
                            </span>
                            <span className="title gaa-menu-item">CSV Upload</span>
                        </span>
                        </Link>
                    </li>
                    {/* <li className="nav-item">
                        <Link to="/choose-plan" className="text-info">
                        <span className="sidebar-link" >
                            <span className="icon-holder">
                                <i className="fa fa-dollar"></i>
                            </span>
                            <span className="title">Choose plan</span>
                        </span>
                        </Link>
                    </li> */}
                    <li className="nav-item">
                        <Link to="/api-key">
                        <span className="sidebar-link" >
                            <span className="icon-holder text-info">
                                <i className="fa fa-key"></i>
                            </span>
                            <span className="title gaa-menu-item">API Keys</span>
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
                    <li className="nav-item">
                        <Link to="#">
                        <span className="sidebar-link" >
                            <span className="icon-holder text-default">
                                <i className="fa fa-cube"></i>
                            </span>
                            <span className="title gaa-menu-item">Add Chrome Extension</span>
                        </span>
                        </Link>
                    </li>
                    {/*<li className="nav-item">*/}
                    {/*    <a className="sidebar-link" href="">*/}
                    {/*        <span className="icon-holder">*/}
                    {/*            <i className="c-blue-500 ti-share"></i>*/}
                    {/*        </span>*/}
                    {/*        <span className="title">Compose</span>*/}
                    {/*    </a>*/}
                    {/*</li>*/}

                    {/*<li className="nav-item dropdown">*/}
                    {/*    <a className="dropdown-toggle">*/}
                    {/*        <span className="icon-holder">*/}
                    {/*        <i className="c-orange-500 ti-layout-list-thumb"></i>*/}
                    {/*        </span>*/}
                    {/*        <span className="title">Tables</span>*/}
                    {/*        <span className="arrow">*/}
                    {/*        <i className="ti-angle-right"></i>*/}
                    {/*        </span>*/}
                    {/*    </a>*/}
                    {/*    <ul className="dropdown-menu">*/}
                    {/*        <li><a className="sidebar-link" href="basic-table.html">Basic Table</a></li>*/}
                    {/*        <li><a className="sidebar-link" href="datatable.html">Data Table</a></li>*/}
                    {/*    </ul>*/}
                    {/*</li>*/}


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
                </ul>
            </div>
        )
    }
}
export default sidebar;
