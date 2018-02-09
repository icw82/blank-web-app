kk.date_to_string = input => {
    const months = [
        'января',
        'февраля',
        'марта',
        'апреля',
        'мая',
        'июня',
        'июля',
        'августа',
        'сентября',
        'октября',
        'ноября',
        'декабря'
    ];

    let output = [];
    let now = new Date();

    if (kk.is_s(input)) {
        input = new Date(input);
    }

    if (!(kk.is_D(input)))
        return input;

    let day = input.getDate();
    let month = months[input.getMonth()];
    let year = input.getFullYear();

    output.push(day);
    output.push(month);

    if (year !== now.getFullYear())
        output.push(year);

    return output.join(' ');
}
