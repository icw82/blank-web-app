class ElementEvents {
    constructor(element) {
        if (!kk.is_E(element))
            throw new Error('ElementEvents: Элемент не передан');

        const self = this;

        const available_events = [
            'mutation',
            'node_addition',
            'node_removal',
            'element_addition',
            'element_removal'
        ];

        available_events.forEach(event => {
            this[`on_${event}`] = new kk.Event();
        });

        const observer = new MutationObserver(function(mutations) {
            self.on_mutation.dispatch(mutations);
        });
        observer.observe(element, {childList: true, subtree: true});

        this.on_mutation.addListener(mutations => {
            each (mutations, function(mutation) {
                each (mutation.addedNodes, element => {
                    self.on_node_addition.dispatch(element);
                });
                each (mutation.removedNodes, element => {
                    self.on_node_removal.dispatch(element);
                });
            });
        });

        this.on_node_addition.addListener(element => {
            if (kk.is_E(element))
                self.on_element_addition.dispatch(element);
        });

        this.on_node_removal.addListener(element => {
            if (kk.is_E(element))
                self.on_element_removal.dispatch(element);
        });
    }
}

kk.ElementEvents = ElementEvents;
