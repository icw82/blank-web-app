class Place extends ItemModel {
    constructor(data) {
        const scheme = kk.convert_scheme([
            'id',
            'name',
            ['parent', Places],
            'type',
            'address',
            'position',
            'rel_x',
            'rel_y',
            'xml',
        ]);

        super(data, scheme);
    }

    update(data, silence) {
        super.update(data);

        if (this._meta.type === 'building') {
            if (!this.locality)
                this.locality = 'Тюмень';

            if (!this.postal_code)
                this.postal_code = '625048';
        }

        silence || this._meta.on_update.dispatch(data);
    }
}


class Places extends ListModel{
    constructor(data, params) {
        super(data, params, Place);
    }

    update(data, silence) {
        super.update(data, true);
        silence || this._meta.on_update.dispatch(data);
    }
}
