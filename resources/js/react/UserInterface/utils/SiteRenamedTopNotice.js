import React, { Component } from "react";
import moment from 'moment'
import { IsDomain } from '../helpers/CommonFunctions';

import TopNoticeBar from './TopNoticeBar';

export default function SiteRenamedTopNotice(props) {

    let gannotations = () => IsDomain('app.gaannotations.com') || IsDomain('localhost') ? <p className="text-white" style={{ marginBottom: '0px' }}>
            GAannotations is now <a style={{ color: 'white', textDecoration: 'underline' }} href="https://app.crystalballinsight.com">Crystal Ball</a>.
        </p> : null;

    return (
        <TopNoticeBar show={props.show} backgroundColor="#096DB7"
            content={
                <div style={{ display: "flex", justifyContent: "center" }}>
                    { gannotations() } {" "}
                    <p className="text-white" style={{ marginBottom: '0px', marginLeft: '2px', marginRight: '2px', }}>
                    Need Help? <a style={{ color: 'white', textDecoration: 'underline' }} href="https://calendly.com/crystal-ball/30min?back=&month=2023-01" target="_blank">Book a Demo</a>
                    </p>
                </div>
            }
        />
    );
}
