FROM node:22-alpine AS web
WORKDIR /web
COPY frontend/ .
RUN (npm ci || npm install) && npm run build

FROM python:3.12-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

COPY backend/ .
RUN pip install --no-cache-dir -r requirements.txt
COPY --from=web /web/dist ./static

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
