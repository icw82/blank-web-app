class PanelRegister {
    constructor(layers) {
        if (!(layers instanceof kk.PageLayers))
            throw new Error('PageLayers is not defined');

        const self = this;

        this.list = [];
        this.layers = layers;
        this.blur_block = false;
        // Блок нужен для того, чтобы предотвратить закрытие панели сразу
        // же после её открытия, так как клик по якорю тоже расценивается
        // как клик вне панели;

        // EVENTS
        this.on_show = new kk.Event();
        this.on_hide = new kk.Event();

        document.body.addEventListener('click', event => {
//            console.log('click', event.target);

            if (kk.find_ancestor(event.target, '.b-panel'))
                return;

            if (self.blur_block) {
                clearTimeout(self.blur_block);
                self.blur_block = false;
                return;
            }

            self.on_blur()
        });

//        this.on_show.addListener(panel => {
//            console.log('show', panel);
//        });
//        this.on_hide.addListener(panel => {
//            console.log('hide', panel);
//        });
    }

    get current() {
        return this.list.filter(panel => panel.state.show);
    }

    get current_layers() {
        const self = this;

        return this.layers.all.filter(layer => {
            return self.current.find(panel => {
                return panel.layer === layer
            });
        });
    }

    get(key) {
        // По ключу
        if (kk.is_s(key))
            return this.list.find(item => item.key === key);

        // По dom-элементу
        if (kk.is_E(key))
            return this.list.find(item => item.element === key);

        // По объекту
        if (key instanceof kk.Panel)
            return this.list.find(item => item === key);

        // По якорю?
    }

    has(key) {
        return this.get(key) ? true : false;
    }

    add(params) {
        const self = this;
        params.register = this;

        let panel = this.get(params.key);

        if (panel) {
            if (!params.replace) {
                console.warn('Панель уже зарегистрирована:', params);
                params.element.parentElement.removeChild(params.element);
                return panel;
            }

            this.remove(panel);
        }

        panel = new Panel(params);
        this.list.push(panel);

        panel.layer = this.layers.get(panel.layer);
        panel.layer.element.appendChild(panel.element);

        return panel;
    }

    remove(panel) {
        panel = this.get(panel);

        if (panel) {
            this.list.splice(this.list.indexOf(panel), 1);
            panel.element.parentElement.removeChild(panel.element);
        }
    }

    // В качестве первого аргумента можно указывать якорь, название панели
    // или саму панель (элемент).
    // Если второй аргумент является элементом, то он указывается как якорь.
    // Если второй или третий аргумент имеют значение false, то якорь,
    // если он есть, не будет становиться активным (останется без класса .active).
    show(key, anchor) {
        const panel = this.get(key);

        if (!panel)
            throw new Error('Панель не найдена');

        this.set_blur_block();

        panel.state.show = true;
        panel.choose_anchor(anchor);
        this.update();
        panel.update();
        this.on_show.dispatch(panel);

        const first_field = panel.element.querySelector('input, textarea');
        if (kk.is_E(first_field))
            first_field.focus();
    }

    set_blur_block() {
        const self = this;

        if (this.blur_block) {
            clearTimeout(this.blur_block);
        }

        this.blur_block = setTimeout(() => {
            self.blur_block = false;
        }, 1000);
    }

    hide(key) {
        const panel = this.get(key);

        if (!panel)
            throw new Error('Панель не найдена');

        panel.state.show = false;
        this.update();
        panel.update();
        this.on_hide.dispatch(panel);
    }

    toggle(key, anchor) {
        const panel = this.get(key);

        if (!panel)
            throw new Error('Панель не найдена');

        panel.state.show ? this.hide(key) : this.show(key, anchor);
    }

    on_blur() {
        console.log('on_blur');

        if (this.current.length > 0) {
            this.current.forEach(panel => {
                if (panel.close_on_blur && panel.state.show) {
                    panel.state.show = false;
                    panel.update();
                    this.on_hide.dispatch(panel);
                }
            });

            this.update();
        }
    }

    update() {
        const self = this;

        if (this.current.length > 0) {
            this.layers.show('top');

            if (this.current.find(panel => panel.blackout))
                this.layers.show('blackout');
            else
                this.layers.hide('blackout');


            this.current_layers.forEach(layer => this.layers.show(layer.name));

        } else {
            this.layers.hide();
        }
    }

//        if (kk.is_A(panel.options.mutex)) {
//            if (panel.options.mutex.indexOf('all') > -1) {
//                each (current, function(item) {
//                    hide(item.name);
//                });
//            } else {
//                each (panel.options.mutex, function(name) {
//                    hide(name);
//                });
//            }
//        }
//
//        if (anchor) {
//            panel.anchor = anchor;//
//            if (panel.anchor_clones_wrapper) {
//                current_clone = null;
//                each (panel.anchor_clones, function(clone) {
//                    if (clone.original === panel.anchor) {
//                        current_clone = clone.dom;
//                    } else {
//                        clone.dom.style.display = 'none';
//                    }
//                });
//
//                if (!current_clone) {
//                    var current_clone = anchor.cloneNode(true);
//                    current_clone = init_anchor(anchor, panel.name).clone;
//                }
//
//                current_clone.style.removeProperty('display');
//                current_clone.classList.remove('active');
//            }
//        }

//        if (active && current_clone) current_clone.classList.add('active');
//        if (active && anchor) anchor.classList.add('active');
//    }

}

kk.PanelRegister = PanelRegister;
