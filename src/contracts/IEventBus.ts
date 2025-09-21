/**
 * IEventBus
 *
 * Interface representing a simple event bus (observer pattern) for
 * publishing and subscribing to events within the system.
 */
export interface IEventBus {
  /**
   * Publishes an event to all subscribed listeners.
   * @param event Name/type of the event
   * @param data Optional payload to send to listeners
   */
  publish(event: string, data?: unknown): void;

  /**
   * Subscribes a listener callback to a specific event.
   * @param event Name/type of the event to listen for
   * @param callback Function to call when the event is published, receives event data
   */
  subscribe(event: string, callback: (data: unknown) => void): void;

  /**
   * Unsubscribes a previously subscribed listener from a specific event.
   * @param event Name/type of the event
   * @param callback The same callback function that was used in subscribe
   */
  unsubscribe(event: string, callback: (data: unknown) => void): void;
}
