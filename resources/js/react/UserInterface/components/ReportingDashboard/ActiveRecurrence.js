import React from "react";
// import UserAnnotationColorPicker from "../../../helpers/UserAnnotationColorPickerComponent";
import { FormGroup, Label } from "reactstrap";


class ActiveRecurrence extends React.Component {
    render() {
        return (
                <>
                 <div className="modal fade bd-example-modal-lg" id="exampleModalCenter1" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            
                        <div className="modal-header">   
                        <h3 className="modal-title" id="exampleModalLongTitle">Active recurrence 12</h3>
                            {/* <div className="d-flex justify-content-between">
                                <div className="d-flex justify-content-center">
                                    
                                     
                                </div>                            
                            </div>                          */}
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>

                        </div>
                        <div className="modal-body">
                            <div className="active-recurrernce-card d-flex flex-column">
                                <div>
                                    <h5>Report 1 created on 20 NOV,0222 </h5>
                                </div>
                                <div className="justify-content-between d-flex">
                                    <div className="d-flex">
                                        <h5>CrystalBall</h5>    
                                        <h5>Dashboard</h5>
                                        <h5>9 Charts</h5>
                                    </div>
                                    <div>
                                        edit pause delete
                                    </div>
                                </div>
                            </div>
                            <div className="active-recurrernce-card">

                                <h5>Report 1 created on 20 NOV,0222 </h5>
                                <h5>CrystalBall</h5>
                            </div>
                            <div className="active-recurrernce-card">
                                <h5>Report 1 created on 20 NOV,0222 </h5>
                                <h5>CrystalBall</h5>
                            </div>
                            <div className="active-recurrernce-card">
                                <h5>Report 1 created on 20 NOV,0222 </h5>
                                <h5>CrystalBall</h5>
                            </div>
                            <div className="active-recurrernce-card">
                                <h5>Report 1 created on 20 NOV,0222 </h5>
                                <h5>CrystalBall</h5>
                            </div>
                        </div>
                        {/* <div className="modal-footer justify-content-between">
                            <div>
                                <button className="left-0">Preview</button>
                            </div>
                            <div className="d-flex justify-content-center">
                                <button type="button" className="btn btn-secondary" >Set recurrence</button> 
                                
                                <button type="button" className="btn btn-primary">Share</button>
                            </div>
                            
                        </div> */}
                        </div>
                    </div>
                    </div>
                </>
        )
    }
}

export default ActiveRecurrence
