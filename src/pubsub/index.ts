import { EventDispatcher, On } from "type-events";
import { Container } from "typedi";
// import events from "./events";

class Conversion {
    constructor(public userAgent: string, public revenue: number) {}
}

class Impression {
    constructor(public userAgent: string) {}
}

export class TrackingSubscriber {
    @On(Conversion)
    async onConversion(event: Conversion): Promise<void> {
        // do something with conversion events
    }

    // The higher the priority, the sooner it's processed.
    // Priority is not guaranteed for same-priority values.
    @On(Impression, { priority: 255 })
    async onImpression(event: Impression): Promise<void> {
        // do something with impression events
    }
}

export class NotifySlack {
    // `background: true` makes this subscriber run after all other
    // subscribers and doesn't wait for the result to finish
    @On([Impression, Conversion], { background: true })
    async notify(event: Impression | Conversion): Promise<void> {
        switch (event.constructor.name) {
            case "Impression":
                // ...
                break;
            case "Conversion":
                // ...
                break;
        }
    }
}

const dispatcher = new EventDispatcher({
    subscribers: [TrackingSubscriber, NotifySlack],
    container: Container,
});

// then dispatch the events somewhere!
dispatcher.dispatch(new Conversion("Chrome", 13.37));
