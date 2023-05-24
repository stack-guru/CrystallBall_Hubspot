import React from "react";
// import UserAnnotationColorPicker from "../../../helpers/UserAnnotationColorPickerComponent";
import { FormGroup, Label } from "reactstrap";
import ShareSuccessPopup from "./shareSucceessPopup";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

class SharePopups extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isShareSuccessfull: false,
            isShareSubmit: false,
        };

        this.handleShareSuccess = this.handleShareSuccess.bind(this);
        this.toggle = this.toggle.bind(this);
        this.closeSuccessPopup = this.closeSuccessPopup.bind(this);
    }

    handleShareReports(){
        this.setState(prevState => ({
            isShareSubmit: !prevState.isShareSubmit
          }));
    }
    handleShareSuccess() {
        // this.setState(prevState => ({
        //     isShareSuccessfull: !prevState.isShareSuccessfull
        //   }));
      
         this.setState({ isShareSuccessfull: true, isShareSubmit: true });
        // this.setState({ });
    }
    closeSuccessPopup(){
        this.setState({ isShareSuccessfull: false, isShareSubmit: true });

    }
    toggle(){
        this.setState(prevState => ({
            isShareSubmit: !prevState.isShareSubmit
          }));
        console.log('toggle call')
    }

    render() {
        return (
            <>
                <Modal
                    className={`apps-modal`}
                    isOpen={!this.state.isShareSubmit}
                    // toggle={this.toggle}
                >
                    <ModalBody>
                        <div className="apps-modalHead d-flex justify-content-between align-items-center flex-row">
                            <div className="d-flex justify-content-between align-items-center leftContent">
                                <h3 className="mb-0">Share Reports</h3>
                                <span className="divider"></span>
                                <div className="d-flex justify-content-center">
                                    <h4 className="mb-0">9 Charts</h4>
                                    <h4 className="mb-0">Edit selection</h4>
                                </div>
                            </div>

                            <div className="d-flex align-items-center">
                                <div>
                                    
                                    <button className="download-pdf-btn" onClick={() => {
                                    html2pdf(document.getElementById("dashboard-index-container"), {
                                        margin: 0.5,
                                        filename: 'dashboard_analytics.pdf',
                                        image: { type: 'jpeg', quality: 1.0 },
                                        html2canvas: { scale: 1 },
                                        jsPDF: { unit: 'in', format: 'A4', orientation: 'landscape' }
                                    });
                                }}>
                                    <img className="float-left d-inline" src="/images/svg/download.svg" alt="download-icon" />                                        
                                        Download pdf
                                    </button>
                                </div>
                                
                                <span
                                    onClick={this.toggle}
                                    className="btn-close" 
                                    // toggle={this.toggle}

                                >
                                    <img
                                        className="inject-me"
                                        src="/close-icon.svg"
                                        width="26"
                                        height="26"
                                        alt="menu icon"
                                    />
                                </span>
                            </div>
                        </div>
                        <div className="shareReport">
                            <div className="fieldsPlusLogo d-flex">
                                <div className="fields flex-grow-1">
                                    <FormGroup className="filter-sort position-relative">
                                        <Label
                                            className="sr-only"
                                            for="dropdownFilters"
                                        >
                                            <span
                                                className={`dot`}
                                                style={{
                                                    color: "2D9CDB",
                                                }}
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
                                            className="form-control" // value={this.state.sortBy} onChange={this.sort}
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
                                    <FormGroup className="filter-sort position-relative">
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
                                            className="form-control"
                                            // value={this.state.sortBy}
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
                                <div className="">
                                <figure className="addLogo">
                                    <img className="d-flex justify-content-center" src="/images/svg/circle-plus.svg" alt="plus icon" />
                                    <p className="add-logo d-flex justify-content-center">Add Logo</p>
                                </figure>
                                </div>
                               
                            </div>
                            <div className="modalContentArea">
                                <h5>
                                    Team members <span>(2selected)</span>
                                </h5>
                                <ul>
                                    <li>
                                        <img
                                            src="/images/svg/6.svg"
                                            alt="share icon"
                                        />
                                    </li>
                                    <li>
                                        <img
                                            src="/images/svg/2.svg"
                                            alt="share icon"
                                        />
                                    </li>
                                    <li>
                                        <img
                                            src="/images/svg/5.svg"
                                            alt="share icon"
                                        />
                                    </li>
                                    <li>
                                        <img
                                            src="/images/svg/4.svg"
                                            alt="share icon"
                                        />
                                    </li>
                                    <li>
                                        <img
                                            src="/images/svg/5.svg"
                                            alt="share icon"
                                        />{" "}
                                    </li>
                                </ul>
                                <div className="addViaEmail">
                                    <label>Add via email</label>
                                    <div className="themeNewInputStyle position-relative inputWithIcon d-inline-block">
                                        <span className="icon fa ">
                                            <img src="/icon-plus.svg" alt="plus icon" />
                                        </span>
                                        <input type="email" className="form-control" placeholder="Enter email address" />
                                    </div>
                                    <p className="d-flex align-items-center emailNote">
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 18 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M9 13.5C9.255 13.5 9.4689 13.4136 9.6417 13.2408C9.8139 13.0686 9.9 12.855 9.9 12.6V8.9775C9.9 8.7225 9.8139 8.5125 9.6417 8.3475C9.4689 8.1825 9.255 8.1 9 8.1C8.745 8.1 8.5314 8.1861 8.3592 8.3583C8.1864 8.5311 8.1 8.745 8.1 9V12.6225C8.1 12.8775 8.1864 13.0875 8.3592 13.2525C8.5314 13.4175 8.745 13.5 9 13.5ZM9 6.3C9.255 6.3 9.4689 6.2136 9.6417 6.0408C9.8139 5.8686 9.9 5.655 9.9 5.4C9.9 5.145 9.8139 4.9311 9.6417 4.7583C9.4689 4.5861 9.255 4.5 9 4.5C8.745 4.5 8.5314 4.5861 8.3592 4.7583C8.1864 4.9311 8.1 5.145 8.1 5.4C8.1 5.655 8.1864 5.8686 8.3592 6.0408C8.5314 6.2136 8.745 6.3 9 6.3ZM9 18C7.755 18 6.585 17.7636 5.49 17.2908C4.395 16.8186 3.4425 16.1775 2.6325 15.3675C1.8225 14.5575 1.1814 13.605 0.7092 12.51C0.2364 11.415 0 10.245 0 9C0 7.755 0.2364 6.585 0.7092 5.49C1.1814 4.395 1.8225 3.4425 2.6325 2.6325C3.4425 1.8225 4.395 1.1811 5.49 0.7083C6.585 0.2361 7.755 0 9 0C10.245 0 11.415 0.2361 12.51 0.7083C13.605 1.1811 14.5575 1.8225 15.3675 2.6325C16.1775 3.4425 16.8186 4.395 17.2908 5.49C17.7636 6.585 18 7.755 18 9C18 10.245 17.7636 11.415 17.2908 12.51C16.8186 13.605 16.1775 14.5575 15.3675 15.3675C14.5575 16.1775 13.605 16.8186 12.51 17.2908C11.415 17.7636 10.245 18 9 18ZM9 16.2C10.995 16.2 12.6939 15.4989 14.0967 14.0967C15.4989 12.6939 16.2 10.995 16.2 9C16.2 7.005 15.4989 5.3061 14.0967 3.9033C12.6939 2.5011 10.995 1.8 9 1.8C7.005 1.8 5.3064 2.5011 3.9042 3.9033C2.5014 5.3061 1.8 7.005 1.8 9C1.8 10.995 2.5014 12.6939 3.9042 14.0967C5.3064 15.4989 7.005 16.2 9 16.2Z"
                                                fill="#666666"
                                            />
                                        </svg>
                                        You’ve added 10 emails per your plan.{" "}
                                        <a href="">Upgrade to add more</a>
                                    </p>
                                </div>
                                <h5>
                                    Selected <span>(Click to remove)</span>
                                </h5>
                                <div className="tags">
                                    <span className="tag">
                                        Newton Jr. (Team)
                                    </span>
                                    <span className="tag">Cool guy (Team)</span>
                                    <span className="tag">
                                        fernando@gmail.com
                                    </span>
                                    <span className="tag">
                                        newtfranklinjr@gmail.com
                                    </span>
                                    <span className="tag">wow@awesome.com</span>
                                </div>
                            </div>

                            <div className="modal-footer justify-content-between">
                                <button className="m-0 btn btn-outline btn-sm btnCornerRounded share-btn">Preview</button>
                                <div className="d-flex justify-content-center m-0">
                                    <button
                                        type="button"
                                        className="btn mr-3 recurrence-text"
                                    >
                                    <img src="/images/svg/recurrence-gray.svg" alt="active icon" className="mr-2 recurrence-color" />
                                        Set recurrence
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline btn-sm btnCornerRounded share-btn share-preview-btn "
                                        onClick={this.handleShareSuccess}
                                    >
                                        Share
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* <div className="popupContent modal-share-report">
                            <div className="apps-modalHead d-flex justify-content-between align-items-center flex-row">
                                <h2>
                                    <span style={{ color: "#096db7" }}>
                                        Report Popup:
                                    </span>{" "}
                                    &nbsp; How it works?
                                </h2>
                                <span onClick={() => {}} className="btn-close">
                                    <img
                                        className="inject-me"
                                        src="/close-icon.svg"
                                        width="26"
                                        height="26"
                                        alt="menu icon"
                                    />
                                </span>
                            </div>

                            <div
                                className="apps-bodyContent overflow-hidden mb-0"
                                style={{ color: "#666" }}
                            >
                                <p className="mb-0">this.props.description</p>
                            </div>

                            <div className="apps-modalFoot d-flex flex-column">
                                <span onClick={() => {}}>
                                    <span>Automate</span>
                                    <img
                                        className="ml-2 inject-me"
                                        src="/icon-green.svg"
                                        width="26"
                                        height="26"
                                        alt="icon"
                                    />
                                </span>
                            </div>
                        </div> */}
                    </ModalBody>
                </Modal>

                <Modal
                    className={`apps-modal share-report-success-modal`}
                    isOpen={this.state.isShareSubmit && this.state.isShareSuccessfull}
                    toggle={() => {}}
                >
                    <ModalBody className="d-flex flex-column justify-content-center">
                        <img src="/images/svg/share-success.svg" alt="share success" width={290} height={146} className="d-block mx-auto" />
                        <h2 className="report-success-text">Report sent successfully!</h2>
                        <div className="d-flex justify-content-center">
                            <button className="`btn btn-outline btn-sm btnCornerRounded share-another-btn mr-3">Share another</button>
                            <button className="`btn btn-outline btn-sm btnCornerRounded share-another-btn close" title="close" onClick={this.closeSuccessPopup}>Close</button>
                        </div>
                    </ModalBody>
                </Modal>
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
        );
    }
}

export default SharePopups;
