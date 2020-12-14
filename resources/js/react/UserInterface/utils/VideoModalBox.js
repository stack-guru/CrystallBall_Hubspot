import React, { Component } from 'react'

export default class VideoModalBox extends Component {
    render() {
        return (
            <div
                className="modal fade"
                id={this.props.id}
                tabIndex="-1"
                role="dialog"
                aria-labelledby="exampleModalLongTitle"
                aria-hidden="true"
            >
                <div
                    className="modal-dialog modal-dialog-centered modal-lg"
                    role="document"
                >
                    <div className="modal-content"
                    >
                        <div className="modal-body">
                            <iframe
                                className="w-100 h-450px"
                                src={this.props.src}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
