#!/usr/bin/env node
//@ts-check

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

try {
  const packageJsonPath = resolve(import.meta.dirname, '../package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const version = packageJson.version;

  const outputPath = resolve(import.meta.dirname, '../src/runtime/version.ts');
  const content =
    `// This is file is auto-generated, DO NOT change it manually.\n` +
    `export const version = '${version}';\n`;

  writeFileSync(outputPath, content);
  console.log(`Successfully exported version ${version} to version.ts`);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
