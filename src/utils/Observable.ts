/**
 * A function that observes an event.
 */
export type Observer<T = void> = (event: T) => void;

/**
 * A set of observers for a single kind of event.
 */
export class Observable<T = void> {
  private __observers = new Set<Observer<T>>();

  /**
   * Subscribe to the event.
   *
   * @returns A function that unsubscribes the observer
   */
  public subscribe(observer: Observer<T>): () => void {
    this.__observers.add(observer);

    return () => {
      this.__observers.delete(observer);
    };
  }

  /**
   * Notify all the subscribed observers of the event.
   *
   * @param event The event to pass to the observers. Omit it when `T` is `void`
   */
  public notify(...[event]: [T] extends [void] ? [] : [T]): void {
    for (const observer of this.__observers) {
      observer(event as T);
    }
  }
}
