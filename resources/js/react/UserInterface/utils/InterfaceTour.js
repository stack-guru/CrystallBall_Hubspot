import React, { Component } from 'react'
import Tour from 'reactour'
import { Redirect } from "react-router-dom";

const steps = [
    {
        // selector: '.btn',
        position: 'top',
        content: 'Welcome! Take this quick tour',
        redirectRoute: null,
        style: {
            // width: '50%', height: '50%',
            padding: '60px'
        }
    },
    {
        position: 'bottom',
        selector: '#annotation-index-container',
        content: 'Here you can see and manage all your annotations',
        redirectRoute: '/annotation'
    },
    {
        position: 'bottom',
        selector: '#csv-upload-form-container',
        content: 'If you already have a list of annotations, you can bulk upload them here',
        redirectRoute: '/annotation/upload'
    },
    {
        position: 'bottom',
        selector: '#integration-page-top-options',
        content: "Automate annotations from your Ad Platforms, Newsletters, Slack and more",
        redirectRoute: '/integrations'
    },
    {
        position: 'right',
        selector: '#data-source-page-container',
        content: 'Automate annotations for Holidays, Weather Alerts, Google Updates & Retail Marketing Dates',
        redirectRoute: '/data-source'
    },
    {
        position: [window.screen.width - (window.screen.width * 25 / 100), 10],
        selector: '#chrome-extension-download-button',
        content: <div>Make sure to add the extension, pin it and to log in.<br />
            <img src="/images/pin_extension.gif" width="100%" height="auto" />
        </div>,
        redirectRoute: null
    },
    {
        position: 'top',
        content: <div>We added a Sample Annotation to show you how it looks like, once you go to <a href="https://analytics.google.com/analytics/web/#/" target="_blank">Google Analytics</a>
            <img src="/images/walkthrough_step7.gif" width="100%" height="auto" />
        </div>,
        redirectRoute: null,
        style: {
            width: '50%', height: 'auto', maxWidth: '677px', top: '25px'
        }
    }

];

export default class InterfaceTour extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentStep: 0,
            redirectTo: null
        }

        this.handleRedirecter = this.handleRedirecter.bind(this)
    }

    componentDidMount() {
        if (this.props.isOpen) {
            let bodyElement = document.getElementsByTagName('body')[0];
            if (!bodyElement.classList.contains('is-collapsed')) {
                bodyElement.classList.add('is-collapsed')
            }
        }
    }

    handleRedirecter() {
        if (this.state.redirectTo !== null) {
            let rL = this.state.redirectTo
            this.setState({ redirectTo: null })
            return <Redirect to={rL} />
        }
    }

    render() {
        return (
            <>
                {this.handleRedirecter()}
                <Tour
                    getCurrentStep={cS => { if (this.state.currentStep !== cS) this.setState({ currentStep: cS, redirectTo: steps[cS].redirectRoute }) }}
                    steps={steps}
                    isOpen={this.props.isOpen}
                    onRequestClose={this.props.toggleShowTour}
                    closeWithMask={false}
                    lastStepNextButton={<button className="btn btn-primary" onClick={this.props.toggleShowTour}>Finish</button>}
                />
            </>
        )
    }

}

