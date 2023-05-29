import React from "react";
// import UserAnnotationColorPicker from "../../../helpers/UserAnnotationColorPickerComponent";
import { FormGroup, Label } from "reactstrap";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";



class ActiveRecurrence extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isShareSuccessfull: false,
            isActiveRecurrence: true,
        };

        
        this.toggle = this.toggle.bind(this);

    }


    toggle(){
        // this.setState({isActiveRecurrence:!this.state.isActiveRecurrence})
        this.setState((prevState) => ({
            isActiveRecurrence: !prevState.isActiveRecurrence,
          }));
    }

    render() {
        const { isActiveRecurrence } = this.state;
        return (
            <Modal className={`apps-modal activeRecurrenceModal`} isOpen={isActiveRecurrence} toggle={this.toggle}>
                <div className="modal-header d-flex justify-content-between align-items-center">
                    <h3 className="modal-title" id="exampleModalLongTitle">Active recurrence <span>12</span></h3>
                    <span type="button" className="" data-dismiss="modal" aria-label="Close" onClick={this.toggle} aria-hidden="true">
                        <img
                            className="inject-me"
                            src="/close-icon.svg"
                            width="26"
                            height="26"
                            alt="close icon"
                        />
                    </span>
                </div>
                <ModalBody>
                <div className="active-recurrernce-card">
                    <p>Report 1 created on 20 NOV,0222</p>
                    <div className="d-flex justify-content-between">
                        <ul className="infoList">
                            <li><span>Crystall Ball</span></li>
                            <li><span>Dashboard 1</span></li>
                            <li><span>9 Charts</span></li>
                        </ul>
                        <ul className="actionList">
                            <li><span><img src="/images/svg/edit.svg" alt="edit-icon" /></span></li>
                            <li><span><img src="/images/svg/play.svg" alt="play-icon" /></span></li>
                            <li><span><img src="/images/svg/delete.svg" alt="delete-icon" /></span></li>
                        </ul>
                    </div>
                </div>
                <div className="active-recurrernce-card">
                    <p>Report 1 created on 20 NOV,0222</p>
                    <div className="d-flex justify-content-between">
                        <ul className="infoList">
                            <li><span>Crystall Ball</span></li>
                            <li><span>Dashboard 1</span></li>
                            <li><span>9 Charts</span></li>
                        </ul>
                        <ul className="actionList">
                            <li><span><img src="/images/svg/edit.svg" alt="edit-icon" /></span></li>
                            <li><span><img src="/images/svg/pause.svg" alt="pause-icon" /></span></li>
                            <li><span><img src="/images/svg/delete.svg" alt="delete-icon" /></span></li>
                        </ul>
                    </div>
                </div>
                <div className="active-recurrernce-card">
                    <p>Report 1 created on 20 NOV,0222</p>
                    <div className="d-flex justify-content-between">
                        <ul className="infoList">
                            <li><span>Crystall Ball</span></li>
                            <li><span>Dashboard 1</span></li>
                            <li><span>9 Charts</span></li>
                        </ul>
                        <ul className="actionList">
                            <li><span><img src="/images/svg/edit.svg" alt="edit-icon" /></span></li>
                            <li><span><img src="/images/svg/play.svg" alt="play-icon" /></span></li>
                            <li><span><img src="/images/svg/delete.svg" alt="delete-icon" /></span></li>
                        </ul>
                    </div>
                </div>
                
                
                </ModalBody>
            </Modal>
        )
    }
}

export default ActiveRecurrence
