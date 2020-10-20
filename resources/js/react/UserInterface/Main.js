import React from 'react';
import ReactDOM from 'react-dom';
import Sidebar from "./layout/sidebar";
import Header from "./layout/header";
import Index from "./Components/index";
import Footer from "./layout/footer"

 class Main extends React.Component{

    constructor() {
        super();
    }

render() {
        return(
            <div className="layout-wrapper" style={{margin: '0%',}}>

                <div className="sidebar">
                    <Sidebar/>

                </div>




                <div className="page-container">


                    <div className="header navbar">
                        <Header/>

                    </div>


                    <main className="main-content bgc-grey-100">

                        <Index/>
                    </main>


                    <Footer/>

                </div>
            </div>
        )
}
}
export default Main;

if (document.getElementById('ui')) {
    ReactDOM.render(<Main />, document.getElementById('ui'));
}
