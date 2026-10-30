import { AnalyticsEvent } from './analytics.ts';

const signup: AnalyticsEvent = { name: 'signup', at: Date.now() };

console.log(signup.name);
