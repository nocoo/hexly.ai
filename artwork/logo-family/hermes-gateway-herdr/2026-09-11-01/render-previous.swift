import AppKit
import Foundation

// The new profile entry uses an editorial door emoji until a logo is selected.
// Preserve that native macOS rendering as the documented comparison baseline.
let size = 1024
let bitmap = NSBitmapImageRep(
    bitmapDataPlanes: nil, pixelsWide: size, pixelsHigh: size,
    bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
    colorSpaceName: .deviceRGB, bytesPerRow: size * 4, bitsPerPixel: 32
)!
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: bitmap)
NSColor.clear.setFill()
NSRect(x: 0, y: 0, width: size, height: size).fill()
let mark = NSAttributedString(
    string: "🚪", attributes: [.font: NSFont(name: "Apple Color Emoji", size: 800)!]
)
let bounds = mark.size()
mark.draw(at: NSPoint(x: (CGFloat(size) - bounds.width) / 2, y: (CGFloat(size) - bounds.height) / 2))
NSGraphicsContext.restoreGraphicsState()
try bitmap.representation(using: .png, properties: [:])!.write(
    to: URL(fileURLWithPath: "public/logos/emoji/hermes-gateway-herdr.png")
)
