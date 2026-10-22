// A "heavy" module — imagine this is a charting library, password strength
// meter, or PDF generator that adds 50+ KB to the bundle.
// It should only be loaded when actually needed.

export function renderChart(data: number[]): string {
  console.log('Heavy chart library loaded');
  return `[Chart: ${data.join(', ')}]`;
}

export function generateReport(title: string): string {
  console.log('Heavy report generator loaded');
  return `=== ${title} ===\n(report content here)`;
}
