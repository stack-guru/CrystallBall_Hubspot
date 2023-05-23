import React from "react";

class ShareSuccessPopup extends React.Component{

    render(){

        return(
            <>
                <div className="successfull-share-conrainer">
                    <div className="">
                        <img src="/images/svg/share-success.svg" alt="share success" />
                    </div>
                    <div className="">
                        <h2 className="report-success-text">Report sent successfully!</h2>               
                    </div>
                    <div>
                        <button className="`btn btn-outline btn-sm btnCornerRounded share-another-btn ">Share another</button>
                        <button className="`btn btn-outline btn-sm btnCornerRounded share-another-btn ">Close</button>
                    </div>
                </div>
            </>
        )
    }
}

export default ShareSuccessPopup