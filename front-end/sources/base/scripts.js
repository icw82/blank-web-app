kk.layers = new kk.PageLayers(
    document.querySelector('body > .page'),
    (() => {
        const fragment = document.createDocumentFragment();

        const row = document.createElement('div');
        row.classList.add('page__row');

        const width = document.createElement('div');
        width.classList.add('page__width');
        width.setAttribute('wrapper', '');

        row.appendChild(width);
        fragment.appendChild(row);

        return fragment;
    })()
);

kk.panels = new kk.PanelRegister(kk.layers);
