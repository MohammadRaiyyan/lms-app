import { IEventBus } from "../contracts/IEventBus";

/**
 * EventBus
 *
 * A simple implementation of the observer pattern.
 * Allows components to subscribe to events, unsubscribe, and be notified
 * when events are published. Uses a Map to maintain a set of listeners for each event type.
 */
export class EventBus implements IEventBus {
  /**
   * Internal map of event names to sets of listener callbacks
   */
  private listeners: Map<string, Set<(data: unknown) => void>> = new Map();

  /**
   * Subscribes a listener callback to a specific event.
   * @param event Name of the event to subscribe to
   * @param listener Function to be called when the event is published
   */
  subscribe(event: string, listener: (data: unknown) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  /**
   * Unsubscribes a previously added listener from a specific event.
   * @param event Name of the event
   * @param listener The same callback function that was used in subscribe
   */
  unsubscribe(event: string, listener: (data: unknown) => void) {
    this.listeners.get(event)?.delete(listener);
  }

  /**
   * Publishes an event, notifying all subscribed listeners with optional data.
   * @param event Name of the event to publish
   * @param data Optional payload passed to each listener
   */
  publish(event: string, data?: unknown) {
    this.listeners.get(event)?.forEach((listener) => listener(data));
  }
}
