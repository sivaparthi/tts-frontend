// .releaserc.js
const branchFromRef = process.env.GITHUB_REF && process.env.GITHUB_REF.replace(/^refs\/heads\//, '');
const currentBranch = process.env.SEMANTIC_RELEASE_BRANCH || branchFromRef || '';

const plugins = [
  '@semantic-release/commit-analyzer',
  '@semantic-release/release-notes-generator'
];

if (currentBranch === 'prod') {
  plugins.push(
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md'
      }
    ],
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'node update-version.js ${nextRelease.version}'
      }
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ],
    // This plugin creates a GitHub release.
    [
      '@semantic-release/github',
      {
        // You can configure additional options if needed.
        // For example, if you want to attach assets, set them here:
        // assets: 'build/**/*'
      }
    ]
  );
}

module.exports = {
  branches: [
    'prod',
    { name: 'uat', prerelease: 'uat' },
    { name: 'qa', prerelease: 'qa' },
    { name: 'dev', prerelease: 'dev' }
  ],
  plugins
};


// module.exports = {
//     branches: [
//       'dev', // Your default branch
//       { name: 'prod', prerelease: false },
//       { name: 'new_uat', prerelease: 'uat' },
//       { name: 'new_qa', prerelease: 'qa' },
//       { name: 'new_qa', prerelease: 'new_qa' } // Add new_qa to recognized branches
//     ],
//     plugins: [
//       '@semantic-release/commit-analyzer',
//       '@semantic-release/release-notes-generator',
//       '@semantic-release/changelog',
//       [
//         '@semantic-release/git',
//         {
//           assets: ['CHANGELOG.md', 'package.json'],
//           message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
//         }
//       ],
//       '@semantic-release/github'
//     ]
//   };
  