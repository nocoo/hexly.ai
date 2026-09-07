import AppKit
import SwiftUI
import OwlCore

@main
struct LogoAudit {
    @MainActor static func main() throws {
        let root = "/Users/nocoo/workspace/personal/owl"
        let output = "/Users/nocoo/workspace/personal/hexly.ai/artwork/logo-family/audits/2026-09-07-redesign/source-browser"
        let mark = NSImage(contentsOfFile: "\(root)/logo.png")!
        let icon = NSImage(contentsOfFile: "\(root)/assets/brand/app-icon-macos.png")!
        for theme in [ColorScheme.light, .dark] {
            let name = theme == .dark ? "dark" : "light"
            let popover = PopoverContentView(appState: AppState(), logoImage: mark, onSettings: {}, onQuit: {})
                .frame(height: 680)
                .environment(\.colorScheme, theme)
            try save(popover, path: "\(output)/owl-popover-\(name).png")
            let general = GeneralTab(launchAtLogin: .constant(false), language: .constant(.en), appearance: .constant(.auto), logoImage: icon)
                .frame(width: 520, height: 520)
                .background(theme == .dark ? Color(white: 0.12) : Color(white: 0.96))
                .environment(\.colorScheme, theme)
            try save(general, path: "\(output)/owl-preferences-\(name).png")
        }
    }

    @MainActor static func save<V: View>(_ content: V, path: String) throws {
        let renderer = ImageRenderer(content: content)
        renderer.scale = 2
        guard let cgImage = renderer.cgImage,
              let png = NSBitmapImageRep(cgImage: cgImage).representation(using: .png, properties: [:]) else {
            fatalError("Native view did not render")
        }
        try png.write(to: URL(fileURLWithPath: path))
        print(path)
    }
}
