# SLDS Starter Kit (React)

A starter for prototyping Salesforce experiences, with SLDS 1/2 switching and dark mode previews. Build and preview locally, then publish a link to share your prototype.

Built with React, TypeScript, Vite, Salesforce Lightning Design System (SLDS), and [`@salesforce/design-system-react`](https://github.com/salesforce/design-system-react). It is the React counterpart of the [SLDS Starter Kit (LWC)](https://github.com/salesforce-ux/slds-starter-kit-lwc).

## Get started

Clone or copy this repository, open it in your coding agent, and ask:

> Run this project.

Requires Node.js 20.19 or later.

To run it yourself:

```bash
npm install
npm run dev
```

If `npm install` reports peer dependency conflicts, run `npm install --legacy-peer-deps`.

## Build with your coding agent

Describe the experience you want to create:

> Create an account dashboard with summary cards and a contacts table.

The project includes agent instructions and project skills. A consistent component structure and working examples help your agent build on existing patterns and use Salesforce components.

Iterate by describing changes, sharing screenshots, or pointing to an existing experience as a reference.

## What's included

- SLDS styles and `design-system-react` components.
- Standard, Console, and Builder app layouts.
- Sample Home, Icons, Contacts, and contact detail pages.
- Light/dark themes and SLDS 1/2 switching.
- Local development with hot reload and page navigation.
- Unit tests (Vitest) and visual-regression tests (Playwright).

## Share your prototype

Ask your agent:

> Deploy this project to GitHub Pages and give me the link.

The project includes guided setup for a GitHub repository and first deployment. Ask your agent to deploy again whenever you want to publish updates.

The deployment command is `npm run deploy`. See the [deployment reference](docs/development.md#github-pages) for setup details.

## Further reading

- [Development reference](docs/development.md): project structure, routing, styling, testing, and deployment.
- [Lightning Design System](https://lightningdesignsystem.com)
- [`design-system-react`](https://github.com/salesforce/design-system-react)
- [Contributing](CONTRIBUTING.md) · [Security](SECURITY.md) · [License](LICENSE.txt)
