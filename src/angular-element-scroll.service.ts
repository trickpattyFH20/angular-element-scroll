import { Injectable, NgZone } from '@angular/core';

import { ElementScrollEvent } from './angular-element-scroll-event';

@Injectable()
export class ElementScrollService {
    events: Object;

    constructor(
        private zone: NgZone
    ) {
        this.events = {};
    }

    addEvent(event: ElementScrollEvent) {
        if (!this.events.hasOwnProperty(event.title)) {
            this.events[event.title] =  event;
        }
        return event.title;
    }


    perform(input: any) {
        // let inputType = typeof(input);
        // if (inputType === 'ElementScrollEvent') {
        //     this.performNew(input);
        // } else if (inputType === 'number') {
        //     this.performStored(input)
        // } else {
        //     console.log('Error, input not known');
        // }

        this.performStored(input);
    }


    performStored(title: string) {
        let elementScrollEvent: ElementScrollEvent = this.events[title];
        this.runDelay(elementScrollEvent);
    }


    performNew(elementScrollEvent: ElementScrollEvent) {
        this.runDelay(elementScrollEvent);
    }

    clearEvents() {
        this.events = {};
    }

    removeEvent(title: string) {
        delete this.events[title];
    }

    private runDelay(event:ElementScrollEvent) {
        setTimeout(() => this.runEvent(event), event.delay);
    }


    private runEvent(event: ElementScrollEvent) {
        this.zone.runOutsideAngular(() => {
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
                document.addEventListener('mousewheel', event.event.bind(event));
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
        });
    }

    private stopEvent(event: ElementScrollEvent) {
        this.zone.runOutsideAngular(() => {
            event.stop();
            if (event.scrollEvent) {
                document.removeEventListener('mousewheel', event.event.bind(event));
            }
            if (event.clickEvent) {
                document.removeEventListener('click', event.event.bind(event));
            }
        });
    }

    // private eventsIndex(event: ElementScrollEvent) {
    //     let flag: number = -1;
    //
    //     this.events.forEach((scrollEvent, idx) => {
    //         if (scrollEvent.end === event.end) {
    //             flag = idx;
    //         }
    //     });
    //
    //     return flag;
    // }

}
