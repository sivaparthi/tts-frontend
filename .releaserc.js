// .releaserc.js
// Determine the current branch. semantic-release sets SEMANTIC_RELEASE_BRANCH.
const currentBranch = process.env.SEMANTIC_RELEASE_BRANCH || '';

const plugins = [
  '@semantic-release/commit-analyzer',
  '@semantic-release/release-notes-generator'
];

// Only update the changelog and commit changes when on production.
if (currentBranch === 'prod') {
  plugins.push(
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md'
      }
    ],
    [
      '@semantic-release/git',
      {
        // These assets will be committed only in production releases.
        assets: ['CHANGELOG.md', 'package.json'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ]
  );
}

module.exports = {
  branches: [
    'prod',
    {
      name: 'uat',
      prerelease: 'uat'
    },
    {
      name: 'qa',
      prerelease: 'qa'
    },
    {
      name: 'dev',
      prerelease: 'dev'
    }
  ],
  plugins
};
