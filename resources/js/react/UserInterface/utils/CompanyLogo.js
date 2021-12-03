import React from 'react';
import { getCompanyLogoUrl } from '../helpers/CommonFunctions';

export default function CompanyLogo(props) {
    let src = getCompanyLogoUrl();
    return <img src={src} width={props.width} height={props.height} alt={props.alt} />;
}
