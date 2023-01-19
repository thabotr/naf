import Publisher, {
  EventName,
  Subscription,
} from '../../../../../src/shared/utils/publisher';
jest.useRealTimers();

describe('Publisher', () => {
  const newMsgEvent: EventName = 'NEW_MESSAGE';
  const mockCallback = jest.fn().mockName('mockCallback');
  const subscription: Subscription = {
    id: 'some sub',
    callback: mockCallback,
  };
  beforeEach(() => {
    mockCallback.mockClear();
  });
  it('callbacks only executed when subbed events are published', () => {
    Publisher.publish(newMsgEvent);
    expect(mockCallback).toBeCalledTimes(0);
    Publisher.subscribe(newMsgEvent, subscription);
    Publisher.publish(newMsgEvent);
    expect(mockCallback).toBeCalledTimes(1);
  });
  it('returns an unsubscribe callback on subscribe', () => {
    const unsubscibe = Publisher.subscribe(newMsgEvent, subscription);
    unsubscibe();
    Publisher.publish(newMsgEvent);
    expect(mockCallback).toBeCalledTimes(0);
  });
  it('does not duplicate multiple subscriptions to the same event', () => {
    Publisher.subscribe(newMsgEvent, subscription);
    Publisher.subscribe(newMsgEvent, subscription);
    Publisher.publish(newMsgEvent);
    expect(mockCallback).toBeCalledTimes(1);
  });
  it('should pass into the callback any data given to the publish function', () => {
    Publisher.subscribe(newMsgEvent, subscription);
    const data = 'published message';
    Publisher.publish(newMsgEvent, data);
    expect(mockCallback).toBeCalledTimes(1);
    expect(mockCallback).toBeCalledWith(data);
  });
});
