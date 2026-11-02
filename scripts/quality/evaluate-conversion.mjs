import { conversionFindings } from './conversion.mjs';
import { builtPages, conversionInputs, isDirectRun, report } from './report.mjs';

export function runConversion() {
  return report('conversion', conversionFindings(conversionInputs(builtPages())));
}

if (isDirectRun(import.meta.url)) process.exit(runConversion());
