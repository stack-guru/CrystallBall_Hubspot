import React from 'react';
import {Link} from "react-router-dom";

export default class CreateAnnotation extends React.Component{

    constructor(props) {
        super(props);

    }
    render() {
        return(
            <div className="container-xl bg-white" style={{minHeight:'100vh'}}>
                <section className="ftco-section" id="buttons">
                    <div className="container">
                        <div className="row mb-5">
                            <div className="col-md-12">
                                <h2 className="heading-section">Add Annotation <br/>
                                    <small>Enter your annotation details</small>
                                </h2>
                            </div>
                        </div>

                        <form method="POST" action="">
                            <div className="row">
                                {/*@csrf*/}
                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group @if($errors->has('category')) has-danger @endif">
                                        <input type="text" className="form-control" id="category" name="category"
                                               required/>
                                            <label htmlFor="category" className="form-control-placeholder">Category</label>

                                            <span className="bmd-help"></span>


                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group  ">

                                            <select className="form-control" name="event_type" id="event_type" required>
                                            <option value="Default" selected>Default</option>
                                            <option value="Annotaions">Annotaions</option>
                                            <option value="Api">Api</option>
                                            <option value="Google-updates">Google-updates</option>
                                            <option value="Holidays">Holidays</option>
                                            <option value="Gtm">Gtm</option>
                                            </select>
                                            <label for="event_type" className="form-control-placeholder">event_type</label>

                                            <span className="bmd-help"></span>

                                            </div>
                                            </div>
                                            <div className="col-lg-3 col-sm-4">
                                            <div className="form-group @if($errors->has('event_name')) has-danger @endif">
                                            <input type="text" className="form-control" id="event_name" name="event_name" required/>
                                            <label for="event_name" className="form-control-placeholder">event_name</label>

                                            <span className="bmd-help"></span>

                                            </div>
                                            </div>
                                            <div className="col-lg-3 col-sm-4">
                                            <div className="form-group @if($errors->has('url')) has-danger @endif">
                                            <input type="text" className="form-control" id="url" name="url"/>
                                            <label for="url" className="form-control-placeholder">url</label>

                                            <span className="bmd-help"></span>

                                            </div>
                                            </div>
                                            <div className="col-lg-3 col-sm-4">
                                                <div className="form-group  has-danger ">
                                                    <textarea type="text" className="form-control" id="description" name="description"></textarea>
                                                    <label for="description" className="form-control-placeholder">description</label>
                                                    <span className="bmd-help"></span>
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-sm-4">
                                                    <div className="form-group ">
                                                    <input type="text" className="form-control" id="title" name="title" required/>
                                                    <label for="title" className="form-control-placeholder">title</label>

                                                    <span className="bmd-help"></span>

                                                         </div>
                                            </div>
                                            <div className="col-lg-3 col-sm-4">
                                            <div className="form-group ">
                                            <input type="date" className="form-control" id="show_at" name="show_at" required/>
                                            <label for="show_at" className="form-control-placeholder">show_at</label>

                                            <span className="bmd-help"></span>

                                            </div>
                                            </div>
                                            <div className="col-lg-3 col-sm-4">
                                                <div className="form-group @if($errors->has('type')) has-danger @endif">
                                                <input type="text" className="form-control" id="type" name="type" required/>
                                                <label for="type" className="form-control-placeholder">type</label>

                                                <span className="bmd-help">error</span>

                                                </div>
                                            </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-1 offset-11">
                                                    <button type="submit" className="btn btn-primary btn-fab btn-round" title="submit">
                                                    <i className="ion-ios-plus"></i>
                                                        save
                                                    </button>
                                                </div>
                                            </div>
                                            </form>

                                            </div>
                                            </section>
            </div>
        )
    }

}
