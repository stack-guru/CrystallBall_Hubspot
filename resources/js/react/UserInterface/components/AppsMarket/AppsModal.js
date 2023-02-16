import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const AppsModal = ({isOpen, toggle, children, popupSize}) => {
    return (
        <Modal className={`apps-modal ${popupSize}`} isOpen={isOpen} toggle={toggle}>
            <ModalBody>
                {children}
            </ModalBody>
        </Modal>
    );
}

export default AppsModal;
