import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import './StartupConfigurationWizardModal.css'

export default class StartupConfigurationWizardModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: true,
            stepNumber: 0
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.incrementStep = this.incrementStep.bind(this);
    }

    toggleModal() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    incrementStep(increment = 1) {
        this.setState({ stepNumber: this.state.stepNumber + increment })
    }

    render() {

        const { isOpen, stepNumber } = this.state;

        let modalBodyFooter = undefined;
        switch (stepNumber) {
            case 0:
                modalBodyFooter = [
                    <ModalBody id="scw-modal-body">
                        <h1><center>Let's build the best experience for you</center></h1>
                    </ModalBody>
                    ,
                    <ModalFooter className="border-top-0">
                        <Button color="primary" onClick={() => this.incrementStep(1)} >Next</Button>
                    </ModalFooter>
                ];
                break;
            case 1:
                modalBodyFooter = [
                    <ModalBody id="scw-modal-body">
                        <center>
                            <h1>Do you want to import old annotations from Universal Analytics?</h1>
                            <Button color="primary" onClick={() => this.incrementStep(1)}>Yes</Button>
                            <Button color="secondary" onClick={() => this.incrementStep(2)} className="ml-4">No</Button>
                        </center>
                    </ModalBody>
                    ,
                    <ModalFooter className="border-top-0"></ModalFooter>
                ];
                break;
            case 2:
                modalBodyFooter = [
                    <ModalBody id="scw-modal-body">
                        <center>
                            <h1>What Automation would you like to add?</h1>
                            <Button color="primary">Web Monitoring</Button>
                            <Button color="primary" className="ml-3">News Alert</Button>
                            <Button color="primary" className="ml-3">Google Updates</Button>
                            <Button color="primary" className="ml-3">Retail Marketing Dates</Button>
                            <Button color="primary" className="ml-3">Holidays</Button>
                            <Button color="primary" className="ml-3">Weather Alerts</Button>
                            <Button color="primary" className="ml-3">WordPress Updates</Button>
                        </center>
                    </ModalBody>
                    ,
                    <ModalFooter className="border-top-0">
                        <Button color="primary" onClick={() => this.incrementStep(1)} >Next</Button>
                    </ModalFooter>
                ];
                break;
            case 3:
                modalBodyFooter = [
                    <ModalBody id="scw-modal-body">
                        <center>
                            <h1>What tools would you like to connect?</h1>
                            <Button color="default"><img src="/images/icons/adwords.png" width="20px" height="auto" className="mr-2" /> Google AdWords</Button>
                            <Button color="default" className="ml-3"><img src="/images/icons/mailchimp.png" width="20px" height="auto" className="mr-2" /> MailChimp</Button>
                            <Button color="default" className="ml-3"><img src="/images/icons/shopify.png" width="20px" height="auto" className="mr-2" /> Shopify</Button>
                            <Button color="default" className="ml-3"><img src="/images/icons/slack.png" width="20px" height="auto" className="mr-2" /> Slack</Button>
                            <Button color="default" className="ml-3"><img src="/images/icons/asana.png" width="20px" height="auto" className="mr-2" /> Asana</Button>
                            <Button color="default" className="ml-3"><img src="/images/icons/jira.png" width="20px" height="auto" className="mr-2" /> Jira</Button>
                            <Button color="default" className="ml-3"><img src="/images/icons/trello.png" width="20px" height="auto" className="mr-2" /> Trello</Button>
                            <Button color="default" className="ml-3"><img src="/images/icons/github.png" width="20px" height="auto" className="mr-2" /> GitHub</Button>
                            <Button color="default" className="ml-3"><img src="/images/icons/bitbucket.png" width="20px" height="auto" className="mr-2" /> BitBucket</Button>
                            <Button color="default" className="ml-3"><img src="/images/icons/google-sheets.png" width="20px" height="auto" className="mr-2" /> Google Spreadsheet</Button>
                        </center>
                    </ModalBody>
                    ,
                    <ModalFooter className="border-top-0">
                        <Button color="primary" onClick={() => this.incrementStep(1)} >Next</Button>
                    </ModalFooter>
                ];
                break;
            case 4:
                modalBodyFooter = [
                    <ModalBody id="scw-modal-body">
                        <center>
                            <h1>Where would you like to view your annotations?</h1>
                        </center>
                        <div className="row">
                            <div className="col-lg-3 col-sm-4">
                                <a target="_blank" href="https://chrome.google.com/webstore/detail/automated-google-analytic/jfkimpgkmamkdhamnhabohpeaplbpmom?hl=en">
                                    <img style={{ width: '90%', height: 'auto' }} src="/images/buttons/google-analytics.png" />
                                </a>
                            </div>
                            <div className="col-lg-3 col-sm-4">
                                <a className="disabled" href="#" onClick={e => { e.preventDefault(); swal('Coming Soon!', '', 'info'); }}>
                                    <img style={{ width: '90%', height: 'auto' }} src="/images/buttons/google-data-studio.png" />
                                </a>
                            </div>
                            <div className="col-lg-3 col-sm-4">
                                <a className="disabled" href="#" onClick={e => { e.preventDefault(); swal('Coming Soon!', '', 'info'); }}>
                                    <img style={{ width: '90%', height: 'auto' }} src="/images/buttons/microsoft-power-business-intelligence.png" />
                                </a>
                            </div>
                            <div className="col-lg-3 col-sm-4">
                                <a className="btn btn-primary w-90 h-auto">Browser Extension</a>
                            </div>
                        </div>
                    </ModalBody>
                    ,
                    <ModalFooter className="border-top-0">
                        <Button color="primary" onClick={() => this.incrementStep(1)} >Next</Button>
                    </ModalFooter>
                ];
                break;
            case 5:
                modalBodyFooter = [
                    <ModalBody id="scw-modal-body">
                        <center>
                            <h1>What tools would you like to connect?</h1>
                            <textarea className="form-control"></textarea>
                        </center>
                    </ModalBody>
                    ,
                    <ModalFooter className="border-top-0">
                        <Button color="primary" onClick={this.toggleModal} >Next</Button>
                    </ModalFooter>
                ];
                break;
        }
        return (
            <Modal isOpen={isOpen} toggle={this.toggleModal} className="modal-lg">
                {modalBodyFooter}
            </Modal>
        )
    }
}