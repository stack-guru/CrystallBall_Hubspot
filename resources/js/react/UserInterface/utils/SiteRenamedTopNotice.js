import React, { Component } from "react";
import moment from 'moment'
import { IsDomain } from '../helpers/CommonFunctions';

import TopNoticeBar from './TopNoticeBar';

export default function SiteRenamedTopNotice(props) {

    // let gannotations = () => IsDomain('app.gaannotations.com') || IsDomain('localhost') ? <>
    //         🥳 We have a New Look 🥳  {' > '} GAannotations is now <a style={{ color: 'white', textDecoration: 'underline' }} href="https://app.crystalballinsight.com">Crystal Ball</a> - {' '}
    //     </> : <>
    //         🥳 Try the New <a style={{ color: 'white', textDecoration: 'underline' }} href="/data-source">Apps Market</a> to Add Automated Annotations - {' '}
    //     </>;

    let gannotations = () => <> New Chrome extension is now available {' > '} <a target={"_blank"} style={{ color: 'white', textDecoration: 'underline' }} href="https://chrome.google.com/webstore/detail/automated-google-analytic/jfkimpgkmamkdhamnhabohpeaplbpmom?hl=en">Update to version 1.5.1</a> - {' '} </>;

    return (
        <TopNoticeBar show={props.show} backgroundColor="linear-gradient(90deg, #3b8bfa 33.33%, #3b8bfa 100%)"
            content={
                <div style={{ display: "flex", justifyContent: "center" }}>

                    <p className="text-white" style={{ marginBottom: '0px', marginLeft: '2px', marginRight: '2px', }}>
                    { gannotations() } {" "} Need Help? <a style={{ color: 'white', textDecoration: 'underline' }} href="https://calendly.com/crystal-ball/30min" target="_blank">Book a Demo</a>
                    </p>
                </div>
            }
        />
    );
}
