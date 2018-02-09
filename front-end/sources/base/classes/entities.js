class Entity extends ItemModel {
    constructor(data) {
        const scheme = kk.convert_scheme([
            'id',
            'name',
            'open',
            ['place', Place],
            'type',
            'from_hour',
            'to_hour',
            'about',
            ['categories', Categories],
            'logo'
        ]);

        super(data, scheme);
    }

    update(data, silence) {
        super.update(data);

        if (!this.hours && this.from_hour && this.to_hour) {
            let from = this.from_hour.split(':');
            let to = this.to_hour.split(':');

            this.hours = `Ежедневно с ${from[0]}:${from[1]} ` +
                `до ${to[0]}:${to[1]}`;
        }

        silence || this._meta.on_update.dispatch(data);
    }

    get url() {
        if (this._meta.type === 'tenant')
            return `/tenants/${ this.id }`;

        if (this._meta.type === 'company')
            return `/companies/${ this.id }`;

        return `/entities/${ this.id }`;
    }
}


class Entities extends ListModel{
    constructor(data, params) {
        super(data, params, Entity);
    }

    update(data, silence) {
        super.update(data, true);
        silence || this._meta.on_update.dispatch(data);
    }
}
