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

# Setting up the development environment

To run this project you will need Node.js, npm and Docker installed.

1.  Clone the repository

    ```shell
    git clone https://github.com/doubleopen-project/dos.git
    ```

2.  Go to project root `cd dos` and install dependencies with `npm i`

3.  Set needed environment variables.

    Create a .env file in the project root, and set the following environment variables in the file:

    ```shell
    DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
    ```

    See [.env.example](https://github.com/doubleopen-project/dos/blob/main/.env.example) file for other non-compulsory configurable variables.

4.  Start containers (in detached mode with -d):

    ```shell
    docker compose up -d
    ```

    This will setup PostgreSQL, Minio S3 storage and Redis work queue, and a Scanner Worker.

5.  Run migrations to the database and seed it with test data (this command can also be used to reset the database):

    ```shell
    npm run db:migrate:reset

    ```

6.  Start apps:

    ```shell
    npm run dev
    ```

    This will start the Clearance UI and the API.

> [!NOTE]
> In case of build errors for the database package you may need to generate the Prisma client with
>
> ```shell
> npm run db:generate
> ```

# License

DOS is licensed under the [MIT License](./LICENSE). Copyright (C) Double Open Oy.

[ScanCode Toolkit]: https://github.com/nexB/scancode-toolkit
[OSS Review Toolkit]: https://github.com/oss-review-toolkit/ort
