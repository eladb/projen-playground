const { TypeScriptProject } = require('projen');

const project = new TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'projen-playgroundx',
  description: 'hello, projen',
});

project.synth();
