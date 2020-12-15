import React, { Component } from 'react'

const steps = [
    {
        selector: '.first-step',
        content: 'This is my first Step',
    },
    // ...
];

export default class InterfaceTour extends Component {
    render() {
        return (
            <>
                <Tour
                    steps={steps}
                    isOpen={isTourOpen}
                    onRequestClose={() => setIsTourOpen(false)}
                />
            </>
        )
    }
}
