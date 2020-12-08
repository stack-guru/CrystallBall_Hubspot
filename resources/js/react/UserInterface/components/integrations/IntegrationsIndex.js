import React from 'react';
require("../../Main.css");

export default class integrationsIndex extends React.Component{

    constructor(props) {
        super(props);

    }
    componentDidMount() {
        document.title="Integrations";
    }

    render() {
        return (
            <div className="container-xl bg-white  d-flex flex-column justify-content-center component-wrapper data-source-container">

                <div className="row ml-0 mr-0">
                    <div className="col-12">
                        <h1 className="gaa-text-primary">Integrations</h1>
                    </div>
                </div>
                <div className="row ml-0 mr-0 mt-5">
                    <div className="col-12">
                        <div className="d-flex flex-row integration-pack">
                            <figure>
                                <img src="/images/mailchamp.jpeg" className="img-fluid int-img" alt="mailchamp image here"/>
                            </figure>
                            <div className="int-description">
                                <p>Add an annotation to GA automatically when a MailChimp campaign is sent.</p>
                                <a target="_blank" href="https://www.youtube.com/channel/UCYJIFsw2yAqJybQn3HKYSxw"><i className="fa fa-play"></i> See how this automations works</a>
                            </div>
                            <div className="int-action">
                                <a target="_blank" href="https://www.gaannotations.com/post/add-an-annotation-to-ga-automatically-when-a-mailchimp-campaign-is-sent" className="btn btn-primary">See instructions</a>
                            </div>
                        </div>
                        <div className="d-flex flex-row integration-pack">
                            <figure>
                                <img src="/images/adword.png" className="img-fluid int-img" alt="adword image here"/>
                            </figure>
                            <div className="int-description">
                                <p>Add an annotation to GA automatically when a New Google Ads campaign Launch.</p>
                                <a target="_blank" href="https://www.youtube.com/channel/UCYJIFsw2yAqJybQn3HKYSxw"><i className="fa fa-play"></i> See how this automations works</a>
                            </div>
                            <div className="int-action">
                                <a target="_blank" href="https://www.gaannotations.com/post/add-an-annotation-to-ga-automatically-when-a-launch-a-new-google-ads-campaign" className="btn btn-primary">See instructions</a>
                            </div>
                        </div>
                        <div className="d-flex flex-row integration-pack">
                            <figure>
                                <img src="/images/asana.png" className="img-fluid int-img" alt="asana image here"/>
                            </figure>
                            <div className="int-description">
                                <p>Add an annotation to GA automatically when a New Message Posted to Private Channel in Asana.</p>
                                <a target="_blank" href="https://www.youtube.com/channel/UCYJIFsw2yAqJybQn3HKYSxw"><i className="fa fa-play"></i> See how this automations works</a>
                            </div>
                            <div className="int-action">
                                <a target="_blank" href="https://www.gaannotations.com/post/add-an-annotation-to-ga-automatically-when-a-new-message-posted-to-a-private-channel-in-asana" className="btn btn-primary">See instructions</a>
                            </div>
                        </div>
                        <div className="d-flex flex-row integration-pack">
                            <figure >
                                <img src="/images/slack.png" className="img-fluid int-img" alt="slack image here"/>
                            </figure>
                            <div className="int-description">
                                <p>Add an annotation to GA automatically when a New Message Posted to Private Channel in Slack</p>
                                <a target="_blank" href="https://www.youtube.com/channel/UCYJIFsw2yAqJybQn3HKYSxw"><i className="fa fa-play"></i> See how this automations works</a>
                            </div>
                            <div className="int-action">
                                <a target="_blank" href="https://www.gaannotations.com/post/add-an-annotation-to-ga-automatically-when-a-new-message-posted-to-a-private-channel-in-slack" className="btn btn-primary">See instructions</a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}
