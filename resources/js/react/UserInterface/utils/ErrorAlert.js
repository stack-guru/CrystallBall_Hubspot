import React from 'react'

export default function ErrorAlert(props) {
    if (props.errors !== undefined && props.errors.length !== 0) {
        let errors = props.errors.errors;
        if (errors !== undefined) {
            if (props.errors.message !== undefined) {
                return (
                    <div className="alert alert-danger" role="alert">
                        <div className="alert-heading"> {props.errors.message}</div>
                        <ul>
                            {
                                Object.keys((errors)).map((field, fi) => {
                                    return (
                                        <li key={fi}>
                                            {field}
                                            <ul>
                                                {
                                                    (errors[field]).map((rule, ri) => {
                                                        return <li key={fi + ri}>{rule}</li>
                                                    })
                                                }
                                            </ul>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                )
            } else {
                return (<div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading"><i className="icon fa fa-info"></i> Unknown error occured</h4>
                </div>);
            }
        } else {
            return (
                <div className="alert alert-danger" role="alert">
                    <p className="alert-heading" dangerouslySetInnerHTML={{ __html: props.errors.message }}></p>
                </div>
            );
        }
    } else {
        return null;
    }
}

