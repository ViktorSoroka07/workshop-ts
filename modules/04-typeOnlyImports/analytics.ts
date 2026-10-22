// A module with a side effect: it does something as soon as it is loaded.
console.log('analytics SDK started');

export interface AnalyticsEvent {
  name: string;
  at: number;
}
