import { vi } from 'vitest';
import '@testing-library/jest-dom';

// ── TEMPORARY WORKAROUND — remove when DSR v11 menu positioning is fixed upstream ──
// (Also see the raised testTimeout in vite.config.ts, which is part of the same
// workaround.)
//
// PR #3195 migrates DSR's menu Dialog positioning from popper.js v1 to
// @floating-ui/dom. The Dialog subscribes to continuous re-positioning via
// `autoUpdate` (scroll/resize/layout-shift listeners + observers). jsdom has
// no layout engine, so each re-position runs `computePosition` (which leans on
// the very slow jsdom `getComputedStyle`), and `autoUpdate` fires it
// repeatedly — pushing a single menu-open from milliseconds (old popper build)
// to ~4–13s and making the suite appear to hang. At runtime this is correct
// and fast (verified in a real browser via Playwright); only the jsdom test
// path is pathological.
//
// Mock `autoUpdate` to position once and return a no-op cleanup: the menu
// still opens and positions, we just drop the continuous re-update that has no
// observable effect in a static jsdom document. This is a test-only shim —
// app code, runtime behaviour, and the DSR public-export surface are all
// untouched. Delete this mock (and restore vite.config.ts's default
// testTimeout) once the PR's Dialog positioning no longer thrashes in jsdom.
// `@floating-ui/dom` is DSR's transitive dependency, not a direct one here, so
// its types aren't resolvable from this project's tsconfig — hence the loose
// `Record<string, unknown>` typing (the specifier still resolves at runtime
// via the DSR install, which is all vi.mock needs).
vi.mock('@floating-ui/dom', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    autoUpdate: (_reference: unknown, _floating: unknown, update: () => void) => {
      update();
      return () => {};
    },
  };
});
