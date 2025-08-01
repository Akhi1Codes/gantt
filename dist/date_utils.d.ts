declare namespace _default {
    /**
     * Parse a duration string into duration and scale components
     * @param {string} duration - Duration string like "3d", "1w", "2h"
     * @returns {{duration: number, scale: string}} Object with duration number and scale string
     */
    function parse_duration(duration: string): {
        duration: number;
        scale: string;
    };
    /**
     * Parse a date string or Date object into a Date object
     * @param {string|Date} date - Date string or Date object to parse
     * @param {string} [date_separator='-'] - Date separator character
     * @param {RegExp|string} [time_separator=/[.:]/] - Time separator pattern
     * @returns {Date} Parsed Date object
     */
    function parse(date: string | Date, date_separator?: string, time_separator?: RegExp | string): Date;
    function to_string(date: any, with_time?: boolean): string;
    /**
     * Format a date according to the specified format string
     * @param {Date} date - Date to format
     * @param {string} [date_format='YYYY-MM-DD HH:mm'] - Format string (e.g., 'YYYY-MM-DD', 'MMM D')
     * @param {string} [lang='en'] - Language code for localization
     * @returns {string} Formatted date string
     */
    function format(date: Date, date_format?: string, lang?: string): string;
    function diff(date_a: any, date_b: any, scale?: string): number;
    function today(): Date;
    function now(): Date;
    function add(date: any, qty: any, scale: any): Date;
    function start_of(date: any, scale: any): Date;
    function clone(date: any): Date;
    function get_date_values(date: any): any[];
    function convert_scales(period: any, to_scale: any): number;
    function get_days_in_month(date: any): number;
    function get_days_in_year(date: any): 365 | 366;
}
export default _default;
