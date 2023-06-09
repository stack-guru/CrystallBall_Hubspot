import React from 'react';
export default class ShowChartAnnotation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }


    }

    render() {
        return (
            <div className="popupContent modal-showChart">
                <div className="apps-modalHead d-flex flex-row">
                    <figure className='theme-insights'><img src='/insights.jpeg' alt='image'/></figure>
                    <div className='flex-grow-1 d-flex flex-column'>
                        <h3>Developed radical application | Website update</h3>
                        <p className='mb-0'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean elementum nulla consectetur euismod tristique. Curabitur fermentum eros non elit elementum, aliquet vestibulum metus mollis. Proin ac aliquam quam. Quisque vestibulum tincidunt quam sit amet porttitor. Aenean eleifend egestas ante, eget vulputate arcu venenatis sit amet. Aenean sit amet magna dolor. Donec at lacus in erat iaculis lacinia.</p>
                    </div>
                </div>
                <div className="apps-bodyContent">
                    <div className='contentHead flex-grow-1 d-flex justify-content-between align-items-center'>
                        <div className='themeNewInputGroup themeNewselect'>
                            <select name="category" id="category" className="form-control">
                                <option value="select-category">Select</option>
                                <option value="select-category">Select</option>
                                <option value="select-category">Select</option>
                            </select>
                        </div>
                        <span onClick={this.props.closeModal} className="btn-close"><img className="inject-me" src="/close-icon.svg" width="26" height="26" alt="menu icon"/></span>
                    </div>

                    <div className='theme-chart m-0'><img src='/chart-placeholder.png' alt='image'/></div>
                </div>
            </div>
        );
    }
}
