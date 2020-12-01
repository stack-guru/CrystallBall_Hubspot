import React from 'react';
require('../../Main.css');
import * as $ from 'jquery';
export default class DataSourceIndex extends React.Component{
    constructor(props) {
        super(props);
            this.state={
                switch:false,
            }
            this.switchHandler=this.switchHandler.bind(this);
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
    switchHandler(e){
        if(e.target.checked){
            this.setState({switch:true});
            $("#"+e.target.className).removeClass('invisible');
            $("#"+e.target.className).addClass('visible');
        }else{
            this.setState({switch:false});
            $("#"+e.target.className).removeClass('visible')
            $("#"+e.target.className).addClass('invisible')
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
                        <div className="col-12 col-md-6 col-lg-6 col-sm-12">
                            <div className="row ml-0 mr-0">
                                <div className="col-6">
                                    <h3>Holiday</h3>
                                </div>
                                <div className="col-6 text-center">
                                    <label className="switch">
                                        <input type="checkbox" className="holiday" defaultChecked={this.state.switch}  onChange={this.switchHandler}/>
                                            <span className="slider round"></span>
                                    </label>
                                </div>

                            </div>
                            <div className="row ml-0 mr-0 mt-3">
                                <div className="col-12">
                                    <dl className="d-flex flex-row flex-wrap ">
                                        <dt>Annotations for:</dt>
                                        <dd className="mx-2">spain</dd>
                                        <dd className="mx-2">Argentina</dd>
                                        <dd className="mx-2">spain</dd>

                                    </dl>
                                </div>

                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-6 col-sm-12">
                            <div className="switch-wrapper invisible" id="holiday">
                            <form action="" className="disabled">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                                        <label className="form-check-label" htmlFor="defaultCheck1">
                                            Default checkbox
                                        </label>
                                </div>

                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                                    <label className="form-check-label" htmlFor="defaultCheck1">
                                        Default checkbox
                                    </label>
                                </div>

                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                                    <label className="form-check-label" htmlFor="defaultCheck1">
                                        Default checkbox
                                    </label>
                                </div>

                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                                    <label className="form-check-label" htmlFor="defaultCheck1">
                                        Default checkbox
                                    </label>
                                </div>

                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                                    <label className="form-check-label" htmlFor="defaultCheck1">
                                        Default checkbox
                                    </label>
                                </div>

                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                                    <label className="form-check-label" htmlFor="defaultCheck1">
                                        Default checkbox
                                    </label>
                                </div>

                            </form>
                            </div>
                        </div>
                    </div>




                <div className="row ml-0 mr-0 mt-4">
                    <div className="col-12 col-md-6 col-lg-6 col-sm-12">
                        <div className="row ml-0 mr-0">
                            <div className="col-6">
                                <h3>Weather Alert</h3>
                            </div>
                            <div className="col-6 text-center">
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
                    <div className="col-12 col-md-6 col-lg-6 col-sm-12">

                    </div>
                </div>








                <div className="row ml-0 mr-0 mt-4">
                    <div className="col-12 col-md-6 col-lg-6 col-sm-12">
                        <div className="row ml-0 mr-0">
                            <div className="col-6">
                                <h3>Google Algorithm Updates</h3>
                            </div>
                            <div className="col-6 text-center">
                                <label className="switch">
                                    <input type="checkbox" />
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
                    <div className="col-12 col-md-6 col-lg-6 col-sm-12">

                    </div>
                </div>







                <div className="row ml-0 mr-0 mt-4">
                    <div className="col-12 col-md-6 col-lg-6 col-sm-12">
                        <div className="row ml-0 mr-0">
                            <div className="col-6">
                                <h3>Retail Marketing</h3>
                            </div>
                            <div className="col-6 text-center">
                                <label className="switch">
                                    <input type="checkbox" className="retail" defaultChecked={this.state.switch}  onChange={this.switchHandler} />
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
                    <div className="col-12 col-md-6 col-lg-6 col-sm-12">
                        <div className="switch-wrapper invisible" id="retail">
                            <form action="" >
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                                    <label className="form-check-label" htmlFor="defaultCheck1">
                                        Default checkbox
                                    </label>
                                </div>

                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                                    <label className="form-check-label" htmlFor="defaultCheck1">
                                        Default checkbox
                                    </label>
                                </div>

                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                                    <label className="form-check-label" htmlFor="defaultCheck1">
                                        Default checkbox
                                    </label>
                                </div>

                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                                    <label className="form-check-label" htmlFor="defaultCheck1">
                                        Default checkbox
                                    </label>
                                </div>

                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                                    <label className="form-check-label" htmlFor="defaultCheck1">
                                        Default checkbox
                                    </label>
                                </div>

                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                                    <label className="form-check-label" htmlFor="defaultCheck1">
                                        Default checkbox
                                    </label>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>















            </div>
        );
    }

}
