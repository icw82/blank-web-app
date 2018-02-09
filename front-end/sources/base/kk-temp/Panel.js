class Panel {
    constructor(params) {
        if (params.register.__proto__.constructor !== kk.PanelRegister)
            throw new Error('Register is not defined');

        if (!kk.is_s(params.key))
            throw new Error('Key is not defined');

        if (!kk.is_E(params.element))
            throw new Error('Element is not defined');

        const self = this;

        this.register = params.register;
        this.key = params.key;

        this.element = params.element;

        this.anchors = [];
        this.state = {
            show: false,
            anchor: null
        };

        delete params.register;
        delete params.key;
        delete params.element;

        for (let key in this.defaults) {
            if (key in params && !kk.is_u(params[key]))
                this[key] = params[key];
            else
                this[key] = this.defaults[key]
        }

        // Настройки
        if (this.mutex !== 'all' && kk.is_A(this.mutex)) {
            // FUTURE: all, исключения"
            this.mutex = this.mutex
                .replace(/,+/g, ' ')
                .replace(/\s{2,}/g, ' ')
                .split(' ');
        }

        // DOM
        this.pointer = this.element
            .querySelector(`.${ self.class }__pointer`);
        this.close_button = this.element
            .querySelector(`.${ self.class }__close-button`);

        if (this.close_button)
            this.close_button.addEventListener('click',
                () => self.register.hide(self));

        if (this.width) {
            this.element.style.width = this.width;

        }

        // EVENTS
        this.events = new kk.ElementEvents(this.element);

        this.events.on_element_addition.addListener(() => {
            self.update_position();
        });

        window.addEventListener('resize', () => self.update(), true);

//        'anchor_clones_wrapper':
//            panel.querySelector('[da*****ne="' + name + '"]'),
//        'update': {
//            'width': true,
//            'height': true
//        }

    }

    get defaults () {
        return {
            blackout: false,
            class: 'b-panel',
            close_on_blur: true,
            layer: 'page',
            modal: false,
//          — подложка, блокирующая основное содержимое.
//            При открытии такой панели все остальные панели закрываются
//            вне зависимости от значений атрибута mutex. (false по умолчанию)
            mutex: 'all', // значение по умолчанию не используется
            replace: false, // Заменять существующую панель с таким же именем
            width: null,
//          data-width {string} ("100", "40.5%")
//            — ширина панели. Если в процентах, то относительно .layout-wrapper.
//              Значение с процентами будет преобразовано во Float;
//              если процента в конце строки нет, строка будет преобразована в Integer.
//          data-height {string} ("100", "40.5%")
//            — высота панели. Если в процентах, то относительно высоты окна.
//              Значение с процентами будет преобразовано во Float;
//              если процента в конце строки нет, строка будет преобразована в Integer.

//            width: { // значение по умолчанию не используется
//                value: 320,
//                units: 'px'
//            },
//            height: { // значение по умолчанию не используется
//                value: null,
//                units: 'auto'
//            },

            rel: 'anchor',
//          rel-x {string} ("wrapper" | "anchor" | "viewport")
//            — относительно чего распологать панель по оси X
//              ("anchor" по умолчанию) (приоритет над rel)
//          rel-y {string} ("wrapper" | "anchor" | "viewport")
//            — относительно чего распологать панель по оси Y
//              ("anchor" по умолчанию) (приоритет над rel)
//          rel {string} ("wrapper" | "anchor" | "viewport")
//            — относительно чего распологать панель.
//              Краткая запись для rel-left="" и rel-top="". Например:
//              rel="viewport"       = rel-x="viewport" и rel-y="viewport",
//              rel="wrapper anchor" = rel-x="wrapper"  и rel-y="anchor",

            pos: {
                x: 'center',
                y: 'top'
            },
//          pos-x {string} ("left" | "center" | "right") center
//            — позиционирование панели относительно выбранного объекта
//          pos-y {string} ("top" | "center" | "bottom") top
//            — позиционирование панели относительно выбранного объекта

            align: {
                x: 'center',
                y: 'top'
            },
//          align-x {string} ("left" | "center" | "right") center
//            — выравнивание панели
//          align-y {string} ("top" | "center" | "bottom") top
//            — выравнивание панели
        }
    }

    show() {
        this.register.show(this);
    }

    hide() {
        this.register.hide(this);
    }

    choose_anchor(anchor) {
        if (!kk.is_E(anchor))
            return;

        if (!this.anchors.includes(anchor))
            this.anchors.push(anchor);

        this.state.anchor = anchor;
    }

    // UPDATES

    update () {
        if (!this.state.show) {
            this.element.classList.remove('visible');
            return;
        }

        this.element.classList.add('visible');

        if (this.pointer) {
            if (this.state.anchor)
                this.pointer.classList.add('visible');
            else
                this.pointer.classList.remove('visible');
        }

        this.state.sizes = {
            container: kk.get_offset(this.layer.element),
            panel: kk.get_offset(this.element),
            anchor: this.state.anchor ? kk.get_offset(this.state.anchor) : null
        }

        this.update_sizes();
        this.update_position();
        this.update_pointer();
    }

    update_sizes () {
        if (!this.state.show)
            return;

    }

    update_position () {
        if (!this.state.show)
            return;

        const sizes = this.state.sizes;

        const wrapper = this.layer.element.getBoundingClientRect();
//       const _ = {
//            width: panel.settings.width,
//            height: panel.settings.height,
//            rel: panel.settings.rel,
//            pos: panel.settings.pos
//        };

        if (this.rel === 'anchor' && this.state.anchor) {

            // X
            let left = sizes.anchor.left - sizes.container.left;
            let shift = sizes.anchor.width/2 - sizes.panel.width/2;

            if (left + shift < 10) {
                left = 10;
            } else if (sizes.container.width - left - shift < 10) {
                left = sizes.container.width - sizes.panel.width - 10;
            } else {
                left += shift;
            }

            this.element.style.left = `${left}px`;

            // Y
            const top = sizes.anchor.top + sizes.anchor.height;
            this.element.style.top = `${top}px`;

        }

        if (this.rel === 'viewport') {
            this.element.style.left = `calc(50% - ${ this.width }/2)`;

            if (this.element.offsetHeight > kk.viewport.h) {
                this.element.style.top = 0;
            } else {
                this.element.style.top =
                    `calc(50% - ${this.element.offsetHeight}px/2)`;

            }
        }

        sizes.panel = kk.get_offset(this.element);
    }


//        if (_.width && _.width.value > 0) {
//
//            // center top
//            if (panel.dom.classList.contains('std'))
//                panel.dom.style.marginLeft = -Math.round(_.width.value/2) + _.width.units;
//        }
//
//        // NOTE: временно
//        if (panel.settings.temp_center) {
//            var scroll_top = kk.viewport.y,
//                client_height = kk.viewport.h;
//
//            panel.dom.style.left = '50%';
//            panel.dom.style.top = Math.max(0,scroll_top
//                + ( (client_height - panel.dom.offsetHeight)/2 )) + 'px';
//        }

//    }

    update_pointer () {
        if (!this.state.show)
            return;

        const sizes = this.state.sizes;

        if (this.rel === 'anchor' && this.state.anchor) {
            if (this.pointer) {
                let left =
                    sizes.anchor.left + sizes.anchor.width/2 -
                    sizes.panel.left
                this.pointer.style.left = `${left}px`;
            }
//
//            if (panel.anchor_clones_wrapper) {
//                panel.anchor_clones_wrapper.style.left =
//                    (anchor.left - panel_offset.left) + 'px';
//
//                panel.anchor_clones_wrapper.style.top =
//                    (anchor.top - panel_offset.top) + 'px';
//            }
        }

    }
}

class Anchor {
    constructor() {

    }
}

//    FUTURE: data-auto-open, data-auto-close

//    var get_panel_option_rel = function(panel) {
//        var _ = {};
//        var settings = ['wrapper', 'anchor', 'viewport'];
//
//        var x = panel.getAttribute('data-rel-x');
//        var y = panel.getAttribute('data-rel-y');
//
//        if ((x !== null) && (settings.indexOf(x) === -1)) x = null;
//        if ((y !== null) && (settings.indexOf(y) === -1)) y = null;
//
//        if (!x || !y) {
//            var rel = panel.getAttribute('data-rel');
//
//            if (rel !== null) {
//                rel = rel
//                    .replace(/,+/g, ' ')
//                    .replace(/\s{2,}/g, ' ')
//                    .split(' ');
//
//                if (rel.length === 1)
//                     rel[1] = rel[0];
//
//                if (settings.indexOf(rel[0]) === -1)
//                    rel[0] = null;
//                if (settings.indexOf(rel[1]) === -1)
//                    rel[1] = null;
//            }
//        }
//
//        _.x = x || (rel ? rel[0] : null);
//        _.y = y || (rel ? rel[1] : null);
//
//        // Old way
//        if (!_.x) {
//            var left = panel.getAttribute('data-kenzo-option-left');
//            if (left !== null) {
//                if (left === 'true')
//                    _.x = 'anchor';
//                else if (left === 'false')
//                    _.x = 'wrapper';
//            }
//        }
//
//        if (!_.y) {
//            var top = panel.getAttribute('data-kenzo-option-top');
//
//            if (top !== null) {
//                if (top === 'true')
//                    _.y = 'anchor';
//                else if (top === 'false')
//                    _.y = 'wrapper';
//            }
//        }
//
//        // Defaults
//        if (!_.x) _.x = default_settings.rel.x;
//        if (!_.y) _.y = default_settings.rel.y;
//
//        return _;
//    }
//
//    var get_panel_option_pos = function(panel) {
//        var _ = {};
//        var settings_x = ['left', 'center', 'right'];
//        var settings_y = ['top', 'center', 'bottom'];
//
//        var x = panel.getAttribute('data-pos-x');
//        var y = panel.getAttribute('data-pos-y');
//
//        if ((x !== null) && (settings_x.indexOf(x) === -1)) x = null;
//        if ((y !== null) && (settings_y.indexOf(y) === -1)) y = null;
//
//        if (!x || !y) {
//            var pos = panel.getAttribute('data-pos');
//
//            if (pos !== null) {
//                pos = pos
//                    .replace(/,+/g, ' ')
//                    .replace(/\s{2,}/g, ' ')
//                    .split(' ');
//
//                if (pos.length === 1)
//                    pos[1] = pos[0];
//
//                if (settings_x.indexOf(pos[0]) === -1)
//                    pos[0] = null;
//                if (settings_y.indexOf(pos[1]) === -1)
//                    pos[1] = null;
//            }
//        }
//
//        _.x = x || (pos ? pos[0] : null);
//        _.y = y || (pos ? pos[1] : null);
//
//        // Defaults
//        if (!_.x) _.x = default_settings.pos.x;
//        if (!_.y) _.y = default_settings.pos.y;
//
//        return _;
//    }

//    var update_sizes = function(panel) {
//        var _ = {
//            width: panel.settings.width,
//            height: panel.settings.height
//        };
//
//        if (panel.update.width && _.width && _.width.value > 0) {
//            panel.dom.style.width = _.width.value + _.width.units;
//            panel.update.width = false;
//        }
//
//        if (panel.update.height && _.height && _.height.value > 0) {
//            if (_.height.units === 'px') {
//                panel.dom.style.height = _.height.value + _.height.units;
//                panel.update.height = false;
//            } else if (_.height.units === '%') {
//                panel.dom.style.height = kk.viewport.h / 100 * _.height.value + 'px';
//            }
//        }
//    }
//


//    var init_anchor = function(anchor) {
//
//        if (kk.is_E(arguments[0])) {
//            var panel = get(arguments[0]);
//            if (!panel) {
//                return;
//            }
//        } else {
//            return;
//        }
//
//        var onclick = function(event) {
//            if ((panel.show === false) || (panel.anchor !== anchor)) {
//                show(anchor);
//            } else {
//                hide(anchor);
//            }
//        }
//
//        anchor.addEventListener('click', onclick);
//
//        if (kk.is_s(arguments[1])) {
//            var steppanel = get(arguments[1]);
//        }
//
//        var clone;
//
//        // Клонирование якоря
//        if (panel.anchor_clones_wrapper) {
//            clone = anchor.cloneNode(true);
//            var newobj = {
//                'original': anchor,
//                'dom': clone
//            };
//
//            if (steppanel) {
//                steppanel.anchor_clones.push(newobj);
//                steppanel.anchor_clones_wrapper.appendChild(clone);
//            } else{
//                panel.anchor_clones.push(newobj);
//                panel.anchor_clones_wrapper.appendChild(clone);
//            }
//
//            clone.addEventListener('click', onclick);
//        }
//    }
//
//    // Панели
//    each ('[data-kenzo-popup-panel]', add);
//
//    // Якори
//    each ('[data-kenzo-popup-anchor]', init_anchor);
//
//    // Проводники
//    // Проводит событие 'click' в первый одноимённый якорь в элементах блока
//    each ('[data-kenzo-popup-conductor]', function(conductor) {
//        var name = conductor.getAttribute('data-kenzo-popup-conductor');
//
//        if (name === '')
//            name = null;
//        else {
//            var panel = get(name);
//            if (!panel) return false;
//            // Не имеет смысла искать якорь при отсутсивии панели.
//            // FUTURE: если панели будут подгружаемыми, эту строку нужно изменить.
//        }
//
//        var anchor;
//
//        var search_anchor = function(node) {
//            if (anchor === document.body)
//                return false;
//
//            if (name) {
//                if (node.parentNode == document.body) {
//                    console.warn('kenzo.popup: Якорь не найден');
//                    return false;
//                }
//                anchor = node.parentNode
//                    .querySelector('[data-kenzo-popup-anchor="' + name + '"]');
//            } else {
//                anchor = node.parentNode
//                    .querySelector('[data-kenzo-popup-anchor]');
//            }
//
//            if (!anchor)
//                search_anchor(node.parentNode);
//        }
//
//        search_anchor(conductor);
//
//        conductor.addEventListener('click', function(event) {
//            anchor.click();
//        });
//    });
//
//    // Кнопки и другие элементы для закрытия панели
//    each ('[data-kenzo-popup-close], [data-kenzo-popup-close-button]', function(item) {
//        item.addEventListener('click', function() {
//            hide(item);
//        });
//    });
//
//    var is_popup = function(element) {
//        if (element instanceof Element) {
//            if (element === document.body) {
//                return false;
//            } else if (
//                element.hasAttribute('data-kenzo-popup-panel') ||
//                element.hasAttribute('data-kenzo-popup-anchor') ||
//                element.hasAttribute('data-kenzo-popup-conductor')
//            ) {
//                return true;
//            } else if (element.parentNode !== document.body) {
//                return is_popup(element.parentNode);
//            } else {
//                return false;
//            }
//        } else if (element instanceof SVGElementInstance) {
//            return is_popup(element.correspondingUseElement);
//        }
//    }
//
//    // Закрытие всех панелей по щелчку вне их;
//    document.addEventListener('click', function(event) {
//        if (block_hide) {
//            block_hide = false;
//            return false;
//        }
//
//        if ((current.length > 0) && (!is_popup(event.target))) {
//            var len = current.length;
//            for (len; len > 0; len--) {
//                hide(current[0].name, true);
//            }
//        }
//    });
//
//    return {
//        'get': get,
//        'show': show,
//        'hide': hide
//    }
//
//})();

kk.Panel = Panel;
