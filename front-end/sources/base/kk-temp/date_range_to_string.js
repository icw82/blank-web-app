kk.date_range_to_string = (start, end) => {
    if (kk.is_s(start))
        start = new Date(start);

    if (kk.is_s(end))
        end = new Date(end);

    if (kk.is_D(start) && kk.is_D(end)) {
        return `с ${ kk.date_to_string(start) } по ${ kk.date_to_string(end) }`
    } else {
        throw new Error(kk.msg.ia);
    }
}
