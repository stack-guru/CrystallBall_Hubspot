import React from 'react'

export default function SpinningLoader(props) {
    return <div className="d-flex justify-content-center">
        <div className="spinner-border gaa-text-primary" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    </div>
}