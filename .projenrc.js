const { NodeProject } = require('projen');

const project = new NodeProject({
  defaultReleaseBranch: 'main',
  name: 'new-name',
});

const workflow = project.github.addWorkflow('SelfMutate');
workflow.on({ push: {} });
workflow.addJobs({
  update: {
    'runs-on': 'ubuntu-latest',
    'env': {
      CI: true
    },
    'steps': [
      {
        name: 'Checkout', 
        uses: 'actions/checkout@v2'
      },
      ...project.installWorkflowSteps,
      {
        name: 'Set git identity',
        run: [
          'git config user.name "Self Mutate"',
          'git config user.email "github-actions@github.com"',
        ].join('\n'),
      },
      {
        name: 'Build',
        run: project.runTaskCommand(project.buildTask),
      },
      {
        name: 'Commit changes',
        run: `git diff --exit-code || git commit -am "update generated files"`,
      },
      {
        name: 'Push commits',
        run: 'git push origin $GITHUB_REF',
      },
    ]
  }
})

project.synth();
