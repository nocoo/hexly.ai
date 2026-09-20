---
name: hexly-site-entry
description: Add or standardize the Hexly project-detail link in family website headers during new-project onboarding or dashboard, admin and homepage updates. Use for 新项目接入、右上角入口 and header icon/tooltip consistency; includes GitHub → Hexly → Theme ordering and explicit page exclusions.
---

# Hexly site entry

Make the family entry part of a new project's website onboarding. Preserve the
source product's own visual identity and use its existing controls. Read
[the project contract](../../../AGENTS.md), the selected catalogue record in
`src/data/projects/<id>.json`, and the source repository's instructions first.

## Scope and destination

- Find the existing GitHub and theme controls in shared layouts, dashboards,
  admin consoles, homepages and authentication layouts. Cover each independent
  header, including its mobile variant; reuse shared components where possible.
- Resolve the canonical catalogue ID before adding the link. Its destination is
  **`https://hexly.ai/projects/<id>`**, for example `/projects/pew` or
  `/projects/ocelot`. Repository names, domains and former project names may differ
  from that ID. Use the current project detail route, not the Hexly homepage.
- CLI, native applications and libraries without a website need no synthetic
  web header. Apply the catalogue's archived-project policy to batch work.
- **Ellie exception:** all public forum pages on `https://bbs.tongji.net/`,
  including login/register, have no Hexly entry. `https://admin.tongji.net/`
  keeps its entry, including the admin login page. This is a project/page-specific
  exception; preserve the
  public forum's other buttons and tooltips when maintaining it.

## Placement and appearance

The shared group reads left to right: **GitHub → Hexly → Theme**. Put Hexly
immediately to the right of the GitHub entry and to the left of the theme control.
If there is no GitHub entry, place Hexly immediately before Theme; if there is no
theme control, place it after GitHub in the existing action group. Keep the
remaining product actions in their existing logical groups.

Use an icon-only ghost button/link with the same dimensions, radius, spacing,
foreground, hover surface and focus ring as its neighbours. Match their SVG size
and stroke weight: commonly 16px / 1.5px, or Ocelot's 18px / 1.75px. Keep the
GitHub mark recognizable. Theme icons reflect the selected mode: Monitor for
system, Sun for light, Moon for dark. Hexly uses this single-colour segmented
hexagon, scaled to the host controls:

```svg
<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
     stroke-linejoin="round" aria-hidden="true" focusable="false"
     pointer-events="none">
  <path d="m12 2 8.66 5v10L12 22l-8.66-5V7Z" />
  <path d="M12 2v20M3.34 7l17.32 10m0-10L3.34 17" />
</svg>
```

Reuse an existing Hexly icon helper, or use these paths with the host's SVG/icon
API. This control needs no raster asset, new icon dependency or product palette
change.

## Button, tooltip and cursor contract

- The entry is a real anchor with `target="_blank"` and
  `rel="noopener noreferrer"`. Give it a localized accessible name identifying
  the project, Hexly and the new tab. Follow the host's screen-reader text
  convention; Basalt icon links also include an `sr-only` label inside the link.
- Add or align tooltips for **all neighbouring icon-only controls**, including
  GitHub, theme and product actions. Reuse the host's Tooltip/TooltipProvider:
  compact **12px** text, placement below the header controls, consistent padding,
  offset and delay, available on hover and keyboard focus. Tooltip text does not
  replace the control's accessible name. Avoid a second native `title` tooltip.

  | Control | Example tooltip; use the product's language |
  | --- | --- |
  | GitHub | `GitHub 仓库` / `<Project> on GitHub` |
  | Hexly | `在 hexly.ai 查看 <项目>` / `<Project> on hexly.ai` |
  | Theme | The real next action, such as `切换到深色` / `Use system theme` |
  | Other actions | Their actual purpose/state, such as `检查更新`, `阅读偏好`, `退出登录` |

- **Basalt/Radix:** `TooltipTrigger asChild` wraps the actual Button or LinkButton;
  use `Button asChild` for an anchor where appropriate. **Base UI:** use its
  `render` composition API, including `nativeButton={false}` for a Button
  rendering an anchor. Keep one interactive DOM element and one focus target;
  do not nest a button inside a link or add layout wrappers around every trigger.
- Preserve classes, refs, click handlers, focus restoration and disabled states
  when composing controls. Tooltip uses `data-state` too: toggle selection styles
  should follow `aria-pressed` / `aria-checked` so the tooltip cannot replace them.
- The whole enabled button rectangle must keep the **hand cursor**, including
  padding, rounded corners and SVG strokes/gaps. Put `cursor: pointer` on the
  interactive element and make decorative SVGs ignore pointer events. Basalt's
  shared fix includes a transparent `::before` hit area; preserve it when styling
  the button. Fix conflicts in the shared control/layout instead of adding global
  cursor overrides or page-specific event loops.

Basalt integrations use the shared control fixes from **2.1.8 or a compatible
newer version**. Follow the source project's dependency policy and integration
recipes.
Keep its theme provider, system preference tracking and persistence. Basalt's
three-state control cycles system → light → dark → system; an established
two-state landing-page switch continues to toggle the resolved light/dark mode.
Use a stable accessible name such as `切换主题` / `Toggle theme` and describe the
changing next action in the tooltip.

## Review and delivery

Review the actual destination, header coverage, order, icon styling and tooltip
composition. If interaction labels change, find and update every affected
browser-test selector. Theme tests must assert the resulting mode and retain
persistence/reload checks where present: system → light may leave the visible
colours unchanged. Keep existing behaviour assertions meaningful.

Follow the current task's instructions for dev startup, testing, versioning and
publication, retaining the repository's normal hooks. This UI convention adds no
separate version bump or publication authorization. When release checking is
requested, match the pushed commit to its successful CI **and** deployment run;
a successful push alone does not establish that the UI is online. Report the
source site's real URL and the actual commit/deployment outcome.
