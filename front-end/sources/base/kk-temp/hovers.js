//
//(() => {
//
//    return;
//
//    const get_element = event => {
//        if (event.target.hasAttribute('href'))
//            return event.target;
//
//        return each (event.path,
//            item => (
//                kk.is_E(item) &&
//                item.hasAttribute('href')
//            ) ? item : false
//        );
//    }
//
//    const get_url = element =>
//        kk.is_E(element) ? element
//            .getAttribute('href')
//            .replace(/[\n\r\b\t]/g, '') : false;
//
//    const get_selector = url =>
//        kk.is_s(url) ? 'a[href="' + url + '"]' : false;
//
//    const is_ignored = element => false; // Заглушка
//
//    const mouseover = event => {
//        if (
//            event.isTrusted &&
//            !is_ignored(event.target)
//        ) {
//            each (get_selector(get_url(get_element(event))), target => {
//                target.classList.add('hover');
//            });
//        }
//    }
//
//    const mouseout = event => {
//        if (
//            event.isTrusted &&
//            !is_ignored(event.target)
//        ) {
//            each (get_selector(get_url(get_element(event))), target => {
//                target.classList.remove('hover');
//            });
//        }
//    }
//
//    const add = item => {
//        item.removeEventListener('mouseover', mouseover);
//        item.removeEventListener('mouseout', mouseout);
//
//        item.addEventListener('mouseover', mouseover);
//        item.addEventListener('mouseout', mouseout);
//    }
//
//    each ('a[href]', add);
//
//    const DOM_observer = new MutationObserver(mutations => {
//        each (mutations, mutation => {
//            if (
//                mutation.type === 'attributes' &&
//                mutation.attributeName === 'href'
//            ) {
//                add(mutation.target);
//            } else if (mutation.addedNodes.length > 0) {
//                each (mutation.addedNodes, node => {
//                    if (kk.is_E(node)) {
//                        if (node.hasAttribute('href')) {
//                            add(node);
//                        } else {
//                            each (node.querySelectorAll('a[href]'), add);
//                        }
//                    }
//                });
//            }
//        });
//    });
//
//    DOM_observer.observe(document, {
//        childList: true,
//        subtree: true,
//        attributes: true
//    });
//
//})();
