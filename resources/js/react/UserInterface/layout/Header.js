import React from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from 'react-progressbar';
import HttpClient from './../utils/HttpClient'
import { IsDomain } from '../helpers/CommonFunctions';

class header extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            user_total_annotations: 0,
        };

    }

    componentDidMount() {
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
                <strong><a className='d-block' href='/'>
                    {/* <img src="{{config('app.logo')}}" width='150' height='44' alt='Crystal Ball' /> */}
                    {/* <img src="{{config('app.logo')}}" width='150' height='44' alt='Crystal Ball' /> */}
                    <div className="d-flex justify-content-between align-items-center">
                        <img src={`${IsDomain('app.gaannotations.com') || IsDomain('localhost') ? '/images/company_logo_gaa.png' : '/images/company_logo_cbi.png'}`} width="44" height="44" alt={`${IsDomain('app.gaannotations.com') || IsDomain('localhost') ? 'GAannotations' : 'Crystal Ball'}`} />
                        <h4 style={(IsDomain('app.gaannotations.com') || IsDomain('localhost') ? {color: '#0a2a50'}: {color: '#056db4'})} className="m-0 pl-2">{`${IsDomain('app.gaannotations.com') || IsDomain('localhost') ? 'GAannotations' : 'Crystal Ball'}`}</h4>
                    </div>
                </a></strong>
                {/* <form className='form-search'>
                    <fieldset className='position-relative'>
                        <input className="form-control" type="search" placeholder="Search anything..."/>
                        <button className='btn-searchIcon'><img className='d-block' src='/search-new.svg' width='16' height='16' alt='Search'/></button>
                    </fieldset>
                </form> */}
                <div className="d-flex align-items-center">
                    {
                        this.props.user.price_plan.name == "Trial" ?
                            <span class='note-trial d-flex align-items-center justify-content-center'>
                                <i className='ti-time mr-1'></i>
                                <span>Trial ending {moment(this.props.user.price_plan_expiry_date).format('ll')}</span>
                            </span>
                            :
                            null
                    }

                    {this.props.user.price_plan.code == "free new" ? <p className="trial-countdown m-0">You are on the Free Plan</p> : null}

                    {
                        this.props.user.price_plan.price == 0 ?
                            <>
                                <Link to="/settings/price-plans" className='d-flex align-items-center justify-content-center mx-4'>
                                    <svg width="129" height="42" viewBox="0 0 129 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="1" y="1.5" width="127" height="39" rx="19.5" fill="white" />
                                        <path d="M34.9372 14.0833C35.0245 14.0833 35.1108 14.103 35.1895 14.1409C35.2683 14.1787 35.3375 14.2338 35.3922 14.302L35.4359 14.3638L37.9151 18.4472C37.9721 18.5409 38.0015 18.6488 37.9999 18.7585C37.9984 18.8682 37.966 18.9752 37.9063 19.0673L37.8614 19.1268L31.4447 26.7102C31.3938 26.7702 31.3313 26.8194 31.2609 26.8547C31.1905 26.89 31.1137 26.9106 31.0351 26.9154C30.9565 26.9202 30.8777 26.9091 30.8036 26.8826C30.7294 26.8561 30.6614 26.8149 30.6036 26.7615L30.5546 26.7102L24.1378 19.1268C24.0671 19.043 24.0213 18.9411 24.0058 18.8325C23.9904 18.724 24.0058 18.6133 24.0503 18.5131L24.0842 18.4472L26.5634 14.3638C26.6087 14.2891 26.6702 14.2255 26.7434 14.1777C26.8166 14.13 26.8996 14.0993 26.9863 14.0879L27.0621 14.0833H34.9372ZM33.0501 19.3333H28.9486L30.9991 24.392L33.0501 19.3333ZM36.1587 19.3333H34.3089L32.6073 23.5304L36.1587 19.3333ZM27.6898 19.3333H25.84L29.3908 23.5292L27.6898 19.3333ZM28.4761 15.2499H27.3894L25.6184 18.1666H27.6425L28.4761 15.2499ZM32.3098 15.2499H29.6889L28.8553 18.1666H33.1434L32.3098 15.2499ZM34.6093 15.2499H33.5226L34.3562 18.1666H36.3803L34.6093 15.2499V15.2499Z" fill="url(#paint0_linear_168_1260)" />
                                        <path d="M51.4824 26.692C50.6824 26.692 49.9837 26.532 49.3864 26.212C48.789 25.892 48.325 25.38 47.9944 24.676C47.6744 23.972 47.5144 23.0493 47.5144 21.908V16.036H49.3704V22.052C49.3704 22.8093 49.4557 23.412 49.6264 23.86C49.8077 24.2973 50.0584 24.612 50.3784 24.804C50.6984 24.9853 51.0664 25.076 51.4824 25.076C51.909 25.076 52.2824 24.9853 52.6024 24.804C52.933 24.612 53.189 24.2973 53.3704 23.86C53.5624 23.412 53.6584 22.8093 53.6584 22.052V16.036H55.4344V21.908C55.4344 23.0493 55.2744 23.972 54.9544 24.676C54.6344 25.38 54.1757 25.892 53.5784 26.212C52.9917 26.532 52.293 26.692 51.4824 26.692ZM57.8868 29.604V18.644H59.4068L59.5348 19.476H59.5988C59.9294 19.1987 60.2974 18.9587 60.7028 18.756C61.1188 18.5533 61.5401 18.452 61.9668 18.452C62.9481 18.452 63.7054 18.8147 64.2388 19.54C64.7828 20.2653 65.0548 21.236 65.0548 22.452C65.0548 23.348 64.8948 24.116 64.5748 24.756C64.2548 25.3853 63.8388 25.8653 63.3268 26.196C62.8254 26.5267 62.2814 26.692 61.6948 26.692C61.3534 26.692 61.0121 26.6173 60.6708 26.468C60.3294 26.308 59.9988 26.0947 59.6788 25.828L59.7268 27.14V29.604H57.8868ZM61.3108 25.172C61.8334 25.172 62.2708 24.9427 62.6228 24.484C62.9748 24.0253 63.1508 23.3533 63.1508 22.468C63.1508 21.6787 63.0174 21.0653 62.7508 20.628C62.4841 20.1907 62.0521 19.972 61.4548 19.972C60.9001 19.972 60.3241 20.2653 59.7268 20.852V24.516C60.0148 24.7507 60.2921 24.9213 60.5588 25.028C60.8254 25.124 61.0761 25.172 61.3108 25.172ZM69.654 29.972C69.0353 29.972 68.4753 29.8973 67.974 29.748C67.4833 29.5987 67.094 29.3693 66.806 29.06C66.5287 28.7613 66.39 28.3827 66.39 27.924C66.39 27.2733 66.7633 26.7133 67.51 26.244V26.18C67.3073 26.052 67.1367 25.8813 66.998 25.668C66.87 25.4547 66.806 25.188 66.806 24.868C66.806 24.5587 66.8913 24.2813 67.062 24.036C67.2433 23.78 67.446 23.572 67.67 23.412V23.348C67.4033 23.1453 67.1633 22.8627 66.95 22.5C66.7473 22.1373 66.646 21.7267 66.646 21.268C66.646 20.66 66.79 20.148 67.078 19.732C67.366 19.316 67.7447 19.0013 68.214 18.788C68.694 18.564 69.206 18.452 69.75 18.452C69.9633 18.452 70.166 18.4733 70.358 18.516C70.5607 18.548 70.742 18.5907 70.902 18.644H73.718V20.004H72.278C72.406 20.1533 72.5127 20.3453 72.598 20.58C72.6833 20.804 72.726 21.0547 72.726 21.332C72.726 21.908 72.5927 22.3987 72.326 22.804C72.0593 23.1987 71.702 23.4973 71.254 23.7C70.806 23.9027 70.3047 24.004 69.75 24.004C69.5793 24.004 69.4033 23.988 69.222 23.956C69.0407 23.924 68.8593 23.8707 68.678 23.796C68.5607 23.9027 68.4647 24.0093 68.39 24.116C68.326 24.2227 68.294 24.3667 68.294 24.548C68.294 24.772 68.3847 24.948 68.566 25.076C68.758 25.204 69.094 25.268 69.574 25.268H70.966C71.9153 25.268 72.63 25.4227 73.11 25.732C73.6007 26.0307 73.846 26.5213 73.846 27.204C73.846 27.716 73.6753 28.18 73.334 28.596C72.9927 29.0227 72.5073 29.3587 71.878 29.604C71.2487 29.8493 70.5073 29.972 69.654 29.972ZM69.75 22.852C70.1233 22.852 70.4433 22.7133 70.71 22.436C70.9767 22.1587 71.11 21.7693 71.11 21.268C71.11 20.7773 70.9767 20.3987 70.71 20.132C70.454 19.8547 70.134 19.716 69.75 19.716C69.366 19.716 69.0407 19.8493 68.774 20.116C68.5073 20.3827 68.374 20.7667 68.374 21.268C68.374 21.7693 68.5073 22.1587 68.774 22.436C69.0407 22.7133 69.366 22.852 69.75 22.852ZM69.942 28.772C70.5713 28.772 71.0833 28.644 71.478 28.388C71.8727 28.132 72.07 27.8387 72.07 27.508C72.07 27.1987 71.9473 26.9907 71.702 26.884C71.4673 26.7773 71.126 26.724 70.678 26.724H69.606C69.1793 26.724 68.822 26.6867 68.534 26.612C68.1287 26.9213 67.926 27.268 67.926 27.652C67.926 28.004 68.1073 28.276 68.47 28.468C68.8327 28.6707 69.3233 28.772 69.942 28.772ZM75.2305 26.5V18.644H76.7505L76.8785 20.036H76.9425C77.2198 19.524 77.5558 19.1347 77.9505 18.868C78.3452 18.5907 78.7505 18.452 79.1665 18.452C79.5398 18.452 79.8385 18.5053 80.0625 18.612L79.7425 20.212C79.6038 20.1693 79.4758 20.1373 79.3585 20.116C79.2412 20.0947 79.0972 20.084 78.9265 20.084C78.6172 20.084 78.2918 20.2067 77.9505 20.452C77.6092 20.6867 77.3158 21.1027 77.0705 21.7V26.5H75.2305ZM82.6814 26.692C81.9987 26.692 81.4387 26.4787 81.0014 26.052C80.5747 25.6253 80.3614 25.0707 80.3614 24.388C80.3614 23.5453 80.7294 22.8947 81.4654 22.436C82.2014 21.9667 83.3747 21.6467 84.9854 21.476C84.9747 21.06 84.8627 20.7027 84.6494 20.404C84.4467 20.0947 84.0787 19.94 83.5454 19.94C83.1614 19.94 82.7827 20.0147 82.4094 20.164C82.0467 20.3133 81.6894 20.4947 81.3374 20.708L80.6654 19.476C81.1027 19.1987 81.5934 18.9587 82.1374 18.756C82.692 18.5533 83.2787 18.452 83.8974 18.452C84.8787 18.452 85.6094 18.7453 86.0894 19.332C86.58 19.908 86.8254 20.7453 86.8254 21.844V26.5H85.3054L85.1774 25.636H85.1134C84.7614 25.9347 84.3827 26.1853 83.9774 26.388C83.5827 26.5907 83.1507 26.692 82.6814 26.692ZM83.2734 25.252C83.5934 25.252 83.8814 25.1773 84.1374 25.028C84.404 24.868 84.6867 24.6547 84.9854 24.388V22.628C83.9187 22.7667 83.1774 22.9747 82.7614 23.252C82.3454 23.5187 82.1374 23.8493 82.1374 24.244C82.1374 24.596 82.244 24.852 82.4574 25.012C82.6707 25.172 82.9427 25.252 83.2734 25.252ZM91.7794 26.692C90.798 26.692 90.014 26.3293 89.4274 25.604C88.8407 24.8787 88.5474 23.8707 88.5474 22.58C88.5474 21.7267 88.702 20.9907 89.0114 20.372C89.3314 19.7533 89.7474 19.2787 90.2594 18.948C90.7714 18.6173 91.31 18.452 91.8754 18.452C92.3234 18.452 92.702 18.532 93.0114 18.692C93.3314 18.8413 93.6407 19.0493 93.9394 19.316L93.8754 18.052V15.204H95.7154V26.5H94.1954L94.0674 25.652H94.0034C93.7154 25.94 93.3794 26.1853 92.9954 26.388C92.6114 26.5907 92.206 26.692 91.7794 26.692ZM92.2274 25.172C92.814 25.172 93.3634 24.8787 93.8754 24.292V20.628C93.6087 20.3827 93.342 20.212 93.0754 20.116C92.8087 20.02 92.542 19.972 92.2754 19.972C91.774 19.972 91.342 20.2013 90.9794 20.66C90.6274 21.108 90.4514 21.7427 90.4514 22.564C90.4514 23.4067 90.606 24.052 90.9154 24.5C91.2247 24.948 91.662 25.172 92.2274 25.172ZM101.419 26.692C100.693 26.692 100.037 26.532 99.4506 26.212C98.864 25.8813 98.4 25.412 98.0586 24.804C97.7173 24.1853 97.5466 23.444 97.5466 22.58C97.5466 21.7267 97.7173 20.9907 98.0586 20.372C98.4106 19.7533 98.864 19.2787 99.4186 18.948C99.9733 18.6173 100.555 18.452 101.163 18.452C101.877 18.452 102.475 18.612 102.955 18.932C103.435 19.2413 103.797 19.6787 104.043 20.244C104.288 20.7987 104.411 21.444 104.411 22.18C104.411 22.564 104.384 22.8627 104.331 23.076H99.3386C99.424 23.7693 99.6746 24.308 100.091 24.692C100.507 25.076 101.029 25.268 101.659 25.268C102 25.268 102.315 25.22 102.603 25.124C102.901 25.0173 103.195 24.8733 103.483 24.692L104.107 25.844C103.733 26.0893 103.317 26.292 102.859 26.452C102.4 26.612 101.92 26.692 101.419 26.692ZM99.3226 21.828H102.811C102.811 21.22 102.677 20.7453 102.411 20.404C102.144 20.052 101.744 19.876 101.211 19.876C100.752 19.876 100.341 20.0467 99.9786 20.388C99.6266 20.7187 99.408 21.1987 99.3226 21.828Z" fill="url(#paint1_linear_168_1260)" />
                                        <rect x="1" y="1.5" width="127" height="39" rx="19.5" stroke="url(#paint2_linear_168_1260)" stroke-width="2" />
                                        <defs>
                                            <linearGradient id="paint0_linear_168_1260" x1="24" y1="20.4999" x2="38" y2="20.4999" gradientUnits="userSpaceOnUse">
                                                <stop offset="0.390625" stop-color="#F7751E" />
                                                <stop offset="1" stop-color="#F2480C" />
                                            </linearGradient>
                                            <linearGradient id="paint1_linear_168_1260" x1="46" y1="20.5" x2="105" y2="20.5" gradientUnits="userSpaceOnUse">
                                                <stop offset="0.390625" stop-color="#F7751E" />
                                                <stop offset="1" stop-color="#F2480C" />
                                            </linearGradient>
                                            <linearGradient id="paint2_linear_168_1260" x1="0" y1="21" x2="129" y2="21" gradientUnits="userSpaceOnUse">
                                                <stop offset="0.333333" stop-color="#FF8534" />
                                                <stop offset="1" stop-color="#FF630C" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </Link>
                                {
                                    // this.props.user.price_plan.code === 'free new' && (!this.props.user.price_plan_settings || this.props.user.price_plan_settings.extended_trial.activation_count < 1) ?
                                     <button onClick={() => { this.props.extendTrial(); }} className="btn-adduser btn-trial mr-3">Extend my Trial</button>
                                        // :
                                        // null
                                }
                            </>
                            :
                            null
                    }
                    <div className='note-trial pr-2'>
                        <div className='text-right'>
                            <span>{this.props.user.name}</span>
                        </div>
                        <div className='text-right'>
                            <span>{this.props.user.email}</span>
                        </div>
                    </div>
                    <div className="dropdown user-dropdown">
                        <button type='button' className="dropdown-toggle btn-toggle no-after border-0 bg-transparent bdrs-50p p-0" data-toggle="dropdown">
                            {
                                this.props.user.profile_image ?
                                    <div className='addPhoto' id='acronym-holder' style={{ backgroundPosition: 'center', backgroundSize: 'contain', backgroundImage: `url(/${this.props.user.profile_image})` }}>
                                    </div>
                                    :
                                    <span className="w-2r bdrs-50p text-center gaa-bg-color m-0" id="acronym-holder" alt="">{this.props.user != undefined ? this.props.user.name.split(' ').map(n => n.substring(0, 1)).join('').toUpperCase() : null}</span>
                            }
                        </button>
                        <div className="dropdown-menu">
                            <div className="dropdownHead">
                                <Link to="/settings/profile">{/* {this.props.user.name} */}View Profile</Link>
                            </div>

                            <ul className='dropdownBody'>
                                <li className='d-flex justify-content-start align-align-items-center'><strong>{this.props.user.price_plan.name}</strong><span>Plan</span></li>
                                <li className='properties'>
                                    <div className='d-flex justify-content-between align-align-items-center'>
                                        <span>Properties in use:</span>
                                        <span>
                                            {this.props.user.google_analytics_properties_in_use_count} / {this.props.user.price_plan.google_analytics_property_count == -1 ? 0 : (this.props.user.price_plan.google_analytics_property_count == 0 ? "∞" : this.props.user.price_plan.google_analytics_property_count)}
                                        </span>
                                    </div>
                                    {/* {this.props.user.price_plan.code == "free new" ? <p className="trial-countdown mt-4">You are on the Free Plan</p> : null} */}
                                    <ProgressBar completed={this.props.user.price_plan.google_analytics_property_count ? (((this.props.user.google_analytics_properties_in_use_count / this.props.user.price_plan.google_analytics_property_count) * 100) || 10) : 10} />
                                </li>
                                <li className='annotation'>
                                    <div className='d-flex justify-content-between align-align-items-center'>
                                        <span>Annotations:</span>
                                        <span>{this.state.user_total_annotations} / {(this.props.user.price_plan.annotations_count == 0) ? "∞" : this.props.user.price_plan.annotations_count}</span>
                                    </div>
                                    {(this.props.user.price_plan.code == 'free new' || this.props.user.price_plan.code == 'Trial' || this.props.user.price_plan.code == null) ? <ProgressBar completed={(this.state.user_total_annotations / (this.props.user.price_plan.annotations_count == 0 ? this.state.user_total_annotations : this.props.user.price_plan.annotations_count)) * 100} /> : <ProgressBar completed={0} />}
                                </li>
                            </ul>

                            <div className='dropdownFoot'>
                                {this.props.user.price_plan.price == 0 ? <div><Link to='/settings/price-plans'>Update subscription</Link></div> : null}

                                <a className='btn-logout' href={null} onClick={() => document.getElementById('header-logout-form').submit()}>Log out</a>
                                <form id='header-logout-form' action={'/logout'} method='POST'><input type='hidden' name={'_token'} value={document.querySelector('meta[name="csrf-token"]').getAttribute('content')} /></form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default header;
