import React from 'react';


class footer extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <footer className="bdT ta-c p-30 lh-0 fsz-sm c-grey-600" style={{ zIndex: 0 }}>
                    <span>Copyright © 2019 Designed by
                        <a href="https://colorlib.com" target="_blank" title="Colorlib">Colorlib</a>.
                        All rights reserved.</span>
                </footer>
            </div>
        );
    }
}
export default footer;
