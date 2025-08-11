export default class Theme {
    constructor(gantt) {
        this.gantt = gantt;
        this.current_theme = localStorage.getItem('gantt-theme') || 'auto';
        this.init();
    }

    init() {
        this.create_theme_button();
        this.apply_theme(this.current_theme);
    }

    create_theme_button() {
        this.$theme_icon = this.gantt.create_el({
            classes: 'theme-icon',
            append_to: this.gantt.$side_header,
        });

        this.$theme_icon.onclick = this.toggle_theme.bind(this);
    }

    toggle_theme() {
        if (this.current_theme === 'auto') {
            this.current_theme = 'light';
        } else {
            this.current_theme =
                this.current_theme === 'light' ? 'dark' : 'light';
        }

        localStorage.setItem('gantt-theme', this.current_theme);
        this.apply_theme(this.current_theme);
    }

    apply_theme(theme) {
        this.gantt.$main_container.classList.remove(
            'theme-light',
            'theme-dark',
            'theme-auto',
        );

        this.gantt.$main_container.classList.add(`theme-${theme}`);
        this.update_theme_button(theme);
    }

    update_theme_button(theme) {
        const icons = {
            auto: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                     <circle cx="12" cy="12" r="9" stroke-width="2"/>
                     <path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" stroke="none" opacity="0.7"/>
                   </svg>`,
            light: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="4"/>
                      <path d="m12 2 0 2"/>
                      <path d="m12 20 0 2"/>
                      <path d="m4.93 4.93 1.41 1.41"/>
                      <path d="m17.66 17.66 1.41 1.41"/>
                      <path d="m2 12 2 0"/>
                      <path d="m20 12 2 0"/>
                      <path d="m6.34 17.66-1.41 1.41"/>
                      <path d="m19.07 4.93-1.41 1.41"/>
                    </svg>`,
            dark: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                     <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                   </svg>`,
        };

        const titles = {
            auto: 'Theme: Auto (click for Light)',
            light: 'Theme: Light (click for Dark)',
            dark: 'Theme: Dark (click for Light)',
        };

        this.$theme_icon.innerHTML = icons[theme];
        this.$theme_icon.title = titles[theme];
    }
}
