export default class Popup {
    constructor(parent: any, popup_func: any, gantt: any);
    parent: any;
    popup_func: any;
    gantt: any;
    make(): void;
    title: any;
    subtitle: any;
    details: any;
    actions: any;
    show({ x, y, task, target }: {
        x: any;
        y: any;
        task: any;
        target: any;
    }): void;
    hide(): void;
}
