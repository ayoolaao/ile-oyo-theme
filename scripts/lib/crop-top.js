// macOS helper for screenshot scripts (JavaScript for Automation):
//
//   osascript -l JavaScript scripts/lib/crop-top.js <png> <height ÷ width>
//
// Crops a PNG in place to the given aspect ratio, keeping the top of the
// image (sips only crops around the center). Example: 0.625 for 16:10.
ObjC.import('AppKit');

function run(argv) {
  const [path, ratio] = argv;
  const rep = $.NSBitmapImageRep.imageRepWithData($.NSData.dataWithContentsOfFile(path));
  const image = rep.CGImage;
  const width = $.CGImageGetWidth(image);
  const height = Math.min($.CGImageGetHeight(image), Math.round(width * Number(ratio)));
  const cropped = $.CGImageCreateWithImageInRect(image, $.CGRectMake(0, 0, width, height));
  const out = $.NSBitmapImageRep.alloc.initWithCGImage(cropped);
  out.representationUsingTypeProperties($.NSBitmapImageFileTypePNG, $()).writeToFileAtomically(path, true);
  return `${width}x${height}`;
}
