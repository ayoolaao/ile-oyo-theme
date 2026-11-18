// Weave one strip of aṣọ-òkè, thread by thread.
import Foundation

/// A thread on the loom.
enum Thread: String, CaseIterable {
    case etu = "ẹtù"
    case sanyan = "sányán"
    case alaari = "àlàárì"
}

struct Strip {
    let threads: [Thread]
    var width: Int
    var sewn = false
}

// MARK: - Loom

@MainActor
final class Loom {
    static let stripWidth = 4
    private(set) var passes = 0

    /// Weaves a strip from the given pattern.
    /// - Parameter pattern: Thread names separated by spaces.
    func weave(_ pattern: String, width: Int = 4) -> Strip {
        let threads = pattern
            .split(separator: " ")
            .compactMap { Thread(rawValue: String($0)) }
        passes += threads.count * 2
        return Strip(threads: threads, width: width, sewn: !threads.isEmpty)
    }

    /// Sews strips side by side into one cloth.
    func sew(_ strips: [Strip]) -> String {
        strips
            .filter(\.sewn)
            .enumerated()
            .map { "\($0.offset + 1): \($0.element.threads.map(\.rawValue).joined(separator: " · "))" }
            .joined(separator: "\n")
    }
}

