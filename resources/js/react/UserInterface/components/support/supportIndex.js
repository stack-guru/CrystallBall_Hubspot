import React, { Component } from 'react'

import ErrorAlert from "../../utils/ErrorAlert";

export default class SupportIndex extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render() {
        return (
            <div className="container-xl bg-white  d-flex flex-column justify-content-center component-wrapper" >
                <section className="ftco-section " id="inputs" >
                    <div className="container p-5">
                        <div className="row mb-5">
                            <div className="col-md-12">
                                <h2 className="heading-section gaa-title">API Keys</h2>
                                <sub className="float-right"><a href="/documentation" target="_blank">Check documentation</a></sub>
                            </div>
                            <div className="col-md-12">
                                <ErrorAlert errors={this.state.errors} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <label>Token Name:</label>
                                <input type="text" className="form-control" name="token_name" onChange={this.handleChange} value={this.state.token_name} />
                            </div>
                            <div className="col-md-4">
                                <label>Access Token:</label>
                                <textarea className="form-control" value={this.state.accessToken} readOnly id="input-access-token" />
                                <label className="text-danger">Token will only appear here, once.</label>
                            </div>
                            <div className="col-md-4">
                                <br />
                                <br />
                                <button className="btn btn-success" onClick={() => { this.generateAPIKey() }}>Generate</button>
                                <button className="ml-3 btn btn-info" onClick={() => { this.copyAccessToken() }}>Copy</button>
                            </div>
                        </div>

                        <div className="row  ml-0 mr-0 mt-5">
                            <div className="col-12">
                                <table className="table table-hover table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>Token Name</th>
                                            <th>Created At</th>
                                            <th>Expires At</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.apiKeys.map(apiKey => {
                                            return <tr key={apiKey.id}>
                                                <td>
                                                    {apiKey.name}
                                                </td>
                                                <td>
                                                    {moment(apiKey.created_at).format("YYYY-MM-DD")}
                                                </td>
                                                <td>
                                                    {moment(apiKey.expires_at).format("YYYY-MM-DD")}
                                                </td>
                                                <td>
                                                    <button className="btn gaa-btn-danger btn-sm" type="button" onClick={this.handleDelete} data-token-id={apiKey.id}><i className="fa fa-trash"></i></button>
                                                </td>
                                            </tr>
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-12"></div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

}