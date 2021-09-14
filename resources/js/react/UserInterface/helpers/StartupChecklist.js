import React, { Component } from 'react'
import HttpClient from "../utils/HttpClient";

import './StartupChecklist.css';

export default class StartupChecklist extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isExpanded: false,
            userChecklistItems: []
        };

        this.toggleView = this.toggleView.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.loadUserChecklistItems = this.loadUserChecklistItems.bind(this);
    }

    toggleView() {
        this.setState({ isExpanded: !this.state.isExpanded });
    }

    componentDidMount() {
        this.loadUserChecklistItems();
    }

    loadUserChecklistItems() {
        HttpClient.get('/user-checklist-item').then(resp => {
            this.setState({ userChecklistItems: resp.data.user_checklist_items });
        }, (err) => {
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
            this.setState({ isBusy: false, errors: err });
        });
    }

    handleUpdate(userChecklistItem) { }


    handleDelete(userChecklistItemId) {
        HttpClient.delete('/user-checklist-item/' + userChecklistItemId).then(resp => {
            this.setState({ userChecklistItems: resp.data.user_checklist_items.filter(uCI => uCI.id !== userChecklistItemId) });
        }, (err) => {
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
            this.setState({ isBusy: false, errors: err });
        });
    }

    render() {
        if (!this.state.isExpanded) {
            return (
                <button onClick={this.toggleView} className="btn gaa-btn-primary btn-rounded floating-checklist-button">
                    <span className="incomplete-checklist-items-count">{this.state.userChecklistItems.length}</span>
                    <i className="fa fa-check-square-o"></i>
                </button>
            )
        }
        return (
            <div className="right-checklist-pane">
                <div className="top-area">
                    <div className="text-right">
                        <i className="fa fa-times" onClick={this.toggleView}></i>
                    </div>
                    <h3>Complete your Onboarding</h3>
                </div>
                <div className="body-area">
                    <ul>
                        {this.state.userChecklistItems.map(uCI => {
                            return <li key={uCI.id} className={"gaa-text-primary" + (uCI.completed_at !== null ? " completed" : "") + (uCI.last_viewed_at !== null ? " read" : "")}>
                                uCI.checklist_item.label
                                {uCI.checklist_item.url ?
                                    <a title={uCI.checklist_item.description} href={uCI.checklist_item.url}><i className="fa fa-link"></i></a>
                                    :
                                    null
                                }
                            </li>;
                        })}
                    </ul>
                </div>
            </div>
        )
    }
}