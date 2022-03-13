import React from 'react';

import './_MaximizeButton.scss';
import MaximizeButton from '../../MaximizeButton';

export default class EclipseRCPMaximizeButton extends MaximizeButton {
    render() {
        const {onClick} = this.props;
        return (
            <svg className="maximize-button" viewBox="0 0 100 100" preserveAspectRatio="xMinYMin" onClick={onClick} onTouchEnd={onClick}>
                <path d="M 20 20 H 80 V 35 H 20 Z"/>
                <path d="M 20 35 H 80 V 80 H 20 Z"/>
            </svg>
        );
    }
};
