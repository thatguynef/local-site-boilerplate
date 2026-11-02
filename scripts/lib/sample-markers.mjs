export const SAMPLE_MARKERS = [
  'Example Plumbing',
  'Example City',
  '(555) 010-0199',
  '+15550100199',
  'hello@example.com',
];

export function sampleLeakHits(text) {
  return SAMPLE_MARKERS.filter((marker) => text.includes(marker));
}
