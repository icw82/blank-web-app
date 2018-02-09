if (!('dom' in kk)) {
    kk.dom = {
        register: {
            initiated: []
        }
    }

    // Вызов обработчика handler при пояявлении в DOM элемента,
    // удовлетворяющего запросу query
    kk.dom.init = (query, handler) => {
        if (!kk.is_s(query))
            throw new TypeError();

        run();

        const observer = new MutationObserver(run);
        observer.observe(document, {childList: true, subtree: true});

        function run() {
            document.querySelectorAll(query).forEach(item => {
                if (!!~kk.dom.register.initiated.indexOf(item))
                    return;

                kk.dom.register.initiated.push(item);
                handler(item);
            });
        }
    }
}
