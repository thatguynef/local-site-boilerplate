const COMMANDS = [
  ['dev', 'Start the Astro dev server.'],
  ['build', 'Build the site into dist/.'],
  ['preview', 'Serve the last build.'],
  ['verify', 'Build, then run the structural checks. This is the structure gate.'],
  ['validate:client', 'Check client YAML against the schemas. It does not build the site.'],
  ['client:generate', 'Write src/config/business.ts from the client YAML.'],
  ['scaffold', 'Generate the config and create missing build-now stubs.'],
  ['doctor', 'Report what is still open. It does not replace verify.'],
  ['security-check', 'Scan tracked files for secrets. Also runs inside verify.'],
  ['performance-check', 'Check the built site against the byte budget. Build first. Also runs inside verify.'],
  ['evaluate:content', 'Review built copy. Build first. Not part of verify.'],
  ['evaluate:conversion', 'Review the conversion path against the strategy. Build first. Not part of verify.'],
  ['evaluate', 'Run the content review, then the conversion review. Does not replace verify.'],
  ['test', 'Run the Node tests, including the fixture scaffold.'],
  ['help', 'Print this list.'],
];

export function helpText() {
  const width = Math.max(...COMMANDS.map(([name]) => name.length));
  const lines = ['local-site-boilerplate commands', ''];
  for (const [name, description] of COMMANDS) {
    lines.push(`  npm run ${name.padEnd(width)}  ${description}`);
  }
  lines.push('');
  return lines.join('\n');
}

const invoked = process.argv[1] && process.argv[1].endsWith('help.mjs');
if (invoked) process.stdout.write(helpText());
