// Does work as soon as it is loaded, and exports only a type.
console.log('analytics SDK started');

export interface AnalyticsEvent {
  name: string;
  at: number;
}
