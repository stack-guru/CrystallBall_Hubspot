import React from 'react';

export default function PromotionPopup(props) {
    if (!props.show) return null;

    return <div className="promo-pop-container">
        <div className="promo-pop-image-holder" onClick={props.togglePopupCallback}>
            <div >
                <a href={props.promotionLink}>
                    <img className="promo-pop-image" src={props.promotionImage} target="_blank" />
                </a>
            </div>
        </div>
    </div>
}