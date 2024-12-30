# Contributing to CVue - Resume Builder

Thank you for considering contributing to CVue! Contributions are what make this open-source project an incredible learning and collaboration opportunity. Any contributions you make are **greatly appreciated**. 🎉

## Table of Contents

- [Getting Started](#getting-started)
- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
    - [Reporting Bugs](#reporting-bugs)
    - [Suggesting Features](#suggesting-features)
    - [Submitting Changes](#submitting-changes)
- [Development Workflow](#development-workflow)
- [Style Guide](#style-guide)
- [License](#license)

---

## Getting Started

1. **Fork the repository**: Create your own fork by clicking the `Fork` button on the top right of this page.
2. **Clone your fork**:
    ```sh
    git clone https://github.com/<your-username>/resume-builder.git
    ```
3. **Create a new branch:**
    ```sh
    git checkout -b feature/your-feature-name
    ```
4. Make your changes in your branch.
5. **Push to your fork:**
    ```sh
    git push origin feature/your-feature-name
    ```

---

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [contact@example.com].

---

## How to Contribute

### Reporting Bugs

If you find a bug, please report it by opening an issue in the repository. Include:

- A clear and descriptive title.
- Steps to reproduce the issue.
- A screenshot or error log, if applicable.
- Suggestions for what you think should happen instead.

### Suggesting Features

We welcome feature requests! Open a new issue and use the Feature Request template. Be sure to explain:

- The problem your feature would solve.
- How it would benefit users.
- Any potential challenges.

### Submitting Changes

If you’re fixing a bug or implementing a feature:

1. Ensure your changes pass all linting and tests (npm run lint and npm run test:unit).
2. Write clear, concise commit messages:

- Follow the conventional commit format, e.g., feat: add live preview to editor.

3. Open a Pull Request (PR) with the following:

- A detailed title and description of the changes.
- A reference to the issue being fixed or feature being added (if applicable).

---

## Development Workflow

### Installing Dependencies

```sh
npm install
```

### Starting the Development Server

```sh
npm run dev
```

### Running Tests

#### Unit tests

```sh
npm run test:unit
```

#### End-to-End tests

```sh
npm run test:e2e
```

### Linting

Ensure your code adheres to the project standards:

```sh
npm run lint
```

---

## Style Guide

- Follow the Vue 3 style guide for component structure and naming conventions.
- Use ESLint and Prettier for consistent formatting.
- Commit messages should follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format.

---

## License

By contributing, you agree that your contributions will be licensed under the same [license as the project](LICENSE).
