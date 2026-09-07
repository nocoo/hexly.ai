import AppKit
import CodoCore

@main
struct LogoAudit {
    @MainActor static func main() throws {
        NSApplication.shared.setActivationPolicy(.prohibited)
        let output = "/Users/nocoo/workspace/personal/hexly.ai/artwork/logo-family/audits/2026-09-07-next-ten/source-browser"
        for dark in [false, true] {
            let name = dark ? "dark" : "light"
            let appearance = NSAppearance(named: dark ? .darkAqua : .aqua)!
            let view = BannerContentView(message: CodoMessage(title: "Build completed", body: "Your project is ready to review."))
            view.appearance = appearance
            view.frame = NSRect(x: 0, y: 0, width: 496, height: 178)
            view.layoutSubtreeIfNeeded()
            let mark = view.subviews.compactMap { $0 as? NSImageView }.first!
            precondition(mark.image != nil && mark.frame.width == 40 && mark.frame.height == 40)
            precondition(mark.layer?.cornerRadius == 0 && mark.layer?.masksToBounds == false)
            let bitmap = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: 992, pixelsHigh: 356, bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
            bitmap.size = view.bounds.size
            appearance.performAsCurrentDrawingAppearance { view.cacheDisplay(in: view.bounds, to: bitmap) }
            let path = "\(output)/codo-banner-\(name).png"
            try bitmap.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: path))
            print(path, "transparent mark", mark.frame)
        }
    }
}
