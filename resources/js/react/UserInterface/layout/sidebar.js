import React from 'react'

class sidebar extends React.Component{

    constructor(props) {
        super(props);

    }


    render() {
        return(
            <div className="sidebar-inner">
                <div className="sidebar-logo">
                    <div className="peers ai-c fxw-nw">
                        <div className="peer peer-greed"><a className="sidebar-link td-n" href="index.html">
                            <div className="peers ai-c fxw-nw">
                                <div className="peer">
                                    <div className="logo"><img src="assets/static/images/logo.png" alt=""/></div>
                                </div>
                                <div className="peer peer-greed"><h5 className="lh-1 mB-0 logo-text">Adminator</h5>
                                </div>
                            </div>
                        </a></div>
                        <div className="peer">
                            <div className="mobile-toggle sidebar-toggle"><a href={null} className="td-n"><i
                                className="ti-arrow-circle-left"></i></a></div>
                        </div>
                    </div>
                </div>
                <ul className="sidebar-menu scrollable pos-r">
                    <li className="nav-item mT-30 actived"><a className="sidebar-link" href="index.html"><span
                        className="icon-holder"><i className="c-blue-500 ti-home"></i> </span><span
                        className="title">Dashboard</span></a></li>
                    <li className="nav-item"><a className="sidebar-link" href="email.html"><span
                        className="icon-holder"><i
                        className="c-brown-500 ti-email"></i> </span><span className="title">Email</span></a></li>
                    <li className="nav-item"><a className="sidebar-link" href="compose.html"><span
                        className="icon-holder"><i
                        className="c-blue-500 ti-share"></i> </span><span className="title">Compose</span></a></li>
                    <li className="nav-item"><a className="sidebar-link" href="calendar.html"><span
                        className="icon-holder"><i
                        className="c-deep-orange-500 ti-calendar"></i> </span><span
                        className="title">Calendar</span></a></li>
                    <li className="nav-item"><a className="sidebar-link" href="chat.html"><span className="icon-holder"><i
                        className="c-deep-purple-500 ti-comment-alt"></i> </span><span className="title">Chat</span></a>
                    </li>
                    <li className="nav-item"><a className="sidebar-link" href="charts.html"><span
                        className="icon-holder"><i
                        className="c-indigo-500 ti-bar-chart"></i> </span><span className="title">Charts</span></a></li>
                    <li className="nav-item"><a className="sidebar-link" href="forms.html"><span
                        className="icon-holder"><i
                        className="c-light-blue-500 ti-pencil"></i> </span><span className="title">Forms</span></a></li>
                    <li className="nav-item dropdown"><a className="sidebar-link" href="ui.html"><span
                        className="icon-holder"><i
                        className="c-pink-500 ti-palette"></i> </span><span className="title">UI Elements</span></a>
                    </li>
                    <li className="nav-item dropdown"><a className="dropdown-toggle" href={null}><span
                        className="icon-holder"><i className="c-orange-500 ti-layout-list-thumb"></i> </span><span
                        className="title">Tables</span> <span className="arrow"><i
                        className="ti-angle-right"></i></span></a>
                        <ul className="dropdown-menu">
                            <li><a className="sidebar-link" href="basic-table.html">Basic Table</a></li>
                            <li><a className="sidebar-link" href="datatable.html">Data Table</a></li>
                        </ul>
                    </li>
                    <li className="nav-item dropdown"><a className="dropdown-toggle" href={null}><span
                        className="icon-holder"><i className="c-purple-500 ti-map"></i> </span><span
                        className="title">Maps</span> <span className="arrow"><i className="ti-angle-right"></i></span></a>
                        <ul className="dropdown-menu">
                            <li><a href="google-maps.html">Google Map</a></li>
                            <li><a href="vector-maps.html">Vector Map</a></li>
                        </ul>
                    </li>
                    <li className="nav-item dropdown"><a className="dropdown-toggle" href={null}><span
                        className="icon-holder"><i className="c-red-500 ti-files"></i> </span><span
                        className="title">Pages</span> <span className="arrow"><i className="ti-angle-right"></i></span></a>
                        <ul className="dropdown-menu">
                            <li><a className="sidebar-link" href="blank.html">Blank</a></li>
                            <li><a className="sidebar-link" href="404.html">404</a></li>
                            <li><a className="sidebar-link" href="500.html">500</a></li>
                            <li><a className="sidebar-link" href="signin.html">Sign In</a></li>
                            <li><a className="sidebar-link" href="signup.html">Sign Up</a></li>
                        </ul>
                    </li>
                    <li className="nav-item dropdown"><a className="dropdown-toggle" href={null}><span
                        className="icon-holder"><i className="c-teal-500 ti-view-list-alt"></i> </span><span
                        className="title">Multiple Levels</span>
                        <span className="arrow"><i className="ti-angle-right"></i></span></a>
                        <ul className="dropdown-menu">
                            <li className="nav-item dropdown"><a href={null}><span>Menu Item</span></a>
                            </li>
                            <li className="nav-item dropdown"><a href={null}><span>Menu Item</span> <span
                                className="arrow"><i className="ti-angle-right"></i></span></a>
                                <ul className="dropdown-menu">
                                    <li><a href={null}>Menu Item</a></li>
                                    <li><a href={null}>Menu Item</a></li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        )
    }
}
export default sidebar;
