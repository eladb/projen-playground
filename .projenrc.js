const { TypeScriptProject } = require('projen');

const project = new TypeScriptProject({
  defaultReleaseBranch: 'main',
  projenDuringBuild: false,
  name: 'projen-playground',
  description: 'hello, projen',
});

project.synth();
