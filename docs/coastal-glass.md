# Coastal Glass Design System

Coastal Glass is the project-wide visual foundation for the web application. Tokens live in `app/globals.css`; use them instead of introducing one-off colors, spacing, or effects in components.

## Core palette

| Token               | Value     | Use                                         |
| ------------------- | --------- | ------------------------------------------- |
| `--color-primary`   | `#00A8E8` | Primary actions and key interactive accents |
| `--color-secondary` | `#70D6FF` | Secondary highlights and hero emphasis      |
| `--color-text`      | `#0F172A` | Primary text and Deep Ocean Slate surfaces  |
| `--color-canvas`    | `#F4F7FB` | Page background                             |
| `--color-surface`   | `#FFFFFF` | Cards and opaque content surfaces           |
| `--color-frost`     | `#E2E8F0` | Borders and frosted-glass edges             |

The stylesheet also defines derived interaction colors, typography, a spacing scale, radii, shadows, gradients, control sizing, and glass blur. Add future theme changes to tokens first.

## Reusable styles

- `.glass-surface` is for navigation and the featured-place search panel. It has an opaque fallback and a 68% white surface with 18px blur and 160% saturation where backdrop filtering is supported. The navigation uses 76% white; the search uses 70% white.
- Decorative floating surfaces use `.glass-float` at 30% white opacity. Text-heavy glass surfaces use at least 62% opacity for legibility, as in `.hero-glass-note`.
- `.button`, `.button-primary`, and `.button-secondary` standardize primary and secondary actions, including hover, active, disabled, and keyboard-focus states.
- `.input` and `.field-error` provide a shared accessible input and validation-error treatment for forms when introduced.
- `.card` provides the opaque content-card baseline. Glass is not a default for reading surfaces.

The homepage header, compact coastal hero, and local featured-destination search demonstrate the navigation, button, and selective glass treatments. The search currently matches only the three featured homepage destinations; it does not call a backend search API. Reduced-motion preferences are respected globally. The mobile header keeps its page navigation visible in a separate row, and the search stacks its field and action vertically.
