# Contribution Guide

Considering contributing? Thank you so much!

There's a [test framework](./test/README.md) that should be pretty straightforward, one thing that HunchJS could always use more of are thoughtful tests for the different features!

Please consider these simple guidelines when filing a pull request:

- Make pull requests to the `master` branch.
- Features and bug fixes should be covered by test cases. (If you find a bug and don't know how to write a test, that's okay, feel free to open a PR anyway and we can learn together!)
- Commits should follow the [Angular commit convention](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines) but just try your best and it can be sorted out later!
- It should be automatically configured via [.editorconfig](.editorconfig), but use [tabs for indentation, spaces for alignment](https://gist.github.com/saibotsivad/06021a81865226cfc140)

This repo uses [changesets](https://github.com/changesets/changesets) to make releasing updates easier. For you, the contributor, this means you should run `npm run changeset` (or `npx changeset`) when you've got your changes ready. For more details, see this short document on [adding a changeset](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md#i-am-in-a-single-package-repository).
