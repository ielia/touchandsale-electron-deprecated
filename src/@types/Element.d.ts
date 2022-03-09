/**
 * Adding outerHeight/Width to Element.
 */
interface Element {
    outerHeight: (includingMargins?: boolean) => number;
    outerWidth: (includingMargins?: boolean) => number;
}