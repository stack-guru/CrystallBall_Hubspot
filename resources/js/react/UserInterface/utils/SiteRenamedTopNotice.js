import React, { Component } from "react";
import moment from 'moment'

import TopNoticeBar from './TopNoticeBar';

export default function SiteRenamedTopNotice(props) {

    return (
        <TopNoticeBar show={props.show} backgroundColor="linear-gradient(#0074E7, #0074E7)"
            content={<p className="text-white" style={{ marginBottom: '0px' }}>
                GAannotations is now <a style={{ color: 'white', textDecoration: 'underline' }} href="https://app.crystalballinsight.com">Crystal Ball</a>
            </p>}
        />
    );
}