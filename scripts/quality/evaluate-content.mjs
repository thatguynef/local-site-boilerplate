import { contentFindings } from './content.mjs';
import { builtPages, isDirectRun, report } from './report.mjs';

export function runContent() {
  return report('content', contentFindings(builtPages()));
}

if (isDirectRun(import.meta.url)) process.exit(runContent());
