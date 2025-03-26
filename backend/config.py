import socket

def find_available_port(start_port=8000, max_port=8100):
    """Find an available port starting from start_port."""
    port = start_port
    while port <= max_port:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('', port))
                return port
        except OSError:
            port += 1
    raise RuntimeError(f"No available ports in range {start_port}-{max_port}")

# Default port with fallback
PORT = find_available_port()
HOST = "0.0.0.0"
