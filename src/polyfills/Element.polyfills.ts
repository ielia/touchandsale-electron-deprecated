if (!Element.prototype.outerHeight) {
    Element.prototype.outerHeight = function(includingMargins?: boolean): number {
        if (includingMargins) {
            const style = getComputedStyle(this);
            return this.offsetHeight + parseInt(style.marginTop) + parseInt(style.marginBottom);
        } else {
            return this.offsetHeight;
        }
    };
}

if (!Element.prototype.outerWidth) {
    Element.prototype.outerWidth = function(includingMargins?: boolean): number {
        if (includingMargins) {
            const style = getComputedStyle(this);
            return this.offsetWidth + parseInt(style.marginLeft) + parseInt(style.marginRight);
        } else {
            return this.offsetWidth;
        }
    };
}
