// .releaserc.js

// Try to derive branch from environment variables:
const branchFromRef = process.env.GITHUB_REF && process.env.GITHUB_REF.replace(/^refs\/heads\//, '');
const currentBranch = process.env.SEMANTIC_RELEASE_BRANCH || branchFromRef || '';

console.log('Current branch:', currentBranch); // For debugging (remove later)

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
