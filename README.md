[![Build Status](https://dev.azure.com/timokz/dart-idx-generator/_apis/build/status%2Ftimokz.dart-idx-generator?branchName=main)](https://dev.azure.com/timokz/dart-idx-generator/_build/latest?definitionId=1&branchName=main)

# dart-idx-generator

This extension supports the generation of individual and project-wide .index files for dart and Flutter projects,
reducing long and unnecessary important statements, as well as relative imports.

## Features

- Generating an index file, exporting your current directories files.
- Generating index files for your whole project.
- Deleting all index files in your project

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Extension Settings

Customization is availabe through the following settings:


- **Exclude Folders**
  - Folders that should be excluded from the index file generation.
- **Include Subfolders**
  - Include subfolders in the index file generation.
- **File Name**
    - Name your barrel files `"index.dart"` or like the directory they're in`"${package_name}.dart"`



- **Scope**
  - Specify the scope for index file generation (e.g., lib/).


## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...


## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

