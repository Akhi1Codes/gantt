export default class Theme {
    constructor(gantt: any);
    gantt: any;
    current_theme: string;
    init(): void;
    create_theme_button(): void;
    $theme_icon: any;
    toggle_theme(): void;
    apply_theme(theme: any): void;
    update_theme_button(theme: any): void;
}
