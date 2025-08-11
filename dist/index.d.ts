/**
 * Main Gantt chart class for creating interactive project timelines
 * @class
 */
declare class Gantt {
    /**
     * Create a new Gantt chart instance
     * @param {string|HTMLElement|SVGElement} wrapper - CSS selector string, HTML element, or SVG element to render the chart
     * @param {Task[]} tasks - Array of task objects
     * @param {GanttOptions} [options] - Chart configuration options
     */
    constructor(wrapper: string | HTMLElement | SVGElement, tasks: Task[], options?: GanttOptions);
    setup_wrapper(element: any): void;
    $main_container: any;
    $container: any;
    $svg: any;
    $popup_wrapper: any;
    setup_options(options: any): void;
    original_options: any;
    options: any;
    config: {
        ignored_dates: any[];
        ignored_positions: any[];
        extend_by_units: number;
    };
    /**
     * Update chart options and re-render
     * @param {Partial<GanttOptions>} options - New options to merge with existing options
     */
    update_options(options: Partial<GanttOptions>): void;
    setup_tasks(tasks: any): void;
    tasks: any;
    setup_dependencies(): void;
    dependency_map: {};
    /**
     * Refresh the chart with new tasks
     * @param {Task[]} tasks - Array of new task objects
     */
    refresh(tasks: Task[]): void;
    /**
     * Update an existing task with new details
     * @param {string} id - Task ID to update
     * @param {Partial<Task>} new_details - New task properties to merge
     */
    update_task(id: string, new_details: Partial<Task>): void;
    /**
     * Change the view mode of the gantt chart
     * @param {string|ViewMode} [mode] - View mode name or view mode object
     * @param {boolean} [maintain_pos=false] - Whether to maintain scroll position
     */
    change_view_mode(mode?: string | ViewMode, maintain_pos?: boolean): void;
    update_view_scale(mode: any): void;
    setup_dates(refresh?: boolean): void;
    setup_gantt_dates(refresh: any): void;
    gantt_start: any;
    gantt_end: any;
    setup_date_values(): void;
    dates: any[];
    bind_events(): void;
    render(): void;
    _preserveLabelState: boolean;
    setup_layers(): void;
    layers: {};
    $extras: any;
    $adjust: any;
    make_grid(): void;
    make_grid_extras(): void;
    make_grid_background(): void;
    grid_height: number;
    make_grid_rows(): void;
    make_grid_header(): void;
    $header: any;
    $upper_header: any;
    $lower_header: any;
    make_side_header(): void;
    $side_header: any;
    $today_button: any;
    $label_button: any;
    $expected_line_button: any;
    theme: Theme;
    make_side_bar(): void;
    $sidebar: any;
    make_grid_ticks(): void;
    highlight_holidays(): void;
    /**
     * Compute the horizontal x-axis distance and associated date for the current date and view.
     *
     * @returns Object containing the x-axis distance and date of the current date, or null if the current date is out of the gantt range.
     */
    highlight_current(): void;
    $current_highlight: any;
    $current_ball_highlight: any;
    make_grid_highlights(): void;
    create_el({ left, top, width, height, id, classes, append_to, type }: {
        left: any;
        top: any;
        width: any;
        height: any;
        id: any;
        classes: any;
        append_to: any;
        type: any;
    }): any;
    make_dates(): void;
    upperTexts: any[];
    get_dates_to_draw(): {
        date: any;
        formatted_date: any;
        column_width: any;
        x: any;
        upper_text: any;
        lower_text: any;
        upper_y: number;
        lower_y: any;
    }[];
    get_date_info(date: any, last_date_info: any): {
        date: any;
        formatted_date: any;
        column_width: any;
        x: any;
        upper_text: any;
        lower_text: any;
        upper_y: number;
        lower_y: any;
    };
    make_bars(): void;
    bars: any;
    make_arrows(): void;
    arrows: any;
    map_arrows_on_bars(): void;
    set_dimensions(): void;
    set_scroll_position(date: any): void;
    current_date: Date;
    $current: any;
    scroll_current(): void;
    get_closest_date(): any[];
    update_current_date_display(): void;
    bind_grid_click(): void;
    bind_holiday_labels(): void;
    get_start_end_positions(): any[];
    bind_bar_events(): void;
    bar_being_dragged: boolean;
    bind_bar_progress(): void;
    get_all_dependent_tasks(task_id: any): any[];
    get_snap_position(dx: any, ox: any): number;
    get_ignored_region(pos: any, drn?: number): any[];
    unselect_all(): void;
    view_is(modes: any): boolean;
    get_task(id: any): any;
    get_bar(id: any): any;
    /**
     * Show popup for a task
     * @param {Object} opts - Popup options including task and position
     */
    show_popup(opts: any): void;
    popup: Popup;
    hide_popup(): void;
    trigger_event(event: any, args: any): void;
    /**
     * Gets the oldest starting date from the list of tasks
     * @returns {Date} The oldest starting date
     */
    get_oldest_starting_date(): Date;
    /**
     * Clear all elements from the parent svg element
     */
    clear(): void;
    setup_labels(labels: any): void;
    toggle_label_field(): void;
    toggle_expected_lines(): void;
    init_label(labels: any): void;
    label: Label;
}
declare namespace Gantt {
    namespace VIEW_MODE {
        namespace HOUR {
            let name: string;
            let padding: string;
            let step: string;
            let date_format: string;
            let column_width: number;
            let lower_text: string | Function;
            let upper_text: string | Function;
            let thick_line: Function;
            let snap_at: string;
        }
        namespace QUARTER_DAY { }
        namespace HALF_DAY { }
        namespace DAY { }
        namespace WEEK { }
        namespace MONTH { }
        namespace YEAR { }
    }
}
export default Gantt;
export type Task = {
    /**
     * - Unique identifier for the task
     */
    id: string;
    /**
     * - Display name of the task
     */
    name: string;
    /**
     * - Start date of the task
     */
    start: string | Date;
    /**
     * - End date of the task
     */
    end?: string | Date;
    /**
     * - Duration string (e.g., "3d", "1w") - alternative to end date
     */
    duration?: string;
    /**
     * - Progress percentage (0-100)
     */
    progress?: number;
    /**
     * - Array of task IDs this task depends on
     */
    dependencies?: string[];
    /**
     * - Custom CSS class for styling
     */
    custom_class?: string;
    /**
     * - Task description shown in popup
     */
    description?: string;
    /**
     * - Expected start date for comparison
     */
    expected_start?: string | Date;
    /**
     * - Expected end date for comparison
     */
    expected_end?: string | Date;
};
export type ViewMode = {
    /**
     * - Name of the view mode
     */
    name: string;
    /**
     * - Padding around the gantt chart
     */
    padding: string;
    /**
     * - Time step for each column
     */
    step: string;
    /**
     * - Date format string
     */
    date_format?: string;
    /**
     * - Width of each column in pixels
     */
    column_width?: number;
    /**
     * - Lower header text format or function
     */
    lower_text?: string | Function;
    /**
     * - Upper header text format or function
     */
    upper_text?: string | Function;
    /**
     * - Function to determine thick lines
     */
    thick_line?: Function;
    /**
     * - Snap granularity for dragging
     */
    snap_at?: string;
};
export type GanttOptions = {
    /**
     * - Curve amount for dependency arrows
     */
    arrow_curve?: number;
    /**
     * - Auto move labels on scroll
     */
    auto_move_label?: boolean;
    /**
     * - Corner radius for task bars
     */
    bar_corner_radius?: number;
    /**
     * - Height of task bars in pixels
     */
    bar_height?: number;
    /**
     * - Height of container or 'auto'
     */
    container_height?: number | string;
    /**
     * - Width of time columns
     */
    column_width?: number;
    /**
     * - Default date format
     */
    date_format?: string;
    /**
     * - Height of upper header
     */
    upper_header_height?: number;
    /**
     * - Height of lower header
     */
    lower_header_height?: number;
    /**
     * - Snap granularity for dragging
     */
    snap_at?: string;
    /**
     * - Enable infinite scrolling
     */
    infinite_padding?: boolean;
    /**
     * - Holiday highlighting configuration
     */
    holidays?: any;
    /**
     * - Dates to ignore/exclude
     */
    ignore?: string[] | Function;
    /**
     * - Language for date formatting
     */
    language?: string;
    /**
     * - Grid lines: 'both', 'vertical', 'horizontal', 'none'
     */
    lines?: string;
    /**
     * - Move dependent tasks when dragging
     */
    move_dependencies?: boolean;
    /**
     * - Padding between task bars
     */
    padding?: number;
    /**
     * - Popup configuration function or false to disable
     */
    popup?: Function | boolean;
    /**
     * - When to show popup: 'click' or 'hover'
     */
    popup_on?: string;
    /**
     * - Disable progress editing
     */
    readonly_progress?: boolean;
    /**
     * - Disable date editing
     */
    readonly_dates?: boolean;
    /**
     * - Make entire chart read-only
     */
    readonly?: boolean;
    /**
     * - Initial scroll position
     */
    scroll_to?: string | Date;
    /**
     * - Show expected progress indicators
     */
    show_expected_progress?: boolean;
    /**
     * - Show expected date lines
     */
    expected_date_line?: boolean;
    /**
     * - Show today navigation button
     */
    today_button?: boolean;
    /**
     * - Show label toggle button
     */
    label_button?: boolean;
    /**
     * - Enable label filtering
     */
    label_filter?: boolean;
    /**
     * - Show expected lines toggle
     */
    expected_line_button?: boolean;
    /**
     * - Default view mode name
     */
    view_mode?: string;
    /**
     * - Show view mode selector
     */
    view_mode_select?: boolean;
    /**
     * - Available view modes
     */
    view_modes?: ViewMode[];
    /**
     * - Click event handler
     */
    on_click?: Function;
    /**
     * - Date change event handler
     */
    on_date_change?: Function;
    /**
     * - Progress change event handler
     */
    on_progress_change?: Function;
    /**
     * - View mode change event handler
     */
    on_view_change?: Function;
    /**
     * - Label configuration
     */
    labels?: any;
};
import Theme from './theme';
import Popup from './popup';
import Label from './label';
