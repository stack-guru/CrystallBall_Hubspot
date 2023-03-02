import React from 'react'

export default function ErrorAlert(props) {
    if (props.errors !== undefined && props.errors.length !== 0) {
        let errors = props.errors.errors;
        if (errors !== undefined) {
            if (props.errors.message !== undefined) {
                return (
                    <>
                        <div className="alert alert-danger border-0 mt-0 mb-3">
                            <i><img src={'/icon-info-red.svg'} alt={'icon'} className="svg-inject" /></i>
                            <span>
                                {props.errors.message}
                            </span>
                        </div>
                        <ul className={`errorList m-0 ${Object.keys(errors).length ?? "pl-4 pb-3"} text-danger`}>
                            {Object.keys(errors).map((field, fi) => {
                                return (
                                    <li key={fi}>
                                        {field}
                                        {errors[field].map((rule, ri) => {
                                            return (
                                                <span className='pl-2' key={fi + ri}>
                                                    {rule}
                                                </span>
                                            );
                                        })}
                                    </li>
                                );
                            })}
                        </ul>
                    </>
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
                <div className="alert alert-danger border-0 mt-0">
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

