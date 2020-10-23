import React from 'react'

export default function ErrorAlert(props) {
    if (props.errors !== undefined && props.errors.length !== 0) {
        let errors = props.errors.errors;
        if (errors !== undefined) {
            if (props.errors.message !== undefined) {
                return (
                    <div className="alert alert-danger" role="alert">
                        <h4 className="alert-heading"><i className="icon fa fa-info"></i> {props.errors.message}</h4>
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
                console.log(props);
                return (<div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading"><i className="icon fa fa-info"></i> Unknown error occured</h4>
                </div>);
            }
        } else {
            return (
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading"><i className="icon fa fa-info"></i> {props.errors.message}</h4>
                </div>
            );
        }
    } else {
        return null;
    }
}

