# Single-project brand kit maintenance

These tools extend the frozen `collection-2026-09` exporter for new catalogue
projects and explicit brand versions. The historical collection, recipes and
published bytes stay unchanged. Shared specimen CSS/JS are read-only inputs
from that collection; Sharp and the real site font are existing dependencies.

1. Read `CLAUDE.md`, the project Logo skill and `.agents/skills/hexly-r2-media`.
   Inspect the product and any real original identity. Tools default to material
   3D objects, Web SaaS to animals, and native Mac apps to birds. Obtain the
   exact-byte approval required for a new generated image before finishing it.
2. Prepare one current catalogue entry and
   `artwork/brands/<project>/v<version>/recipe.json`. See Pi Agent Policy's 1.0.0
   recipe for a first identity. Record the actual source archive, baseline,
   generation origin, approved foreground, separate scope and individual motif.
3. Outline type, format mutable inputs, then export from the repository root:

   ```sh
   uv run --with fonttools==4.60.1 --with brotli==1.1.0 python \
     artwork/brands/tools/outline.py pi-agent-policy 1.0.0
   bunx biome check --write artwork/brands/tools/export.ts \
     artwork/brands/pi-agent-policy/v1.0.0/recipe.json
   bun artwork/brands/tools/export.ts pi-agent-policy 1.0.0
   ```

   Both commands reject committed versions. Pass one project and one explicit
   version; there is no implicit bulk rewrite. The wordmark preserves real glyph
   bounds, including descenders. Hero canvases independently place the complete
   artwork; they are authored compositions, not new native image-model outputs.
4. Verify the official file and decoded-pixel hashes, both themes, full frames,
   ICO entries, licensed type and every manifest file. Source record copies
   named `source-*.json` preserve exact archived bytes and are excluded from
   formatting; their byte/hash equality is tested. Do not reformat them.
5. Finish the static study and site views, run asset/profile generation, then
   inventory, publish and verify with the project R2 skill. All new material
   binaries stay outside Git. Run browser checks and normal site release gates.

`method: archived-artwork` describes kit assembly from an approved foreground.
It does not imply the identity was never generated: the recipe explicitly
records whether generation happened for this onboarding, and provenance keeps
the actual model/prompt/raw/approval. Source adoption and package release are
separate. Record real commits; do not invent a previous Logo or a future SHA.

Pi Agent Policy 1.0.1 is a texture-only presentation pilot. Its versioned
`artwork/brands/pi-agent-policy/v1.0.1/refine.ts` inherits and checksums the
published 1.0.0 kit, preserving 50 files exactly while refining texture strokes
and specimen layout. It keeps historical tool hashes intact and rejects any
existing, inventoried or committed output. Do not rerun the generic exporter on
a published kit or spread this contrast change to other projects implicitly.
