import md5 from 'crypto-js/md5';

export function getCompanyLogoUrl() {
    let url = "/images/company_logo.png";
    switch (window.location.hostname) {
        case 'app.gaannotations.com':
            url = '/images/company_logo_gaa.png';
            break;

        case 'app.crystalballinsight.com':
            url = '/images/company_logo_cbi.png';
            break;

        case 'localhost':
            url = '/images/company_logo_gaa.png';
            break;

        case '127.0.0.1':
            url = '/images/company_logo_cbi.png';
            break;
    }
    return url;
}

export function getCompanyName() {
    let heading = "Crystal Ball";
    switch (window.location.hostname) {
        case 'app.gaannotations.com':
            heading = 'GAannotations';
            break;

        case 'app.crystalballinsight.com':
            heading = 'Crystal Ball';
            break;

        case 'localhost':
            heading = 'GAannotations';
            break;

        case '127.0.0.1':
            heading = 'Crystal Ball';
            break;
    }
    return heading;
}

export function IsDomain(domain) {
    return window.location.hostname == domain;
}

export function callmiddle(e, callback) {
    e.preventDefault();
    (callback)(e);
    window.location = e.target.getAttribute("href");
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function saveStateToLocalStorage(componentName, state) {
    if (componentName == "") {
        console.error("Please add parameter for component name before using draft function.");
        return false;
    }

    localStorage.setItem(md5(componentName + "-state"), JSON.stringify(state));
    return true;
}

export function loadStateFromLocalStorage(componentName) {
    if (componentName == "") {
        console.error("Please add parameter for component name before using draft function.");
        return false;
    }
    let state = JSON.parse(localStorage.getItem(md5(componentName + "-state")));

    return state;
}

export function removeStateFromLocalStorage(componentName) {
    if (componentName == "") {
        console.error("Please add parameter for component name before using draft function.");
        return false;
    }

    localStorage.removeItem(md5(componentName + "-state"));
    return true;
}

export function calculatePricePlanPrice(price, monthDuration, yearlyDiscountPercent, registrationOffer) {
    let discountSum = 0.00;
    if (registrationOffer) {
        if (registrationOffer.discount_percent != 0) {
            discountSum = parseFloat(registrationOffer.discount_percent);
            // return parseFloat((price) - ((discountSum / 100) * price)).toFixed(1);
            return parseInt((price) - ((discountSum / 100) * price));
        }
    }

    switch (monthDuration) {
        case 12:
            if (yearlyDiscountPercent != 0) {
                discountSum += parseFloat(yearlyDiscountPercent);
            }
            break;
    }

    // return parseFloat((price) - ((discountSum / 100) * price)).toFixed(1);
    return parseInt((price) - ((discountSum / 100) * price));
}

export function manipulateRegistrationOfferText(text, userRegistrationOffer) {
    let offerExpiringDate = moment(userRegistrationOffer.expires_at);
    const offerDiscountPercent = userRegistrationOffer.discount_percent;

    const daysDiff = offerExpiringDate.diff(moment(), 'days');
    offerExpiringDate = offerExpiringDate.subtract(daysDiff, 'days');
    const hoursDiff = offerExpiringDate.diff(moment(), 'hours');
    offerExpiringDate = offerExpiringDate.subtract(hoursDiff, 'hours')
    const minutesDiff = offerExpiringDate.diff(moment(), 'minutes');
    offerExpiringDate = offerExpiringDate.subtract(minutesDiff, 'minutes');
    const secondsDiff = offerExpiringDate.diff(moment(), 'seconds');

    return text.replace('[{expires_at}]', `${hoursDiff + (daysDiff * 24)}:${minutesDiff}:${secondsDiff}`).replace("[{discount_percent}]", offerDiscountPercent);
}
