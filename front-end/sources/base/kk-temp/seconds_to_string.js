kk.seconds_to_string = seconds => {
    if (!kk.is_n(seconds))
        return seconds;

    const time = [           // 1        2 3 4     5 6 7 8 9
        ['seconds',      1, ['секунда', 'секунды', 'секунд']],
        ['minutes',     60, ['минута', 'минуты', 'минут']],
        ['hours',     3600, ['час', 'часа', 'часов']],
        ['days',     86400, ['день', 'дня', 'дней']],
        ['weeks',   604800, ['неделя', 'недели', 'недель']],
        ['months', 2592000, ['месяц', 'месяца', 'месяцев']],
        ['years', 22118400, ['год', 'года', 'лет']]
    ].map(unit => {
        return {
            unit: unit[0],
            value: Math.abs(Math.round(seconds / unit[1])), // !!!
            forms: unit[2]
        }
    }).filter(unit => Math.abs(unit.value) > 1).pop();

    return `${ time.value } ${ kk.plural(time.value, time.forms) }`;
}
