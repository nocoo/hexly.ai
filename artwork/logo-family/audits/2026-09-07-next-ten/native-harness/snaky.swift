import AppKit
import SwiftUI
import SnakyCore

struct AuditFiles: FileExistenceChecker {
    func isExecutableFile(atPath path: String) -> Bool { false }
}
struct AuditShell: ShellExecutor {
    func execute(command: String, timeout: Duration) async throws -> String? { nil }
}

@main
struct LogoAudit {
    @MainActor static func main() throws {
        NSApplication.shared.setActivationPolicy(.prohibited)
        let output = "/Users/nocoo/workspace/personal/hexly.ai/artwork/logo-family/audits/2026-09-07-next-ten/source-browser"
        let bridge = CLIBridge(discovery: CLIDiscovery(fileChecker: AuditFiles(), shellExecutor: AuditShell(), configuredPath: { nil }))
        for theme in [ColorScheme.light, .dark] {
            let name = theme == .dark ? "dark" : "light"
            let content = PopoverContentView(viewModel: AppViewModel(bridge: bridge), dnsLeakViewModel: DnsLeakViewModel(bridge: bridge))
                .environment(\.colorScheme, theme)
            let host = NSHostingView(rootView: content)
            host.appearance = NSAppearance(named: theme == .dark ? .darkAqua : .aqua)
            host.frame = NSRect(x: 0, y: 0, width: 451, height: 818)
            host.layoutSubtreeIfNeeded()
            let bitmap = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: 902, pixelsHigh: 1636, bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
            bitmap.size = host.bounds.size
            host.cacheDisplay(in: host.bounds, to: bitmap)
            let png = bitmap.representation(using: .png, properties: [:])!
            let path = "\(output)/snaky-popover-\(name).png"
            try png.write(to: URL(fileURLWithPath: path))
            print(path)
        }
    }
}
