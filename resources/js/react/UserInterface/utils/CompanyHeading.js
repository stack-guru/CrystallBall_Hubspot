import React from 'react';

export default function CompanyHeading(props) {
    let txt = "Crystal Ball";
    switch (window.location.hostname) {
        case 'app.gaannotations.com':
            txt = 'GAannotations';
            break;

        case 'app.crystalballinsight.com':
            txt = 'Crystal Ball';
            break;

        case 'localhost':
            txt = 'GAannotations';
            break;

        case '127.0.0.1':
            txt = 'Crystal Ball';
            break;
    }

    return <h5 className={props.className}>{txt}</h5>;
}
