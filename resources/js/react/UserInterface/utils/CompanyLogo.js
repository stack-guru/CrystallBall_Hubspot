import React from 'react';

export default function CompanyLogo(props) {
    let src = "/images/company_logo.png";
    switch (window.location.hostname) {
        case 'app.gaannotations.com':
            src = '/images/company_logo_gaa.png';
            break;

        case 'app.crystalballinsight.com':
            src = '/images/company_logo_cbi.png';
            break;

        case 'localhost':
            src = '/images/company_logo_gaa.png';
            break;

        case '127.0.0.1':
            src = '/images/company_logo_cbi.png';
            break;
    }

    return <img src={src} width={props.width} height={props.height} alt={props.alt} />;
}
