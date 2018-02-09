class Contact extends ItemModel{
    constructor(data) {
        const scheme = kk.convert_scheme([
            'id',
            'entity',
            'is_main',
            'position',
            'type',
            'value'
        ]);

        super(data, scheme);
    }

    update(data, silence) {
        super.update(data, true);

        if (this.is_social_network) {
            this.svg = '/static/images/graphics.svg' +
                `#logo-${ this.type }-box`;
            this.value = this.absolute_url(this.value);
            this.url = this.value; // TODO: Обрабатывать?
        } else if (this.type === 'website') {
            this.value = this.absolute_url(this.value);
        }

        silence || this._meta.on_update.dispatch(data);
    }

    get is_social_network() {
        return [
            'vk', 'fb', 'ok', 'twitter', 'instagram'
        ].includes(this.type)
    }

    absolute_url(string) {
        string = string.replace(/^.*?[\/]{2}/, '');
        string = string.replace(/\/$/, '');

        return string;
    }

}

class Contacts extends ListModel{
    constructor(data, params) {
        super(data, params, Contact);
    }

    update(data, silence) {
        super.update(data, true);

        this.social_networks =
            this.all.filter(contact => contact.is_social_network);

        this.tels =
            this.all.filter(contact => contact.type === 'tel');

        this.emails =
            this.all.filter(contact => contact.type === 'email');

        this.websites =
            this.all.filter(contact => contact.type === 'website');

        silence || this._meta.on_update.dispatch(data);
    }

}
