import ast
import http.client
import io
import json
from pathlib import Path
import ssl
import tempfile
import time
from unittest.mock import patch


source = Path(__file__).with_name("resume.py")
tree = ast.parse(source.read_text())
connection = next(node for node in tree.body if isinstance(node, ast.ClassDef) and node.name == "HandshakeConnection")


class Socket:
    def __init__(self):
        self.sent = []

    def sendall(self, data):
        self.sent.append(data)

    def makefile(self, *args):
        return io.BytesIO(b"HTTP/1.1 200 OK\r\nContent-Length: 2\r\n\r\nOK")

    def close(self):
        pass


with tempfile.TemporaryDirectory() as temporary:
    log = Path(temporary) / "connections.json"
    namespace = {"native_connection": http.client.HTTPSConnection, "ssl": ssl, "time": time,
                 "json": json, "connection_log": log,
                 "runner": {"now": lambda: "test", "save": lambda p, value: p.write_text(json.dumps(value))}}
    exec(compile(ast.Module(body=[connection], type_ignores=[]), str(source), "exec"), namespace)
    socket = Socket()
    attempts = []

    def connect(client):
        attempts.append(True)
        if len(attempts) == 1:
            raise ssl.SSLEOFError("simulated TLS handshake failure")
        client.sock = socket

    with patch.object(http.client.HTTPSConnection, "connect", connect), patch.object(time, "sleep"):
        client = namespace["HandshakeConnection"]("fixture.invalid")
        client.request("POST", "/images/generations", b"{}")
        response = client.getresponse()
        assert response.status == 200 and response.read() == b"OK"
        assert len(attempts) == 2
        assert b"".join(socket.sent).count(b"POST /images/generations") == 1
        assert b"".join(socket.sent).endswith(b"{}")
        assert len(json.loads(log.read_text())) == 1
        client.close()
print("Passed: TLS reconnect preserves HTTP response state and sends the request once.")
