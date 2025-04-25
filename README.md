## Getting Started

Follow these steps to set up and run the application locally on `3000` port:

1. Clone the repository

   ```
   git clone https://github.com/mdayat/d3labs.git
   cd d3labs
   ```

2. Install deps and run:

   ```
   pnpm install && pnpm dev
   ```

> **Note:** Don't forget to provide GitHub personal access token as described in `.example.env` file.

## Tech Stack

### Next.js

- Optimizes Lighthouse scores, especially for SEO.
- Includes built-in CSS Module support to prevent CSS specificity issues and naming collisions.

### CSS Module

- Built-in Next.js feature that prevents CSS specificity issues and naming collisions.
- Implements BEM naming convention and code colocation for better maintenance.

## Project Architecture

```
src
  contexts
  dto
  libs
  styles
  components
    Hello
      index.tsx
      Hello.module.css
  pages
    home
      index.tsx
      home.module.css
```

- `contexts`: Stores components that provide values to all children without prop drilling.
- `dto`: Contains schema definitions for GitHub API responses.
- `styles`: Holds global CSS including theme variables and CSS reset.
- Components and pages have their own associated CSS modules (colocation) for easier maintenance.
