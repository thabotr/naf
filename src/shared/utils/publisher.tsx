export enum Event {
  IDLE = 0,
  START_NOTIFICATION_LISTENER = 1,
  NEW_MESSAGE = 2,
  MESSAGE_SINCE = 10,
}
export type EventName = keyof typeof Event;
export type Subscription = {
  id: string;
  callback: (message?: unknown) => void;
};

const subscriptions: Record<EventName, Subscription[]> = {
  START_NOTIFICATION_LISTENER: [],
  NEW_MESSAGE: [],
  IDLE: [],
  MESSAGE_SINCE: [],
};

const subscribe = (
  event: EventName,
  subscription: Subscription,
): (() => void) => {
  const notSubscribed = !subscriptions[event].find(
    sub => sub.id === subscription.id,
  );
  if (notSubscribed) {
    subscriptions[event].push(subscription);
  }
  const unsubscribe = () =>
    (subscriptions[event] = subscriptions[event].filter(
      sub => sub.id !== subscription.id,
    ));
  return unsubscribe;
};

const publish = (event: EventName, message?: unknown): void => {
  subscriptions[event].forEach(subscription => {
    try {
      subscription.callback(message);
    } catch (e) {
      console.log('eventPublisher->publish', e);
    }
  });
};

const EventPublisher = {
  subscribe: subscribe,
  publish: publish,
};

export default EventPublisher;
