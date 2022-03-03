if (!Element.prototype.outerHeight) {
    Element.prototype.outerHeight = function(includingMargins?: boolean): number {
        const style = getComputedStyle(this);
        return this.offsetHeight + (includingMargins ? parseInt(style.marginTop) + parseInt(style.marginBottom) : 0);
    };
}

if (!Element.prototype.outerWidth) {
    Element.prototype.outerWidth = function(includingMargins?: boolean): number {
        const style = getComputedStyle(this);
        return this.offsetWidth + (includingMargins ? parseInt(style.marginLeft) + parseInt(style.marginRight) : 0);
    };
}
