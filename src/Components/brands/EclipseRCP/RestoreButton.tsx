import React from 'react';

import './_RestoreButton.scss';
import RestoreButton from '../../RestoreButton';

export default class EclipseRCPRestoreButton extends RestoreButton {
    render() {
        const {onClick} = this.props;
        return (
            <svg className="restore-button" viewBox="0 0 100 100" preserveAspectRatio="xMinYMin" onClick={onClick} onTouchEnd={onClick}>
                <path className="restore-button-window-handle" d="M 50 20 H 80 V 30 H 50 Z"/>
                <path className="restore-button-window-body" d="M 50 30 H 80 V 50 H 50 Z"/>
                <path className="restore-button-window-handle" d="M 30 40 H 60 V 50 H 30 Z"/>
                <path className="restore-button-window-body" d="M 30 50 H 60 V 70 H 30 Z"/>
            </svg>
        );
    }
};
