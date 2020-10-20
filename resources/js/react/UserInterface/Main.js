import React from 'react';
import ReactDOM from 'react-dom';

 class Main extends React.Component{

    constructor() {
        super();
    }

render() {
        return(
            <div className="container">
                hello this annotation ui main file
            </div>
        )
}
}
export default Main;

if (document.getElementById('UI')) {
    ReactDOM.render(<Main />, document.getElementById('UI'));
}