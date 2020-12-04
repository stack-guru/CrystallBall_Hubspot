import React from 'react';
import HttpClient from '../utils/HttpClient';
require('../Main.css');

export default  class countries extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            countries:[],
            isBusy:false,
            errors:''
        }
    }
    componentDidMount() {
        if(!this.state.isBusy){
        this.setState({isBusy:true})
            HttpClient.get('countries').then(resp=>{
                this.setState({isBusy:false,countries:resp.data.countries})
            },(err)=>{
                console.log(err);
                this.setState({isBusy:false,errors:err.response})
            }).then(err=>{
                console.log(err);
                this.setState({isBusy:false,errors:err})
            })
        }

    }

    render() {
        let countries=this.state.countries;
        return (
            <div className="countries-form">
                        <h3 className="gaa-text-primary">Select Countries</h3>
                <hr/>
                <div className="checkbox-box">
                {
                    countries?
                        countries.map(country=>(
                        <div className="form-check country" key={country}>
                            <input className="form-check-input" type="checkbox" name={country} id={country}/>
                            <label className="form-check-label" htmlFor="defaultCheck1">
                                {country}
                            </label>
                        </div>
                        ))
                        :<span>No country found</span>
                }
                </div>
            </div>
        );
    }

}
