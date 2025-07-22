export default class Label {
    constructor(gantt, labels) {
        this.gantt = gantt;
        this.labels = Array.isArray(labels) ? labels : [];
        this.setup_labels();
    }

    setup_labels() {
        this.labelHeaders = [];
        this.labelColumns = [];

        const labelMap = new Map();

        this.labels.forEach(labelObj => {
            Object.entries(labelObj).forEach(([header, values]) => {
                if (!labelMap.has(header)) {
                    labelMap.set(header, Array.isArray(values) ? values : []);
                }
            });
        });

        // Populate headers and values
        this.labelHeaders = Array.from(labelMap.keys());
        this.labelColumns = Array.from(labelMap.values());
    }

    create_label_field() {
        if (this.$label_field) {
            this.$label_field.remove();
        }

        this.$label_field = document.createElement('div');
        this.$label_field.classList.add('gantt-label-field');

        this.create_upper_header();
        this.create_headers_row();
        this.create_values_area();
        this.setup_scroll_sync();

        this.gantt.$main_container.prepend(this.$label_field);
    }

    create_upper_header() {
        const $label_header = document.createElement('div');
        $label_header.classList.add('gantt-label-upperheader');

        const $settings_icon = document.createElement('span');
        $settings_icon.classList.add('gantt-label-settings');
        $settings_icon.title = 'Settings';
        $settings_icon.innerHTML = `
<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
     xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
  <line x1="4" y1="21" x2="4" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="4" y1="10" x2="4" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="12" y1="21" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="12" y1="8" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="20" y1="21" x2="20" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="20" y1="12" x2="20" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <circle cx="4" cy="12" r="2" fill="none" stroke="currentColor" stroke-width="2"/>
  <circle cx="12" cy="8" r="2" fill="none" stroke="currentColor" stroke-width="2"/>
  <circle cx="20" cy="16" r="2" fill="none" stroke="currentColor" stroke-width="2"/>
</svg>
`;
        $label_header.appendChild($settings_icon);
        this.$label_field.appendChild($label_header);
    }

    create_headers_row() {
        const $labels_header = document.createElement('div');
        $labels_header.classList.add('gantt-labels-header');
        $labels_header.style.display = 'flex';
        $labels_header.style.flex = '0 0 auto';

        // Add headers if available
        if (this.labelHeaders && this.labelHeaders.length > 0) {
            this.labelHeaders.forEach((header) => {
                const $header = document.createElement('div');
                $header.classList.add('gantt-labels-col');
                $header.textContent = header;
                $header.title = header;
                $labels_header.appendChild($header);
            });
        }

        this.$label_field.appendChild($labels_header);
    }

    create_values_area() {
        // Scrollable container for values
        this.$labels_scroll = document.createElement('div');
        this.$labels_scroll.classList.add('gantt-labels-scroll');
        this.$labels_scroll.style.flex = '1 1 auto';
        this.$labels_scroll.style.overflowY = 'auto';
        this.$labels_scroll.style.height = '100%';

        const $labels_content = document.createElement('div');
        $labels_content.classList.add('gantt-labels-content');
        $labels_content.style.display = 'flex';

        // Add value columns if headers/columns are available
        if (this.labelHeaders && this.labelHeaders.length > 0) {
            this.labelHeaders.forEach((header, colIdx) => {
                const $col = document.createElement('div');
                $col.classList.add('gantt-labels-col');

                const values = this.labelColumns[colIdx];
                if (Array.isArray(values)) {
                    values.forEach(val => {
                        const $val = document.createElement('div');
                        $val.classList.add('gantt-labels-cell');

                        const $text = document.createElement('span');
                        $text.classList.add('gantt-labels-cell-text');
                        $text.textContent = val;
                        $text.title = val;

                        const height = this.gantt.options.bar_height + this.gantt.options.padding;
                        $val.style.height = height + 'px';

                        $val.appendChild($text);
                        $col.appendChild($val);
                    });
                }

                $labels_content.appendChild($col);
            });
        }

        this.$labels_scroll.appendChild($labels_content);
        this.$label_field.appendChild(this.$labels_scroll);
    }

    setup_scroll_sync() {
        // Sync scroll between labels and gantt container
        if (this.$labels_scroll && this.gantt.$container) {
            let isSyncingScroll = false;

            this.$labels_scroll.addEventListener('scroll', () => {
                if (isSyncingScroll) return;
                isSyncingScroll = true;
                this.gantt.$container.scrollTop = this.$labels_scroll.scrollTop;
                isSyncingScroll = false;
            });

            this.gantt.$container.addEventListener('scroll', () => {
                if (isSyncingScroll) return;
                isSyncingScroll = true;
                this.$labels_scroll.scrollTop = this.gantt.$container.scrollTop;
                isSyncingScroll = false;
            });
        }
    }

    toggle() {
        if (!this.$label_field) {
            this.create_label_field();
        }
        if (this.$label_field.style.display === 'none') {
            this.$label_field.style.display = 'flex';
        } else {
            this.$label_field.style.display = 'none';
        }
    }

    show() {
        if (!this.$label_field) {
            this.create_label_field();
        }
        this.$label_field.style.display = 'flex';
    }

    hide() {
        if (this.$label_field) {
            this.$label_field.style.display = 'none';
        }
    }

    remove() {
        if (this.$label_field) {
            this.$label_field.remove();
            this.$label_field = null;
        }
    }

    update_labels(labels) {
        this.labels = Array.isArray(labels) ? labels : [];
        this.setup_labels();
        if (this.$label_field && this.$label_field.style.display !== 'none') {
            this.remove();
            this.create_label_field();
        }
    }
} 