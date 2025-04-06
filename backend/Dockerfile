FROM python:3.9-slim

WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=8080

CMD uvicorn main:app --host 0.0.0.0 --port ${PORT}