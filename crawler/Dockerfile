FROM python:3.10.11-slim
RUN mkdir /app
WORKDIR /app
COPY fetch.py main.py requirements.txt /app/
RUN pip install -r requirements.txt
