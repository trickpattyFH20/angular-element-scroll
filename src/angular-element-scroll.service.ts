import { Injectable } from '@angular/core';

import { ElementScrollEvent } from './angular-element-scroll-event';

@Injectable()
export class ElementScrollService {
    events: Array<ElementScrollEvent>;

    constructor() {
        this.events = [];
    }

    addEvent(elementScrollEvent: ElementScrollEvent) {
        if (this.eventsIndex(elementScrollEvent) !== -1) {
            return this.eventsIndex(elementScrollEvent);
        } else {
            this.events.push(elementScrollEvent);
            return (this.events.length - 1);
        }
    }


    perform(input: any) {
        if (typeof(input) === 'ElementScrollEvent') {
            this.performNew(input);
        } else if (typeof(input) === 'number') {
            this.performStored(input)
        } else {
            console.log('Error, input not known');
        }
    }


    performStored(index: number) {
        let elementScrollEvent = this.events[index];
        this.runDelay(elementScrollEvent);
    }


    performNew(elementScrollEvent: ElementScrollEvent) {
        this.runDelay(elementScrollEvent);
    }

    private runDelay(event) {
        setTimeout(() => this.runEvent(event), event.delay);
    }


    private runEvent(event: ElementScrollEvent) {
        if (event.end.getBoundingClientRect().top === 0) {
            this.runDelay(event);
            return false;
        }

        let endHeight = event.end.getBoundingClientRect().top;
        let change = (event.speed);

        //  gets if page needs to go up or down
        let down: boolean;
        if (endHeight > 0) {
            down = true;
        } else {
            change *= -1;
            down = false;
        }

        if (event.scrollEvent) {
            document.addEventListener('scroll', event.event.bind(event));
        }

        if (event.clickEvent) {
            document.addEventListener('click', event.event.bind(event));
        }

        let scrollY = 0;
        event.intId = window.setInterval(() => {
            window.scroll(0, window.scrollY + change);
            scrollY += change;

            if (down) {
                if (scrollY >= (endHeight - event.offset)) {
                    this.stopEvent(event);
                }
            } else {
                if (scrollY <= (endHeight - event.offset)) {
                    this.stopEvent(event);
                }
            }
        }, 10);
    }

    private stopEvent(event) {
        event.stop();

        if (event.scrollEvent) {
            document.removeEventListener('scroll', event.stop);
        }
        if (event.clickEvent) {
            document.removeEventListener('click', event.stop);
        }
    }

    private eventsIndex(event: ElementScrollEvent) {
        let flag: number = -1;

        this.events.forEach((scrollEvent, idx) => {
            if (scrollEvent.end === event.end) {
                flag = idx;
            }
        });

        return flag;
    }

}
