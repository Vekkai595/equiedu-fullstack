"""Vercel/FastAPI entrypoint.

Vercel detects a top-level ``app`` ASGI application in this file when the
backend directory is selected as the Vercel project root.
"""
from app.main import app

__all__ = ["app"]
