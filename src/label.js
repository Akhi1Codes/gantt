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

        this.labels.forEach((labelObj) => {
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
        this.create_resize_handle();

        this.gantt.$main_container.prepend(this.$label_field);
    }

    create_upper_header() {
        const $label_header = document.createElement('div');
        $label_header.classList.add('gantt-label-upperheader');

        // Only show settings icon if label_filter option is enabled
        if (this.gantt.options.label_filter) {
            const $settings_icon = document.createElement('span');
            $settings_icon.classList.add('gantt-label-settings');
            $settings_icon.title = 'Only 3 columns can be selected at a time';
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

            this._clickOutsideHandler = (e) => {
                if (
                    this.$settings_dropdown &&
                    !$settings_icon.contains(e.target) &&
                    !this.$settings_dropdown.contains(e.target)
                ) {
                    this.hide_settings_dropdown();
                }
            };
            document.addEventListener('click', this._clickOutsideHandler);
        } else {
            // When label_filter is false, initialize visibleHeaders to show first 2 headers
            this.visibleHeaders = new Set(this.labelHeaders.slice(0, 2));
        }

        this.$label_field.appendChild($label_header);
    }

    create_settings_dropdown($parent) {
        this.$settings_dropdown = document.createElement('div');
        this.$settings_dropdown.classList.add('gantt-label-settings-dropdown');
        this.$settings_dropdown.style.display = 'none';
        this.visibleHeaders = new Set(this.labelHeaders.slice(0, 2));

        const $dropdown_header = document.createElement('div');
        $dropdown_header.classList.add('dropdown-header');
        $dropdown_header.textContent = 'Show/Hide Columns';
        this.$settings_dropdown.appendChild($dropdown_header);
        this._headerCheckboxes = [];

        const updateDropdownBackgrounds = () => {
            const checkedCount = this._headerCheckboxes.filter(
                (cb) => cb.checked,
            ).length;
            if (checkedCount === 3) {
                this.$settings_dropdown.classList.remove('no-bg');
            } else {
                this.$settings_dropdown.classList.add('no-bg');
            }
            const items =
                this.$settings_dropdown.querySelectorAll('.checkbox-item');
            items.forEach((item, idx) => {
                const cb = item.querySelector('input[type="checkbox"]');
                if (checkedCount === 3) {
                    if (cb && !cb.checked) {
                        item.classList.add('unselected');
                    } else {
                        item.classList.remove('unselected');
                    }
                } else {
                    item.classList.remove('unselected');
                }
            });
        };

        this.labelHeaders.forEach((header, index) => {
            const $checkbox_item = document.createElement('div');
            $checkbox_item.classList.add('checkbox-item');

            const $checkbox = document.createElement('input');
            $checkbox.type = 'checkbox';
            $checkbox.id = `header-${index}`;
            $checkbox.checked = index < 2;
            if (index < 2) this.visibleHeaders.add(header);
            else this.visibleHeaders.delete(header);

            this._headerCheckboxes.push($checkbox);

            $checkbox.addEventListener('change', () => {
                this.toggle_header_visibility(header, $checkbox.checked);
                this._enforce_max_three_headers();
                updateDropdownBackgrounds();
            });

            const $label = document.createElement('label');
            $label.htmlFor = `header-${index}`;
            $label.textContent = header;

            $checkbox_item.appendChild($checkbox);
            $checkbox_item.appendChild($label);
            this.$settings_dropdown.appendChild($checkbox_item);
        });

        $parent.appendChild(this.$settings_dropdown);
        this._enforce_max_three_headers();
        updateDropdownBackgrounds();
    }

    toggle_settings_dropdown() {
        if (!this.$settings_dropdown) return;
        
        if (this.$settings_dropdown.style.display === 'none') {
            this.show_settings_dropdown();
        } else {
            this.hide_settings_dropdown();
        }
    }

    show_settings_dropdown() {
        if (!this.$settings_dropdown) return;
        
        this.$settings_dropdown.style.display = 'block';

        const settingsIcon = this.$settings_dropdown.parentElement;
        const rect = settingsIcon.getBoundingClientRect();

        this.$settings_dropdown.style.position = 'fixed';
        this.$settings_dropdown.style.top = rect.bottom + 2 + 'px';
        this.$settings_dropdown.style.left = rect.left + 'px';
        this.$settings_dropdown.style.zIndex = '100000';
    }

    hide_settings_dropdown() {
        if (!this.$settings_dropdown) return;
        
        this.$settings_dropdown.style.display = 'none';

        this.$settings_dropdown.style.position = '';
        this.$settings_dropdown.style.top = '';
        this.$settings_dropdown.style.left = '';
    }

    toggle_header_visibility(header, isVisible) {
        if (isVisible) {
            this.visibleHeaders.add(header);
        } else {
            this.visibleHeaders.delete(header);
        }
        this.refresh_label_display();
    }

    refresh_label_display() {
        const $existing_header = this.$label_field.querySelector(
            '.gantt-labels-header',
        );
        const $existing_scroll = this.$label_field.querySelector(
            '.gantt-labels-scroll',
        );

        if ($existing_header) $existing_header.remove();
        if ($existing_scroll) {
            $existing_scroll.remove();
            if (this.$labels_scroll === $existing_scroll) {
                this.$labels_scroll = null;
            }
        }

        this.create_headers_row();
        this.create_values_area();
        this.setup_scroll_sync();

        if (
            !this.$resize_handle ||
            !this.$label_field.contains(this.$resize_handle)
        ) {
            this.create_resize_handle();
        }
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
        $labels_content.style.width = '100%';

        const contentHeight = this.gantt.grid_height - this.gantt.config.header_height;
        $labels_content.style.height = contentHeight + 'px';

        if (this.labelHeaders && this.labelHeaders.length > 0) {
            this.labelHeaders.forEach((header, colIdx) => {
                if (this.visibleHeaders && this.visibleHeaders.has(header)) {
                    const $col = document.createElement('div');
                    $col.classList.add('gantt-labels-col');

                    const values = this.labelColumns[colIdx];
                    if (Array.isArray(values)) {
                        values.forEach((val) => {
                            const $val = document.createElement('div');
                            $val.classList.add('gantt-labels-cell');

                            const $text = document.createElement('span');
                            $text.classList.add('gantt-labels-cell-text');
                            $text.textContent = val;
                            $text.title = val;

                            const height =
                                this.gantt.options.bar_height +
                                this.gantt.options.padding;
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
        if (this.$labels_scroll && this.gantt.$container) {
            let isSyncingScroll = false;

            this.$labels_scroll.addEventListener('scroll', () => {
                if (isSyncingScroll || !this.$labels_scroll) return;
                isSyncingScroll = true;
                this.gantt._isSyncingLabelScroll = true;
                if (this.$labels_scroll && this.gantt.$container) {
                    this.gantt.$container.scrollTop = this.$labels_scroll.scrollTop;
                }
                this.gantt._isSyncingLabelScroll = false;
                isSyncingScroll = false;
            });

            this.gantt.$container.addEventListener('scroll', () => {
                if (isSyncingScroll || !this.$labels_scroll) return;
                isSyncingScroll = true;
                this.gantt._isSyncingLabelScroll = true;
                if (this.$labels_scroll && this.gantt.$container) {
                    this.$labels_scroll.scrollTop = this.gantt.$container.scrollTop;
                }
                this.gantt._isSyncingLabelScroll = false;
                isSyncingScroll = false;
            });
        }
    }

    create_resize_handle() {
        this.$resize_handle = document.createElement('div');
        this.$resize_handle.classList.add('gantt-label-resize-handle');
        this.$label_field.appendChild(this.$resize_handle);
        this.setup_resize_functionality();
    }

    setup_resize_functionality() {
        let isResizing = false;
        let startX = 0;
        let startWidth = 0;
        let mainContainerWidth = 0;

        const startResize = (e) => {
            e.preventDefault();
            isResizing = true;
            startX = e.clientX;
            startWidth = this.$label_field.offsetWidth;
            mainContainerWidth = this.gantt.$main_container.offsetWidth;

            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
            document.body.style.userSelect = 'none';
            document.body.style.cursor = 'col-resize';
        };

        const resize = (e) => {
            if (!isResizing) return;
            e.preventDefault();

            const deltaX = e.clientX - startX;
            const newWidth = Math.max(
                200,
                Math.min(startWidth + deltaX, mainContainerWidth * 0.4),
            );

            this.$label_field.style.width = newWidth + 'px';
            this.update_column_layout();
            window.dispatchEvent(new Event('resize'));
        };

        const stopResize = () => {
            isResizing = false;
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        };

        this.$resize_handle.addEventListener('mousedown', startResize);
        const handleWindowResize = () => {
            if (
                this.$label_field &&
                this.$label_field.style.display !== 'none'
            ) {
                const currentWidth =
                    parseInt(this.$label_field.style.width) || 300;
                const maxWidth = this.gantt.$main_container.offsetWidth * 0.4;
                if (currentWidth > maxWidth) {
                    this.$label_field.style.width = maxWidth + 'px';
                }
                this.update_column_layout();
            }
        };
        window.addEventListener('resize', handleWindowResize);

        this._windowResizeHandler = handleWindowResize;
    }

    save_state() {
        const labelWidth = this.$label_field
            ? this.$label_field.style.width || '250px'
            : '250px';
        return {
            isVisible: this.isVisible,
            visibleHeaders: this.visibleHeaders
                ? new Set(this.visibleHeaders)
                : null,
            labels: this.labels,
            labelWidth: labelWidth,
        };
    }

    restore_state(state) {
        if (state) {
            this.labels = state.labels || [];
            this.setup_labels();

            if (state.visibleHeaders) {
                this.visibleHeaders = new Set(state.visibleHeaders);
                console.log(
                    'Restored visibleHeaders:',
                    Array.from(this.visibleHeaders),
                );
            }

            if (state.isVisible) {
                if (!this.$label_field || !this.$label_field.parentNode) {
                    this.create_label_field();
                } else {
                    this.refresh_label_display();
                }
                this.isVisible = true;
                if (this.$label_field) {
                    this.$label_field.style.display = 'flex';
                    if (state.labelWidth) {
                        this.$label_field.style.width = state.labelWidth;
                    }
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
            this.$resize_handle = null;
            this.$labels_scroll = null;
        }
        if (this._windowResizeHandler) {
            window.removeEventListener('resize', this._windowResizeHandler);
            this._windowResizeHandler = null;
        }
        if (this._clickOutsideHandler) {
            document.removeEventListener('click', this._clickOutsideHandler);
            this._clickOutsideHandler = null;
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

    get_width() {
        if (this.$label_field) {
            return parseInt(this.$label_field.style.width) || 250;
        }
        return 250;
    }

    set_width(width) {
        if (this.$label_field) {
            const maxWidth = this.gantt.$main_container.offsetWidth * 0.4;
            const clampedWidth = Math.max(150, Math.min(width, maxWidth));
            this.$label_field.style.width = clampedWidth + 'px';
            this.update_column_layout();
            window.dispatchEvent(new Event('resize'));
        }
    }

    update_column_layout() {
        // This method can be used to optimize column widths based on content
        // For now, the CSS flex properties handle the distribution automatically
        // But we can add custom logic here if needed in the future

        // Force a reflow to ensure the flex layout updates properly
        if (this.$label_field) {
            this.$label_field.offsetHeight;
        }
    }

    _enforce_max_three_headers() {
        if (!this._headerCheckboxes) return;
        
        const checked = this._headerCheckboxes.filter((cb) => cb.checked);
        if (checked.length >= 3) {
            this._headerCheckboxes.forEach((cb) => {
                if (!cb.checked) cb.disabled = true;
            });
        } else {
            this._headerCheckboxes.forEach((cb) => {
                cb.disabled = false;
            });
        }
    }
}
