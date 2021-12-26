const { typescript } = require('projen');

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: '@eladb/projen-playground',
  repository: 'https://github.com/eladb/projen-playground.git',

  releaseToNpm: true,
  npmRegistryUrl: 'http://npm.pkg.github.com/',
  minNodeVersion: '16.0.0',
});

project.synth();
