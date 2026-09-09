import AppKit
import CoreImage
import ImageIO
import UniformTypeIdentifiers
import Vision

let arguments = CommandLine.arguments
guard arguments.count == 3 else {
    fatalError("Usage: swift vision-mask.swift <source.png> <diagnostic-mask.png>")
}
let sourceURL = URL(fileURLWithPath: arguments[1])
let outputURL = URL(fileURLWithPath: arguments[2])
guard let imageSource = CGImageSourceCreateWithURL(sourceURL as CFURL, nil),
    let image = CGImageSourceCreateImageAtIndex(imageSource, 0, nil)
else {
    fatalError("Cannot decode the preserved source image.")
}
let handler = VNImageRequestHandler(cgImage: image, options: [:])
let request = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([request])
guard let observation = request.results?.first else {
    fatalError("Vision returned no foreground observation.")
}
let mask = try observation.generateScaledMaskForImage(
    forInstances: observation.allInstances,
    from: handler
)
let context = CIContext(options: [.workingColorSpace: NSNull()])
let maskImage = CIImage(cvPixelBuffer: mask)
guard let maskCGImage = context.createCGImage(maskImage, from: maskImage.extent),
    let destination = CGImageDestinationCreateWithURL(
        outputURL as CFURL, UTType.png.identifier as CFString, 1, nil
    )
else {
    fatalError("Cannot encode the diagnostic foreground mask.")
}
CGImageDestinationAddImage(destination, maskCGImage, nil)
guard CGImageDestinationFinalize(destination) else {
    fatalError("Cannot write the diagnostic foreground mask.")
}
print("Saved native-size Vision foreground diagnostic: \(maskCGImage.width)x\(maskCGImage.height).")
