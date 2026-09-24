# Local collector

Kite observes Pi through an extension and stores a local execution trace. Pi remains the interactive CLI. The collector does not send prompts, choose tools, change context, answer confirmations, or drive the agent.

## Data contract

The transport envelope describes facts: source, producer identity, sequence, capture time, session and execution correlation. The event name and JSON payload belong to the source. The collector accepts new event names without understanding Pi's lifecycle. There are no animation states, UI coordinates, or inferred reasoning stages in the stored schema.

Producer identity is independent of a durable Pi session ID. Reloads and separate processes can observe the same session; they must not reuse the same producer/sequence identity. A collector cursor orders committed storage records. It is not a causal clock across independent producers.

Capturing a hook records what this extension observed at its position in Pi's handler chain. It does not prove that later handlers left the value unchanged. Tool execution-start means an attempt has begun, including validation and policy checks; agent-end does not mean automatic recovery has finished. Preserve those event names and interpret them only in a future consumer.

## Capture boundaries

Detailed local traces can contain user prompts, system instructions, thinking supplied by the provider, file paths, tool arguments, tool results and generated text. They are private application data, not an anonymized analytics feed. Credential-shaped fields and binary/image data are filtered, but a secret embedded in ordinary prose cannot be reliably recognized. Keep the storage directory private and review traces before sharing them.

Assistant streaming records contain deltas rather than repeated cumulative messages. Final messages remain authoritative. Oversized or unsupported data must carry explicit omission/truncation information. Serialized snapshots must not retain references that Pi can mutate later.

The observer does not monkey-patch Pi or install global hooks. Extension-only capture cannot obtain the SDK/RPC-only retry countdown and full queue events. It also cannot see arbitrary child sessions or internal work inside another extension. The unreleased `provider_stream_event` event is not advertised as part of the Pi 0.87.1 contract.

## Delivery guarantees

Event callbacks enqueue bounded work and return without awaiting the collector. A separate exporter batches records over a local Unix socket. The collector acknowledges a batch after a database transaction commits. Retrying an acknowledged or uncertain batch must not create duplicate events; conflicting content under an existing identity is an error.

Delivery is best effort while Pi runs. Bounded memory means a long collector outage can lose events. Forced process termination can lose the unacknowledged tail. Sequence gaps, loss diagnostics and capture limits must remain visible to consumers; a trace is not implicitly complete because its last record exists.

Shutdown gets a bounded flush opportunity. Cleanup must terminate owned timers, requests and sockets. The collector never takes over an existing socket by blindly deleting it, and it does not expose a TCP listener.

## Verification scope

Unit tests exercise event validation, immutable and bounded capture, producer/session correlation, batching, retries, overflow, shutdown, transaction rollback, duplicate/conflicting identities, cursor queries and local HTTP boundaries. All production TypeScript belongs to the four-metric coverage scope. The research-only Python probe and generated build output are separate from that scope.

An isolated Pi acceptance probe complements UT: it runs a local fake provider with a transient failure, parallel tools, a blocked tool and an invalid tool. This checks the extension against the installed Pi runtime without paid model calls or personal provider configuration.

See [the research](research/pi-execution-visualization.md) for the version-specific event inventory and source evidence.
