#!/usr/bin/env python3
"""Simple HTTP server for vibethon-web project"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import os
import sys

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def log_message(self, format, *args):
        print(f"[Server] {format % args}")

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    port = 8000
    server_address = ('localhost', port)
    httpd = HTTPServer(server_address, CORSRequestHandler)
    
    print(f"\n🚀 Server running at http://localhost:{port}")
    print(f"📁 Serving files from: {os.getcwd()}")
    print(f"📄 Main file: http://localhost:{port}/index.html")
    print("\nPress Ctrl+C to stop the server\n")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n✋ Server stopped")
        sys.exit(0)
