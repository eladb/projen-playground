const { typescript, Component } = require('projen');

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: '@eladb/projen-playground',
  repository: 'https://github.com/eladb/projen-playground.git',
  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',
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
      run: 'curl --fail -X POST -H "Accept: application/vnd.github.v3+json" -H "Authorization: token ${GITHUB_TOKEN}" https://api.github.com/repos/${{ github.repository }}/actions/workflows/build.yml/dispatches -d "{\\"ref\\":\\"$GITHUB_REF_NAME\\"}"',
    });
    upgradeWorkflow.synthesize();
  }
}

new UpgradePatch(project);


project.synth();
