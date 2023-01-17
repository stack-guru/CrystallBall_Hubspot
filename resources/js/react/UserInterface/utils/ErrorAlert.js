import React from 'react'

export default function ErrorAlert(props) {
    if (props.errors !== undefined && props.errors.length !== 0) {
        let errors = props.errors.errors;
        if (errors !== undefined) {
            if (props.errors.message !== undefined) {
                return (
                    <div className="alert alert-danger border-0">
                        <i><img src={'/icon-info-red.svg'} alt={'icon'} className="svg-inject" /></i>
                        <span>
                            {props.errors.message}
                        </span>

                        <ul>
                            {Object.keys(errors).map((field, fi) => {
                                return (
                                    <li key={fi}>
                                        {field}
                                        <ul>
                                            {errors[field].map((rule, ri) => {
                                                return (
                                                    <li key={fi + ri}>
                                                        {rule}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                );
            } else {
                return (
                    <div className="alert alert-danger border-0">
                        <i><img src={'/icon-info-red.svg'} alt={'icon'} className="svg-inject" /></i>
                        <span>
                        Unknown error occurred
                        </span>
                    </div>
                );
            }
        } else {
            return (
                <div className="alert alert-danger border-0">
                    <i><img src={'/icon-info-red.svg'} alt={'icon'} className="svg-inject" /></i>
                    <span
                        dangerouslySetInnerHTML={{
                            __html: props.errors.message,
                        }}
                    ></span>
                </div>
            );
        }
    } else {
        return null;
    }
}

