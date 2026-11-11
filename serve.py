# Local preview server: like `python3 -m http.server 8420`, but tells the
# browser to check every file with the server before using its copy, so a normal
# reload always shows the latest files. ("no-cache" rather than "no-store": an
# unchanged file, like the 3.3MB ball video, comes back as a quick "not modified"
# instead of downloading again on every page, as on the hosting.)
import http.server

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

http.server.ThreadingHTTPServer(('', 8420), NoCacheHandler).serve_forever()
