class Poster extends ItemModel{
    constructor(data) {
        const scheme = kk.convert_scheme([
            'id',
            'format',
            'hide_text',
            'image',
            'original_image',
            ['article', Article],
        ]);

        super(data, scheme);
    }

    update(data, silence) {
        super.update(data, true);

        let matches = this.format.match(/(\d{1,2})×(\d{1,2})/);

        if (matches.length === 3) {
            this.height = parseInt(matches[1]);
            this.width = parseInt(matches[2]);
//            this.value = this.width;
        }

        silence || this._meta.on_update.dispatch(data);
    }
}


class Posters extends ListModel {
    constructor(data, params) {
        super(data, params, Poster);
    }

    update(data, silence) {
        super.update(data, true);
        silence || this._meta.on_update.dispatch(data);
    }

    get_by_entity(entity) {
        let id;

        if (kk.is_n(entity))
            id = entity;
        else if (kk.is_n(entity.id))
            id = entity.id;
        else
            throw new Error('Некорректный идентификатор орагнизации');

        return this.filter(poster => {
            if (kk.is_n(poster.article.entity))
                return poster.article.entity === id;
            else if (kk.is_n(poster.article.entity.id))
                return poster.article.entity.id === id;
        });
    }
}
