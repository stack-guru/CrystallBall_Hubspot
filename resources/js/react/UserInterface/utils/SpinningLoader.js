import React from 'react'

export default function SpinningLoader(props) {
    return <div class="d-flex justify-content-center">
        <div class="spinner-border gaa-text-primary" role="status">
            <span class="sr-only">Loading...</span>
        </div>
    </div>
}