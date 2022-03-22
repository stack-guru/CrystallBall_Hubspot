import React from 'react';

export default function PromotionPopup(props) {
    if (!props.show) return null;

    return <div className="promo-pop-container" onClick={() => { (props.togglePopupCallback)(); }}>
        <div className="promo-pop-image-holder" >
            <div >
                <a href={props.promotionLink} target="_blank">
                    <img className="promo-pop-image" src={props.promotionImage} />
                </a>
            </div>
        </div>
    </div>
}