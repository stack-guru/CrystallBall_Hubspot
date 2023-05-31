import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { callmiddle } from '../../../helpers/CommonFunctions';

export default class NoGoogleAccountConnectedPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isPermissionPopupOpened: false,
        };
        console.log("user name",this.props.user.name)
    }

    

    render() {
        return (
            <div>
                <div className="container-xl bg-white anno-container  d-flex flex-column justify-content-center component-wrapper" >
                    <section className="ftco-section" id="inputs">
                        <div className="container-xl pt-4">
                            <div id="dashboard-index-container">
                                <div>
                                    <h1 className='welcome-color'>welcome {this.props.user.name}</h1>
                                </div>
                                {/* btn-goToPropertyLogin */}
                                <div className=' propertyLoginBox'>
                                    <div>
                                        <h3 className='propertyLoginText'>Connect to Google Analytics</h3>                                                                                
                                    </div>
                                    <div>
                                        <p className='propertyLoginText'>to get data on your visitors’ behavior and know how to optimize for better results</p>
                                    </div>
                                    <div className='align-items-center justify-content-center '>
                                        <img className='analytice-logo ' src="/images/analytics-logo.svg" width="100" height="90" />
                                        <a
                                            onClick={(e) => { this.setState({ isPermissionPopupOpened: true }) }}
                                            className="btn-adduser d-flex align-items-center justify-content-center mt-4">
                                                <i><img style={{width: 16, height: 16}} src={'/google-small.svg'} alt={'icon'}
                                                        className="svg-inject socialImage"/></i>
                                                <span>Connect with Google Analytics </span>
                                        </a>
                                        
                                    </div>


                                    {/* <div className="">
                                        <a onClick={(e) => { this.setState({ isPermissionPopupOpened: true }) }} href="#"><img src="/images/connect-google-analytics.svg" href="#" width="400" height="auto" /></a>
                                    </div> */}
                                </div>





                                {/* <div className="row">
                                    <div className="col-12 text-center">
                                        <h3>Connect to Google Analytics</h3>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 text-center">
                                        <p>to get data on your visitors’ behavior and know how to optimize for better results</p>
                                    </div>
                                </div>

                                <div className='col-12 text-center'>
                                    <a href="javascript:void(0);"
                                        onClick={this.restrictionHandler}
                                        className="btn-adduser d-flex align-items-center justify-content-center">
                                            <i><img style={{width: 16, height: 16}} src={'/google-small.svg'} alt={'icon'}
                                                    className="svg-inject socialImage"/></i>
                                            <span>Connect with Google Analytics </span>
                                    </a>
                                </div> */}
                                

                                {/* <div className="row">
                                    <div className="col-12 text-center">
                                        <a onClick={(e) => { this.setState({ isPermissionPopupOpened: true }) }} href="#"><img src="/images/connect-google-analytics.svg" href="#" width="400" height="auto" /></a>
                                    </div>
                                </div> */}
                                {/* <div className="row">
                                    <div className="col-12">
                                        <p className="text-center gaa-text-primary">This page is on Beta</p>
                                    </div>
                                </div> */}
                            </div>
                        </div>

                    </section>
                </div >
                {
                    this.state.isPermissionPopupOpened ? <GooglePermissionPopup /> : ''
                }
            </div>
        )
    }
}