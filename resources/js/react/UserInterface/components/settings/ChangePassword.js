import React from 'react';

export default class ChangePassword extends React.Component{

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="container-xl bg-white component-wrapper">
                <div className="row ml-0 mr-0">
                    <div className="col-12">
                        <h3 className="gaa-title">New Password</h3>
                        <form action="">
                            <div className="form-group">
                                <label htmlFor="">Password</label>
                                <input type="text" className="form-control" name="password" placeholder="New Password" id=""/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="">Repeat-Password</label>
                                <input type="text"  className="form-control" placeholder="Repeat Password" name="R-password" id=""/>
                            </div>
                            <div className="row ml-0 mr-0">
                                <div className="col-12 text-right p-0">
                                    <button className="btn btn-primary">Reset</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }


}
