const { typescript } = require('projen');

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: '@eladb/projen-playground',
  repository: 'https://github.com/eladb/projen-playground.git',

  releaseToNpm: true,
  npmRegistryUrl: 'http://npm.pkg.github.com/',
});

project.synth();
