export function $(expr: any, con: any): any;
export namespace $ {
    function on(element: any, event: any, selector: any, callback: any): void;
    function off(element: any, event: any, handler: any): void;
    function bind(element: any, event: any, callback: any): void;
    function delegate(element: any, event: any, selector: any, callback: any): void;
    function closest(selector: any, element: any): any;
    function attr(element: any, attr: any, value: any): any;
}
export function createSVG(tag: any, attrs: any): any;
export function animateSVG(svgElement: any, attr: any, from: any, to: any): void;
