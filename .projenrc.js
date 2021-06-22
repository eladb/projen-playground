const { TypeScriptProject } = require('projen');

const project = new TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'projen-playground',
  description: 'hello, projen',
  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',
});

project.synth();
