import http.server
import socketserver
import os

PORT = 4000

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Remove trailing slash for comparison
        path = self.path.rstrip('/')
        if not path:
            path = '/index'

        # If no extension, try adding .html
        if not '.' in os.path.basename(path):
            if os.path.exists(path[1:] + '.html'):
                self.path = path + '.html'
            elif os.path.exists(path[1:] + '/index.html'):
                self.path = path + '/index.html'

        return super().do_GET()

with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()
