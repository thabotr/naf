import pubSub, {
  EventTypeString,
} from '../../../../../src/shared/utils/eventPublisher';

jest.useRealTimers();

describe('EventPublisher', () => {
  const newMsgEvent: EventTypeString = 'NEW_MESSAGE';
  describe('subscribe', () => {
    const mockSubscriber = jest.fn().mockName('mockSubscriber');
    it(
      'given an event type and a subscriber it will add tha subsribers to the list of' +
        'subscribers for that event type',
      () => {
        expect(pubSub.subscriptions[newMsgEvent]).not.toContain(mockSubscriber);
        pubSub.subscribe(newMsgEvent, mockSubscriber);
        expect(pubSub.subscriptions[newMsgEvent]).toContain(mockSubscriber);
      },
    );
    it('returns a function which when called unsubscribes the the subscriber from the event type', () => {
      const unsubscibe = pubSub.subscribe('NEW_MESSAGE', mockSubscriber);
      unsubscibe();
      expect(pubSub.subscriptions.NEW_MESSAGE).not.toContain(mockSubscriber);
    });
    it('subscribes the same function only once to the same event', () => {
      pubSub.subscribe(newMsgEvent, mockSubscriber);
      pubSub.subscribe(newMsgEvent, mockSubscriber);
      const numberOfsubscriptions = pubSub.subscriptions[newMsgEvent].filter(
        subber => subber === mockSubscriber,
      ).length;
      expect(numberOfsubscriptions).toBe(1);
    });
  });
  describe('publish', () => {
    const mockSubscriber = jest.fn().mockName('mockSubscriber');
    pubSub.subscribe(newMsgEvent, mockSubscriber);
    it('it calls all the subscribers to the given event type', () => {
      const mock2ndSubscriber = jest.fn().mockName('mock2ndSubscriber');
      pubSub.subscribe(newMsgEvent, mock2ndSubscriber);
      pubSub.publish(newMsgEvent);
      expect(mockSubscriber).toBeCalledTimes(1);
      expect(mock2ndSubscriber).toBeCalledTimes(1);
    });
    it('it does not fail when any of the subscribers throws an error', () => {
      const anError = new Error('error thrown by mockSubscriber');
      mockSubscriber.mockImplementation(() => {
        throw anError;
      });
      expect(() => pubSub.publish(newMsgEvent)).not.toThrow(anError);
    });
  });
});
