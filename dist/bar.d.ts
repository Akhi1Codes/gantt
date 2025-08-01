/**
 * Represents a task bar in the Gantt chart
 * @class
 */
export default class Bar {
    /**
     * Create a new Bar instance
     * @param {import('./index.js').default} gantt - The parent Gantt chart instance
     * @param {import('./index.js').Task} task - The task data object
     */
    constructor(gantt: import("./index.js").default, task: import("./index.js").Task);
    /**
     * Refresh the bar display with current task data
     */
    refresh(): void;
    set_defaults(gantt: any, task: any): void;
    action_completed: boolean;
    gantt: any;
    task: any;
    name: any;
    prepare_wrappers(): void;
    group: any;
    bar_group: any;
    handle_group: any;
    prepare_values(): void;
    invalid: any;
    height: any;
    image_size: number;
    corner_radius: any;
    width: number;
    prepare_helpers(): void;
    prepare_expected_progress_values(): void;
    expected_progress_width: number;
    draw(): void;
    draw_bar(): void;
    $bar: any;
    draw_expected_progress_bar(): void;
    $expected_bar_progress: any;
    draw_progress_bar(): void;
    progress_width: any;
    $bar_progress: any;
    $date_highlight: any;
    calculate_progress_width(): number;
    draw_label(): void;
    draw_thumbnail(): void;
    draw_resize_handles(): void;
    handles: any[];
    $handle_progress: any;
    bind(): void;
    setup_click_event(): void;
    /**
     * Update the position and/or width of the task bar
     * @param {Object} params - Position parameters
     * @param {number} [params.x] - New x position
     * @param {number} [params.width] - New width
     */
    update_bar_position({ x, width }: {
        x?: number;
        width?: number;
    }): void;
    x: any;
    update_label_position_on_horizontal_scroll({ x, sx }: {
        x: any;
        sx: any;
    }): void;
    date_changed(): void;
    progress_changed(): void;
    set_action_completed(): void;
    compute_start_end_date(): {
        new_start_date: Date;
        new_end_date: Date;
    };
    compute_progress(): number;
    compute_expected_progress(): void;
    expected_progress: any;
    compute_x(): void;
    compute_y(): void;
    y: any;
    compute_duration(): void;
    duration: number;
    actual_duration_raw: number;
    ignored_duration_raw: number;
    update_attr(element: any, attr: any, value: any): any;
    update_expected_progressbar_position(): void;
    update_progressbar_position(): void;
    update_label_position(): void;
    update_handle_position(): void;
    update_arrow_position(): void;
    arrows: any;
    draw_expected_line(): void;
    $expected_line: any;
}
