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
        const popupSidebar = <aside className="popupSidebar p-6">
            <div className="progressbar d-flex align-items-center">
                <span className='ml-2'>20%</span>
                <div className="progress flex-grow-1">
                    <div className="progress-bar" role="progressbar" style={{ "width": "20%" }} aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
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
                        <span className='status-icon current'><img className='loader' src="./icon-current.svg" /></span>
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
                        <path d="M8.58475 8.28475C8.44126 8.14125 8.37238 7.96786 8.37812 7.76457C8.38434 7.56128 8.45919 7.38789 8.60269 7.24439L10.6296 5.21749H1.6296C1.42631 5.21749 1.25579 5.14861 1.11803 5.01085C0.980749 4.87357 0.912109 4.70329 0.912109 4.5C0.912109 4.29671 0.980749 4.12619 1.11803 3.98843C1.25579 3.85115 1.42631 3.78251 1.6296 3.78251H10.6296L8.58475 1.73767C8.44126 1.59417 8.36951 1.42365 8.36951 1.2261C8.36951 1.02903 8.44126 0.858744 8.58475 0.715246C8.72825 0.571749 8.89878 0.5 9.09632 0.5C9.29339 0.5 9.46368 0.571749 9.60718 0.715246L12.8897 3.99776C12.9614 4.06951 13.0124 4.14723 13.0425 4.23094C13.0722 4.31465 13.087 4.40433 13.087 4.5C13.087 4.59566 13.0722 4.68535 13.0425 4.76906C13.0124 4.85277 12.9614 4.93049 12.8897 5.00224L9.58924 8.30269C9.4577 8.43423 9.29339 8.5 9.09632 8.5C8.89878 8.5 8.72825 8.42825 8.58475 8.28475Z" fill="#096DB7" />
                    </svg>
                </span>
            </button>
        </aside>
        // if (!this.props.isOpen) return null;
        const { stepNumber, automations, integrations, views } = this.state;
        const list = [];
        {
            this.state.user.starter_configuration_checklist?.map(checklist =>
                list.push(<li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span>{checklist.label}</li>)
            )
        }
        let modalBodyFooter = undefined;
        switch (stepNumber) {
            case 0:
                modalBodyFooter = [
                    <>
                        <div className="d-flex">
                            {popupSidebar}
                            <ModalBody className='p-6 contentArea helloContent flex-grow-1'>
                                <h1>Hello Adil 👋</h1>
                                <strong>Let's get you started.</strong>
                                <p>Based on your website, we recommend you some steps to enhance your experience. You can see the checklist on left, and even if you cancel, you can resume the setup whenever you like from the header</p>
                                <div className='d-flex justify-content-center'>
                                    <Button className='btn-theme' onClick={() => { this.recordStepResponse('START', true); this.incrementStep(1) }}>Let's Go</Button>
                                </div>
                            </ModalBody>
                        </div>
                    </>
                ];
                break;
            case 1:
                modalBodyFooter = [
                    <div className="d-flex">
                        {popupSidebar}
                        <ModalBody className='p-6 contentArea installChromeExtension flex-grow-1'>
                            <div className='titleAndCloseButton d-flex justify-content-between align-items-center'>
                                <h2>Install Chrome Extension</h2>
                                <span className='cursor-pointer'>
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 7.00031L16.0003 0L18 1.99969L10.9997 9L18 16.0003L16.0003 18L9 10.9997L1.99969 18L0 16.0003L7.00031 9L0 1.99969L1.99969 0L9 7.00031Z" fill="#a6a6a6" />
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
                    </div>
                ];
                break;
            case 2:
                modalBodyFooter = [
                    <div className="d-flex">
                        {popupSidebar}
                        <ModalBody className='p-6 contentArea googleAnalytics flex-grow-1'>
                            <div className='titleAndCloseButton d-flex justify-content-between align-items-center'>
                                <h2>Connect Google Analytics</h2>
                                <span className='cursor-pointer'>
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 7.00031L16.0003 0L18 1.99969L10.9997 9L18 16.0003L16.0003 18L9 10.9997L1.99969 18L0 16.0003L7.00031 9L0 1.99969L1.99969 0L9 7.00031Z" fill="#a6a6a6" />
                                    </svg>
                                </span>
                            </div>
                            <div className='connectGoogleAnalytics d-flex justify-content-center align-items-center'>
                                <a href="#"><img src="/images/connect_with_google.svg" /></a>
                            </div>
                            <div className='popupBtnBox d-flex justify-content-between align-items-center'>
                                <Button onClick={() => { this.recordStepResponse('IMPORT_OLD_ANNOTATIONS', false); this.incrementStep(1) }} className="btn-cancel">Skip this</Button>
                                <Button className="btn-theme">Continue</Button>
                            </div>
                        </ModalBody>
                    </div>
                ];
                break;
            case 3:
                modalBodyFooter = [
                    <div className="d-flex">
                        {popupSidebar}
                        <ModalBody className='p-6 contentArea GAandSearchConsole flex-grow-1'>
                            <div className='titleAndCloseButton d-flex justify-content-between align-items-center'>
                                <h2>Connect GA & Search Console</h2>
                                <span className='cursor-pointer'>
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 7.00031L16.0003 0L18 1.99969L10.9997 9L18 16.0003L16.0003 18L9 10.9997L1.99969 18L0 16.0003L7.00031 9L0 1.99969L1.99969 0L9 7.00031Z" fill="#a6a6a6" />
                                    </svg>
                                </span>
                            </div>
                            <div className='connectGAandSearchConsole d-flex flex-column'>
                                <p className='m-0'>Please select URLs for each property</p>
                                <div className='dataTableAnalyticsAccount'>
                                    <div className='d-flex flex-column'>
                                        <div className='d-flex justify-content-start analyticTopBar'>
                                            <div className='d-flex align-items-center pr-3'>
                                                <span className='pr-2'><img src="/icon-g.svg" /></span>
                                                <span>Adil Aijaz</span>
                                            </div>
                                            <div className='d-flex align-items-center'>
                                                <span className='pr-2'><img src="/icon-bars.svg" /></span>
                                                <span>Crystal ball</span>
                                            </div>
                                        </div>
                                        <div className='grid2layout'>
                                            <div className='w-100 d-flex justify-content-between align-items-center'>
                                                <span>A single property</span>
                                                <span><img src="/icon-unlink-red.svg" /></span>
                                            </div>
                                            <div className="singleCol text-left d-flex flex-column">
                                                <div className="themeNewInputStyle position-relative w-100">
                                                    <i className="btn-searchIcon right-0 fa fa-angle-down"></i>
                                                    <select name="" value='' className="form-control selected">
                                                        <option value="Null">Select website</option>
                                                    </select>
                                                    <i className="btn-searchIcon left-0 fa fa-check-circle"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='d-flex flex-column'>
                                        <div className='d-flex justify-content-start analyticTopBar'>
                                            <div className='d-flex align-items-center pr-3'>
                                                <span className='pr-2'><img src="/icon-g.svg" /></span>
                                                <span>Adil Aijaz</span>
                                            </div>
                                            <div className='d-flex align-items-center'>
                                                <span className='pr-2'><img src="/icon-bars.svg" /></span>
                                                <span>Crystal ball</span>
                                            </div>
                                        </div>
                                        <div className='grid2layout'>
                                            <div className='w-100 d-flex justify-content-between align-items-center'>
                                                <span>A single property</span>
                                                <span><img src="/icon-unlink-red.svg" /></span>
                                            </div>
                                            <div className="singleCol text-left d-flex flex-column">
                                                <div className="themeNewInputStyle position-relative w-100">
                                                    <i className="btn-searchIcon right-0 fa fa-angle-down"></i>
                                                    <select name="" value='' className="form-control selected">
                                                        <option value="Null">Select website</option>
                                                    </select>
                                                    <i className="btn-searchIcon left-0 fa fa-check-circle"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='popupBtnBox d-flex justify-content-between align-items-center'>
                                <Button onClick={() => { this.recordStepResponse('IMPORT_OLD_ANNOTATIONS', false); this.incrementStep(1) }} className="btn-cancel">Skip this</Button>
                                <Button className="btn-theme">Continue</Button>
                            </div>
                        </ModalBody>
                    </div>
                ];
                break;
            case 4:
                modalBodyFooter = [
                    <div className="d-flex">
                        {popupSidebar}
                        <ModalBody className='p-6 contentArea recommendedApp flex-grow-1'>
                            <div className='titleAndCloseButton d-flex justify-content-between align-items-center'>
                                <h2>Connect Recommended Apps</h2>
                                <span className='cursor-pointer'>
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 7.00031L16.0003 0L18 1.99969L10.9997 9L18 16.0003L16.0003 18L9 10.9997L1.99969 18L0 16.0003L7.00031 9L0 1.99969L1.99969 0L9 7.00031Z" fill="#a6a6a6" />
                                    </svg>
                                </span>
                            </div>
                            <div className='connectRecommendedApp d-flex justify-content-center align-items-center'>
                                <div className="items">
                                    {[
                                        {
                                            id: "02",
                                            background: "#00749a",
                                            dsKey: "",
                                            enabled: true,
                                            premium: false,
                                            brandName: "Wordpress",
                                            brandLogo: "/wordpress.svg",
                                        },
                                        {
                                            id: "03",
                                            background: "null",
                                            dsKey: "",
                                            enabled: false,
                                            premium: false,
                                            brandName: "Rank Tracking SERP",
                                            brandLogo: "/serp.svg",
                                        },
                                        {
                                            id: "10",
                                            background: "#411442",
                                            dsKey: "",
                                            enabled: false,
                                            premium: false,
                                            commingSoon: true,
                                            brandName: "slack",
                                            brandLogo: "/slack.svg",
                                        },
                                        {
                                            id: "11",
                                            background: "#F8761F",
                                            dsKey: "",
                                            enabled: false,
                                            premium: false,
                                            commingSoon: true,
                                            brandName: "Hubspot",
                                            brandLogo: "/hubspot.svg",
                                        },
                                        {
                                            id: "07",
                                            background: "#004F9D",
                                            dsKey: "",
                                            enabled: false,
                                            premium: false,
                                            commingSoon: true,
                                            brandName: "Facebook Ads",
                                            brandLogo: "/facebookAds.svg",
                                        },
                                    ].map((item, itemKey) => (
                                        <div className="item" key={itemKey} style={{ background: item.background || "#fff", "border-color" : item.background || "#e0e0e0",}}>
                                            { item.enabled ? (<i className="active fa fa-check-circle"></i>) : null }
                                            <img src={item.brandLogo} alt={item.brandName} className="svg-inject" width='140' />
                                            { item.premium ? (<span className="btn-premium"><i className="fa fa-diamond"></i><span>Premium</span></span>) : null }
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='popupBtnBox d-flex justify-content-between align-items-center'>
                                <Button onClick={() => { this.recordStepResponse('IMPORT_OLD_ANNOTATIONS', false); this.incrementStep(1) }} className="btn-cancel">Skip this</Button>
                                <Button className="btn-theme">Continue</Button>
                            </div>
                        </ModalBody>
                    </div>
                ];
                break;
            case 5:
                modalBodyFooter = [
                    <div className="d-flex">
                        {popupSidebar}
                        <ModalBody className='p-6 contentArea coWorkers flex-grow-1'>
                            <div className='titleAndCloseButton d-flex justify-content-between align-items-center'>
                                <h2>Invite Co-workers</h2>
                                <span className='cursor-pointer'>
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 7.00031L16.0003 0L18 1.99969L10.9997 9L18 16.0003L16.0003 18L9 10.9997L1.99969 18L0 16.0003L7.00031 9L0 1.99969L1.99969 0L9 7.00031Z" fill="#a6a6a6" />
                                    </svg>
                                </span>
                            </div>
                            <div className='inviteCoWorkers d-flex justify-content-center align-items-center'>
                                <form className='inviteForm'>
                                    <legend>Enter details</legend>

                                    <fieldset className='grid2layout'>
                                        <div className="themeNewInputStyle">
                                            <input type='text' className='form-control' placeholder='Full name' value='' id='' name='' />
                                        </div>
                                        <div className="themeNewInputStyle">
                                            <input type='email' className='form-control' placeholder='Email' value='' id='' name='' />
                                        </div>
                                        <div className="themeNewInputStyle position-relative inputWithIcon">
                                            <span className="cursor-pointer fa"><img src={"/icon-eye-close.svg"}/></span>
                                            <input type='password' className='form-control' placeholder='Password' value='' id='' name='' />
                                        </div>
                                        <div className="themeNewInputStyle position-relative inputWithIcon">
                                            <span className="cursor-pointer fa"><img src={"/icon-eye-blue.svg"}/></span>
                                            <input type='password' className='form-control' placeholder='Confirm password' value='' id='' name='' />
                                        </div>
                                        <div className="themeNewInputStyle">
                                            <select name='user_level' className='form-control' placeholder='User level' onChange='' value=''>
                                                <option value="admin">Admin</option>
                                                <option value="team">Read & Write</option>
                                                <option value="viewer">Read</option>
                                            </select>
                                        </div>
                                        <div className="themeNewInputStyle">
                                            <input type='text' className='form-control' placeholder='Department' value='' id='' name='' />
                                        </div>
                                        <div className="themeNewInputStyle position-relative inputWithIcon">
                                            <span className="cursor-pointer fa"><img src={"/icon-plus.svg"}/></span>
                                            <input type='text' className='form-control' placeholder='Google accounts' value='' id='' name='' />
                                        </div>
                                        <div className="themeNewInputStyle">
                                            <select name='user_level' className='form-control' placeholder='Team' onChange='' value=''>
                                                <option value="admin">Admin</option>
                                                <option value="team">Read & Write</option>
                                                <option value="viewer">Read</option>
                                            </select>
                                        </div>
                                    </fieldset>

                                    <fieldset className="tags">
                                        <span className="tag">All accounts</span>
                                        <span className="tag">Crystal account</span>
                                    </fieldset>

                                    <fieldset>
                                        <div className="themeNewInputStyle position-relative inputWithIcon">
                                            <span className="textPlusIcon cursor-pointer">
                                                <img src={"/icon-email.svg"}/>
                                                <em>Invitations sent to</em>
                                            </span>
                                            <div className='invitationEmail'>
                                                <div className="tags">
                                                    <span className="tag">adilaijazwow@gmail.com</span>
                                                    <span className="tag">wowmail@yahoo.com</span>
                                                    <span className="tag">Adnie@hotmail.com</span>
                                                    <span className="tag">Oswald_Ledner73@gmail.com</span>
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                </form>
                            </div>
                            <div className='popupBtnBox d-flex justify-content-between align-items-center'>
                                <Button onClick={() => { this.recordStepResponse('IMPORT_OLD_ANNOTATIONS', false); this.incrementStep(1) }} className="btn-cancel">Skip this</Button>
                                <div>
                                    <Button className="btn-theme mr-3">Send another</Button>
                                    <Button className="btn-theme">Continue</Button>
                                </div>
                            </div>
                        </ModalBody>
                    </div>
                ];
                break;
            case 6:
                modalBodyFooter = [
                    <div className="d-flex">
                        {popupSidebar}
                        <ModalBody className='p-6 contentArea goodWork flex-grow-1'>
                            <strong><img src="/allDone.svg" width={180} height={180} /></strong>
                            <h1>Good work, Adil!</h1>
                            <p>Now you can go to your dashboard and do some productive work. Hooray 🎉</p>
                            <div className='popupBtnBox d-flex justify-content-center'>
                                <Button className='btn-theme' onClick={() => { this.props.closeModal() }}>Go to Dashboard</Button>
                            </div>
                        </ModalBody>
                    </div>
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
