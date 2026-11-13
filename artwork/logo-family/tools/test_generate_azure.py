import base64
import contextlib
import io
import json
import os
from pathlib import Path
import struct
import sys
import tempfile
import unittest
from unittest.mock import MagicMock, patch
import zlib

import generate_azure


def chunk(kind, data):
    payload = kind + data
    return struct.pack(">I", len(data)) + payload + struct.pack(">I", zlib.crc32(payload))


PNG = (
    b"\x89PNG\r\n\x1a\n"
    + chunk(b"IHDR", struct.pack(">IIBBBBB", 1, 1, 8, 6, 0, 0, 0))
    + chunk(b"IDAT", zlib.compress(b"\x00\x30\x37\x2e\xff"))
    + chunk(b"IEND", b"")
)


class ImageRequestTests(unittest.TestCase):
    def test_text_and_reference_requests_preserve_one_raw_response(self):
        for reference in (False, True):
            with self.subTest(reference=reference), tempfile.TemporaryDirectory() as directory:
                root = Path(directory)
                (root / "prompt.txt").write_text("One flat illustration.\n")
                argv = ["generate_azure.py", "--run-dir", str(root), "--size", "1024x1024"]
                if reference:
                    (root / "reference.png").write_bytes(PNG)
                    argv += ["--image", str(root / "reference.png")]
                response = MagicMock()
                response.__enter__.return_value = response
                response.headers = {"x-request-id": "test-request"}
                response.read.return_value = json.dumps({
                    "data": [{"b64_json": base64.b64encode(PNG).decode()}],
                }).encode()
                with (
                    patch.dict(os.environ, {
                        "AZURE_OPENAI_ENDPOINT": "https://example.test/openai/v1",
                        "AZURE_OPENAI_API_KEY": "test-placeholder",
                    }),
                    patch.object(sys, "argv", argv),
                    patch.object(generate_azure, "urlopen", return_value=response) as send,
                    contextlib.redirect_stdout(io.StringIO()),
                    contextlib.redirect_stderr(io.StringIO()),
                ):
                    generate_azure.main()
                    send.assert_called_once()
                    request = send.call_args.args[0]
                    receipt = json.loads((root / "request.json").read_text())
                    self.assertEqual(len(receipt["images"]), int(reference))
                    if reference:
                        self.assertTrue(request.full_url.endswith("/images/edits"))
                        self.assertIn(b'name="image[]"', request.data)
                        self.assertIn(PNG, request.data)
                        self.assertEqual(receipt["contentType"], "multipart/form-data")
                    else:
                        self.assertTrue(request.full_url.endswith("/images/generations"))
                        body = json.loads(request.data)
                        self.assertEqual(body["n"], 1)
                        self.assertIsInstance(body["n"], int)
                        self.assertEqual(body["prompt"], "One flat illustration.\n")
                        self.assertEqual(receipt["contentType"], "application/json")
                    self.assertEqual((root / "raw/generated.png").read_bytes(), PNG)
                    self.assertEqual(json.loads((root / "raw-review.json").read_text())["status"], "pending")
                    self.assertNotIn("test-placeholder", (root / "request.json").read_text())
                    with self.assertRaises(SystemExit):
                        generate_azure.main()
                    send.assert_called_once()


if __name__ == "__main__":
    unittest.main()
