// A "heavy" module: imagine a charting library or a PDF generator that adds 50+ KB
// to the bundle. This line runs when the module is first loaded, not when a function is called:
console.log('heavy.ts loaded');

export function renderChart(data: number[]): string {
  return `[Chart: ${data.join(', ')}]`;
}

export function generateReport(title: string): string {
  return `=== ${title} ===\n(report content here)`;
}
