[![Build Status](https://dev.azure.com/timokz/dart-idx-generator/_apis/build/status%2Ftimokz.dart-idx-generator?branchName=main)](https://dev.azure.com/timokz/dart-idx-generator/_build/latest?definitionId=1&branchName=main)

# dart-idx-generator

This extension automates the creation of Dart index files (also called barrel-files), organizing exports from files and subdirectories into an indexed format, reducing long and unnecessary import statements, as well as relative imports.
![2023-10-15 23-23-42](https://github.com/timokz/dart-idx-generator/assets/68619123/5e836c89-88b3-4292-bcd7-2e5a43e7322f)


## Features

- Generating an index file, exporting your current directories files.
- Generating index files for your whole project.
- Customization to fit preferences and suggested approaches
- Deleting all index files in your project

Upcoming Feature: choose between index files, and export statements at the top of each file.

## Extension Settings

Customization is availabe through the following settings:


- **Exclude Directories**
  - Directories that should be excluded from the index file generation.
- **Include Subdirectories**
  - Include subdirectories in the index file generation.
- **File Name**
  - Name your barrel files `"index.dart"` or like the directory they're in`"${package_name}.dart"`


- **Scope**
  - Specify the scope for index file generation (e.g., lib/).


## Known Issues

A Buffer Deprecation [Warning](https://github.com/andrewrk/node-fd-slicer/issues/3) can unfortunately not be resolved,
as vscode depends on a module, which itself depends on an unmaintained package, see link provided.

## Release Notes


### 1.0.0

Initial release of basic functionalities.
Potential abuse of diskspace at your own risk.

