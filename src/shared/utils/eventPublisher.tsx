export enum EventType {
  IDLE = 0,
  START_NOTIFICATION_LISTENER = 1,
  NEW_MESSAGE = 2,
}
export type EventTypeString = keyof typeof EventType;
export type SubscriberType = () => void;

class EventPublisher {
  subscriptions: Record<EventTypeString, SubscriberType[]> = {
    START_NOTIFICATION_LISTENER: [],
    NEW_MESSAGE: [],
    IDLE: [],
  };
  subscribe(event: EventTypeString, callback: SubscriberType): () => void {
    const isAlreadySubscribed = !!this.subscriptions[event].find(
      subber => subber === callback,
    );
    if (!isAlreadySubscribed) {
      this.subscriptions[event].push(callback);
    }
    return () => {
      this.subscriptions[event] = this.subscriptions[event].filter(
        subber => subber !== callback,
      );
    };
  }
  publish(event: EventTypeString): void {
    this.subscriptions[event].forEach(subscriber => {
      try {
        subscriber();
      } catch (e: unknown) {
        console.log((e as Error).message);
      }
    });
  }
}
export {EventPublisher};
