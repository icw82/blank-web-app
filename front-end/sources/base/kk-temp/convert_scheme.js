kk.convert_scheme = scheme => {
    if (!kk.is_A(scheme))
        throw new Error('Схема не корректна');

    return scheme.map(item => {
        let key;
        let format;

        if (kk.is_s(item))
            key = item;
        else if (kk.is_A(item)) {
            key = item[0];
            format = item[1];
        } else
            throw new Error('Некорректный элемент схемы', item);

        return {
            key: key,
            format: format
        }
    });
}
