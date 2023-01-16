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
            views: [],
            feedback: '',
            user: props.user
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.incrementStep = this.incrementStep.bind(this);
        this.recordStepResponse = this.recordStepResponse.bind(this);
        this.toggleAutomation = this.toggleAutomation.bind(this);
        this.toggleIntegration = this.toggleIntegration.bind(this);
        this.toggleView = this.toggleView.bind(this);
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
    toggleView(viewName) {
        const { views } = this.state;
        if (views.indexOf(viewName) > -1) {
            this.setState({ views: views.filter(a => a !== viewName) });
        } else {
            this.setState({ views: [...views, viewName] });
        }
    }
    render() {
        const { stepNumber, automations, integrations, views } = this.state;
        const list = [];
        {this.state.user.starter_configuration_checklist.map(checklist =>
            list.push(<li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span>{checklist.label}</li>)
        )}
        let modalBodyFooter = undefined;
        switch (stepNumber) {
            case 0:
                modalBodyFooter = [
                    <ModalBody id="scw-modal-body" className="with-background">
                        <center>
                            <h1>Let's build the best experience for you</h1>
                            <Button style={{ left: '45%' }} className="mt-8" color="primary" onClick={() => { this.recordStepResponse('START', true); this.incrementStep(1) }} >Let's Start</Button>
                        </center>
                    </ModalBody>
                ];
                break;
            case 1:
                modalBodyFooter = [
                    <ModalBody id="scw-modal-body">
                        <center>
                            <div className="row">
                                <div className="col-3">
                                    <ul className="fa-ul">
                                        {list}
                                    </ul>
                                </div>
                                <div className="col-9 text-inline">
                                    <h1>Connect Google Analytic</h1>
                                    <a onClick={() => { this.recordStepResponse('IMPORT_OLD_ANNOTATIONS', true); this.incrementStep(1) }} href="#"><img src="/images/connect-google-analytics.svg" width="400" height="auto" /></a>
                                </div>
                            </div>
                            {/* <Button style={{ left: '40%' }} color="primary" onClick={() => { this.recordStepResponse('IMPORT_OLD_ANNOTATIONS', true); this.incrementStep(1) }} className="to-below">Yes</Button> */}
                            <Button style={{ right: '10%' }} color="secondary" onClick={() => { this.recordStepResponse('IMPORT_OLD_ANNOTATIONS', false); this.incrementStep(2) }} className="ml-4 to-below">Skip</Button>
                        </center>
                    </ModalBody>
                    ,
                    <ModalFooter className="border-top-0"></ModalFooter>
                ];
                break;
            case 2:
                modalBodyFooter = [
                    <ModalBody id="scw-modal-body" className="">
                        <center>
                            <h1>Invite Co-worker </h1>
                            <Button style={{ left: '40%' }} color="primary" onClick={() => { this.recordStepResponse('INVITE_YOUR_TEAM', true); this.incrementStep(1) }} className="to-below">Yes</Button>
                            <Button style={{ right: '40%' }} color="secondary" onClick={() => { this.recordStepResponse('INVITE_YOUR_TEAM', false); this.incrementStep(1) }} className="ml-4 to-below">No</Button>
                        </center>
                    </ModalBody>
                    ,
                    <ModalFooter className="border-top-0">
                    </ModalFooter>
                ];
                break;
            case 3:
                modalBodyFooter = [
                    <ModalBody id="scw-modal-body">
                        <center>
                            <h1>Install Chrome Extension?</h1> 
                        </center>
                    </ModalBody>
                    ,
                    <ModalFooter className="border-top-0">
                        <Button color="primary" onClick={() => { this.recordStepResponse('automations', JSON.stringify(this.state.automations)); this.incrementStep(1) }} >Next</Button>
                    </ModalFooter>
                ];
                break;
            case 4:
                modalBodyFooter = [
                    <ModalBody id="scw-modal-body">
                        <center>
                            <h1>Connect Recommended Apps ?</h1>
                            <Button color="light" onClick={() => { this.toggleIntegration('ADWORDS'); }} className={"mt-3" + (integrations.indexOf('ADWORDS') > -1 ? " active" : "")}><img src="/images/icons/adwords.png" width="20px" height="auto" className="mr-2" /> Google AdWords</Button>
                            <Button color="light" onClick={() => { this.toggleIntegration('MAILCHIMP'); }} className={"mt-3 ml-3" + (integrations.indexOf('MAILCHIMP') > -1 ? " active" : "")}><img src="/images/icons/mailchimp.png" width="20px" height="auto" className="mr-2" /> MailChimp</Button>
                            <Button color="light" onClick={() => { this.toggleIntegration('SHOPIFY'); }} className={"mt-3 ml-3" + (integrations.indexOf('SHOPIFY') > -1 ? " active" : "")}><img src="/images/icons/shopify.png" width="20px" height="auto" className="mr-2" /> Shopify</Button>
                            <Button color="light" onClick={() => { this.toggleIntegration('SLACK'); }} className={"mt-3 ml-3" + (integrations.indexOf('SLACK') > -1 ? " active" : "")}><img src="/images/icons/slack.png" width="20px" height="auto" className="mr-2" /> Slack</Button>
                            <Button color="light" onClick={() => { this.toggleIntegration('ASANA'); }} className={"mt-3 ml-3" + (integrations.indexOf('ASANA') > -1 ? " active" : "")}><img src="/images/icons/asana.png" width="20px" height="auto" className="mr-2" /> Asana</Button>
                            <Button color="light" onClick={() => { this.toggleIntegration('JIRA'); }} className={"mt-3 ml-3" + (integrations.indexOf('JIRA') > -1 ? " active" : "")}><img src="/images/icons/jira.png" width="20px" height="auto" className="mr-2" /> Jira</Button>
                            <Button color="light" onClick={() => { this.toggleIntegration('TRELLO'); }} className={"mt-3 ml-3" + (integrations.indexOf('TRELLO') > -1 ? " active" : "")}><img src="/images/icons/trello.png" width="20px" height="auto" className="mr-2" /> Trello</Button>
                            <Button color="light" onClick={() => { this.toggleIntegration('GITHUB'); }} className={"mt-3 ml-3" + (integrations.indexOf('GITHUB') > -1 ? " active" : "")}><img src="/images/icons/github.png" width="20px" height="auto" className="mr-2" /> GitHub</Button>
                            <Button color="light" onClick={() => { this.toggleIntegration('BITBUCKET'); }} className={"mt-3 ml-3" + (integrations.indexOf('BITBUCKET') > -1 ? " active" : "")}><img src="/images/icons/bitbucket.png" width="20px" height="auto" className="mr-2" /> Bitbucket</Button>
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
            case 5:
                modalBodyFooter = [
                    <ModalBody id="scw-modal-body">
                        <center>
                            <h1>Let's build the best experience for you</h1>
                            <Button style={{ left: '45%' }} className="mt-8" color="primary" onClick={() => { this.recordStepResponse('feedback', this.state.feedback, this.handleSubmit); this.props.toggleShowTour(); }} >Finish</Button>
                        </center>
                    </ModalBody>
                    ,
                    <ModalFooter className="border-top-0">
                        {/* <Button color="primary" onClick={() => { this.recordStepResponse('feedback', this.state.feedback, this.handleSubmit); this.props.toggleShowTour(); }}  >Finish</Button> */}
                    </ModalFooter>
                ];
                break;
        }
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggleShowTour} size="lg" centered={true} id="scw-modal" backdrop="static">
                {modalBodyFooter}
            </Modal>
        )
    }
}
