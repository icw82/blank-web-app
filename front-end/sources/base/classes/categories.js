class Category extends ItemModel {
    constructor(data) {
        const scheme = kk.convert_scheme([
            'id',
            'name',
            'name_plural',
            'note',
            'position',
            'xml',
            'draft_image'
        ]);

        super(data, scheme);
    }

    update(data, silence) {
        super.update(data, true);
        silence || this._meta.on_update.dispatch(data);
    }
}

class Categories extends ListModel{
    constructor(data, params) {
        super(data, params, Category);
    }

    update(data, silence) {
        super.update(data, true);
        silence || this._meta.on_update.dispatch(data);
    }
}
