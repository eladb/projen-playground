const { NodeProject } = require('projen');

const project = new NodeProject({
  defaultReleaseBranch: 'main',
  name: 'experiment-projen-self-mutation',
});

project.createBuildWorkflow('SelfMutate', {
  trigger: { push: {} },
  antitamperDisabled: true,
  commit: 'chore: update generated files',
  pushBranch: '$GITHUB_REF',
});

project.synth();
