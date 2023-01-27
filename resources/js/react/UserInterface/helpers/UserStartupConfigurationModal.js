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
        Object.keys(this.state.stepResponses).forEach(k => {
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
        if (!this.props.isOpen) return null;
        const { stepNumber, automations, integrations, views } = this.state;
        const list = [];
        {this.state.user.starter_configuration_checklist.map(checklist =>
            list.push(<li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span>{checklist.label}</li>)
        )}
        let modalBodyFooter = undefined;
        switch (stepNumber) {
            case 0:
                modalBodyFooter = [
                    <>
                        {/* <div className="d-flex">
                            <aside className="popupSidebar p-6">
                                <div class="progressbar d-flex align-items-center">
                                    <span className='ml-2'>20%</span>
                                    <div class="progress flex-grow-1">
                                        <div class="progress-bar" role="progressbar" style={{"width": "20%"}} aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                                <div className="checklist">
                                    <strong>Checklist</strong>
                                    <ul>
                                        <li>
                                            <span className='status-icon checked'><img src="./icon-checked-green.svg" /></span>
                                            <span className='pl-2'>Invite Co-workers</span>
                                        </li>
                                        <li>
                                            <span className='status-icon current'><img src="./icon-current.svg" /></span>
                                            <span className='pl-2'>Install Chrome Extension</span>
                                        </li>
                                        <li>
                                            <span className='status-icon icon-list'></span>
                                            <span className='pl-2'>Connect Apps</span>
                                        </li>
                                        <li>
                                            <span className='status-icon icon-list'></span>
                                            <span className='pl-2'>Another Item</span>
                                        </li>
                                        <li>
                                            <span className='status-icon icon-list'></span>
                                            <span className='pl-2'>Download Blah</span>
                                        </li>
                                    </ul>
                                </div>
                                <button className='btn-bookADemo'>
                                    <span>Book a Demo</span>
                                    <span className='ml-2'>
                                        <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.58475 8.28475C8.44126 8.14125 8.37238 7.96786 8.37812 7.76457C8.38434 7.56128 8.45919 7.38789 8.60269 7.24439L10.6296 5.21749H1.6296C1.42631 5.21749 1.25579 5.14861 1.11803 5.01085C0.980749 4.87357 0.912109 4.70329 0.912109 4.5C0.912109 4.29671 0.980749 4.12619 1.11803 3.98843C1.25579 3.85115 1.42631 3.78251 1.6296 3.78251H10.6296L8.58475 1.73767C8.44126 1.59417 8.36951 1.42365 8.36951 1.2261C8.36951 1.02903 8.44126 0.858744 8.58475 0.715246C8.72825 0.571749 8.89878 0.5 9.09632 0.5C9.29339 0.5 9.46368 0.571749 9.60718 0.715246L12.8897 3.99776C12.9614 4.06951 13.0124 4.14723 13.0425 4.23094C13.0722 4.31465 13.087 4.40433 13.087 4.5C13.087 4.59566 13.0722 4.68535 13.0425 4.76906C13.0124 4.85277 12.9614 4.93049 12.8897 5.00224L9.58924 8.30269C9.4577 8.43423 9.29339 8.5 9.09632 8.5C8.89878 8.5 8.72825 8.42825 8.58475 8.28475Z" fill="#096DB7"/>
                                        </svg>
                                    </span>
                                </button>
                            </aside>
                            <ModalBody className='p-6 contentArea flex-grow-1'>
                                <h1>Hello Adil 👋</h1>
                                <strong>Let's get you started.</strong>
                                <p>Based on your website, we recommend you some steps to enhance your experience. You can see the checklist on left, and even if you cancel, you can resume the setup whenever you like from the header</p>
                                <div className='d-flex justify-content-center'>
                                    <Button className='btn-theme' onClick={() => { this.recordStepResponse('START', true); this.incrementStep(1) }}>Let's Go</Button>
                                </div>
                            </ModalBody>
                        </div> */}

                        {/* <div className="d-flex">
                            <aside className="popupSidebar p-6">
                                <div class="progressbar d-flex align-items-center">
                                    <span className='ml-2'>20%</span>
                                    <div class="progress flex-grow-1">
                                        <div class="progress-bar" role="progressbar" style={{"width": "20%"}} aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                                <div className="checklist">
                                    <strong>Checklist</strong>
                                    <ul>
                                        <li>
                                            <span className='status-icon checked'><img src="./icon-checked-green.svg" /></span>
                                            <span className='pl-2'>Invite Co-workers</span>
                                        </li>
                                        <li>
                                            <span className='status-icon current'><img src="./icon-current.svg" /></span>
                                            <span className='pl-2'>Install Chrome Extension</span>
                                        </li>
                                        <li>
                                            <span className='status-icon icon-list'></span>
                                            <span className='pl-2'>Connect Apps</span>
                                        </li>
                                        <li>
                                            <span className='status-icon icon-list'></span>
                                            <span className='pl-2'>Another Item</span>
                                        </li>
                                        <li>
                                            <span className='status-icon icon-list'></span>
                                            <span className='pl-2'>Download Blah</span>
                                        </li>
                                    </ul>
                                </div>
                                <button className='btn-bookADemo'>
                                    <span>Book a Demo</span>
                                    <span className='ml-2'>
                                        <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.58475 8.28475C8.44126 8.14125 8.37238 7.96786 8.37812 7.76457C8.38434 7.56128 8.45919 7.38789 8.60269 7.24439L10.6296 5.21749H1.6296C1.42631 5.21749 1.25579 5.14861 1.11803 5.01085C0.980749 4.87357 0.912109 4.70329 0.912109 4.5C0.912109 4.29671 0.980749 4.12619 1.11803 3.98843C1.25579 3.85115 1.42631 3.78251 1.6296 3.78251H10.6296L8.58475 1.73767C8.44126 1.59417 8.36951 1.42365 8.36951 1.2261C8.36951 1.02903 8.44126 0.858744 8.58475 0.715246C8.72825 0.571749 8.89878 0.5 9.09632 0.5C9.29339 0.5 9.46368 0.571749 9.60718 0.715246L12.8897 3.99776C12.9614 4.06951 13.0124 4.14723 13.0425 4.23094C13.0722 4.31465 13.087 4.40433 13.087 4.5C13.087 4.59566 13.0722 4.68535 13.0425 4.76906C13.0124 4.85277 12.9614 4.93049 12.8897 5.00224L9.58924 8.30269C9.4577 8.43423 9.29339 8.5 9.09632 8.5C8.89878 8.5 8.72825 8.42825 8.58475 8.28475Z" fill="#096DB7"/>
                                        </svg>
                                    </span>
                                </button>
                            </aside>
                            <ModalBody className='p-6 contentArea flex-grow-1'>
                                <div className='titleAndCloseButton d-flex justify-content-between align-items-center'>
                                    <h1>Install Chrome Extension</h1>
                                    <span className='cursor-pointer'>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 7.00031L16.0003 0L18 1.99969L10.9997 9L18 16.0003L16.0003 18L9 10.9997L1.99969 18L0 16.0003L7.00031 9L0 1.99969L1.99969 0L9 7.00031Z" fill="#a6a6a6"/>
                                        </svg>
                                    </span>
                                </div>
                                <div className='chromeExtensionContent d-flex flex-row-reverse align-items-center'>
                                    <div className='pl-4 flex-shrink-0'><img src="./chrome-01.svg" /></div>
                                    <div className='flex-grow-1 d-flex flex-column'>
                                        <strong><img src="./chromeExtension.svg" /></strong>
                                        <p>Install our extension, It's like a sticky note on your data charts.</p>
                                        <ul>
                                            <li>
                                                <span><img src="./icon-listTick.svg" /></span>
                                                <span>GA4 & Universal Analytics</span>
                                            </li>
                                            <li>
                                                <span><img src="./icon-listTick.svg" /></span>
                                                <span>Google Ads</span>
                                            </li>
                                            <li>
                                                <span><img src="./icon-listTick.svg" /></span>
                                                <span>Add annotations directly from your browser</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className='popupBtnBox d-flex justify-content-between align-items-center'>
                                    <Button onClick={() => { this.recordStepResponse('IMPORT_OLD_ANNOTATIONS', false); this.incrementStep(1) }} className="btn-cancel">Skip this</Button>
                                    <Button className="btn-theme">Continue</Button>
                                </div>
                            </ModalBody>
                        </div> */}

                        {/* <div className="d-flex">
                            <aside className="popupSidebar p-6">
                                <div class="progressbar d-flex align-items-center">
                                    <span className='ml-2'>20%</span>
                                    <div class="progress flex-grow-1">
                                        <div class="progress-bar" role="progressbar" style={{"width": "20%"}} aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                                <div className="checklist">
                                    <strong>Checklist</strong>
                                    <ul>
                                        <li>
                                            <span className='status-icon checked'><img src="./icon-checked-green.svg" /></span>
                                            <span className='pl-2'>Invite Co-workers</span>
                                        </li>
                                        <li>
                                            <span className='status-icon current'><img src="./icon-current.svg" /></span>
                                            <span className='pl-2'>Install Chrome Extension</span>
                                        </li>
                                        <li>
                                            <span className='status-icon icon-list'></span>
                                            <span className='pl-2'>Connect Apps</span>
                                        </li>
                                        <li>
                                            <span className='status-icon icon-list'></span>
                                            <span className='pl-2'>Another Item</span>
                                        </li>
                                        <li>
                                            <span className='status-icon icon-list'></span>
                                            <span className='pl-2'>Download Blah</span>
                                        </li>
                                    </ul>
                                </div>
                                <button className='btn-bookADemo'>
                                    <span>Book a Demo</span>
                                    <span className='ml-2'>
                                        <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.58475 8.28475C8.44126 8.14125 8.37238 7.96786 8.37812 7.76457C8.38434 7.56128 8.45919 7.38789 8.60269 7.24439L10.6296 5.21749H1.6296C1.42631 5.21749 1.25579 5.14861 1.11803 5.01085C0.980749 4.87357 0.912109 4.70329 0.912109 4.5C0.912109 4.29671 0.980749 4.12619 1.11803 3.98843C1.25579 3.85115 1.42631 3.78251 1.6296 3.78251H10.6296L8.58475 1.73767C8.44126 1.59417 8.36951 1.42365 8.36951 1.2261C8.36951 1.02903 8.44126 0.858744 8.58475 0.715246C8.72825 0.571749 8.89878 0.5 9.09632 0.5C9.29339 0.5 9.46368 0.571749 9.60718 0.715246L12.8897 3.99776C12.9614 4.06951 13.0124 4.14723 13.0425 4.23094C13.0722 4.31465 13.087 4.40433 13.087 4.5C13.087 4.59566 13.0722 4.68535 13.0425 4.76906C13.0124 4.85277 12.9614 4.93049 12.8897 5.00224L9.58924 8.30269C9.4577 8.43423 9.29339 8.5 9.09632 8.5C8.89878 8.5 8.72825 8.42825 8.58475 8.28475Z" fill="#096DB7"/>
                                        </svg>
                                    </span>
                                </button>
                            </aside>
                            <ModalBody className='p-6 contentArea flex-grow-1'>
                                <div className='titleAndCloseButton d-flex justify-content-between align-items-center'>
                                    <h1>Connect Google Analytics</h1>
                                    <span className='cursor-pointer'>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 7.00031L16.0003 0L18 1.99969L10.9997 9L18 16.0003L16.0003 18L9 10.9997L1.99969 18L0 16.0003L7.00031 9L0 1.99969L1.99969 0L9 7.00031Z" fill="#a6a6a6"/>
                                        </svg>
                                    </span>
                                </div>
                                <div className='connectGoogleAnalytics d-flex justify-content-center align-items-center'>
                                    <a href="#"><img src="/images/connect_with_google.svg" width="400" height="auto" /></a>
                                </div>
                                <div className='popupBtnBox d-flex justify-content-between align-items-center'>
                                    <Button onClick={() => { this.recordStepResponse('IMPORT_OLD_ANNOTATIONS', false); this.incrementStep(1) }} className="btn-cancel">Skip this</Button>
                                    <Button className="btn-theme">Continue</Button>
                                </div>
                            </ModalBody>
                        </div> */}

                        {/* <div className="d-flex">
                            <aside className="popupSidebar p-6">
                                <div class="progressbar d-flex align-items-center">
                                    <span className='ml-2'>20%</span>
                                    <div class="progress flex-grow-1">
                                        <div class="progress-bar" role="progressbar" style={{"width": "20%"}} aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                                <div className="checklist">
                                    <strong>Checklist</strong>
                                    <ul>
                                        <li>
                                            <span className='status-icon checked'><img src="./icon-checked-green.svg" /></span>
                                            <span className='pl-2'>Invite Co-workers</span>
                                        </li>
                                        <li>
                                            <span className='status-icon current'><img src="./icon-current.svg" /></span>
                                            <span className='pl-2'>Install Chrome Extension</span>
                                        </li>
                                        <li>
                                            <span className='status-icon icon-list'></span>
                                            <span className='pl-2'>Connect Apps</span>
                                        </li>
                                        <li>
                                            <span className='status-icon icon-list'></span>
                                            <span className='pl-2'>Another Item</span>
                                        </li>
                                        <li>
                                            <span className='status-icon icon-list'></span>
                                            <span className='pl-2'>Download Blah</span>
                                        </li>
                                    </ul>
                                </div>
                                <button className='btn-bookADemo'>
                                    <span>Book a Demo</span>
                                    <span className='ml-2'>
                                        <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.58475 8.28475C8.44126 8.14125 8.37238 7.96786 8.37812 7.76457C8.38434 7.56128 8.45919 7.38789 8.60269 7.24439L10.6296 5.21749H1.6296C1.42631 5.21749 1.25579 5.14861 1.11803 5.01085C0.980749 4.87357 0.912109 4.70329 0.912109 4.5C0.912109 4.29671 0.980749 4.12619 1.11803 3.98843C1.25579 3.85115 1.42631 3.78251 1.6296 3.78251H10.6296L8.58475 1.73767C8.44126 1.59417 8.36951 1.42365 8.36951 1.2261C8.36951 1.02903 8.44126 0.858744 8.58475 0.715246C8.72825 0.571749 8.89878 0.5 9.09632 0.5C9.29339 0.5 9.46368 0.571749 9.60718 0.715246L12.8897 3.99776C12.9614 4.06951 13.0124 4.14723 13.0425 4.23094C13.0722 4.31465 13.087 4.40433 13.087 4.5C13.087 4.59566 13.0722 4.68535 13.0425 4.76906C13.0124 4.85277 12.9614 4.93049 12.8897 5.00224L9.58924 8.30269C9.4577 8.43423 9.29339 8.5 9.09632 8.5C8.89878 8.5 8.72825 8.42825 8.58475 8.28475Z" fill="#096DB7"/>
                                        </svg>
                                    </span>
                                </button>
                            </aside>
                            <ModalBody className='p-6 contentArea flex-grow-1'>
                                <div className='titleAndCloseButton d-flex justify-content-between align-items-center'>
                                    <h1>Connect GA & Search Console</h1>
                                    <span className='cursor-pointer'>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 7.00031L16.0003 0L18 1.99969L10.9997 9L18 16.0003L16.0003 18L9 10.9997L1.99969 18L0 16.0003L7.00031 9L0 1.99969L1.99969 0L9 7.00031Z" fill="#a6a6a6"/>
                                        </svg>
                                    </span>
                                </div>
                                <div className='connectGoogleAnalytics d-flex justify-content-center align-items-center'>
                                    <a href="#"><img src="/images/connect_with_google.svg" width="400" height="auto" /></a>
                                </div>
                                <div className='popupBtnBox d-flex justify-content-between align-items-center'>
                                    <Button onClick={() => { this.recordStepResponse('IMPORT_OLD_ANNOTATIONS', false); this.incrementStep(1) }} className="btn-cancel">Skip this</Button>
                                    <Button className="btn-theme">Continue</Button>
                                </div>
                            </ModalBody>
                        </div> */}

                        {/* <div className="d-flex">
                            <aside className="popupSidebar p-6">
                                <div class="progressbar d-flex align-items-center">
                                    <span className='ml-2'>20%</span>
                                    <div class="progress flex-grow-1">
                                        <div class="progress-bar" role="progressbar" style={{"width": "20%"}} aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                                <div className="checklist">
                                    <strong>Checklist</strong>
                                    <ul>
                                        <li>
                                            <span className='status-icon checked'><img src="./icon-checked-green.svg" /></span>
                                            <span className='pl-2'>Invite Co-workers</span>
                                        </li>
                                        <li>
                                            <span className='status-icon current'><img src="./icon-current.svg" /></span>
                                            <span className='pl-2'>Install Chrome Extension</span>
                                        </li>
                                        <li>
                                            <span className='status-icon icon-list'></span>
                                            <span className='pl-2'>Connect Apps</span>
                                        </li>
                                        <li>
                                            <span className='status-icon icon-list'></span>
                                            <span className='pl-2'>Another Item</span>
                                        </li>
                                        <li>
                                            <span className='status-icon icon-list'></span>
                                            <span className='pl-2'>Download Blah</span>
                                        </li>
                                    </ul>
                                </div>
                                <button className='btn-bookADemo'>
                                    <span>Book a Demo</span>
                                    <span className='ml-2'>
                                        <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.58475 8.28475C8.44126 8.14125 8.37238 7.96786 8.37812 7.76457C8.38434 7.56128 8.45919 7.38789 8.60269 7.24439L10.6296 5.21749H1.6296C1.42631 5.21749 1.25579 5.14861 1.11803 5.01085C0.980749 4.87357 0.912109 4.70329 0.912109 4.5C0.912109 4.29671 0.980749 4.12619 1.11803 3.98843C1.25579 3.85115 1.42631 3.78251 1.6296 3.78251H10.6296L8.58475 1.73767C8.44126 1.59417 8.36951 1.42365 8.36951 1.2261C8.36951 1.02903 8.44126 0.858744 8.58475 0.715246C8.72825 0.571749 8.89878 0.5 9.09632 0.5C9.29339 0.5 9.46368 0.571749 9.60718 0.715246L12.8897 3.99776C12.9614 4.06951 13.0124 4.14723 13.0425 4.23094C13.0722 4.31465 13.087 4.40433 13.087 4.5C13.087 4.59566 13.0722 4.68535 13.0425 4.76906C13.0124 4.85277 12.9614 4.93049 12.8897 5.00224L9.58924 8.30269C9.4577 8.43423 9.29339 8.5 9.09632 8.5C8.89878 8.5 8.72825 8.42825 8.58475 8.28475Z" fill="#096DB7"/>
                                        </svg>
                                    </span>
                                </button>
                            </aside>
                            <ModalBody className='p-6 contentArea flex-grow-1'>
                                <div className='titleAndCloseButton d-flex justify-content-between align-items-center'>
                                    <h1>Connect Recommended Apps</h1>
                                    <span className='cursor-pointer'>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 7.00031L16.0003 0L18 1.99969L10.9997 9L18 16.0003L16.0003 18L9 10.9997L1.99969 18L0 16.0003L7.00031 9L0 1.99969L1.99969 0L9 7.00031Z" fill="#a6a6a6"/>
                                        </svg>
                                    </span>
                                </div>
                                <div className='connectGoogleAnalytics d-flex justify-content-center align-items-center'>
                                    <a href="#"><img src="/images/connect_with_google.svg" width="400" height="auto" /></a>
                                </div>
                                <div className='popupBtnBox d-flex justify-content-between align-items-center'>
                                    <Button onClick={() => { this.recordStepResponse('IMPORT_OLD_ANNOTATIONS', false); this.incrementStep(1) }} className="btn-cancel">Skip this</Button>
                                    <Button className="btn-theme">Continue</Button>
                                </div>
                            </ModalBody>
                        </div> */}

                        {/* <div className="d-flex">
                            <aside className="popupSidebar p-6">
                                <div class="progressbar d-flex align-items-center">
                                    <span className='ml-2'>20%</span>
                                    <div class="progress flex-grow-1">
                                        <div class="progress-bar" role="progressbar" style={{"width": "20%"}} aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                                <div className="checklist">
                                    <strong>Checklist</strong>
                                    <ul>
                                        <li>
                                            <span className='status-icon checked'><img src="./icon-checked-green.svg" /></span>
                                            <span className='pl-2'>Invite Co-workers</span>
                                        </li>
                                        <li>
                                            <span className='status-icon current'><img src="./icon-current.svg" /></span>
                                            <span className='pl-2'>Install Chrome Extension</span>
                                        </li>
                                        <li>
                                            <span className='status-icon icon-list'></span>
                                            <span className='pl-2'>Connect Apps</span>
                                        </li>
                                        <li>
                                            <span className='status-icon icon-list'></span>
                                            <span className='pl-2'>Another Item</span>
                                        </li>
                                        <li>
                                            <span className='status-icon icon-list'></span>
                                            <span className='pl-2'>Download Blah</span>
                                        </li>
                                    </ul>
                                </div>
                                <button className='btn-bookADemo'>
                                    <span>Book a Demo</span>
                                    <span className='ml-2'>
                                        <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.58475 8.28475C8.44126 8.14125 8.37238 7.96786 8.37812 7.76457C8.38434 7.56128 8.45919 7.38789 8.60269 7.24439L10.6296 5.21749H1.6296C1.42631 5.21749 1.25579 5.14861 1.11803 5.01085C0.980749 4.87357 0.912109 4.70329 0.912109 4.5C0.912109 4.29671 0.980749 4.12619 1.11803 3.98843C1.25579 3.85115 1.42631 3.78251 1.6296 3.78251H10.6296L8.58475 1.73767C8.44126 1.59417 8.36951 1.42365 8.36951 1.2261C8.36951 1.02903 8.44126 0.858744 8.58475 0.715246C8.72825 0.571749 8.89878 0.5 9.09632 0.5C9.29339 0.5 9.46368 0.571749 9.60718 0.715246L12.8897 3.99776C12.9614 4.06951 13.0124 4.14723 13.0425 4.23094C13.0722 4.31465 13.087 4.40433 13.087 4.5C13.087 4.59566 13.0722 4.68535 13.0425 4.76906C13.0124 4.85277 12.9614 4.93049 12.8897 5.00224L9.58924 8.30269C9.4577 8.43423 9.29339 8.5 9.09632 8.5C8.89878 8.5 8.72825 8.42825 8.58475 8.28475Z" fill="#096DB7"/>
                                        </svg>
                                    </span>
                                </button>
                            </aside>
                            <ModalBody className='p-6 contentArea flex-grow-1'>
                                <div className='titleAndCloseButton d-flex justify-content-between align-items-center'>
                                    <h1>Invite Co-workers</h1>
                                    <span className='cursor-pointer'>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 7.00031L16.0003 0L18 1.99969L10.9997 9L18 16.0003L16.0003 18L9 10.9997L1.99969 18L0 16.0003L7.00031 9L0 1.99969L1.99969 0L9 7.00031Z" fill="#a6a6a6"/>
                                        </svg>
                                    </span>
                                </div>
                                <div className='connectGoogleAnalytics d-flex justify-content-center align-items-center'>
                                    <a href="#"><img src="/images/connect_with_google.svg" width="400" height="auto" /></a>
                                </div>
                                <div className='popupBtnBox d-flex justify-content-between align-items-center'>
                                    <Button onClick={() => { this.recordStepResponse('IMPORT_OLD_ANNOTATIONS', false); this.incrementStep(1) }} className="btn-cancel">Skip this</Button>
                                    <Button className="btn-theme">Continue</Button>
                                </div>
                            </ModalBody>
                        </div> */}

                        <div className="d-flex">
                            <aside className="popupSidebar p-6">
                                <div class="progressbar d-flex align-items-center">
                                    <span className='ml-2'>20%</span>
                                    <div class="progress flex-grow-1">
                                        <div class="progress-bar" role="progressbar" style={{"width": "20%"}} aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                                <div className="checklist">
                                    <strong>Checklist</strong>
                                    <ul>
                                        <li>
                                            <span className='status-icon checked'><img src="./icon-checked-green.svg" /></span>
                                            <span className='pl-2'>Invite Co-workers</span>
                                        </li>
                                        <li>
                                            <span className='status-icon current'><img src="./icon-current.svg" /></span>
                                            <span className='pl-2'>Install Chrome Extension</span>
                                        </li>
                                        <li>
                                            <span className='status-icon icon-list'></span>
                                            <span className='pl-2'>Connect Apps</span>
                                        </li>
                                        <li>
                                            <span className='status-icon icon-list'></span>
                                            <span className='pl-2'>Another Item</span>
                                        </li>
                                        <li>
                                            <span className='status-icon icon-list'></span>
                                            <span className='pl-2'>Download Blah</span>
                                        </li>
                                    </ul>
                                </div>
                                <button className='btn-bookADemo'>
                                    <span>Book a Demo</span>
                                    <span className='ml-2'>
                                        <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.58475 8.28475C8.44126 8.14125 8.37238 7.96786 8.37812 7.76457C8.38434 7.56128 8.45919 7.38789 8.60269 7.24439L10.6296 5.21749H1.6296C1.42631 5.21749 1.25579 5.14861 1.11803 5.01085C0.980749 4.87357 0.912109 4.70329 0.912109 4.5C0.912109 4.29671 0.980749 4.12619 1.11803 3.98843C1.25579 3.85115 1.42631 3.78251 1.6296 3.78251H10.6296L8.58475 1.73767C8.44126 1.59417 8.36951 1.42365 8.36951 1.2261C8.36951 1.02903 8.44126 0.858744 8.58475 0.715246C8.72825 0.571749 8.89878 0.5 9.09632 0.5C9.29339 0.5 9.46368 0.571749 9.60718 0.715246L12.8897 3.99776C12.9614 4.06951 13.0124 4.14723 13.0425 4.23094C13.0722 4.31465 13.087 4.40433 13.087 4.5C13.087 4.59566 13.0722 4.68535 13.0425 4.76906C13.0124 4.85277 12.9614 4.93049 12.8897 5.00224L9.58924 8.30269C9.4577 8.43423 9.29339 8.5 9.09632 8.5C8.89878 8.5 8.72825 8.42825 8.58475 8.28475Z" fill="#096DB7"/>
                                        </svg>
                                    </span>
                                </button>
                            </aside>
                            <ModalBody className='p-6 contentArea flex-grow-1'>
                                <strong><img src="/allDone.svg" /></strong>
                                <h1>Good work, Adil!</h1>
                                <p>Now you can go to your dashboard and do some productive work. Hooray 🎉</p>
                                <div className='d-flex justify-content-center'>
                                    <Button className='btn-theme' onClick={() => { this.recordStepResponse('START', true); this.incrementStep(1) }}>Go to Dashboard</Button>
                                </div>
                            </ModalBody>
                        </div>
                    </>
                ];
                break;
            case 1:
                modalBodyFooter = [
                    <ModalBody style={{ padding: '3%' }}>
                        <h1 className="text-start ">Connect Google Analytic</h1>
                        <center id="scw-modal-body">
                            <div className="w-100 ">
                                <a className="" href="#"><img src="/images/connect_with_google.svg" width="400" height="auto" /></a>
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <Button color="secondary" onClick={() => { this.recordStepResponse('IMPORT_OLD_ANNOTATIONS', false); this.incrementStep(1) }} className="ml-4 to-below">Skip</Button>
                                    </div>
                                    <div>
                                        <Button color="primary" className="ml-4 to-below">Continue</Button>
                                    </div>
                                </div>
                            </div>
                        </center>
                    </ModalBody>
                    ,
                    <ModalFooter className="border-top-0"><h1>sddas fasfasfasadfasf 1</h1></ModalFooter>
                ];
                break;
            case 2:
                modalBodyFooter = [
                    <ModalBody style={{ padding: '3%' }}>
                        <h1 className="text-start ">Connect Recommended Apps</h1>
                        <center id="scw-modal-body">
                            <div className="w-100 ">

                                <span className="mx-2">
                                    <svg width="240" height="90" viewBox="0 0 240 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="240" height="90" rx="12" fill="#411442"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M100.073 53.0464L101.454 49.8375C102.946 50.9529 104.933 51.5327 106.894 51.5327C108.341 51.5327 109.257 50.975 109.257 50.1296C109.235 47.7661 100.587 49.6162 100.52 43.6896C100.498 40.6798 103.172 38.3605 106.96 38.3605C109.213 38.3605 111.462 38.9182 113.068 40.1885L111.776 43.4639C110.306 42.5255 108.478 41.8572 106.739 41.8572C105.557 41.8572 104.778 42.4149 104.778 43.1275C104.8 45.4468 113.515 44.1765 113.604 49.8375C113.604 52.9136 110.997 55.078 107.252 55.078C104.508 55.0736 101.99 54.4274 100.073 53.0464ZM153.103 48.6778C152.412 49.8817 151.12 50.705 149.624 50.705C147.415 50.705 145.636 48.9213 145.636 46.7171C145.636 44.5129 147.419 42.7291 149.624 42.7291C151.115 42.7291 152.412 43.5524 153.103 44.7563L156.914 42.6406C155.488 40.1 152.744 38.3605 149.624 38.3605C145.007 38.3605 141.263 42.105 141.263 46.7215C141.263 51.3379 145.007 55.0824 149.624 55.0824C152.766 55.0824 155.488 53.3651 156.914 50.8024L153.103 48.6778ZM115.52 31.4248H120.292V54.7638H115.52V31.4248ZM158.786 31.4248V54.7638H163.557V47.7616L169.218 54.7638H175.326L168.125 46.4471L174.791 38.6881H168.948L163.553 45.1281V31.4248H158.786Z" fill="white"/>
                                        <path d="M134.469 48.7223C133.778 49.8598 132.353 50.7052 130.746 50.7052C128.538 50.7052 126.758 48.9215 126.758 46.7173C126.758 44.5131 128.542 42.7293 130.746 42.7293C132.353 42.7293 133.778 43.619 134.469 44.7786V48.7223ZM134.469 38.6927V40.5871C133.69 39.2725 131.751 38.3563 129.719 38.3563C125.528 38.3563 122.23 42.0566 122.23 46.6951C122.23 51.3337 125.528 55.0782 129.719 55.0782C131.747 55.0782 133.685 54.1664 134.469 52.8475V54.7418H139.24V38.6927H134.469Z" fill="white"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M70.5821 48.7005C70.5821 50.3293 69.2675 51.6438 67.6387 51.6438C66.0099 51.6438 64.6953 50.3248 64.6953 48.7005C64.6953 47.0761 66.0099 45.7571 67.6387 45.7571H70.5821V48.7005ZM72.0515 48.7005C72.0515 47.0716 73.3661 45.7571 74.9949 45.7571C76.6237 45.7571 77.9383 47.0716 77.9383 48.7005V56.0567C77.9383 57.6855 76.6237 59 74.9949 59C73.3661 59 72.0515 57.6855 72.0515 56.0567V48.7005Z" fill="#E01E5A"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M74.9956 36.8867C73.3667 36.8867 72.0522 35.5722 72.0522 33.9434C72.0522 32.3146 73.3667 31 74.9956 31C76.6244 31 77.9389 32.3146 77.9389 33.9434V36.8867H74.9956ZM74.9956 38.3783C76.6244 38.3783 77.9389 39.6929 77.9389 41.3217C77.9389 42.9505 76.6244 44.2651 74.9956 44.2651H67.6172C65.9884 44.2651 64.6738 42.9461 64.6738 41.3217C64.6738 39.6973 65.9884 38.3783 67.6172 38.3783H74.9956Z" fill="#36C5F0"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M86.7869 41.3217C86.7869 39.6929 88.1014 38.3783 89.7303 38.3783C91.3591 38.3783 92.6736 39.6929 92.6736 41.3217C92.6736 42.9505 91.3591 44.2651 89.7303 44.2651H86.7869V41.3217ZM85.3174 41.3217C85.3174 42.9505 84.0029 44.2651 82.374 44.2651C80.7452 44.2651 79.4307 42.9505 79.4307 41.3217V33.9434C79.4307 32.3146 80.7452 31 82.374 31C84.0029 31 85.3174 32.3146 85.3174 33.9434V41.3217Z" fill="#2EB67D"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M82.374 53.1133C84.0029 53.1133 85.3174 54.4279 85.3174 56.0567C85.3174 57.6855 84.0029 59 82.374 59C80.7452 59 79.4307 57.6855 79.4307 56.0567V53.1133H82.374ZM82.374 51.6438C80.7452 51.6438 79.4307 50.3293 79.4307 48.7005C79.4307 47.0716 80.7452 45.7571 82.374 45.7571H89.7524C91.3812 45.7571 92.6958 47.0716 92.6958 48.7005C92.6958 50.3293 91.3812 51.6438 89.7524 51.6438H82.374Z" fill="#ECB22E"/>
                                    </svg>
                                </span>

                                <svg width="240" height="90" viewBox="0 0 240 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="240" height="90" rx="12" fill="#004F9D"/>
                                    <path d="M59.1868 35.9465C58.1565 35.7375 57.3711 35.579 56.2903 35.579C53.1848 35.579 51.9454 37.0561 51.9454 39.686V41.6027H50V44.7082H51.9454V54.1616H55.7355V44.7082H58.5023L58.7617 41.6027H55.7355V40.1039C55.7355 39.2609 55.8147 38.7349 57.0252 38.7349C57.472 38.7349 58.1853 38.8142 58.7113 38.9223L59.1868 35.9465ZM70.6073 54.1616V45.9763C70.6073 42.4241 69.6346 41.0767 65.1889 41.0767C63.7118 41.0767 61.788 41.3433 60.5775 41.7107L61.0818 44.5568C62.2923 44.3191 63.4236 44.1822 64.5548 44.1822C66.5795 44.1822 66.8173 44.6361 66.8173 45.9475V46.9202H64.0504C61.4205 46.9202 60.2388 47.9506 60.2388 50.5301C60.2388 52.7133 61.2115 54.421 63.5821 54.421C64.4467 54.421 65.7653 54.1616 67.2352 53.3402L67.5018 54.1616H70.6073ZM66.8173 51.0273C66.2409 51.2939 65.6861 51.474 64.8935 51.474C64.1585 51.474 63.8703 51.1858 63.8703 50.4724C63.8703 49.7663 64.1873 49.5574 65.0015 49.5574H66.8173V51.0273ZM76.7679 46.2357C76.7679 44.9243 77.3155 44.3191 78.843 44.3191C79.5852 44.3191 80.6876 44.4488 81.4802 44.6361L81.9485 41.473C80.6588 41.1847 79.7365 41.0767 78.843 41.0767C74.6855 41.0767 72.9779 42.633 72.9779 46.2933V49.2115C72.9779 52.8718 74.6855 54.421 78.843 54.421C79.7365 54.421 80.6588 54.3201 81.9485 54.0247L81.4802 50.8687C80.5579 51.0777 79.8157 51.1858 78.843 51.1858C77.3155 51.1858 76.7679 50.5805 76.7679 49.2619V46.2357ZM94.3489 49.0818V46.3942C94.3489 43.6057 93.4267 41.0767 89.1611 41.0767C84.8955 41.0767 83.6634 43.4472 83.6634 46.2141V49.2115C83.6634 52.3675 85.2414 54.421 89.3989 54.421C91.1858 54.421 93.0592 54.0247 94.212 53.6068L93.6644 50.7679C92.5332 51.1065 90.948 51.3155 89.7663 51.3155C88.0299 51.3155 87.4534 50.9192 87.4534 49.4493V49.0818H94.3489ZM90.7679 46.2357H87.4534V45.6881C87.4534 44.7874 87.8713 44.0525 89.1899 44.0525C90.5013 44.0525 90.7679 44.7874 90.7679 45.6881V46.2357ZM108.479 49.0242V45.7097C108.479 42.842 107.376 41.0767 104.53 41.0767C103.139 41.0767 101.929 41.3937 100.899 41.79V35.579L97.1086 36.105V54.0031C98.8739 54.2913 100.949 54.421 102.318 54.421C107.614 54.421 108.479 52.0792 108.479 49.0242ZM100.899 45.0828C101.612 44.7082 102.505 44.3695 103.32 44.3695C104.321 44.3695 104.689 44.8955 104.689 45.7385V49.053C104.689 50.2635 104.35 51.1353 102.455 51.1353C101.929 51.1353 101.453 51.1353 100.899 51.0777V45.0828ZM116.376 54.421C120.929 54.421 122.162 51.8703 122.162 49.2403V46.2645C122.162 43.6346 120.929 41.0767 116.376 41.0767C111.822 41.0767 110.583 43.6346 110.583 46.2645V49.2403C110.583 51.8703 111.822 54.421 116.376 54.421ZM116.376 51.2362C115.007 51.2362 114.373 50.5517 114.373 49.3412V46.1564C114.373 44.9459 115.007 44.2614 116.376 44.2614C117.745 44.2614 118.372 44.9459 118.372 46.1564V49.3412C118.372 50.5517 117.745 51.2362 116.376 51.2362ZM130.059 54.421C134.612 54.421 135.852 51.8703 135.852 49.2403V46.2645C135.852 43.6346 134.612 41.0767 130.059 41.0767C125.505 41.0767 124.273 43.6346 124.273 46.2645V49.2403C124.273 51.8703 125.505 54.421 130.059 54.421ZM130.059 51.2362C128.69 51.2362 128.063 50.5517 128.063 49.3412V46.1564C128.063 44.9459 128.69 44.2614 130.059 44.2614C131.428 44.2614 132.062 44.9459 132.062 46.1564V49.3412C132.062 50.5517 131.428 51.2362 130.059 51.2362ZM142.401 54.1616V35.579L138.611 36.105V54.1616H142.401ZM142.906 47.7128L146.321 54.1616H150.378L146.854 47.7128L150.219 41.3433H146.17L142.906 47.7128Z" fill="white"/>
                                    <path d="M166.834 54.1828H168.203L162.713 38.4103H160.652L155.154 54.1828H156.531L158 50.0398H165.343L166.834 54.1828ZM161.668 39.2173L164.918 48.8293H158.426L161.668 39.2173ZM170.624 51.2214C170.624 53.311 171.64 54.4206 173.888 54.4206C175.171 54.4206 176.612 53.9739 177.779 53.0948L177.844 54.1828H179.105V37.7474L177.729 37.9348V42.7912C176.403 42.5318 175.387 42.4165 174.176 42.4165C171.568 42.4165 170.624 43.8576 170.624 45.9687V51.2214ZM177.729 51.7186C176.641 52.5977 175.409 53.1885 173.989 53.1885C172.426 53.1885 171.993 52.5544 171.993 51.2214V45.9687C171.993 44.4052 172.613 43.6486 174.126 43.6486C175.243 43.6486 176.475 43.7855 177.729 44.0449V51.7186ZM189.999 51.2719C189.999 49.1175 189.812 48.5699 186.418 47.7196C184.293 47.172 184.192 47.0063 184.192 45.4211C184.192 44.1674 184.48 43.6486 186.49 43.6486C187.441 43.6486 188.789 43.7855 189.711 43.9801L189.855 42.8128C188.955 42.5534 187.65 42.4165 186.584 42.4165C183.745 42.4165 182.823 43.4541 182.823 45.3707C182.823 47.4819 183.061 48.1952 185.95 48.8797C188.58 49.4922 188.623 49.6651 188.623 51.3223C188.623 52.785 188.198 53.1885 186.065 53.1885C185.215 53.1885 184.005 53.0228 183.01 52.7202L182.772 53.8298C183.63 54.1828 184.999 54.4206 186.159 54.4206C189.243 54.4206 189.999 53.3542 189.999 51.2719Z" fill="#F2F2F2"/>
                                    <path d="M0 66H78.9092C85.5366 66 90.9092 71.3726 90.9092 78V90H12C5.37258 90 0 84.6274 0 78V66Z" fill="url(#paint0_linear_674_9519)"/>
                                    <path d="M18.5225 73C18.5906 73 18.6578 73.0154 18.7192 73.0449C18.7805 73.0744 18.8345 73.1173 18.8771 73.1705L18.9112 73.2186L20.843 76.4005C20.8874 76.4735 20.9103 76.5576 20.9091 76.6431C20.9079 76.7285 20.8826 76.8119 20.8362 76.8837L20.8012 76.93L15.8011 82.8392C15.7615 82.886 15.7127 82.9243 15.6579 82.9518C15.603 82.9793 15.5432 82.9954 15.4819 82.9992C15.4207 83.0029 15.3593 82.9942 15.3015 82.9736C15.2437 82.953 15.1907 82.9209 15.1457 82.8792L15.1075 82.8392L10.1074 76.93C10.0523 76.8648 10.0166 76.7853 10.0046 76.7008C9.99249 76.6162 10.0045 76.5299 10.0392 76.4519L10.0656 76.4005L11.9974 73.2186C12.0328 73.1604 12.0807 73.1108 12.1377 73.0736C12.1948 73.0364 12.2595 73.0125 12.327 73.0036L12.3861 73H18.5225ZM17.052 77.091H13.8561L15.4538 81.0328L17.052 77.091ZM19.4743 77.091H18.033L16.707 80.3614L19.4743 77.091ZM12.8752 77.091H11.4338L14.2006 80.3605L12.8752 77.091ZM13.4879 73.9091H12.6411L11.2611 76.1819H12.8384L13.4879 73.9091ZM16.4752 73.9091H14.4329L13.7834 76.1819H17.1248L16.4752 73.9091ZM18.2671 73.9091H17.4202L18.0698 76.1819H19.6471L18.2671 73.9091Z" fill="white"/>
                                    <path d="M26.7001 83V73.844H29.5841C30.2654 73.844 30.8721 73.9327 31.4041 74.11C31.9361 74.2873 32.3561 74.5813 32.6641 74.992C32.9721 75.4027 33.1261 75.9627 33.1261 76.672C33.1261 77.344 32.9721 77.8993 32.6641 78.338C32.3561 78.7767 31.9408 79.1033 31.4181 79.318C30.8954 79.5327 30.3028 79.64 29.6401 79.64H28.3241V83H26.7001ZM28.3241 78.338H29.5141C30.8581 78.338 31.5301 77.7827 31.5301 76.672C31.5301 76.0933 31.3528 75.6967 30.9981 75.482C30.6528 75.258 30.1394 75.146 29.4581 75.146H28.3241V78.338ZM34.7085 83V76.126H36.0385L36.1505 77.344H36.2065C36.4492 76.896 36.7432 76.5553 37.0885 76.322C37.4339 76.0793 37.7885 75.958 38.1525 75.958C38.4792 75.958 38.7405 76.0047 38.9365 76.098L38.6565 77.498C38.5352 77.4607 38.4232 77.4327 38.3205 77.414C38.2179 77.3953 38.0919 77.386 37.9425 77.386C37.6719 77.386 37.3872 77.4933 37.0885 77.708C36.7899 77.9133 36.5332 78.2773 36.3185 78.8V83H34.7085ZM42.7345 83.168C42.0998 83.168 41.5258 83.028 41.0125 82.748C40.4991 82.4587 40.0931 82.048 39.7945 81.516C39.4958 80.9747 39.3465 80.326 39.3465 79.57C39.3465 78.8233 39.4958 78.1793 39.7945 77.638C40.1025 77.0967 40.4991 76.6813 40.9845 76.392C41.4698 76.1027 41.9785 75.958 42.5105 75.958C43.1358 75.958 43.6585 76.098 44.0785 76.378C44.4985 76.6487 44.8158 77.0313 45.0305 77.526C45.2451 78.0113 45.3525 78.576 45.3525 79.22C45.3525 79.556 45.3291 79.8173 45.2825 80.004H40.9145C40.9891 80.6107 41.2085 81.082 41.5725 81.418C41.9365 81.754 42.3938 81.922 42.9445 81.922C43.2431 81.922 43.5185 81.88 43.7705 81.796C44.0318 81.7027 44.2885 81.5767 44.5405 81.418L45.0865 82.426C44.7598 82.6407 44.3958 82.818 43.9945 82.958C43.5931 83.098 43.1731 83.168 42.7345 83.168ZM40.9005 78.912H43.9525C43.9525 78.38 43.8358 77.9647 43.6025 77.666C43.3691 77.358 43.0191 77.204 42.5525 77.204C42.1511 77.204 41.7918 77.3533 41.4745 77.652C41.1665 77.9413 40.9751 78.3613 40.9005 78.912ZM46.8902 83V76.126H48.2202L48.3322 77.064H48.3882C48.6775 76.756 48.9902 76.4947 49.3262 76.28C49.6715 76.0653 50.0588 75.958 50.4882 75.958C50.9922 75.958 51.3935 76.07 51.6922 76.294C52.0002 76.5087 52.2335 76.8073 52.3922 77.19C52.7188 76.8353 53.0595 76.5413 53.4142 76.308C53.7782 76.0747 54.1748 75.958 54.6042 75.958C55.3322 75.958 55.8688 76.196 56.2142 76.672C56.5595 77.148 56.7322 77.82 56.7322 78.688V83H55.1082V78.898C55.1082 78.3287 55.0195 77.9273 54.8422 77.694C54.6742 77.4607 54.4128 77.344 54.0582 77.344C53.6288 77.344 53.1482 77.6287 52.6162 78.198V83H51.0062V78.898C51.0062 78.3287 50.9175 77.9273 50.7402 77.694C50.5722 77.4607 50.3062 77.344 49.9422 77.344C49.5128 77.344 49.0322 77.6287 48.5002 78.198V83H46.8902ZM58.689 83V76.126H60.299V83H58.689ZM59.501 74.922C59.2117 74.922 58.9783 74.838 58.801 74.67C58.6237 74.502 58.535 74.278 58.535 73.998C58.535 73.7273 58.6237 73.508 58.801 73.34C58.9783 73.172 59.2117 73.088 59.501 73.088C59.7903 73.088 60.0237 73.172 60.201 73.34C60.3783 73.508 60.467 73.7273 60.467 73.998C60.467 74.278 60.3783 74.502 60.201 74.67C60.0237 74.838 59.7903 74.922 59.501 74.922ZM64.3971 83.168C63.6597 83.168 63.1231 82.93 62.7871 82.454C62.4511 81.978 62.2831 81.306 62.2831 80.438V76.126H63.8931V80.228C63.8931 80.7973 63.9771 81.1987 64.1451 81.432C64.3131 81.6653 64.5837 81.782 64.9571 81.782C65.2557 81.782 65.5171 81.7073 65.7411 81.558C65.9744 81.4087 66.2217 81.166 66.4831 80.83V76.126H68.0931V83H66.7771L66.6511 81.992H66.6091C66.3104 82.3467 65.9837 82.6313 65.6291 82.846C65.2744 83.0607 64.8637 83.168 64.3971 83.168ZM70.1324 83V76.126H71.4624L71.5744 77.064H71.6304C71.9197 76.756 72.2324 76.4947 72.5684 76.28C72.9137 76.0653 73.301 75.958 73.7304 75.958C74.2344 75.958 74.6357 76.07 74.9344 76.294C75.2424 76.5087 75.4757 76.8073 75.6344 77.19C75.961 76.8353 76.3017 76.5413 76.6564 76.308C77.0204 76.0747 77.417 75.958 77.8464 75.958C78.5744 75.958 79.111 76.196 79.4564 76.672C79.8017 77.148 79.9744 77.82 79.9744 78.688V83H78.3504V78.898C78.3504 78.3287 78.2617 77.9273 78.0844 77.694C77.9164 77.4607 77.655 77.344 77.3004 77.344C76.871 77.344 76.3904 77.6287 75.8584 78.198V83H74.2484V78.898C74.2484 78.3287 74.1597 77.9273 73.9824 77.694C73.8144 77.4607 73.5484 77.344 73.1844 77.344C72.755 77.344 72.2744 77.6287 71.7424 78.198V83H70.1324Z" fill="white"/>
                                    <defs>
                                    <linearGradient id="paint0_linear_674_9519" x1="0" y1="78" x2="90.9092" y2="78" gradientUnits="userSpaceOnUse">
                                    <stop offset="0.333333" stop-color="#FF8534"/>
                                    <stop offset="1" stop-color="#FF630C"/>
                                    </linearGradient>
                                    </defs>
                                </svg>

                                <div className="d-flex justify-content-between">
                                    <div>
                                        <Button color="secondary" onClick={() => { this.recordStepResponse('IMPORT_OLD_ANNOTATIONS', false); this.incrementStep(1) }} className="ml-4 to-below">Skip</Button>
                                    </div>
                                    <div>
                                        <Button color="primary" className="ml-4 to-below">Continue</Button>
                                    </div>
                                </div>

                            </div>
                        </center>
                    </ModalBody>
                    ,
                    <ModalFooter className="border-top-0"><h1>sddas fasfasfasadfasf 2</h1></ModalFooter>
                ];
                break;
            case 3:
                modalBodyFooter = [
                    <ModalBody id="scw-modal-body">
                        <center>
                        </center>
                    </ModalBody>
                ];
                break;
            case 4:
                modalBodyFooter = [
                    <ModalBody id="scw-modal-body">
                        <center>
                        </center>
                    </ModalBody>
                ];
                break;
            case 5:
                modalBodyFooter = [
                    <ModalBody id="scw-modal-body">
                        <center>
                        </center>
                    </ModalBody>
                ];
                break;
        }
        return (
            <Modal isOpen={this.props.isOpen} className='accountSetUpPopup' toggle={this.props.toggleShowTour} size="lg" centered={true} id="scw-modal" backdrop="static">
                {modalBodyFooter}
            </Modal>
        )
    }
}
