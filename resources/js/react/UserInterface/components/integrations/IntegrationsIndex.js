import React from 'react';
import VideoModalBox from '../../utils/VideoModalBox';

export default class integrationsIndex extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.title = "Integrations";
    }

    render() {
        return (
            <div className="container-xl bg-white  d-flex flex-column justify-content-center component-wrapper data-source-container">
                <div className="row ml-0 mr-0">
                    <div className="col-12">
                        <h2 className="gaa-text-primary">Integrations</h2>
                    </div>
                </div>
                <div className="row ml-0 mr-0 mt-5" id="integration-page-container">
                    <div className="col-12">
                        <div id="integration-page-top-options">
                            <div className="d-flex flex-row integration-pack justify-content-between">
                                <div className="d-flex w-100 integration-pack-content">
                                    <figure>
                                        <img src="/images/adward.jpg" className="img-fluid int-img" alt="mail champ image here" />
                                    </figure>
                                    <div className="int-description w-100 ml-2">
                                        <p>Add an annotation to GA automatically when a New Google Ads campaign Launch.</p>
                                        <div
                                            className="mt-3 integration-video-link"
                                            data-toggle="modal"
                                            data-target="#google-modal"
                                        >
                                            <i className="fa fa-play pr-2" />
                                        See how this works
                                    </div>
                                        <VideoModalBox id="google-modal" src="https://www.youtube.com/embed/bRjoZtmkUxU" />
                                    </div>
                                </div>
                                <div className="int-action">
                                    <a
                                        target="_blank"
                                        href="https://www.gaannotations.com/campaign-creation-trigger"
                                        className="btn btn-primary"
                                    >
                                        See instructions
                                </a>
                                </div>
                            </div>
                            <div className="d-flex flex-row integration-pack justify-content-between">
                                <div className="d-flex w-100 integration-pack-content">
                                    <figure>
                                        <img
                                            src="/images/mailchamp.jpeg"
                                            className="img-fluid int-img"
                                            alt="mailchamp image here"
                                        />
                                    </figure>
                                    <div className="int-description w-100 ml-2">
                                        <p>Add an annotation to GA automatically when a MailChimp campaign is sent.</p>
                                        <div
                                            className="mt-3 integration-video-link"
                                            data-toggle="modal"
                                            data-target="#mail-chimp-modal"
                                        >
                                            <i className="fa fa-play pr-2" />
                                        See how this works
                                    </div>
                                        <VideoModalBox id="mail-chimp-modal" src="https://www.youtube.com/embed/IRUUQ6jVvks" />
                                    </div>
                                </div>
                                <div className="int-action">
                                    <a
                                        target="_blank"
                                        href="https://www.gaannotations.com/mailchimp-creation-trigger"
                                        className="btn btn-primary"
                                    >
                                        See instructions
                                </a>
                                </div>
                            </div>
                        </div>
                        {/* <div className="d-flex flex-row integration-pack justify-content-between">
                            <div className="d-flex w-100 integration-pack-content">
                                <figure>
                                    <img
                                        src="/images/activecampaign.png"
                                        className="img-fluid int-img"
                                        alt="activecampaign"
                                    />
                                </figure>
                                <div className="int-description w-100 ml-2">
                                    <p>
                                    Add an annotation to GA automatically when a New Campaign Starts Sending in ActiveCampaign.
                                    </p>
                                    <div
                                        className="mt-3 integration-video-link"
                                        // data-toggle="modal"
                                        // data-target="#activecampaign-modal"
                                        onClick={() => { swal("Coming soon!", '', 'info'); }}
                                    >
                                        <i className="fa fa-play pr-2" />
                                        See how this works
                                    </div>
                                     <VideoModalBox id="asana-modal" src="https://www.youtube.com/embed/oR6u4qoPZgk" /> 
                                </div>
                            </div>
                            <div className="int-action">
                                <a
                                    onClick={(e) => { e.preventDefault(); swal("Coming soon!", '', 'info'); }}
                                    target="_blank"
                                    href="#"
                                    className="btn btn-primary"
                                >
                                    See instructions
                                </a>
                            </div>
                        </div> */}
                        <div className="d-flex flex-row integration-pack justify-content-between">
                            <div className="d-flex w-100 integration-pack-content">
                                <figure>
                                    <img
                                        src="/images/shopify.png"
                                        className="img-fluid int-img"
                                        alt="shopify"
                                    />
                                </figure>
                                <div className="int-description w-100 ml-2">
                                    <p>
                                    Add an annotation to GA automatically when a New Product in Shopify.
                                    </p>
                                    <div
                                        className="mt-3 integration-video-link"
                                        // data-toggle="modal"
                                        // data-target="#activecampaign-modal"
                                        onClick={() => { swal("Coming soon!", '', 'info'); }}
                                    >
                                        <i className="fa fa-play pr-2" />
                                        See how this works
                                    </div>
                                    {/* <VideoModalBox id="asana-modal" src="https://www.youtube.com/embed/oR6u4qoPZgk" /> */}
                                </div>
                            </div>
                            <div className="int-action">
                                <a
                                    target="_blank"
                                    href="https://www.gaannotations.com/shopify-creation-trigger"
                                    className="btn btn-primary"
                                >
                                    See instructions
                                </a>
                            </div>
                        </div>
                        <div className="d-flex flex-row integration-pack justify-content-between">
                            <div className="d-flex w-100 integration-pack-content">
                                <figure>
                                    <img
                                        src="/images/slack.png"
                                        className="img-fluid int-img"
                                        alt="mailchamp image here"
                                    />
                                </figure>
                                <div className="int-description w-100 ml-2">
                                    <p>
                                        Add an annotation to GA automatically when a New Message Posted to Private Channel in
                                        Slack
                                    </p>
                                    <div
                                        className="mt-3 integration-video-link"
                                        data-toggle="modal"
                                        data-target="#slack-modal"
                                    >
                                        <i className="fa fa-play pr-2" />
                                        See how this works
                                    </div>
                                    <VideoModalBox id="slack-modal" src="https://www.youtube.com/embed/RY3Q00lyeg4" />
                                </div>
                            </div>
                            <div className="int-action">
                                <a
                                    target="_blank"
                                    href="https://www.gaannotations.com/slack-creation-trigger"
                                    className="btn btn-primary"
                                >
                                    See instructions
                                </a>
                            </div>
                        </div>
                        <div className="d-flex flex-row integration-pack justify-content-between">
                            <div className="d-flex w-100 integration-pack-content">
                                <figure>
                                    <img
                                        src="/images/asana.png"
                                        className="img-fluid int-img"
                                        alt="mailchamp image here"
                                    />
                                </figure>
                                <div className="int-description w-100 ml-2">
                                    <p>
                                        Add an annotation to GA automatically when a New Message Posted to Private Channel in
                                        Asana.
                                    </p>
                                    <div
                                        className="mt-3 integration-video-link"
                                        data-toggle="modal"
                                        data-target="#asana-modal"
                                    >
                                        <i className="fa fa-play pr-2" />
                                        See how this works
                                    </div>
                                    <VideoModalBox id="asana-modal" src="https://www.youtube.com/embed/oR6u4qoPZgk" />
                                </div>
                            </div>
                            <div className="int-action">
                                <a
                                    target="_blank"
                                    href="https://www.gaannotations.com/asana-creation-trigger"
                                    className="btn btn-primary"
                                >
                                    See instructions
                                </a>
                            </div>
                        </div>
                        {/* <div className="d-flex flex-row integration-pack justify-content-between">
                            <div className="d-flex w-100 integration-pack-content">
                                <figure>
                                    <img
                                        src="/images/monday.png"
                                        className="img-fluid int-img"
                                        alt="mailchamp image here"
                                    />
                                </figure>
                                <div className="int-description w-100 ml-2">
                                    <p>
                                    Add an annotation to GA automatically when a New Update in Board in monday.com.
                                    </p>
                                    <div
                                        className="mt-3 integration-video-link"
                                        // data-toggle="modal"
                                        // data-target="#monday-modal"
                                        onClick={() => { swal("Coming soon!", '', 'info'); }}
                                    >
                                        <i className="fa fa-play pr-2" />
                                        See how this works
                                    </div>
                                    <VideoModalBox id="asana-modal" src="https://www.youtube.com/embed/oR6u4qoPZgk" />
                                </div>
                            </div>
                            <div className="int-action">
                                <a
                                    onClick={(e) => { e.preventDefault(); swal("Coming soon!", '', 'info'); }}
                                    target="_blank"
                                    href="https://www.gaannotations.com/post/add-an-annotation-to-ga-automatically-when-a-new-message-posted-to-a-private-channel-in-asana"
                                    className="btn btn-primary"
                                >
                                    See instructions
                                </a>
                            </div>
                        </div> */}
                        <div className="d-flex flex-row integration-pack justify-content-between">
                            <div className="d-flex w-100 integration-pack-content">
                                <figure>
                                    <img
                                        src="/images/jira.png"
                                        className="img-fluid int-img"
                                        alt="mailchamp image here"
                                    />
                                </figure>
                                <div className="int-description w-100 ml-2">
                                    <p>
                                    Add an annotation to GA automatically when a New Issue Type in Jira.
                                    </p>
                                    <div
                                        className="mt-3 integration-video-link"
                                        // data-toggle="modal"
                                        // data-target="#monday-modal"
                                        onClick={() => { swal("Coming soon!", '', 'info'); }}
                                    >
                                        <i className="fa fa-play pr-2" />
                                        See how this works
                                    </div>
                                    <VideoModalBox id="asana-modal" src="https://www.youtube.com/embed/oR6u4qoPZgk" />
                                </div>
                            </div>
                            <div className="int-action">
                                <a
                                    target="_blank"
                                    href="https://www.gaannotations.com/jira-creation-trigger"
                                    className="btn btn-primary"
                                >
                                    See instructions
                                </a>
                            </div>
                        </div>
                        <div className="d-flex flex-row integration-pack justify-content-between">
                            <div className="d-flex w-100 integration-pack-content">
                                <figure>
                                    <img
                                        src="/images/trello.png"
                                        className="img-fluid int-img"
                                        alt="mailchamp image here"
                                    />
                                </figure>
                                <div className="int-description w-100 ml-2">
                                    <p>
                                    Add an annotation to GA automatically when a New Card in Trello.
                                    </p>
                                    <div
                                        className="mt-3 integration-video-link"
                                        // data-toggle="modal"
                                        // data-target="#monday-modal"
                                        onClick={() => { swal("Coming soon!", '', 'info'); }}
                                    >
                                        <i className="fa fa-play pr-2" />
                                        See how this works
                                    </div>
                                    <VideoModalBox id="asana-modal" src="https://www.youtube.com/embed/oR6u4qoPZgk" />
                                </div>
                            </div>
                            <div className="int-action">
                                <a
                                    target="_blank"
                                    href="https://www.gaannotations.com/trello-creation-trigger"
                                    className="btn btn-primary"
                                >
                                    See instructions
                                </a>
                            </div>
                        </div>
                        <div className="d-flex flex-row integration-pack justify-content-between">
                            <div className="d-flex w-100 integration-pack-content">
                                <figure>
                                    <img
                                        src="/images/github.png"
                                        className="img-fluid int-img"
                                        alt="mailchamp image here"
                                    />
                                </figure>
                                <div className="int-description w-100 ml-2">
                                    <p>
                                    Add an annotation to GA automatically when a New Commit on Github.
                                    </p>
                                    <div
                                        className="mt-3 integration-video-link"
                                        // data-toggle="modal"
                                        // data-target="#monday-modal"
                                        onClick={() => { swal("Coming soon!", '', 'info'); }}
                                    >
                                        <i className="fa fa-play pr-2" />
                                        See how this works
                                    </div>
                                    <VideoModalBox id="asana-modal" src="https://www.youtube.com/embed/oR6u4qoPZgk" />
                                </div>
                            </div>
                            <div className="int-action">
                                <a
                                    target="_blank"
                                    href="https://www.gaannotations.com/github-creation-trigger"
                                    className="btn btn-primary"
                                >
                                    See instructions
                                </a>
                            </div>
                        </div>
                        <div className="d-flex flex-row integration-pack justify-content-between">
                            <div className="d-flex w-100 integration-pack-content">
                                <figure>
                                    <img
                                        src="/images/bitbucket.png"
                                        className="img-fluid int-img"
                                        alt="mailchamp image here"
                                    />
                                </figure>
                                <div className="int-description w-100 ml-2">
                                    <p>
                                    Add an annotation to GA automatically when a New Commit on Bitbucket.
                                    </p>
                                    <div
                                        className="mt-3 integration-video-link"
                                        // data-toggle="modal"
                                        // data-target="#monday-modal"
                                        onClick={() => { swal("Coming soon!", '', 'info'); }}
                                    >
                                        <i className="fa fa-play pr-2" />
                                        See how this works
                                    </div>
                                    <VideoModalBox id="asana-modal" src="https://www.youtube.com/embed/oR6u4qoPZgk" />
                                </div>
                            </div>
                            <div className="int-action">
                                <a
                                    target="_blank"
                                    href="https://www.gaannotations.com/bitbucket-creation-trigger"
                                    className="btn btn-primary"
                                >
                                    See instructions
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
