import React, { Component } from 'react'

export default class StorePayment extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render() {
        return (
            <div className="container-xl bg-white component-wrapper">
                <div className="row ml-0 mr-0">
                    <div className="masonry-item col-md-6">
                        <div className="bgc-white p-20 bd">
                            <h6 className="c-grey-900">Complex Form Layout</h6>
                            <div className="mT-30">
                                <form>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label for="inputEmail4">Email</label>
                                            <input type="email" className="form-control" id="inputEmail4" placeholder="Email" />
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label for="inputPassword4">Password</label>
                                            <input type="password" className="form-control" id="inputPassword4" placeholder="Password" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label for="inputAddress">Address</label>
                                        <input type="text" className="form-control" id="inputAddress" placeholder="1234 Main St" />
                                    </div>
                                    <div className="form-group">
                                        <label for="inputAddress2">Address 2</label>
                                        <input type="text" className="form-control" id="inputAddress2" placeholder="Apartment, studio, or floor" />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label for="inputCity">City</label>
                                            <input type="text" className="form-control" id="inputCity" />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label for="inputState">State</label>
                                            <select id="inputState" className="form-control">
                                                <option selected="selected">Choose...</option>
                                                <option>...</option>
                                            </select>
                                        </div>
                                        <div className="form-group col-md-2">
                                            <label for="inputZip">Zip</label>
                                            <input type="text" className="form-control" id="inputZip" />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label className="fw-500">Birthdate</label>
                                            <div className="timepicker-input input-icon form-group">
                                                <div className="input-group">
                                                    <div className="input-group-addon bgc-white bd bdwR-0">
                                                        <i className="ti-calendar"></i>
                                                    </div>
                                                    <input type="text" className="form-control bdc-grey-200 start-date" placeholder="Datepicker" data-provide="datepicker" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="checkbox checkbox-circle checkbox-info peers ai-c">
                                            <input type="checkbox" id="inputCall2" name="inputCheckboxesCall" className="peer" />
                                            <label for="inputCall2" className="peers peer-greed js-sb ai-c">
                                                <span className="peer peer-greed">Call John for Dinner</span>
                                            </label>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Sign in</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="masonry-item col-md-6">
                        <div className="bgc-white p-20 bd">
                            <h6 className="c-grey-900">Complex Form Layout</h6>
                            <div className="mT-30">
                                <form>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label for="inputEmail4">Email</label>
                                            <input type="email" className="form-control" id="inputEmail4" placeholder="Email" />
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label for="inputPassword4">Password</label>
                                            <input type="password" className="form-control" id="inputPassword4" placeholder="Password" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label for="inputAddress">Address</label>
                                        <input type="text" className="form-control" id="inputAddress" placeholder="1234 Main St" />
                                    </div>
                                    <div className="form-group">
                                        <label for="inputAddress2">Address 2</label>
                                        <input type="text" className="form-control" id="inputAddress2" placeholder="Apartment, studio, or floor" />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label for="inputCity">City</label>
                                            <input type="text" className="form-control" id="inputCity" />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label for="inputState">State</label>
                                            <select id="inputState" className="form-control">
                                                <option selected="selected">Choose...</option>
                                                <option>...</option>
                                            </select>
                                        </div>
                                        <div className="form-group col-md-2">
                                            <label for="inputZip">Zip</label>
                                            <input type="text" className="form-control" id="inputZip" />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label className="fw-500">Birthdate</label>
                                            <div className="timepicker-input input-icon form-group">
                                                <div className="input-group">
                                                    <div className="input-group-addon bgc-white bd bdwR-0">
                                                        <i className="ti-calendar"></i>
                                                    </div>
                                                    <input type="text" className="form-control bdc-grey-200 start-date" placeholder="Datepicker" data-provide="datepicker" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="checkbox checkbox-circle checkbox-info peers ai-c">
                                            <input type="checkbox" id="inputCall2" name="inputCheckboxesCall" className="peer" />
                                            <label for="inputCall2" className="peers peer-greed js-sb ai-c">
                                                <span className="peer peer-greed">Call John for Dinner</span>
                                            </label>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Sign in</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        )
    }
}
