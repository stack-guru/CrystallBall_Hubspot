import React from 'react';
require('../../Main.css');
import Countries from "../../utils/Countries";
import HttpClient from "../../utils/HttpClient";
import * as $ from 'jquery';

export default class DataSourceIndex extends React.Component{
    constructor(props) {
        super(props);
            this.state={
                sectionName:null,
                showCountry:false,
                countries:[],
                countryCheck:false,

                isBusy:false,
                errors:'',
            }
        this.holidaySwitchHandler=this.holidaySwitchHandler.bind(this);
        this.addCountry=this.addCountry.bind(this);

    }

    componentDidMount() {
        document.title='Data Source';
        if(!this.state.isBusy){
            HttpClient.get('/user-data-source').then(resp=>{
                this.setState({isBusy:false,countries:resp.data.data_sources});
                console.log(this.state.countries);
            },(err)=>{
                this.setState({isBusy:false,errors:err.response});
                console.log(err)
            }).then(err=>{
                console.log(err)
                this.setState({isBusy:false,errors:err});

            })
        }


    }
    addCountry(e){
        let countries=[];
        if(!e.target.defaultChecked){
            this.setState({countryCheck:true})
            let formData={
                'ds_code':'holidays',
                'ds_name':'Holiday',
                'country_name':e.target.name,
                'is_enabled':1,
            }
            HttpClient.post('/data-sources',formData).then(resp=>{
                this.setState({countries:this.state.countries.concat(resp.data.user_data_source)})
                    console.log(resp);
                },(err)=>{
                   console.log(err)
                }).then(err=>{
                    console.log(err)
            })
        }
        if(e.target.defaultChecked){

        }
        console.log(countries);


    }

    holidaySwitchHandler(e){
        if(!this.state.showCountry||this.state.sectionName==null){
            this.setState({showCountry: true, sectionName: e.target.className});
        }else {
            this.setState({showCountry:false,sectionName:null});

        }
    }


    render() {
        let countries=this.state.countries;
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
                                        {
                                            countries?
                                                countries.map(country=>(
                                                    <dd className="mx-2" key={country.id}>{country.country_name}</dd>
                                                ))
                                                :
                                                <dd className="mx-2">no country added</dd>

                                        }

                                    </dl>
                                </div>
                                <div className="col-4 text-center d-flex flex-column justify-content-center align-items-center">
                                    <label className="switch">
                                        <input type="checkbox" className="holiday"  name="status" />
                                            <span className="slider round"></span>
                                    </label>
                                    <label className="trigger switch ">
                                        <input type="checkbox" className="holiday" defaultChecked={this.state.showCountry} onChange={this.holidaySwitchHandler} />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                            </div>

                            </div>

                            {/*<div className="container mt-3 ds-sections">*/}
                            {/*    <div className="row ml-0 mr-0">*/}
                            {/*        <div className="col-8">*/}
                            {/*            <h3 className="gaa-text-primary">Weather Alert</h3>*/}
                            {/*        </div>*/}
                            {/*        <div className="col-4 d-flex flex-column justify-content-center align-items-center">*/}
                            {/*            <label className="switch">*/}
                            {/*                <input type="checkbox"  />*/}
                            {/*                <span className="slider round"></span>*/}
                            {/*            </label>*/}
                            {/*            <label className="trigger switch ">*/}
                            {/*                <input type="checkbox" className="weather" defaultChecked={this.state.showCountry} onChange={this.weatherSwitchHandler} />*/}
                            {/*                <span className="slider round"></span>*/}
                            {/*            </label>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*    <div className="row ml-0 mr-0 mt-3">*/}
                            {/*        <div className="col-12">*/}
                            {/*            <dl className="d-flex flex-row flex-wrap">*/}
                            {/*                <dt>Annotations for:</dt>*/}
                            {/*                <dd className="mx-2">spain</dd>*/}
                            {/*                <dd className="mx-2">Argentina</dd>*/}
                            {/*                <dd className="mx-2">spain</dd>*/}

                            {/*            </dl>*/}
                            {/*        </div>*/}

                            {/*    </div>*/}
                            {/*</div>*/}

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
                            {this.state.showCountry?
                                <div className="switch-wrapper" >
                        <Countries sectionTitle={this.state.sectionName} onChangeCallback={this.addCountry} ds_data={this.state.countries} ></Countries>
                                </div>
                                :null
                            }
                        </div>
                    </div>










            </div>
        );
    }

}
