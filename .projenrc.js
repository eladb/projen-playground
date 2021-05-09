const { TypeScriptProject } = require('projen');

const project = new TypeScriptProject({
  defaultReleaseBranch: 'main',
  projenDuringBuild: false,
  name: 'projen-playgroundx',
  description: 'hello, projen',
});

project.synth();
