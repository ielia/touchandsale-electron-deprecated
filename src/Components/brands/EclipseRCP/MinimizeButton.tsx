import React from 'react';

import './_MinimizeButton.scss';
import MinimizeButton from '../../MinimizeButton';

export default class EclipseRCPMinimizeButton extends MinimizeButton {
    render() {
        const {onClick} = this.props;
        return (
            <svg className="minimize-button" viewBox="0 0 100 100" preserveAspectRatio="xMinYMin" onClick={onClick} onTouchEnd={onClick}>
                <path d="M 20 20 H 80 V 40 H 20 Z"/>
            </svg>
        );
    }
};
