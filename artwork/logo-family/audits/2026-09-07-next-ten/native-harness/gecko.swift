import AppKit
import SwiftUI

@main
struct LogoAudit {
    @MainActor static func main() throws {
        NSApplication.shared.setActivationPolicy(.prohibited)
        let output = "/Users/nocoo/workspace/personal/hexly.ai/artwork/logo-family/audits/2026-09-07-next-ten/source-browser"
        precondition(NSImage(named: "GeckoLogo") != nil)
        for theme in [ColorScheme.light, .dark] {
            let name = theme == .dark ? "dark" : "light"
            let content = AboutView().frame(width: 520, height: 520)
                .background(theme == .dark ? Color(white: 0.12) : Color(white: 0.96))
                .environment(\.colorScheme, theme)
            let renderer = ImageRenderer(content: content)
            renderer.scale = 2
            guard let cgImage = renderer.cgImage,
                  let png = NSBitmapImageRep(cgImage: cgImage).representation(using: .png, properties: [:]) else {
                fatalError("Native view did not render")
            }
            let path = "\(output)/gecko-about-\(name).png"
            try png.write(to: URL(fileURLWithPath: path))
            print(path)
        }
    }
}
