/**
 * @typedef CompassCornerHeading Corner heading.
 */
type CompassCornerHeading = 'ne' | 'nw' | 'se' | 'sw';

/**
 * @typedef CompassHeading Simple compass heading.
 */
type CompassHeading = 'e' | 'n' | 's' | 'w';

/**
 * @typedef CompassOctoHeading 8-sided compass heading.
 */
type CompassOctoHeading = CompassCornerHeading | CompassHeading;
