import React from "react";
// import UserAnnotationColorPicker from "../../../helpers/UserAnnotationColorPickerComponent";
import { FormGroup, Label } from "reactstrap";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";



class ActiveRecurrence extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isShareSuccessfull: false,
            isActiveRecurrence: false,
        };

        
        this.toggle = this.toggle.bind(this);

    }


    toggle(){
        this.setState({isActiveRecurrence:true})
    }

    render() {
        return (
            <Modal className={`apps-modal activeRecurrenceModal`} isOpen={!this.state.isActiveRecurrence} toggle={()=>{this.setState({isActiveRecurrence:true})}}>
                <div className="modal-header d-flex justify-content-between align-items-center">
                    <h3 className="modal-title" id="exampleModalLongTitle">Active recurrence <span>12</span></h3>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <ModalBody>
                <div className="active-recurrernce-card">
                    <h6>Report 1 created on 20 NOV,0222 </h6>
                    <h5>CrystalBall</h5>
                </div>
                </ModalBody>
            </Modal>
        )
    }
}

export default ActiveRecurrence
