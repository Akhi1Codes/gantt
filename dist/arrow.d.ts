export default class Arrow {
    constructor(gantt: any, from_task: any, to_task: any);
    gantt: any;
    from_task: any;
    to_task: any;
    calculate_path(): void;
    path: string;
    draw(): void;
    element: any;
    update(): void;
}
