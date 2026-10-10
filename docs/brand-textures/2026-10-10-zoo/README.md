# Zoo texture adoption

The owner approved both complete native Flare canvases on 2026-10-10. Logo
approval is separate in `artwork/logo-family/zoo/2026-10-10-01/raw-review.json`.

`inventory.json` records the first local v1.0.0 export. Before publication,
validation required explicit full-canvas/no-crop/no-repeat inspection fields.
`export-inventory.json` selects v1.0.1 with those accurate inspection fields;
the first pack stays preserved and inactive. No generation was repeated and no
published bytes were overwritten. Only v1.0.1 is selected by the catalogue.
Both native outputs remain unchanged; their full-canvas material analogy is
paperboard fibers and rounded-card impressions, not animal habitat.

The first profile-generation pass omitted the required presentation-icon package;
the existing complete-coverage test caught it. Zoo now has an independent
`/icons/zoo/v1.0.0/` pack using the approved light texture and unchanged transparent
foreground, exported with the existing composition recipe restricted to Zoo.
The two generated license files preserve the exporter's trailing blank line;
`git diff --check` reports it, but immutable export bytes are not reformatted.
