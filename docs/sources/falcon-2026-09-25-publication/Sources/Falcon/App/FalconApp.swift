import AppKit
import FalconCore
import SwiftUI

@main struct FalconApp: App {
    @NSApplicationDelegateAdaptor(FalconDelegate.self) private var delegate
    @State private var runtime = AppRuntime(preview: CommandLine.arguments.contains("--preview"))
    @Environment(\.openWindow) private var openWindow

    var body: some Scene {
        Window("Falcon", id: "main") {
            Group {
                if let model = runtime.workspace {
                    WorkspaceView(model: model, runtime: runtime)
                } else if let error = runtime.startupError {
                    ContentUnavailableView(
                        "Falcon needs attention", systemImage: "exclamationmark.triangle", description: Text(error)
                    ).frame(minWidth: 1120, minHeight: 720)
                } else {
                    ProgressView("Opening your workspace…").frame(minWidth: 1120, minHeight: 720)
                }
            }.task {
                delegate.runtime = runtime
                await runtime.start()
                await delegate.captureIfRequested()
            }.onReceive(NSWorkspace.shared.notificationCenter.publisher(for: NSWorkspace.willSleepNotification)) { _ in
                Task { await runtime.sleep() }
            }.onReceive(NSWorkspace.shared.notificationCenter.publisher(for: NSWorkspace.didWakeNotification)) { _ in
                Task { await runtime.wake() }
            }
        }.defaultSize(width: 1600, height: 1000).windowResizability(.contentMinSize).commands {
            CommandGroup(replacing: .newItem) {
                Button("Open Falcon") {
                    openWindow(id: "main")
                    NSApp.activate()
                }.keyboardShortcut("0")
            }
            CommandGroup(after: .appSettings) {
                Button("Settings…") {
                    runtime.workspace?.page = .settings
                    openWindow(id: "main")
                }.keyboardShortcut(",")
            }
            CommandGroup(after: .sidebar) {
                ForEach(Array([WorkspacePage.decisions, .usage, .sources, .connections].enumerated()), id: \.element) {
                    index, page in
                    Button(page.rawValue) {
                        runtime.workspace?.page = page
                        openWindow(id: "main")
                        NSApp.activate()
                    }.keyboardShortcut(KeyEquivalent(Character(String(index + 1))))
                }
            }
        }
        MenuBarExtra("Falcon", systemImage: "bird") {
            Text("Falcon · \(runtime.statusTitle)")
            Divider()
            Button("Open workspace") {
                openWindow(id: "main")
                NSApp.activate()
            }
            Button(runtime.isPaused ? "Resume service" : "Pause service") { Task { await runtime.togglePause() } }
                .disabled(runtime.preview)
            Divider()
            Button("Quit Falcon") { NSApp.terminate(nil) }.keyboardShortcut("q")
        }
    }
}

@MainActor final class FalconDelegate: NSObject, NSApplicationDelegate {
    var runtime: AppRuntime?
    private var terminating = false
    private var didCapture = false

    func applicationDidFinishLaunching(_ notification: Notification) {
        NSApp.setActivationPolicy(.regular)
        NSApp.activate()
        if CommandLine.arguments.contains("--dark") {
            NSApp.appearance = NSAppearance(named: .darkAqua)
        } else if CommandLine.arguments.contains("--light") {
            NSApp.appearance = NSAppearance(named: .aqua)
        }
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool { false }

    func applicationShouldTerminate(_ sender: NSApplication) -> NSApplication.TerminateReply {
        guard runtime != nil else { return .terminateNow }
        guard !terminating else { return .terminateNow }
        terminating = true
        Task {
            await runtime?.shutdown()
            sender.reply(toApplicationShouldTerminate: true)
        }
        return .terminateLater
    }

    func captureIfRequested() async {
        guard !didCapture, CommandLine.arguments.contains("--preview"),
            let index = CommandLine.arguments.firstIndex(of: "--capture"),
            CommandLine.arguments.indices.contains(index + 1)
        else { return }
        didCapture = true
        if CommandLine.arguments.contains("--focus") { runtime?.workspace?.focusReview = true }
        if CommandLine.arguments.contains("--usage") {
            runtime?.workspace?.page = .usage
            await runtime?.workspace?.refresh(reset: true)
        }
        try? await Task.sleep(for: .seconds(2))
        guard let window = NSApp.windows.first(where: { $0.title == "Falcon" }), let content = window.contentView else {
            return
        }
        content.layoutSubtreeIfNeeded()
        guard let bitmap = content.bitmapImageRepForCachingDisplay(in: content.bounds) else { return }
        content.cacheDisplay(in: content.bounds, to: bitmap)
        guard let data = bitmap.representation(using: .png, properties: [:]) else { return }
        do { try data.write(to: URL(fileURLWithPath: CommandLine.arguments[index + 1]), options: .atomic) } catch {
            runtime?.startupError = error.localizedDescription
        }
        await runtime?.shutdown()
        runtime = nil
        NSApp.terminate(nil)
    }
}
