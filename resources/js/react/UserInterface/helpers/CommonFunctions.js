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

export function saveFormToLocalStorage(form) {
    if (form.getAttribute('id') == "") {
        console.error("Please add a unique form id to the form before using draft function.");
        return false;
    }

    let draftObject = {};
    form.querySelectorAll('input').forEach(function (element) {
        draftObject[element.name] = { name: element.name, type: element.type, value: element.value };
    });

    localStorage.setItem(md5(form.getAttribute('id')), JSON.stringify(draftObject));
    return true;
}

export function loadFormFromLocalStorage(form) {
    if (form.getAttribute('id') == "") {
        console.error("Please add a unique form id to the form before using draft function.");
        return false;
    }
    let draftObject = JSON.parse(localStorage.getItem(md5(form.getAttribute('id'))));
    form.querySelectorAll('input').forEach(function (element) {
        if (element.name in draftObject)
            element.setAttribute("value", draftObject[element.name].value);
    });

    return true;
}

export function removeFormFromLocalStorage(form) {
    if (form.getAttribute('id') == "") {
        console.error("Please add a unique form id to the form before using draft function.");
        return false;
    }

    localStorage.removeItem(md5(form.getAttribute('id')));
    return true;
}