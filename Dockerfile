FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .
COPY src/ ./src/
COPY models/ ./models/
COPY data/mecha_ml_dataset.csv ./data/
COPY templates/ ./templates/
COPY static/ ./static/
COPY docs/ ./docs/

EXPOSE 5000

ENV PYTHONPATH=/app/src
ENV TF_ENABLE_ONEDNN_OPTS=0
ENV TF_CPP_MIN_LOG_LEVEL=2

CMD ["python", "app.py"]
