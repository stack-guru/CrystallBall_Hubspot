import React from "react";
// import UserAnnotationColorPicker from "../../../helpers/UserAnnotationColorPickerComponent";
import { FormGroup, Label } from "reactstrap";


class SharePopups extends React.Component {
    render() {
        return (
                <>

                    {/* <!-- Button trigger modal --> */}
                    {/* <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                    Launch demo modal
                    </button> */}

                    {/* <!-- Modal --> */}
                    
                    <div className="modal fade bd-example-modal-lg" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            
                        <div className="modal-header">   
                            <div className="d-flex justify-content-between">
                                <div className="d-flex justify-content-center">
                                    <h3 className="modal-title" id="exampleModalLongTitle">Share Reports</h3>
                                    <h4>9 Charts</h4>
                                    <h4>Edit selection</h4>  
                                </div>                                                                
                                <div >
                                    <h5>Download pdf</h5>
                                </div>
                            </div>                         
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>

                        </div>

                        <div className="d-flex justify-content-between mb-5">
                            <div className="d-flex">
                                <div>
                                    <FormGroup className="filter-sort position-relative mr-3">
                                        <Label
                                            className="sr-only"
                                            for="dropdownFilters"
                                        >
                                            <span
                                                className={`dot`}
                                                style={{ color: "2D9CDB" }}
                                            ></span>
                                            Crystal Ball
                                        </Label>
                                        <i className="btn-dot left-0 ">
                                            {/*<svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                                            {/*    <path d="M0 10V8.33333H4V10H0ZM0 5.83333V4.16667H8V5.83333H0ZM0 1.66667V0H12V1.66667H0Z" fill="#666666" />*/}
                                            {/*</svg>*/}
                                        </i>
                                        <i className="btn-searchIcon right-0 fa fa-angle-down"></i>
                                        <select
                                            name="sortBy"
                                            id="sort-by"
                                            // value={this.state.sortBy}
                                            className="form-control"
                                            // onChange={this.sort}
                                        >
                                            <option value="">
                                                Crystal Ball
                                            </option>
                                            {/*<option value="added">Added</option>*/}
                                            {/*<option value="user">By User</option>*/}
                                            {/*<option value="today">By Today</option>*/}
                                            {/*<option value="date">By Date</option>*/}
                                            {/*<option value="category">By Category</option>*/}
                                            {/*<option value="ga-property">By GA Property</option>*/}
                                        </select>
                                    </FormGroup>
                                </div>
                                <div>
                                    <FormGroup className="filter-sort position-relative mr-3">
                                        <Label
                                            className="sr-only"
                                            for="dropdownFilters"
                                        >
                                            My First Dashboard
                                        </Label>
                                        <i className="btn-searchIcon left-0">
                                            <svg
                                                width="12"
                                                height="10"
                                                viewBox="0 0 12 10"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M0 10V8.33333H4V10H0ZM0 5.83333V4.16667H8V5.83333H0ZM0 1.66667V0H12V1.66667H0Z"
                                                    fill="#666666"
                                                />
                                            </svg>
                                        </i>
                                        <i className="btn-searchIcon right-0 fa fa-angle-down"></i>
                                        <select
                                            name="sortBy"
                                            id="sort-by"
                                            // value={this.state.sortBy}
                                            className="form-control"
                                            // onChange={this.sort}
                                        >
                                            <option value="">
                                                My First Dashboard
                                            </option>
                                            {/*<option value="added">Added</option>*/}
                                            {/*<option value="user">By User</option>*/}
                                            {/*<option value="today">By Today</option>*/}
                                            {/*<option value="date">By Date</option>*/}
                                            {/*<option value="category">By Category</option>*/}
                                            {/*<option value="ga-property">By GA Property</option>*/}
                                        </select>
                                    </FormGroup>
                                </div>
                            </div>                            
                        </div>
                      
                        <div className="modal-body">
                            <div>
                                <h5>Team members (2selected)</h5>
                                <span className="align-center">
                                    <img
                                        src="/images/svg/test-image.svg"
                                        alt="share icon"
                                    />
                                </span>
                                <span className="align-center">
                                    <img
                                        src="/images/svg/test-image.svg"
                                        alt="share icon"
                                    />
                                </span>
                                <span className="align-center">
                                    <img
                                        src="/images/svg/test-image.svg"
                                        alt="share icon"
                                    />
                                </span>
                                <span className="align-center">
                                    <img
                                        src="/images/svg/test-image.svg"
                                        alt="share icon"
                                    />
                                </span>
                                <span className="align-center">
                                    <img
                                        src="/images/svg/test-image.svg"
                                        alt="share icon"
                                    />
                                </span>
                            </div>
                            <div>
                                Add via email

                            </div>
                            <div>
                                selected(click to remove)
                                <div>
                                    A(Team) B(Team) C(Team) D(Team) E(Team) F(Team)
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer justify-content-between">
                            <div>
                                <button className="left-0">Preview</button>
                            </div>
                            <div className="d-flex justify-content-center">
                                <button type="button" className="btn btn-secondary" >Set recurrence</button> 
                                {/* //data-dismiss="modal" */}
                                <button type="button" className="btn btn-primary">Share</button>
                            </div>
                            
                        </div>
                        </div>
                    </div>
                    </div>
                </>
           

            //  </div>
            // <div className="apps-modalHead">
            //     <div className="d-flex justify-content-between align-items-center">
            //         <div className="d-flex justify-content-start align-items-center">
            //         <h2>{this.props.serviceName}</h2>
            //         <h2>{this.props.chartsCount}</h2>
            //         </div>
            //             {/* {this.props.downloadButton ?
            //                 <div className="d-flex align-items-center">
            //                     <a href="/csv/upload_sample.csv" target="_blank" download={true} className="btn-cancel mr-5">
            //                         <i className="mr-2"><img src="/icon-download.svg"/></i>
            //                         <span>Download pdf</span>
            //                     </a>
            //                     {this.props.closeModal ? <span onClick={this.props.closeModal} className="btn-close"><img className="inject-me" src="/close-icon.svg" width="26" height="26" alt="menu icon" /></span> : null}
            //                 </div>
            //             :
            //                 <>
            //                     { <span onClick={this.props.closeModal} className="btn-close"><img className="inject-me" src="/close-icon.svg" width="26" height="26" alt="menu icon" /></span>}
            //                 </>
            //             } */}
            //             {this.props.closeModal ? <span onClick={this.props.closeModal} className="btn-close"><img className="inject-me" src="/close-icon.svg" width="26" height="26" alt="menu icon" /></span> : null}


            //     </div>
            //     {this.props.description ? <p className="mb-0 pt-3">{this.props.description}</p> : null}

            // </div>
        )
    }
}

export default SharePopups