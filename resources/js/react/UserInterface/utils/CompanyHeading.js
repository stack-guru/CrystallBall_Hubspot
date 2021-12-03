import React from 'react';
import { getCompanyName } from '../helpers/CommonFunctions';

export default function CompanyHeading(props) {
    let txt = getCompanyName();

    return <h5 className={props.className}>{txt}</h5>;
}
