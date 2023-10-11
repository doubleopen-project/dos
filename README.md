<!--
SPDX-FileCopyrightText: 2023 Double Open

SPDX-License-Identifier: MIT
-->

<p align="center">
  <img src="./Double_Open_logo.png" width="350" alt="Logo for Double Open">
</p>

<h3 align="center">Double Open Server</h3>

<p align="center">
  Scanner server and curation frontend for open source license compliance.
</p>

# About the Project

Double Open Server (DOS) is a server application that scans the source code of open source
components for license findings, stores the scan results for use in license compliance pipelines and
provides a graphical interface for manually curating the license findings. DOS is currently in early
development.

DOS utilizes [ScanCode Toolkit] for scanning the files and is designed to work with
[OSS Review Toolkit] as a part of its pipeline.

# License

DOS is licensed under the [MIT License](./LICENSE). Copyright (C) Double Open Oy.

[ScanCode Toolkit]: https://github.com/nexB/scancode-toolkit
[OSS Review Toolkit]: https://github.com/oss-review-toolkit/ort
