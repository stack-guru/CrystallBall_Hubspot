import React from "react";
import HttpClient from "./HttpClient";

export default class GoogleAdChanges extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            errors: "",
        };

    }

    componentDidMount() {

    }

    render() {
        return (
            <div className="apps-bodyContent switch-wrapper">
                <div className="">
                    <h4 className="gaa-text-primary">Google Ad Change Configurations</h4>

                    <form>

                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Anomaly Change</label>
                            <div className="input-group mb-3">
                                <input type="number" min="0" className="form-control" placeholder="Anomaly Change" aria-label="Anomaly Change"
                                       aria-describedby="basic-addon1" />
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1">%</span>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Time To Compare</label>
                            <div className="input-group mb-3">
                                <input type="number" min="0" className="form-control" placeholder="Time To Compare" aria-label="Time To Compare"
                                       aria-describedby="basic-addon2" />
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1">days</span>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Active</label>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="active"
                                       id="exampleRadios1" value="1" checked />
                                    <label className="form-check-label" htmlFor="exampleRadios1">
                                        Increase
                                    </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="active"
                                       id="exampleRadios2" value="2" />
                                    <label className="form-check-label" htmlFor="exampleRadios2">
                                        Decrease
                                    </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="active"
                                       id="exampleRadios3" value="3" />
                                    <label className="form-check-label" htmlFor="exampleRadios3">
                                        Both
                                    </label>
                            </div>
                        </div>

                    </form>

                </div>
            </div>
        );
    }
}
