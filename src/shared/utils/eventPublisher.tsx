export enum EventType {
  IDLE = 0,
  START_NOTIFICATION_LISTENER = 1,
  NEW_MESSAGE = 2,
}
export type EventTypeString = keyof typeof EventType;
export type SubscriberType = () => void;

const subscriptions: Record<EventTypeString, SubscriberType[]> = {
  START_NOTIFICATION_LISTENER: [],
  NEW_MESSAGE: [],
  IDLE: [],
};

const subscribe = (
  event: EventTypeString,
  callback: SubscriberType,
): (() => void) => {
  const isAlreadySubscribed = !!subscriptions[event].find(
    subber => subber === callback,
  );
  if (!isAlreadySubscribed) {
    subscriptions[event].push(callback);
  }
  return () => {
    subscriptions[event] = subscriptions[event].filter(
      subber => subber !== callback,
    );
  };
};

const publish = (event: EventTypeString): void => {
  subscriptions[event].forEach(subscriber => {
    try {
      subscriber();
    } catch (e: unknown) {
      console.log((e as Error).message);
    }
  });
};

const EventPublisher = {
  subscriptions: subscriptions,
  subscribe: subscribe,
  publish: publish,
};

export default EventPublisher;
