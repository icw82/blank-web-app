kk.get_id_from_request = (request, name) => {
    // Если запрос по идентификатору
    if (kk.is_n(request) || kk.is_s(request))
        return request;

    // Если запрос по идентификатору в объекте
    if (kk.is_n(request.id) || kk.is_s(request.id))
        return request.id;

    // Если идетификатор передаётся свойством article
    // Когда неизвестно, article обработана или нет
    if (kk.is_n(request[name]) || kk.is_s(request[name]))
        return request[name];
}
