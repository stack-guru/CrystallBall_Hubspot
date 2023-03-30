import React from 'react';

export default class DowngradedPopup extends React.Component {
    constructor(props) {
        super(props)

    }

    render() {
        if (!this.props.show) return null;

        return (
            <Modal className={`apps-modal md`} isOpen={this.props.show}>
                <ModalBody>
                    <div className="popupContent modal-setupNewPassword mx-5">
                        <div className='mt-4 text-center'>
                            <p className='mt-4'>{this.props.text}</p>
                        </div>
                        <button type="button" className="btn-theme" title="close">Close</button>

                    </div>
                </ModalBody>
            </Modal>
        )
    }
}