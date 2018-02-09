class PageLayers {
    constructor(root, wrapper) {
        const self = this;
        const NS = 'kk-layer';

        this.all = [];

        const fragment = document.createDocumentFragment();

        if (!kk.is_E(root))
            root = document.body;

        const make_layer = name => {
            const layer = {
                name: name,
                element: document.querySelector(`.${NS}__${name}`)
            }

            if (!kk.is_E(layer.element)) {
                layer.element = document.createElement('div');
                layer.element.classList.add(`${NS}__${name}`);
            }

            this.all.push(layer);
        }

        ['top', 'blackout', 'viewport', 'page']
            .forEach(name => make_layer(name));

        const top = this.get('top').element;
        const blackout = this.get('blackout').element;
        const viewport = this.get('viewport').element;
        const page = this.get('page').element;

        fragment.appendChild(top);
        top.appendChild(blackout);
        top.appendChild(viewport);

        if (
            kk.is_E(wrapper) ||
            (wrapper instanceof DocumentFragment)
        ) {
            const port = wrapper.querySelector('[wrapper]')

            if (port) {
                port.appendChild(page);
                top.appendChild(wrapper);
            } else {
                console.warn('Нет метки обёртки');
                top.appendChild(page);
            }
        } else {
            top.appendChild(page);
        }


        // Вставка
        root.appendChild(fragment);
    }

    get(layer) {
        if (kk.is_s(layer))
            return this.all.find(item => item.name === layer);
        else if (kk.is_o(layer))
            return this.all.find(item => item.element === layer);
        else
            throw new Error('Некорректный запрос');
    }

    show(layer) {
        layer = this.get(layer);

        if (layer)
            layer.element.classList.add('visible');
    }

    hide(layer) {
        if (!layer) {
            this.all.forEach(layer =>
                layer.element.classList.remove('visible')
            );
        } else {
            layer = this.get(layer);

            if (layer)
                layer.element.classList.remove('visible');
        }
    }
}

kk.PageLayers = PageLayers;
