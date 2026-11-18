// macOS helper for screenshot scripts (JavaScript for Automation):
//
//   osascript -l JavaScript scripts/lib/window-id.js <app name> [title contains]
//
// Prints the CoreGraphics window number of the largest window owned by
// <app name> (on any Space) (optionally whose title contains the given text), for
// `screencapture -l`. Prints nothing if there's no match. Window titles need
// Screen Recording permission.
ObjC.import('CoreGraphics');

function run(argv) {
  const [owner, title] = argv;
  const list = ObjC.deepUnwrap(ObjC.castRefToObject($.CGWindowListCopyWindowInfo($.kCGWindowListOptionAll, 0)));
  const matches = list
    .filter((w) => w.kCGWindowOwnerName === owner && w.kCGWindowLayer === 0)
    .filter((w) => !title || (w.kCGWindowName || '').includes(title))
    .sort((a, b) => b.kCGWindowBounds.Width * b.kCGWindowBounds.Height - a.kCGWindowBounds.Width * a.kCGWindowBounds.Height);
  return matches.length ? String(matches[0].kCGWindowNumber) : '';
}
