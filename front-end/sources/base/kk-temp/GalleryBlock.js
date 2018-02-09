class GalleryBlock {
    constructor(slides, block) {
        if (!kk.is_A(slides))
            return;

        const self = this;
        const BN = 'b-gallery'; // blockname ${BN}
        const MV = 'b-gallery__mainview';
        const PV = 'b-gallery__preview';
        const SVG = '/static/images/graphics.svg'

        this.slides = slides;
        this.block = block;
        this.state = {
            current: null,
            previews: slides.length > 1,
            mainview_controls: slides.length > 1
        };

        const fragment = document.createDocumentFragment();

        this.elements = {
            list: document.createElement('ul'),
            view: document.createElement('div')
        }

        this.elements.list.classList.add(`${BN}__list`);
        this.elements.view.classList.add(`${BN}__view`);

        this.elements.view.innerHTML = `
            <div class="${BN}__view__close"></div>
            <div class="${MV}">
                <div class="${MV}__viewport">
                    <div class="${MV}__container"></div>
                </div>
                <div class="${MV}__controls">
                    <div class="${MV}__control prev">
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
                            viewBox="0 0 5 10">
                            <use x="0" y="0" xlink:href="${SVG}#arrow-narrow"
                                transform="rotate(180, 2.5, 5)" />
                        </svg>
                    </div>
                    <div class="${MV}__control next">
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
                            viewBox="0 0 5 10">
                            <use x="0" y="0" xlink:href="${SVG}#arrow-narrow" />
                        </svg>
                    </div>
                </div>
            </div>
            <div class="${PV}">
                <div class="${PV}__viewport">
                    <div class="${PV}__container">
                        <div class="${PV}__item">
                            <img class="${PV}__img" src="" />
                            <div class="${PV}__mask"></div>
                        </div>
                    </div>
                </div>
                <div class="${PV}__controls">
                    <div class="${PV}__prev"></div>
                    <div class="${PV}__next"></div>
                </div>
            </div>
        `;

        this.elements.view__close =
            this.elements.view.querySelector(`.${BN}__view__close`);

        this.elements.mainview =
            this.elements.view.querySelector(`.${MV}`);
        this.elements.mainview__container =
            this.elements.view.querySelector(`.${MV}__container`);
        this.elements.mainview__controls =
            this.elements.view.querySelector(`.${MV}__controls`);
        this.elements.mainview__prev =
            this.elements.view.querySelector(`.${MV}__control.prev`);
        this.elements.mainview__next =
            this.elements.view.querySelector(`.${MV}__control.next`);

        this.elements.preview =
            this.elements.view.querySelector(`.${PV}`);
        this.elements.preview__container =
            this.elements.view.querySelector(`.${PV}__container`);
        this.elements.preview__item =
            this.elements.view.querySelector(`.${PV}__item`);
        this.elements.preview__controls =
            this.elements.view.querySelector(`.${PV}__controls`);
        this.elements.preview__prev =
            this.elements.view.querySelector(`.${PV}__prev`);
        this.elements.preview__next =
            this.elements.view.querySelector(`.${PV}__next`);

        this.elements.view__close.addEventListener(
            'click',
            () => self.close()
        );

        if (this.state.mainview_controls) {
            this.elements.mainview__next.addEventListener(
                'click',
                () => self.nextSlide()
            );

            this.elements.mainview__prev.addEventListener(
                'click',
                () => self.prevSlide()
            );
        } else {
            this.elements.mainview__controls.removeChild(
                this.elements.mainview__next);
            this.elements.mainview__controls.removeChild(
                this.elements.mainview__prev);

            delete this.elements.mainview__next;
            delete this.elements.mainview__prev;

            this.elements.mainview.removeChild(
                this.elements.mainview__controls);
            delete this.elements.mainview__controls;
        }

        slides.forEach((item, index) => {
            if (slides.length >= 2) {
                item.next = slides[index + 1];
                item.prev = slides[index - 1];

                // Если первый элемент
                if (index === 0) {
                    item.prev = slides[slides.length - 1];
                }

                if (index + 1 === slides.length) {
                    item.next = slides[0];
                }
            }

            item.elements = {};

            // Список
            {
                item.elements.list = document.createElement('li');
                item.elements.list.classList.add(`${BN}__list-item`);
                item.elements.list.addEventListener(
                    'click',
                    () => self.chooseSlide(item)
                );

                const image = document.createElement('img');
                image.setAttribute('src', item.image);

                item.elements.list.appendChild(image);
                self.elements.list.appendChild(item.elements.list);
            }

            // Просмотр
            {
                item.elements.view = document.createElement('figure');
                item.elements.view.classList.add(`${MV}__item`);
                item.elements.view.classList.add('hidden');

                if (item.image) {
                    const image = document.createElement('img');
                    image.setAttribute('src', item.image);
                    item.elements.view.appendChild(image);
                } else {
                    throw new Error('Адрес изображения не передан')
                }

                if (item.caption) {
                    const caption = document.createElement('figcaption');
                    caption.innerHTML = item.caption;
                    item.elements.view.appendChild(caption);
                }

                if (this.state.mainview_controls)
                    item.elements.view.addEventListener(
                        'click',
                        () => self.nextSlide()
                    );

                this.elements.mainview__container
                    .appendChild(item.elements.view);
            }

            // Миниатюры
            if (this.state.previews) {
                item.elements.preview = self.elements.preview__item
                    .cloneNode(true);
                item.elements.preview.addEventListener(
                    'click',
                    () => self.chooseSlide(item)
                );

                const image = item.elements.preview.querySelector('img');
                image.setAttribute('src', item.image);

                this.elements.preview__container
                    .appendChild(item.elements.preview);
            } else {

            }
        });

        // Удаление типа шаблонов
        this.elements.preview__container.removeChild(
            this.elements.preview__item);

        fragment.appendChild(this.elements.list);

        kk.layers.get('viewport').element.appendChild(this.elements.view);

        // Вставка
        block.appendChild(fragment);

        this.update();
    }

    chooseSlide(item) {
        if (kk.is_n(item))
            item = this.slides[item];

        if (this.state.current !== item) {
            this.state.current = item;
            this.update();
        }
    }

    nextSlide() {
        this.chooseSlide(this.state.current.next)
    }

    prevSlide() {
        this.chooseSlide(this.state.current.prev)
    }

    close() {
        this.state.current = null;
        this.update();
    }

    update() {
        if (this.state.current === null) {
            this.elements.view.classList.add('hidden');
            kk.layers.hide('top');
            kk.layers.hide('blackout');
            return;
        }

        this.elements.view.classList.remove('hidden');
        kk.layers.show('top');
        kk.layers.show('blackout');

        this.slides.forEach(slide => {
            if (slide === this.state.current) {
                slide.elements.view.classList.remove('hidden');
                this.state.previews &&
                    slide.elements.preview.classList.add('current');
            } else {
                slide.elements.view.classList.add('hidden');
                this.state.previews &&
                    slide.elements.preview.classList.remove('current');
            }
        });
    }

}

kk.GalleryBlock = GalleryBlock;

// TODO: проверка на существование библиотеки
// TODO: Рандомный старт
// TODO: символическая навигация по слайдам
// TODO: Описание или подпись к слайдам
// TODO: Способ перелистывания
// TODO: Элементы на разных слоях (как на анге)
// TODO: Ориентация превью (горизонтальная / вертикальная)
// TODO: Прокрутка слайдов перетаскиванием
// TODO: Скрывать основной блок по умолчанию
