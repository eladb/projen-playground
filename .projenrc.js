const { TypeScriptProject } = require('projen');
const { JobPermission } = require('projen/lib/github/workflows-model');

const project = new TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'projen-playground',
  description: 'hello, projen!',
  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',
  mergify: false,
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    label: 'automerge',
  },
});

const workflow = project.github.addWorkflow('automerge');
workflow.on({
  pullRequest: { types: ['labeled', 'unlabeled', 'synchronize', 'opened', 'edited', 'ready_for_review', 'reopened', 'unlabeled'] },
  pullRequestReview: { types: ['submitted'] },
  checkSuite: { types: ['completed'] },
  status: {},
});

workflow.addJobs({
  automerge: {
    runsOn: 'ubuntu-latest',
    permissions: {
      contents: JobPermission.WRITE,
      pullRequests: JobPermission.WRITE,
      checks: JobPermission.WRITE,
      statuses: JobPermission.WRITE,
    },
    steps: [
      {
        name: 'automerge',
        uses: 'pascalgn/automerge-action@v0.14.2',
        env: {
          MERGE_METHOD: 'squash',
          GITHUB_TOKEN: '${{ secrets.GITHUB_TOKEN }}',
          MERGE_COMMIT_MESSAGE: 'pull-request-title-and-description',
          MERGE_COMMIT_MESSAGE_REGEX: '(.*)^---',
          MERGE_DELETE_BRANCH: 'true',
        },
      },
    ],
  },
});

project.synth();
