import AppKit
import Foundation
import SwiftUI

@MainActor
func imageDetails(_ image: NSImage?) -> [String: Any] {
    guard let image else { return ["loaded": false] }
    return [
        "loaded": true,
        "valid": image.isValid,
        "size": [image.size.width, image.size.height],
        "representations": image.representations.map { representation in
            [
                "pixels": [representation.pixelsWide, representation.pixelsHigh],
                "points": [representation.size.width, representation.size.height],
            ]
        },
    ]
}

@MainActor
func render(_ image: Image, name: String, output: URL) throws -> [String: Any] {
    let renderer = ImageRenderer(
        content: image.renderingMode(.original).resizable().interpolation(.high).scaledToFit()
            .frame(width: 22, height: 22)
            .foregroundStyle(.white.opacity(0.92)))
    renderer.scale = 2
    guard let result = renderer.cgImage else { return ["rendered": false] }
    let bitmap = NSBitmapImageRep(cgImage: result)
    let png = bitmap.representation(using: .png, properties: [:])!
    try png.write(to: output.appending(path: name + ".png"))
    let bytesPerRow = result.width * 4
    let space = CGColorSpace(name: CGColorSpace.sRGB)!
    let context = CGContext(
        data: nil, width: result.width, height: result.height, bitsPerComponent: 8,
        bytesPerRow: bytesPerRow, space: space,
        bitmapInfo: CGBitmapInfo.byteOrder32Big.rawValue | CGImageAlphaInfo.premultipliedLast.rawValue)!
    context.draw(result, in: CGRect(x: 0, y: 0, width: result.width, height: result.height))
    let bytes = context.data!.assumingMemoryBound(to: UInt8.self)
    var visible = 0
    var maximumAlpha: UInt8 = 0
    for index in stride(from: 3, to: bytesPerRow * result.height, by: 4) {
        if bytes[index] > 0 { visible += 1 }
        maximumAlpha = max(maximumAlpha, bytes[index])
    }
    return [
        "rendered": true,
        "size": [result.width, result.height],
        "nontransparent_pixels": visible,
        "maximum_alpha": maximumAlpha,
        "png": output.appending(path: name + ".png").path,
    ]
}

@MainActor
func inspect(bundle: Bundle, label: String, output: URL) throws -> [String: Any] {
    var result: [String: Any] = ["bundle": bundle.bundlePath]
    var paths: [String: String] = [:]
    for name in ["ToolbarMark", "ToolbarMark@2x"] {
        for ext in ["png", "tiff"] {
            if let url = bundle.url(forResource: name, withExtension: ext) {
                paths[name + "." + ext] = url.path
            }
        }
    }
    result["resource_urls"] = paths
    result["swiftui_named"] = try render(
        Image(decorative: "ToolbarMark", bundle: bundle), name: label + "-swiftui-named", output: output)
    result["swiftui_tiff_name"] = try render(
        Image(decorative: "ToolbarMark.tiff", bundle: bundle), name: label + "-swiftui-tiff", output: output)
    let named = bundle.image(forResource: NSImage.Name("ToolbarMark"))
    result["appkit_named"] = imageDetails(named)
    if let named {
        result["appkit_named_render"] = try render(
            Image(nsImage: named), name: label + "-appkit-named", output: output)
    }
    var explicit: [String: Any] = [:]
    for (key, path) in paths.sorted(by: { $0.key < $1.key }) {
        let image = NSImage(contentsOf: URL(fileURLWithPath: path))
        var details = imageDetails(image)
        if let image {
            details["render"] = try render(
                Image(nsImage: image), name: label + "-explicit-" + key, output: output)
        }
        explicit[key] = details
    }
    result["explicit_urls"] = explicit
    return result
}

let output = URL(fileURLWithPath: CommandLine.arguments[3], isDirectory: true)
try FileManager.default.createDirectory(at: output, withIntermediateDirectories: true)
NSApplication.shared.setActivationPolicy(.prohibited)
var reports: [String: Any] = [:]
for (label, path) in zip(["xcode", "swiftpm"], CommandLine.arguments[1...2]) {
    guard let bundle = Bundle(path: path) else { fatalError("Cannot open bundle " + path) }
    reports[label] = try inspect(bundle: bundle, label: label, output: output)
}
let json = try JSONSerialization.data(withJSONObject: reports, options: [.prettyPrinted, .sortedKeys])
try json.write(to: output.appending(path: "report.json"))
FileHandle.standardOutput.write(json)
FileHandle.standardOutput.write(Data("\n".utf8))
