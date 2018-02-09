class BaseModel {
    constructor() {
        const meta = {
            on_update: new kk.Event(),
        };

        Object.defineProperty(this, '_meta', {
            enumerable: false,
            value: meta
        });
    }
}

class ItemModel extends BaseModel {
    constructor(data, scheme = []) {
        super();

        if (kk.is_n(data) || kk.is_s(data)) {
            this.id = parseInt(data);
            if (isNaN(this.id))
                throw new Error(`Некорректный идентификатор: ${ data }`);
        }

        const self = this;

        this._meta.scheme = scheme;

        Object.defineProperty(this._meta, 'complete', {
            get: () => this._meta.scheme.find(item => {
                if (!self[item.key])
                    return true;
                if (item.format && !(self[item.key] instanceof item.format))
                    return true;
            }) ? false : true
        });

        if (kk.is_o(data))
            this.update(data);

//        console.log(this);
    }

    update (data, silence) {
        const self = this;

        self._meta.scheme.forEach(item => {
            if (!data.hasOwnProperty(item.key))
                return;

            if (!item.format) {
                self[item.key] = data[item.key];
                return;
            }

            self[item.key] = self.convert(
                data[item.key],
                item.format,
                self[item.key]
            );
        });

        silence || this._meta.on_update.dispatch(data);
    }

    convert(source, format, def) {
        if (source === null)
            return source;

        if (!format)
            return source;

        if (format === Date)
            return new Date(source);

//        console.log('---', source, format, def)
//        console.log('---', def instanceof ItemModel)

        if (def instanceof ItemModel)
            return def;

        return source;

    }
}

class ListModel extends BaseModel {
    constructor(data, params, item_model) {
        if (!item_model)
            throw new Error(`Модель единицы не определена ${ data }`);

        super();

        this.all = [];

        this._meta.item_model = item_model;
        if (params) {
            this._meta.params = params;

            ['count', 'skip', 'total'].forEach(key => {
                if (kk.is_s(this._meta.params[key]))
                    this._meta.params[key] = parseInt(this._meta.params[key]);

                if (
                    !kk.is_n(this._meta.params[key]) ||
                    isNaN(this._meta.params[key])
                )
                    delete this._meta.params[key];
            });
        }

        if (kk.is_o(data))
            this.update(data);
    }

    get length() {
        return this.all.length;
    }

    filter(callback) {
        if (!kk.is_f(callback))
            throw new Error(`Функция фильтра не задана`);

        return new this.__proto__.constructor(
            this.all.filter(callback)
        );
    }

    sort(callback) {
        if (!kk.is_f(callback))
            throw new Error(`Функция сортировки не задана`);

        return new this.__proto__.constructor(
            this.all.slice(0).sort(callback)
        );
    }

    update(data, silence) {
         if (!data)
            throw new Error(`Некорректные данные ${ data }`);

        const self = this;

        if (data instanceof this.__proto__.constructor)
            data = data.all;

        if (kk.is_A(data)) {
            data.forEach(item => {
                self.update(item, true);
            });
        } else {
            if (!kk.is_o(data))
                throw new Error(`Некорректные данные ${ data }`);

            const instance = (data instanceof self._meta.item_model) ?
                data : new this._meta.item_model(data);

            const existed = self.get(instance.id);

            if (existed)
                existed.update(instance);
            else
                self.all.push(instance);
        }

        silence || this._meta.on_update.dispatch(data);
    }

    has(item) {
        return this.get(item) ? true : false;
    }

    get(item) {
        if (!item)
            return false;

        if (kk.is_o(item) && ('id' in item))
            item = item.id;

        let id;

        if (kk.is_n(item) || kk.is_s(item)) {
            id = parseInt(item);
            if (isNaN(id))
                throw new Error(`Некорректный идентификатор ${ item }`);
        }

        if (!id)
            return false;

        return this.all.find(item => item.id === id);
    }

    get sorted_by_name() {
        const output = this.all.map(item => item);

        output.sort((a, b) => {
            if (a.name > b.name)
                return 1;
            if (a.name < b.name)
                return -1;
            return 0;
        });

        return output;
    }

    get sorted_by_position() {
        const self = this;

        let max_position = self.all
            .map(item => item.position)
            .filter(item => kk.is_n(item));

        max_position = Math.max(...max_position) + 1;

        const output = self.all.map(item => {
            (item.position === null) &&
            (item.position = max_position)

            return item;
        });

        output.sort((a, b) => {
            if (a.position > b.position)
                return 1;
            if (a.position < b.position)
                return -1;

            if (a.name > b.name)
                return 1;
            if (a.name < b.name)
                return -1;

            return 0;

        });

        return output;
    }
}
