class Pagination {
    constructor(params) {
        this.model = [];

        this.pages = Math.ceil(params.total / params.count);
        this.current = Math.ceil(params.skip / params.count) + 1;

        this.calc();
    }

    calc() {
        const self = this;
        this.model = [];

//        console.log('pages', self.pages);
//        console.log('curent', self.current);

        if (this.pages < 2)
            return;

        if (this.pages <= 10) {
            this.model = Array(this.pages).fill().map((x, i) => i + 1);

        } else if (self.current + 5 <= self.pages) {
            if (self.current <= 5) {
                kk.each (Math.max(self.current, 3) + 2, (x, i) => {
                    self.model.push(i + 1);
                });

            } else {
                self.model.push(1);
                self.model.push(false);
                kk.each (5, (x, i) => {
                    self.model.push(self.current - 2 + i);
                });
            }

            self.model.push(false);
            self.model.push(self.pages);
        } else {
            let length = self.pages - Math.min(self.current, self.pages - 2) + 3;

            if (isNaN(length)) {
                console.warn('Ошибка в подсчёте');
                return;
            }

            kk.each (length, (x, i) => {
                self.model.push(self.pages - i);
            }, true);

            self.model.unshift(false);
            isel.modelst.unshift(1);
        }
    }
}
