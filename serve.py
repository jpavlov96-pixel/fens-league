# Local preview server: like `python3 -m http.server 8420`, but tells the
# browser not to cache, so a normal reload always shows the latest files.
import http.server

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

http.server.ThreadingHTTPServer(('', 8420), NoCacheHandler).serve_forever()
