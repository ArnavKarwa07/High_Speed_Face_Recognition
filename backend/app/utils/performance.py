"""
Performance monitoring middleware and utilities
"""

import time
import logging
from typing import Dict, List
from datetime import datetime
from collections import deque
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)


class PerformanceMetrics:
    """Track performance metrics"""

    def __init__(self, max_history: int = 1000):
        self.max_history = max_history
        self.request_times: deque = deque(maxlen=max_history)
        self.recognition_times: deque = deque(maxlen=max_history)
        self.enrollment_times: deque = deque(maxlen=max_history)
        self.total_requests = 0
        self.total_recognitions = 0
        self.total_enrollments = 0
        self.start_time = datetime.now()

    def add_request_time(self, duration: float):
        """Add request processing time"""
        self.request_times.append(duration)
        self.total_requests += 1

    def add_recognition_time(self, duration: float):
        """Add recognition processing time"""
        self.recognition_times.append(duration)
        self.total_recognitions += 1

    def add_enrollment_time(self, duration: float):
        """Add enrollment processing time"""
        self.enrollment_times.append(duration)
        self.total_enrollments += 1

    def get_stats(self) -> Dict:
        """Get performance statistics"""
        uptime = (datetime.now() - self.start_time).total_seconds()

        def calc_stats(times: deque) -> Dict:
            if not times:
                return {"avg": 0, "min": 0, "max": 0, "count": 0}
            times_list = list(times)
            return {
                "avg": sum(times_list) / len(times_list),
                "min": min(times_list),
                "max": max(times_list),
                "count": len(times_list),
            }

        return {
            "uptime_seconds": round(uptime, 2),
            "total_requests": self.total_requests,
            "total_recognitions": self.total_recognitions,
            "total_enrollments": self.total_enrollments,
            "request_times": calc_stats(self.request_times),
            "recognition_times": calc_stats(self.recognition_times),
            "enrollment_times": calc_stats(self.enrollment_times),
            "requests_per_second": round(
                self.total_requests / uptime if uptime > 0 else 0, 2
            ),
        }


# Global metrics instance
metrics = PerformanceMetrics()


class PerformanceMiddleware(BaseHTTPMiddleware):
    """Middleware to track request performance"""

    async def dispatch(self, request: Request, call_next):
        start_time = time.time()

        response = await call_next(request)

        process_time = time.time() - start_time
        metrics.add_request_time(process_time)

        # Add performance header
        response.headers["X-Process-Time"] = str(round(process_time, 4))

        # Log slow requests
        if process_time > 1.0:
            logger.warning(f"Slow request: {request.url.path} took {process_time:.2f}s")

        return response
