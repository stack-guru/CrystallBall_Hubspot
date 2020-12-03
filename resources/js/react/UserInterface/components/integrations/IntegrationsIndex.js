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
            <div className="container-xl bg-white  d-flex flex-column justify-content-center component-wrapper">

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
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate doloribus molestias officia, pers
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate doloribus molestias officia, pers
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate doloribus molestias officia, pers
                                </p>
                            </div>
                            <div className="int-action">
                                <a href="" className="btn btn-primary">See instructions</a>
                            </div>

                        </div>
                        <div className="d-flex flex-row integration-pack">
                            <figure>
                                <img src="/images/adword.png" className="img-fluid int-img" alt="adword image here"/>
                            </figure>
                            <div className="int-description">
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate doloribus molestias officia, pers</p>
                            </div>
                            <div className="int-action">
                                <a href="" className="btn btn-primary">See instructions</a>
                            </div>
                        </div>
                        <div className="d-flex flex-row integration-pack">
                            <figure>
                                <img src="/images/asana.png" className="img-fluid int-img" alt="adword image here"/>
                            </figure>
                            <div className="int-description">
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate doloribus molestias officia, pers</p>
                            </div>
                            <div className="int-action">
                                <a href="" className="btn btn-primary">See instructions</a>
                            </div>
                        </div>
                        <div className="d-flex flex-row integration-pack">
                            <figure >
                                <img src="/images/slack.png" className="img-fluid int-img" alt="adword image here"/>
                            </figure>
                            <div className="int-description">
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate doloribus molestias officia, pers</p>
                            </div>
                            <div className="int-action">
                                <a href="" className="btn btn-primary">See instructions</a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}
