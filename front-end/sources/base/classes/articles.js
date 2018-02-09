class Article extends ItemModel {
    constructor(data) {
        const scheme = kk.convert_scheme([
            'id',
            'headline',
            ['entity', Entity],

            'fixed',
            ['pub_date', Date],
            ['event_start', Date],
            ['event_end', Date],
            'is_promo',

            'annotation',
            'content',

            'posters',
            'galleries',
        ]);

        super(data, scheme);
    }

    update(data, silence) {
        super.update(data, true);

        if (this.event_start || this.event_end) {
            this.event = new ArticleEvent({
                start: this.event_start,
                end: this.event_end,
                is_promo: this.is_promo,
            });

//            console.log(this.event.state, this);
        } else {
            this.event = null;
        }

        silence || this._meta.on_update.dispatch(data);
    }

    get url() {
        return `/articles/${this.id}`;
    }

    get actual_time() {
        return this.event ? this.event.start : this.pub_date
    }

}

class ArticleEvent {
    constructor(params) {
        this.start = params.start;
        this.end = params.end;

        this.is_promo = params.is_promo;

    }

    // В секундах
    get duration() {
        const self = this;

        if (!this.start || !this.end)
            return;

        return Math.round(
            (self.end.getTime() - self.start.getTime()) / 1000
        );
    }

    get state() {
        const start = this.start ? this.start.getTime() : null;
        const end = this.end ? this.end.getTime() : null;

        // До события | во время события | после события
        // scheduled  | started          | ended

        if (start) {
            if (Date.now() < start)
                return 'scheduled';

            if (end && Date.now() >= end)
                return 'ended';

            return 'started';
        } else {
            if (end && Date.now() >= end) {
                return 'ended';
            }

            return 'started';
        }
    }

    get is_waiting_for_end() {
        return (this.state == 'started' && this.end) ? true : false;
    }

    get is_one_day_event() {
        const duration = this.duration;

        return (
            duration &&
            (duration < 86400 * 3) &&
            this.start.getDate() === this.end.getDate()
        ) ? true : false;
    }

    get label() {

        // До события
        if (this.state === 'scheduled') {
            if (this.end) {
                if (this.is_one_day_event) {
                    return `${ kk.date_to_string(this.start) }`;
                } else {
                    return kk.date_range_to_string(this.start, this.end);
                }
            } else {
                return `C ${ kk.date_to_string(this.start) }`;
            }

        // Во время события
        } else if (this.state === 'started') {
            if (this.end) {
                const left = Math.round( (this.end - Date.now()) / 1000 );
                return `Осталось ${ kk.seconds_to_string(left) }`;
            } else {
                return `C ${ kk.date_to_string(this.start) }`;
            }

        // После события
        } else if (this.state === 'ended') {
            if (this.is_one_day_event) {
                return `${ kk.date_to_string(this.start) }`;
            } else {
                return kk.date_range_to_string(this.start, this.end);
            }
        }
    }
}


class Articles extends ListModel {
    constructor(data, params) {
        super(data, params, Article);
    }

    update(data, silence) {
        super.update(data, true);

        this.promo = this.all.filter(article => article.is_promo);
        this.current_promo = this.promo.filter(
            article => article.event && article.event.state === 'started'
        );
        this.upcoming_promo = this.promo.filter(
            article => article.event && article.event.state === 'scheduled'
        );
        this.actual_promo = this.promo.filter(
            article => {
                if (article.event instanceof ArticleEvent)
                    return;

                return
                    article.event.state === 'started' ||
                    article.event.state === 'scheduled'
            });

        silence || this._meta.on_update.dispatch(data);
    }
}
