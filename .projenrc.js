const { TypeScriptProject } = require('projen');
const { JobPermission } = require('projen/lib/github/workflows-model');

const project = new TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'projen-playground',
  description: 'hello, projen4',
  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',
  mergify: false,
});

const autolabel = project.github.addWorkflow('automerge-label');
autolabel.on({ pullRequestTarget: {} });
autolabel.addJobs({
  add_merge_label: {
    runsOn: 'ubuntu-latest',
    permissions: {
      pullRequests: JobPermission.WRITE,
    },
    steps: [
      {
        run: 'gh pr edit ${{ github.event.pull_request.number }} --add-label automerge --repo ${{ github.event.repository.full_name }}',
        env: {
          GITHUB_TOKEN: '${{ secrets.GITHUB_TOKEN }}',
        },
      },
    ],
  },
});

const automerge = project.github.addWorkflow('automerge');

automerge.on({
  pullRequest: { types: ['labeled', 'unlabeled', 'synchronize', 'opened', 'edited', 'ready_for_review', 'reopened', 'unlabeled'] },
  pullRequestReview: { types: ['submitted'] },
  checkSuite: { types: ['completed'] },
  status: {},
});

automerge.addJobs({
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
