# CVue -- Resume Builder

![License](https://img.shields.io/github/license/WesleySmits/resume-builder)
![Project Status](https://img.shields.io/badge/status-active-brightgreen)

This project is a modern, web-based resume builder designed specifically for software developers, built using Vue 3 and TypeScript. It originated from the need for a tailored solution to create professional resumes that reflect the unique demands of the software development field. Featuring real-time resume building with a live preview, the application allows users to seamlessly craft resumes across multiple structured sections, including an introduction, skills, education, professional experiences (one page per experience), and a miscellaneous page for additional information.

Primarily developed as a personal tool, this project also serves as a showcase of my expertise with the Vue tech stack, emphasizing dynamic form handling, component-driven architecture, and modern development practices. The application will be deployed publicly to help others craft their resumes and as a testament to continuous improvement in my software engineering journey.

![Screenshot of the Project](./screenshot.png)

## Features

- ✏️ **Real-Time Resume Building**: Update and preview your resume live.
- 👀 **Live PDF Preview**: See how your resume will look while editing.
- 🗂️ **Structured Sections**:
  - General information (name, contact details, profile photo).
  - Skills (languages, frameworks, tools).
  - Education, work experience, and miscellaneous sections.
- ⚙️ **Dynamic Page Allocation**: Automatically allocate pages for work experience and other content.
- 🔖 **Skill Tagging System**: Add skills dynamically with a modern tagging system.
- 🖨️ **PDF Generation**: Generate professional, high-quality PDFs.
- 📱 **Responsive Design**: Fully optimized for all device sizes.

---

## Future Features (Planned)

- 🎨 **Template Support**: Choose from multiple professionally designed resume templates.

---

## **Tech Stack**

- **Framework**: [Vue 3](https://vuejs.org/) with Composition API and TypeScript
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [PostCSS / CSS]
- **State Management**: [Pinia] (if applicable)
- **Other Tools**: [ESLint, Prettier]

---

## **Contributing**

Contributions are welcome! If you’d like to contribute, please fork the repository and submit a pull request.

----

This template should help get you started developing with Vue 3 in Vite.

---

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

This project is proprietary. All rights reserved. Unauthorized use, copying, or distribution is strictly prohibited.
