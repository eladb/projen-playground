const { typescript, Component } = require('projen');

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: '@eladb/projen-playground',
  repository: 'https://github.com/eladb/projen-playground.git',

  releaseToNpm: true,
  npmRegistryUrl: 'http://npm.pkg.github.com/',
  minNodeVersion: '16.0.0',
});

class UpgradePatch extends Component {
  postSynthesize() {
    debugger;
    console.log('there');
    const upgradeWorkflow = project.tryFindObjectFile('.github/workflows/upgrade-main.yml');
    upgradeWorkflow.addOverride('jobs.pr.permissions.actions', 'write');
    upgradeWorkflow.addOverride('jobs.upgrade.steps.5', { run: 'echo "noop"' });
    upgradeWorkflow.addOverride('jobs.pr.steps.5', {
      name: 'Trigger build workflow',
      if: "steps.create-pr.outputs.pull-request-url != ''",
      run: "curl -i --fail -X POST -H \"Accept: application/vnd.github.v3+json\" -H \"Authorization: token ${GITHUB_TOKEN}\" https://api.github.com/repos/${{ github.repository }}/actions/workflows/build/dispatches -d '{\"ref\":\"$(git rev-parse HEAD)\"}'",
    });
    upgradeWorkflow.synthesize();
  }
}

new UpgradePatch(project);


project.synth();
