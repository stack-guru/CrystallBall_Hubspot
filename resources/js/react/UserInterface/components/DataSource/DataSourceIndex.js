import React from 'react';
require('../../Main.css');
import Countries from "../../utils/Countries";
import * as $ from 'jquery';
export default class DataSourceIndex extends React.Component{
    constructor(props) {
        super(props);
            this.state={
                switch:false,
                trigger:false,
            }
            this.switchHandler=this.switchHandler.bind(this);
            this.serviceStatusHandler=this.serviceStatusHandler.bind(this)
    }

    componentDidMount() {
        document.title='Data Source';
        // if(this.state.switch){
        //     $(".switch-wrapper").removeClass('invisible')
        //     $(".switch-wrapper").addClass('visible')
        // }else{
        //     $(".switch-wrapper").removeClass('visible')
        //     $(".switch-wrapper").addClass('invisible')
        // }

    }
    serviceStatusHandler(){
        console.log('service status')
    }
    switchHandler(e){
        if(e.target.switch){
            this.setState({switch:true});
            $("#"+e.target.title).removeClass('off');
            $("#"+e.target.title).addClass('on');
        }else{
            this.setState({switch:false});
            $("#"+e.target.title).removeClass('on')
            $("#"+e.target.title).addClass('off')
        }


    }

    render() {
        return (
            <div className="container-xl bg-white  d-flex flex-column justify-content-center component-wrapper">
                <div className="row ml-0 mr-0">
                    <div className="col-12">
                        <h1 className="heading-section gaa-title">Data Source</h1>
                    </div>
                </div>
                    <div className="row ml-0 mr-0 mt-4">
                        <div className="col-6 M">
                            <div className="container ds-sections">
                            <div className="row ml-0 mr-0">
                                <div className="col-8">
                                    <h3 className="gaa-text-primary">Holiday</h3>
                                    <dl className="d-flex flex-row flex-wrap ">
                                        <dt>Annotations for:</dt>
                                        <dd className="mx-2">spain</dd>
                                        <dd className="mx-2">Argentina</dd>
                                        <dd className="mx-2">spain</dd>
                                    </dl>
                                </div>
                                <div className="col-4 text-center">
                                    <label className="switch">
                                        <input type="checkbox" className="holiday" defaultChecked={this.state.switch}  onChange={this.switchHandler}/>
                                            <span className="slider round"></span>
                                    </label>
                                    <span className="country-trigger"  title="holiday" onClick={()=>{this.switchHandler(this)}}>
                                        <i className="fa fa-arrow-left text-primary"></i>
                                    </span>
                                </div>

                            </div>
                            {/*<div className="row ml-0 mr-0 mt-3">*/}
                            {/*    <div className="col-12">*/}
                            {/*        */}
                            {/*    </div>*/}
                            {/*</div>*/}
                            </div>

                            <div className="container mt-3 ds-sections">
                                <div className="row ml-0 mr-0">
                                    <div className="col-8">
                                        <h3 className="gaa-text-primary">Weather Alert</h3>
                                    </div>
                                    <div className="col-4 text-center">
                                        <label className="switch">
                                            <input type="checkbox"  />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>

                                </div>
                                <div className="row ml-0 mr-0 mt-3">
                                    <div className="col-12">
                                        <dl className="d-flex flex-row flex-wrap">
                                            <dt>Annotations for:</dt>
                                            <dd className="mx-2">spain</dd>
                                            <dd className="mx-2">Argentina</dd>
                                            <dd className="mx-2">spain</dd>

                                        </dl>
                                    </div>

                                </div>
                            </div>

                            <div className="container mt-3 ds-sections">
                                <div className="row ml-0 mr-0">
                                    <div className="col-8">
                                        <h3 className="gaa-text-primary">Google Algorithm Updates</h3>
                                    </div>
                                    <div className="col-4 text-center">
                                        <label className="switch">
                                            <input type="checkbox" />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>

                                </div>

                            </div>

                            <div className="container mt-3 ds-sections">
                                <div className="row ml-0 mr-0">
                                    <div className="col-8">
                                        <h3 className="gaa-text-primary">Retail Marketing</h3>
                                    </div>
                                    <div className="col-4 text-center">
                                        <label className="switch">
                                            <input type="checkbox" className="retail" defaultChecked={this.state.switch}  onChange={this.switchHandler} />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>

                                </div>
                            </div>






                        </div>
                        <div className="col-6 M">
                            <div className="switch-wrapper off" id="holiday">
                                <Countries></Countries>
                            </div>
                        </div>
                    </div>










            </div>
        );
    }

}
