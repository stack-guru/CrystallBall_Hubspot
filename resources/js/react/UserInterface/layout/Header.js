import React from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from 'react-progressbar';
import HttpClient from './../utils/HttpClient'

class header extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            user_total_annotations: 0,
        };

    }

    componentDidMount(){
        HttpClient.get('user_total_annotations')
        .then(response => {
            this.setState({ user_total_annotations: response.data.user_total_annotations });
        });
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
            <div className="header-container d-flex justify-content-between align-items-center">
                <strong><a className='d-block' href='/'><img src='/logo-new.svg' width='150' height='44' alt='Crystal Ball'/></a></strong>
                <form className='form-search'>
                    <fieldset className='position-relative'>
                        <input className="form-control" type="search" placeholder="Search anything..."/>
                        <button className='btn-searchIcon'><img className='d-block' src='/search-new.svg' width='16' height='16' alt='Search'/></button>
                    </fieldset>
                </form>
                <div className="d-flex align-items-center">
                    {
                        this.props.user.price_plan.name == "Trial" ?
                            <span class='note-trial d-flex align-items-center justify-content-center'>
                                <i className='ti-time mr-1'></i>
                                <span>Trial ending {moment(this.props.user.price_plan_expiry_date).fromNow()}</span>
                            </span>
                        :
                        null
                    }

                    {
                        this.props.user.price_plan.code == "free new" ?
                            <p class="trial-countdown">You are on the Fee Plan</p>
                        :
                        null
                    }

                            {this.props.user.price_plan.code == "free new" ?
                                <li className="notifications">
                                    <div className="no-after">
                                        <p class="trial-countdown mt-4">You are on the Free Plan</p>
                                    </div>
                                </li>
                                : null}

                        {this.props.user.price_plan.price == 0 ?
                            <li className="notifications">
                                <div className="no-after">
                                    <Link to="/settings/price-plans" className="btn gaa-btn-primary mr-2">Click here to Upgrade</Link>
                                    {this.props.user.price_plan.code === 'free new' && (!this.props.user.price_plan_settings || this.props.user.price_plan_settings.extended_trial.activation_count < 1) ?
                                    <button onClick={() => {
                                        this.props.extendTrial();
                                    }} className="btn gaa-btn-primary">Extend my Trial</button>
                                    : null}
                                </div>
                            </li>
                            : null}

                        <li className="dropdown">
                            <a href={null} className="dropdown-toggle no-after peers fxw-nw ai-c lh-1 c-grey-800 cH-blue bgcH-grey-100"
                                data-toggle="dropdown">

                                <div className="peer mR-10">
                                    <p className="w-2r bdrs-50p text-center mt-3 gaa-bg-color" id="acronym-holder" alt="" >{this.props.user != undefined ? this.props.user.name.split(' ').map(n => n.substring(0, 1)).join('').toUpperCase() : null}</p>
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
                                        <p className="">Properties in use:
                                            <span className="float-right gaa-text-primary">
                                                {this.props.user.google_analytics_properties_in_use_count}
                                                /
                                                {this.props.user.price_plan.google_analytics_property_count == -1 ? 0 : (this.props.user.price_plan.google_analytics_property_count == 0 ? "∞" : this.props.user.price_plan.google_analytics_property_count)}
                                            </span>
                                        </p>
                                    </div>
                                </li>

                            <div className="header-profile-info">
                                <ProgressBar completed={
                                    this.props.user.price_plan.google_analytics_property_count ?
                                        (
                                            ((this.props.user.google_analytics_properties_in_use_count / this.props.user.price_plan.google_analytics_property_count) * 100) || 10
                                        )
                                        : 10
                                    }
                                />
                            </div>

                            <div className="header-profile-info">
                                <p className="">Annotations:
                                    <span className="float-right gaa-text-primary">
                                        { this.state.user_total_annotations }
                                        /
                                        {
                                            (this.props.user.price_plan.annotations_count == 0) ? "∞" : this.props.user.price_plan.annotations_count
                                        }
                                    </span>
                                </p>
                            </div>

                            <div className="header-profile-info">
                                {
                                    (this.props.user.price_plan.code == 'free new' || this.props.user.price_plan.code == 'Trial' || this.props.user.price_plan.code == null) ? <ProgressBar completed={ (this.state.user_total_annotations/this.props.user.price_plan.annotations_count) * 100 } /> : <ProgressBar completed={ 0 } />
                                }
                            </div>

                            {
                                this.props.user.price_plan.price == 0 ?
                                    <div className="header-profile-info pt-3">
                                        <Link to="/settings/price-plans" className="btn gaa-btn-primary w-100">Update subscription</Link>
                                    </div>
                                :
                                null
                            }

                            <div className="header-profile-info pt-3">
                                <p className="gaa-text-primary">
                                    <Link to="/settings" style={{ color: "black", fontWeight: 'lighter' }}>
                                        <b>{this.props.user.name}</b>
                                        <span className="float-right"><i className="fa fa-chevron-right"></i></span>
                                    </Link>
                                </p>
                            </div>

                            <div className="text-center">
                                <a href={null} onClick={() => document.getElementById("header-logout-form").submit()} className="d-b td-n pY-5 bgcH-grey-100 c-grey-700">
                                    <i className="ti-power-off mR-10"></i><span>Log out</span>
                                </a>
                                <form id="header-logout-form" action={'/logout'} method="POST">
                                    <input type="hidden" name={"_token"} value={document.querySelector('meta[name="csrf-token"]').getAttribute('content')} />
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }

}


export default header;
