export default class Label {
    constructor(gantt, labels) {
        this.gantt = gantt;
        this.labels = Array.isArray(labels) ? labels : [];
        this.setup_labels();
        this.isVisible = false;
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
        this.create_settings_dropdown($settings_icon);
        $settings_icon.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle_settings_dropdown();
        });

        $label_header.appendChild($settings_icon);
        this.$label_field.appendChild($label_header);
        document.addEventListener('click', (e) => {
            if (this.$settings_dropdown && !$settings_icon.contains(e.target)) {
                this.hide_settings_dropdown();
            }
        });
    }

    create_settings_dropdown($parent) {
        this.$settings_dropdown = document.createElement('div');
        this.$settings_dropdown.classList.add('gantt-label-settings-dropdown');
        this.$settings_dropdown.style.display = 'none';
        this.visibleHeaders = new Set(this.labelHeaders);
        
        const $dropdown_header = document.createElement('div');
        $dropdown_header.classList.add('dropdown-header');
        $dropdown_header.textContent = 'Show/Hide Columns';
        this.$settings_dropdown.appendChild($dropdown_header);
        
        this.labelHeaders.forEach((header, index) => {
            const $checkbox_item = document.createElement('div');
            $checkbox_item.classList.add('checkbox-item');
            
            const $checkbox = document.createElement('input');
            $checkbox.type = 'checkbox';
            $checkbox.id = `header-${index}`;
            $checkbox.checked = true;
            $checkbox.addEventListener('change', () => {
                this.toggle_header_visibility(header, $checkbox.checked);
            });
            
            const $label = document.createElement('label');
            $label.htmlFor = `header-${index}`;
            $label.textContent = header;
            
            $checkbox_item.appendChild($checkbox);
            $checkbox_item.appendChild($label);
            this.$settings_dropdown.appendChild($checkbox_item);
        });
        
        $parent.appendChild(this.$settings_dropdown);
    }

    toggle_settings_dropdown() {
        if (this.$settings_dropdown.style.display === 'none') {
            this.show_settings_dropdown();
        } else {
            this.hide_settings_dropdown();
        }
    }

    show_settings_dropdown() {
        this.$settings_dropdown.style.display = 'block';
    }

    hide_settings_dropdown() {
        this.$settings_dropdown.style.display = 'none';
        this.$settings_dropdown.parentElement.classList.remove('dropdown-above');
    }

    toggle_header_visibility(header, isVisible) {
        console.log(`Toggling header '${header}' to ${isVisible ? 'visible' : 'hidden'}`);
        if (isVisible) {
            this.visibleHeaders.add(header);
        } else {
            this.visibleHeaders.delete(header);
        }
        console.log('Current visibleHeaders:', Array.from(this.visibleHeaders));
        this.refresh_label_display();
    }

    refresh_label_display() {
        // Remove existing headers and content
        const $existing_header = this.$label_field.querySelector('.gantt-labels-header');
        const $existing_scroll = this.$label_field.querySelector('.gantt-labels-scroll');
        
        if ($existing_header) $existing_header.remove();
        if ($existing_scroll) $existing_scroll.remove();
        
        // Recreate with only visible headers
        this.create_headers_row();
        this.create_values_area();
        this.setup_scroll_sync();
    }

    create_headers_row() {
        const $labels_header = document.createElement('div');
        $labels_header.classList.add('gantt-labels-header');
        $labels_header.style.display = 'flex';
        $labels_header.style.flex = '0 0 auto';

        // Add only visible headers
        if (this.labelHeaders && this.labelHeaders.length > 0) {
            this.labelHeaders.forEach((header) => {
                if (this.visibleHeaders && this.visibleHeaders.has(header)) {
                    const $header = document.createElement('div');
                    $header.classList.add('gantt-labels-col');
                    $header.textContent = header;
                    $header.title = header;
                    $labels_header.appendChild($header);
                }
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

        if (this.labelHeaders && this.labelHeaders.length > 0) {
            this.labelHeaders.forEach((header, colIdx) => {
                if (this.visibleHeaders && this.visibleHeaders.has(header)) {
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
                }
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
                this.gantt._isSyncingLabelScroll = true;
                this.gantt.$container.scrollTop = this.$labels_scroll.scrollTop;
                this.gantt._isSyncingLabelScroll = false;
                isSyncingScroll = false;
            });

            this.gantt.$container.addEventListener('scroll', () => {
                if (isSyncingScroll) return;
                isSyncingScroll = true;
                this.gantt._isSyncingLabelScroll = true;
                this.$labels_scroll.scrollTop = this.gantt.$container.scrollTop;
                this.gantt._isSyncingLabelScroll = false;
                isSyncingScroll = false;
            });
        }
    }

    save_state() {
        // Save the current state for restoration after re-render
        console.log('Saving label state:', {
            isVisible: this.isVisible,
            visibleHeaders: this.visibleHeaders ? Array.from(this.visibleHeaders) : null,
            labels: this.labels
        });
        return {
            isVisible: this.isVisible,
            visibleHeaders: this.visibleHeaders ? new Set(this.visibleHeaders) : null,
            labels: this.labels
        };
    }

    restore_state(state) {
        // Restore the saved state after re-render
        console.log('Restoring label state:', {
            state: state,
            currentLabelField: !!this.$label_field,
            labelFieldAttached: this.$label_field ? !!this.$label_field.parentNode : false
        });
        
        if (state) {
            this.labels = state.labels || [];
            this.setup_labels();
            
            if (state.visibleHeaders) {
                this.visibleHeaders = new Set(state.visibleHeaders);
                console.log('Restored visibleHeaders:', Array.from(this.visibleHeaders));
            }
            
            if (state.isVisible) {
                // If the label field was removed during re-render, recreate it
                if (!this.$label_field || !this.$label_field.parentNode) {
                    console.log('Label field was removed, recreating...');
                    this.create_label_field();
                } else {
                    console.log('Label field exists, refreshing display...');
                    // Just refresh the display with the preserved visible headers
                    this.refresh_label_display();
                }
                this.isVisible = true;
                if (this.$label_field) {
                    this.$label_field.style.display = 'flex';
                }
            }
        }
    }

    toggle() {
        if (!this.$label_field) {
            this.create_label_field();
        }
        if (this.$label_field.style.display === 'none' || !this.isVisible) {
            this.show();
        } else {
            this.hide();
        }
    }

    show() {
        if (!this.$label_field) {
            this.create_label_field();
        }
        this.$label_field.style.display = 'flex';
        this.isVisible = true;
    }

    hide() {
        if (this.$label_field) {
            this.$label_field.style.display = 'none';
        }
        this.isVisible = false;
    }

    remove() {
        if (this.$label_field) {
            this.$label_field.remove();
            this.$label_field = null;
        }
        // Note: Don't reset isVisible here as it should be preserved for state restoration
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