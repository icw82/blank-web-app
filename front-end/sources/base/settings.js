store.settings = {};

store.settings.structure = [{
    name: 'main',
    label: 'Главная страница',
    presence: [],
    url: '/'
}, {
    name: 'not-found',
    label: 'Страница не найдена',
    presence: [],
    url: '/not-found/'
}];

{
    const addons = [];

    store.settings.structure.forEach(item => {
        if (!kk.is_s(item.name))
            throw Error('Не указано имя раздела');

        if (!kk.is_s(item.url))
            item.url = '/' + item.name + '/';

        if (!kk.is_s(item.template))
            item.template = item.name + '.html';

        if (!kk.is_s(item.controller)) {
            item.controller = kk.camelize(item.name) + `PageCtrl`;
        }

        if (item.pagination === true) {
            const pagination = {
                url: `${ item.url }/page/:page/`,
                pageOf: item,
                template: item.template,
                controller: item.controller
            };

            addons.push(pagination);
            item.pagination = pagination;
        }
    });

    store.settings.structure = store.settings.structure.concat(addons);

}

/*
    {
        name: 'name',
        label: {
            ru: 'asdasd'
        },
        value: false,
        default_value: 5,
        type: [
            boolian,
            number: integer, float, date,
            string: email, phone, ip, url,
            text: plain, html, markdown,
            file: doc, image, audio, video
        ],
        required: true,
        range: [10, 50]
        units: 'mm',
        choice: [ // для number и string
            [123, 'asdasd'],
            [231, 'safgeg'],
        ],
        length: 256
    }
*/

store.settings.forms = [];

// Форма обратной связи
store.settings.forms.push({
    name: 'feedback',
    header: 'Форма обратной связи',
    resource: 'feedback',
    url: '/api/forms/feedback/',
    items: [{
        name: 'message',
        label: {
            ru: 'Ваше сообщение'
        },
        type: 'plain',
        required: true,
    }, {
        name: 'name',
        label: {
            ru: 'ФИО'
        },
        type: 'string',
        required: true,
    }, {
        name: 'email',
        label: {
            ru: 'Эл. почта'
        },
        type: 'email',
        required: true
    }, {
        name: 'phone',
        label: {
            ru: 'Телефон'
        },
        type: 'phone',
    }]
})
