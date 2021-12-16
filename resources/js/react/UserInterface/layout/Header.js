import React from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from 'react-progressbar';

class header extends React.Component {

    constructor(props) {
        super(props)

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
            <div>
                <div className="header-container "> {/* gaa-bg-primary */}
                    <ul className="nav-left  ">
                        <li>
                            <a id="sidebar-toggle" className="sidebar-toggle " href="#" onClick={this.toggleSidebar}><i
                                className="ti-menu"></i></a>
                        </li>
                        {/* <li className="search-box"><a className="search-toggle no-pdd-right" href={null}><i
                            className="search-icon ti-search pdd-right-10"></i> <i
                                className="search-icon-close ti-close pdd-right-10"></i></a></li>
                        <li className="search-input">
                            <input className="form-control" type="text"
                                placeholder="Search..." />
                        </li> */}
                    </ul>
                    <ul className="nav-right  ">
                        {/*<li className="notifications dropdown">*/}
                        {/*    <span className="counter bgc-red">3</span>*/}
                        {/*    <a href={null} className="dropdown-toggle no-after" data-toggle="dropdown"><i*/}
                        {/*        className="ti-bell"></i></a>*/}
                        {/*    <ul className="dropdown-menu">*/}
                        {/*        <li className="pX-20 pY-15 bdB"><i className="ti-bell pR-10"></i> <span*/}
                        {/*            className="fsz-sm fw-600 c-grey-900">Notifications</span></li>*/}
                        {/*        <li>*/}
                        {/*            <ul className="ovY-a pos-r scrollable lis-n p-0 m-0 fsz-sm">*/}
                        {/*                <li><a href={null}*/}
                        {/*                       className="peers fxw-nw td-n p-20 bdB c-grey-800 cH-blue bgcH-grey-100">*/}
                        {/*                    <div className="peer mR-15">*/}
                        {/*                        <img className="w-3r bdrs-50p" src="https://randomuser.me/api/portraits/men/1.jpg" alt=""/></div>*/}
                        {/*                    <div className="peer peer-greed"><span>*/}
                        {/*                        <span className="fw-500">John Doe</span>*/}
                        {/*                        <span className="c-grey-600">liked your <span*/}
                        {/*                        className="text-dark">post</span></span></span>*/}
                        {/*                        <p className="m-0"><small className="fsz-xs">5 mins ago</small></p>*/}
                        {/*                    </div>*/}
                        {/*                </a></li>*/}
                        {/*                <li><a href={null}*/}
                        {/*                       className="peers fxw-nw td-n p-20 bdB c-grey-800 cH-blue bgcH-grey-100">*/}
                        {/*                    <div className="peer mR-15"><img className="w-3r bdrs-50p"*/}
                        {/*                                                     src="https://randomuser.me/api/portraits/men/2.jpg"*/}
                        {/*                                                     alt=""/></div>*/}
                        {/*                    <div className="peer peer-greed"><span><span*/}
                        {/*                        className="fw-500">Moo Doe</span> <span*/}
                        {/*                        className="c-grey-600">liked your <span className="text-dark">cover image</span></span></span>*/}
                        {/*                        <p className="m-0"><small className="fsz-xs">7 mins ago</small></p>*/}
                        {/*                    </div>*/}
                        {/*                </a></li>*/}
                        {/*                <li><a href={null}*/}
                        {/*                       className="peers fxw-nw td-n p-20 bdB c-grey-800 cH-blue bgcH-grey-100">*/}
                        {/*                    <div className="peer mR-15"><img className="w-3r bdrs-50p"*/}
                        {/*                                                     src="https://randomuser.me/api/portraits/men/3.jpg"*/}
                        {/*                                                     alt=""/></div>*/}
                        {/*                    <div className="peer peer-greed"><span><span*/}
                        {/*                        className="fw-500">Lee Doe</span> <span*/}
                        {/*                        className="c-grey-600">commented on your <span*/}
                        {/*                        className="text-dark">video</span></span></span>*/}
                        {/*                        <p className="m-0"><small className="fsz-xs">10 mins ago</small></p>*/}
                        {/*                    </div>*/}
                        {/*                </a></li>*/}
                        {/*            </ul>*/}
                        {/*        </li>*/}
                        {/*        <li className="pX-20 pY-15 ta-c bdT"><span>*/}
                        {/*            <a href={null} className="c-grey-600 cH-blue fsz-sm td-n">View All Notifications <i*/}
                        {/*            className="ti-angle-right fsz-xs mL-10"></i></a></span></li>*/}
                        {/*    </ul>*/}
                        {/*</li>*/}
                        {/*<li className="notifications dropdown"><span className="counter bgc-blue">3</span> <a href={null}*/}
                        {/*                                                                                      className="dropdown-toggle no-after"*/}
                        {/*                                                                                      data-toggle="dropdown"><i*/}
                        {/*    className="ti-email"></i></a>*/}
                        {/*    <ul className="dropdown-menu">*/}
                        {/*        <li className="pX-20 pY-15 bdB"><i className="ti-email pR-10"></i> <span*/}
                        {/*            className="fsz-sm fw-600 c-grey-900">Emails</span></li>*/}
                        {/*        <li>*/}
                        {/*            <ul className="ovY-a pos-r scrollable lis-n p-0 m-0 fsz-sm">*/}
                        {/*                <li><a href={null}*/}
                        {/*                       className="peers fxw-nw td-n p-20 bdB c-grey-800 cH-blue bgcH-grey-100">*/}
                        {/*                    <div className="peer mR-15"><img className="w-3r bdrs-50p"*/}
                        {/*                                                     src="https://randomuser.me/api/portraits/men/1.jpg"*/}
                        {/*                                                     alt=""/></div>*/}
                        {/*                    <div className="peer peer-greed">*/}
                        {/*                        <div>*/}
                        {/*                            <div className="peers jc-sb fxw-nw mB-5">*/}
                        {/*                                <div className="peer"><p className="fw-500 mB-0">John Doe</p>*/}
                        {/*                                </div>*/}
                        {/*                                <div className="peer"><small className="fsz-xs">5 mins*/}
                        {/*                                    ago</small></div>*/}
                        {/*                            </div>*/}
                        {/*                            <span className="c-grey-600 fsz-sm">Want to create your own customized data generator for your app...</span>*/}
                        {/*                        </div>*/}
                        {/*                    </div>*/}
                        {/*                </a></li>*/}
                        {/*                <li><a href={null}*/}
                        {/*                       className="peers fxw-nw td-n p-20 bdB c-grey-800 cH-blue bgcH-grey-100">*/}
                        {/*                    <div className="peer mR-15">*/}
                        {/*                        <img className="w-3r bdrs-50p" src="https://randomuser.me/api/portraits/men/2.jpg" alt=""/>*/}
                        {/*                    </div>*/}
                        {/*                    <div className="peer peer-greed">*/}
                        {/*                        <div>*/}
                        {/*                            <div className="peers jc-sb fxw-nw mB-5">*/}
                        {/*                                <div className="peer"><p className="fw-500 mB-0">Moo Doe</p>*/}
                        {/*                                </div>*/}
                        {/*                                <div className="peer"><small className="fsz-xs">15 mins*/}
                        {/*                                    ago</small>*/}
                        {/*                                </div>*/}
                        {/*                            </div>*/}
                        {/*                            <span className="c-grey-600 fsz-sm">Want to create your own customized data generator for your app...</span>*/}
                        {/*                        </div>*/}
                        {/*                    </div>*/}
                        {/*                </a></li>*/}
                        {/*                <li>*/}
                        {/*                    <a href={null}*/}
                        {/*                       className="peers fxw-nw td-n p-20 bdB c-grey-800 cH-blue bgcH-grey-100">*/}
                        {/*                    <div className="peer mR-15"><img className="w-3r bdrs-50p"*/}
                        {/*                                                     src="https://randomuser.me/api/portraits/men/3.jpg"*/}
                        {/*                                                     alt=""/></div>*/}
                        {/*                    <div className="peer peer-greed">*/}
                        {/*                        <div>*/}
                        {/*                            <div className="peers jc-sb fxw-nw mB-5">*/}
                        {/*                                <div className="peer"><p className="fw-500 mB-0">Lee Doe</p>*/}
                        {/*                                </div>*/}
                        {/*                                <div className="peer"><small className="fsz-xs">25 mins*/}
                        {/*                                    ago</small>*/}
                        {/*                                </div>*/}
                        {/*                            </div>*/}
                        {/*                            <span className="c-grey-600 fsz-sm">Want to create your own customized data generator for your app...</span>*/}
                        {/*                        </div>*/}
                        {/*                    </div>*/}
                        {/*                </a></li>*/}
                        {/*            </ul>*/}
                        {/*        </li>*/}
                        {/*        <li className="pX-20 pY-15 ta-c bdT"><span>*/}
                        {/*            <a href="email.html" className="c-grey-600 cH-blue fsz-sm td-n">View All Email*/}
                        {/*                <i className="fs-xs ti-angle-right mL-10"></i>*/}
                        {/*            </a>*/}
                        {/*        </span></li>*/}
                        {/*    </ul>*/}
                        {/*</li>*/}

                        {this.props.user.price_plan.name == "Trial" ?
                            <li className="notifications">
                                <div className="no-after">
                                    <a className="trial-countdown">Trial: {moment(this.props.user.price_plan_expiry_date).diff(moment(), "days")} days left</a>
                                </div>
                            </li>
                            : null}

                        {this.props.user.price_plan.price == 0 ?
                            <li className="notifications">
                                <div className="no-after">
                                    <Link to="/settings/price-plans" className="btn gaa-btn-primary">Upgrade Now</Link>
                                </div>
                            </li>
                            : null}

                        <li className="dropdown">
                            <a href={null} className="dropdown-toggle no-after peers fxw-nw ai-c lh-1 c-grey-800 cH-blue bgcH-grey-100"
                                data-toggle="dropdown">

                                <div className="peer mR-10">
                                    <p className="w-2r bdrs-50p text-center mt-3" id="acronym-holder" alt="" >{this.props.user != undefined ? this.props.user.name.split(' ').map(n => n.substring(0, 1)).join('').toUpperCase() : null}</p>
                                </div>
                                {/* <div className="peer"><span>{this.props.user != undefined ? this.props.user.name : null}</span></div> */}
                            </a>
                            <ul className="dropdown-menu pX-20">
                                <li >
                                    <div className="header-profile-info">
                                        <h4 className="gaa-text-primary"><b>{this.props.user.price_plan.name}</b></h4>
                                    </div>
                                </li>
                                <li >
                                    <div className="header-profile-info">
                                        <p className="">Credits:
                                            <span className="float-right gaa-text-primary">{this.props.user.annotations_count}/{this.props.user.price_plan.annotations_count ?? "&infin;"}</span>
                                        </p>
                                    </div>
                                </li>
                                <li >
                                    <div className="header-profile-info">
                                        <ProgressBar completed={
                                            this.props.user.price_plan.annotations_count ?
                                                (((this.props.user.annotations_count / this.props.user.price_plan.annotations_count) * 100) ?
                                                    ((this.props.user.annotations_count / this.props.user.price_plan.annotations_count) * 100)
                                                    : 10)
                                                : 10
                                        }
                                            color="#1c98f0"
                                        />
                                    </div>
                                </li>
                                {this.props.user.price_plan.price == 0 ?
                                    <li className="text-center">
                                        <div className="header-profile-info pt-3">
                                            <Link to="/settings/price-plans" className="btn gaa-btn-primary">Update subscription</Link>
                                        </div>
                                    </li>
                                    : null}
                                <li role="separator" className="divider pt-3"></li>
                                <li >
                                    <div className="header-profile-info pt-3">
                                        <p className="gaa-text-primary">
                                            <Link to="/settings">
                                                <b>{this.props.user.name}</b>
                                                <span className="float-right"><i className="fa fa-chevron-right"></i></span>
                                            </Link>
                                        </p>
                                        {/* <h6 className="gaa-text-primary"><b>Email: {this.props.user.email}</b></h6> */}
                                        {/* <h6 className="gaa-text-primary"><b>Team: {this.props.user.team_name}</b></h6> */}
                                    </div>
                                </li>
                                {/* <li>
                                    <a href={null} className="d-b td-n pY-5 bgcH-grey-100 c-grey-700"><i
                                        className="ti-user mR-10"></i>
                                <span>Profile</span></a></li>*/ }
                                {/* <li>
                                    <a href="email.html" className="d-b td-n pY-5 bgcH-grey-100 c-grey-700"><i
                                        className="ti-email mR-10"></i> <span>Messages</span></a></li> */}
                                <li role="separator" className="divider"></li>
                                <li>
                                    <a href={null} onClick={() => document.getElementById("header-logout-form").submit()} className="d-b td-n pY-5 bgcH-grey-100 c-grey-700">
                                        <i className="ti-power-off mR-10"></i><span>Log out</span>
                                    </a>


                                    <form id="header-logout-form" action={'/logout'} method="POST">
                                        <input type="hidden" name={"_token"} value={document.querySelector('meta[name="csrf-token"]').getAttribute('content')} />
                                    </form>

                                </li>

                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

}


export default header;
