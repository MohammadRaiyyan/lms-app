import { EventBus } from "../../../events/EventBus";

describe("EventBus", () => {
  it("should allow subscribing and publishing events", () => {
    const eventBus = new EventBus();
    const mockCallback = jest.fn();
    eventBus.subscribe("TEST_EVENT", mockCallback);
    eventBus.publish("TEST_EVENT", { key: "value" });
    expect(mockCallback).toHaveBeenCalledWith({ key: "value" });
  });

  it("should notify multiple subscribers", () => {
    const eventBus = new EventBus();
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();
    eventBus.subscribe("MULTI_EVENT", mockCallback1);
    eventBus.subscribe("MULTI_EVENT", mockCallback2);
    eventBus.publish("MULTI_EVENT", { data: 123 });
    expect(mockCallback1).toHaveBeenCalledWith({ data: 123 });
    expect(mockCallback2).toHaveBeenCalledWith({ data: 123 });
  });

  it("should not notify unsubscribed listeners", () => {
    const eventBus = new EventBus();
    const mockCallback = jest.fn();
    eventBus.subscribe("UNSUB_EVENT", mockCallback);
    eventBus.unsubscribe("UNSUB_EVENT", mockCallback);
    eventBus.publish("UNSUB_EVENT", { test: true });
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it("should handle publishing with no subscribers gracefully", () => {
    const eventBus = new EventBus();
    expect(() => eventBus.publish("NO_SUBS_EVENT", { foo: "bar" })).not.toThrow();
  });
});
