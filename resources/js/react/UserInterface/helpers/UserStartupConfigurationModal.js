import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import HttpClient from '../utils/HttpClient';

import './UserStartupConfigurationModal.css';

export default class UserStartupConfigurationModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stepNumber: 0,
            stepResponses: {},
            automations: [],
            integrations: [],
            feedback: ''
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.incrementStep = this.incrementStep.bind(this);
        this.recordStepResponse = this.recordStepResponse.bind(this);
        this.toggleAutomation = this.toggleAutomation.bind(this);
        this.toggleIntegration = this.toggleIntegration.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit() {
        let formData = new FormData;
        Object.keys(this.state.stepResponses).map(k => {
            const stepResponse = this.state.stepResponses[k];
            formData.append('step_number[]', k);
            formData.append('data_label[]', stepResponse.data_label);
            formData.append('data_value[]', stepResponse.data_value);
        });

        HttpClient.post('/user-startup-configuration', formData).then(resp => {
        }, (err) => {
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {

            this.setState({ isBusy: false, errors: err });
        });
    }

    toggleModal() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    incrementStep(increment = 1) {
        this.setState({ stepNumber: this.state.stepNumber + increment })
    }

    recordStepResponse(name, value, stateCallback = () => { }) {
        this.setState({
            stepResponses: {
                ...this.state.stepResponses,
                [this.state.stepNumber]: {
                    ...this.state.stepResponses[this.state.stepNumber],
                    data_label: name,
                    data_value: value
                }
            }
        }, stateCallback);
    }

    toggleAutomation(automationName) {
        const { automations } = this.state;

        if (automations.indexOf(automationName) > -1) {
            this.setState({ automations: automations.filter(a => a !== automationName) });
        } else {
            this.setState({ automations: [...automations, automationName] });
        }
    }

    toggleIntegration(integrationName) {
        const { integrations } = this.state;

        if (integrations.indexOf(integrationName) > -1) {
            this.setState({ integrations: integrations.filter(a => a !== integrationName) });
        } else {
            this.setState({ integrations: [...integrations, integrationName] });
        }
    }

    render() {

        const { stepNumber, automations, integrations } = this.state;

        let modalBodyFooter = undefined;
        switch (stepNumber) {
            case 0:
                modalBodyFooter = [
                    <ModalBody id="scw-modal-body p-0">
                        <img style={{ width: '100%', height: 'auto' }} src="/images/startup-configuration/step-1.png" onClick={() => { this.recordStepResponse('NEXT', true); this.incrementStep(1) }} />
                    </ModalBody>
                ];
                break;
            case 1:
                modalBodyFooter = [
                    <ModalBody id="scw-modal-body">
                        <center>
                            <h1>Do you want to import old annotations from Universal Analytics?</h1>
                            <Button color="primary" onClick={() => { this.recordStepResponse('IMPORT_OLD_ANNOTATIONS', true); this.incrementStep(1) }}>Yes</Button>
                            <Button color="secondary" onClick={() => { this.recordStepResponse('IMPORT_OLD_ANNOTATIONS', false); this.incrementStep(2) }} className="ml-4">No</Button>
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
                            <Button color="light" onClick={() => { this.toggleAutomation('WEB_MONITORING'); }} className={"mt-3" + (automations.indexOf('WEB_MONITORING') > -1 ? " active" : "")}>Web Monitoring</Button>
                            <Button color="light" onClick={() => { this.toggleAutomation('GOOGLE_ALERT'); }} className={"mt-3 ml-3" + (automations.indexOf('GOOGLE_ALERT') > -1 ? " active" : "")}>News Alert</Button>
                            <Button color="light" onClick={() => { this.toggleAutomation('GOOGLE_UPDATES'); }} className={"mt-3 ml-3" + (automations.indexOf('GOOGLE_UPDATES') > -1 ? " active" : "")}>Google Updates</Button>
                            <Button color="light" onClick={() => { this.toggleAutomation('RETAIL_MARKETING_DATES'); }} className={"mt-3 ml-3" + (automations.indexOf('RETAIL_MARKETING_DATES') > -1 ? " active" : "")}>Retail Marketing Dates</Button>
                            <Button color="light" onClick={() => { this.toggleAutomation('HOLIDAYS'); }} className={"mt-3 ml-3" + (automations.indexOf('HOLIDAYS') > -1 ? " active" : "")}>Holidays</Button>
                            <Button color="light" onClick={() => { this.toggleAutomation('WEATHER_ALERTS'); }} className={"mt-3 ml-3" + (automations.indexOf('WEATHER_ALERTS') > -1 ? " active" : "")}>Weather Alerts</Button>
                            <Button color="light" onClick={() => { this.toggleAutomation('WORDPRESS_UPDATES'); }} className={"mt-3 ml-3" + (automations.indexOf('WORDPRESS_UPDATES') > -1 ? " active" : "")}>WordPress Updates</Button>
                        </center>
                    </ModalBody>
                    ,
                    <ModalFooter className="border-top-0">
                        <Button color="primary" onClick={() => { this.recordStepResponse('automations', JSON.stringify(this.state.automations)); this.incrementStep(1) }} >Next</Button>
                    </ModalFooter>
                ];
                break;
            case 3:
                modalBodyFooter = [
                    <ModalBody id="scw-modal-body">
                        <center>
                            <h1>What tools would you like to connect?</h1>
                            <Button color="light" onClick={() => { this.toggleIntegration('ADWORDS'); }} className={"mt-3" + (integrations.indexOf('ADWORDS') > -1 ? " active" : "")}><img src="/images/icons/adwords.png" width="20px" height="auto" className="mr-2" /> Google AdWords</Button>
                            <Button color="light" onClick={() => { this.toggleIntegration('MAILCHIMP'); }} className={"mt-3 ml-3" + (integrations.indexOf('MAILCHIMP') > -1 ? " active" : "")}><img src="/images/icons/mailchimp.png" width="20px" height="auto" className="mr-2" /> MailChimp</Button>
                            <Button color="light" onClick={() => { this.toggleIntegration('SHOPIFY'); }} className={"mt-3 ml-3" + (integrations.indexOf('SHOPIFY') > -1 ? " active" : "")}><img src="/images/icons/shopify.png" width="20px" height="auto" className="mr-2" /> Shopify</Button>
                            <Button color="light" onClick={() => { this.toggleIntegration('SLACK'); }} className={"mt-3 ml-3" + (integrations.indexOf('SLACK') > -1 ? " active" : "")}><img src="/images/icons/slack.png" width="20px" height="auto" className="mr-2" /> Slack</Button>
                            <Button color="light" onClick={() => { this.toggleIntegration('ASANA'); }} className={"mt-3 ml-3" + (integrations.indexOf('ASANA') > -1 ? " active" : "")}><img src="/images/icons/asana.png" width="20px" height="auto" className="mr-2" /> Asana</Button>
                            <Button color="light" onClick={() => { this.toggleIntegration('JIRA'); }} className={"mt-3 ml-3" + (integrations.indexOf('JIRA') > -1 ? " active" : "")}><img src="/images/icons/jira.png" width="20px" height="auto" className="mr-2" /> Jira</Button>
                            <Button color="light" onClick={() => { this.toggleIntegration('TRELLO'); }} className={"mt-3 ml-3" + (integrations.indexOf('TRELLO') > -1 ? " active" : "")}><img src="/images/icons/trello.png" width="20px" height="auto" className="mr-2" /> Trello</Button>
                            <Button color="light" onClick={() => { this.toggleIntegration('GITHUB'); }} className={"mt-3 ml-3" + (integrations.indexOf('GITHUB') > -1 ? " active" : "")}><img src="/images/icons/github.png" width="20px" height="auto" className="mr-2" /> GitHub</Button>
                            <Button color="light" onClick={() => { this.toggleIntegration('BITBUCKET'); }} className={"mt-3 ml-3" + (integrations.indexOf('BITBUCKET') > -1 ? " active" : "")}><img src="/images/icons/bitbucket.png" width="20px" height="auto" className="mr-2" /> BitBucket</Button>
                            <Button color="light" onClick={() => { this.toggleIntegration('GOOGLE_SHEETS'); }} className={"mt-3 ml-3" + (integrations.indexOf('GOOGLE_SHEETS') > -1 ? " active" : "")}><img src="/images/icons/google-sheets.png" width="20px" height="auto" className="mr-2" /> Google Spreadsheet</Button>
                            <Button color="light" onClick={() => { this.toggleIntegration('OTHER'); }} className={"mt-3 ml-3" + (integrations.indexOf('OTHER') > -1 ? " active" : "")}>Other</Button>
                        </center>
                    </ModalBody>
                    ,
                    <ModalFooter className="border-top-0">
                        <Button color="primary" onClick={() => { this.recordStepResponse('integrations', JSON.stringify(this.state.integrations)); this.incrementStep(1) }} >Next</Button>
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
                                    <img style={{ width: '90%', height: 'auto' }} src="/images/buttons/google-analytics.svg" />
                                </a>
                            </div>
                            <div className="col-lg-3 col-sm-4">
                                <a className="disabled" href="#" onClick={e => { e.preventDefault(); swal('Coming Soon!', '', 'info'); }}>
                                    <img style={{ width: '90%', height: 'auto' }} src="/images/buttons/google-data-studio-cs.png" />
                                </a>
                            </div>
                            <div className="col-lg-3 col-sm-4">
                                <a className="disabled" href="#" onClick={e => { e.preventDefault(); swal('Coming Soon!', '', 'info'); }}>
                                    <img style={{ width: '90%', height: 'auto' }} src="/images/buttons/microsoft-power-business-intelligence.png" />
                                </a>
                            </div>
                            <div className="col-lg-3 col-sm-4">
                                <a className="btn btn-primary w-90 h-auto">Chrome Extension</a>
                            </div>
                        </div>
                    </ModalBody>
                    ,
                    <ModalFooter className="border-top-0">
                        <Button color="primary" onClick={() => { this.recordStepResponse('NEXT', true); this.incrementStep(1) }}  >Next</Button>
                    </ModalFooter>
                ];
                break;
            case 5:
                modalBodyFooter = [
                    <ModalBody id="scw-modal-body">
                        <center>
                            <h1>Is it something else do you need?</h1>
                            <textarea name="feedback" value={this.state.feedback} onChange={this.handleChange} className="form-control"></textarea>
                        </center>
                    </ModalBody>
                    ,
                    <ModalFooter className="border-top-0">
                        <Button color="primary" onClick={() => { this.recordStepResponse('feedback', this.state.feedback, this.handleSubmit); this.props.toggleShowTour(); }}  >Finish</Button>
                    </ModalFooter>
                ];
                break;
        }
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggleShowTour} className="modal-lg modal-dialog-centered" id="scw-modal">
                {modalBodyFooter}
            </Modal>
        )
    }
}