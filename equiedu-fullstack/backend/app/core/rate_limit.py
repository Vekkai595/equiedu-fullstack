import time
from threading import Lock
import redis
from app.core.config import settings
from app.core.exceptions import RateLimitExceeded

_redis_client = None
_last_redis_retry = 0.0
class _InMemoryRedis:
    def __init__(self): self.store, self.expiry, self.lock = {}, {}, Lock()
    def _purge(self,k):
        if self.expiry.get(k, float('inf')) <= time.time(): self.store.pop(k,None); self.expiry.pop(k,None)
    def get(self,k):
        with self.lock: self._purge(k); return self.store.get(k)
    def incr(self,k):
        with self.lock: self._purge(k); self.store[k]=int(self.store.get(k,0))+1; return self.store[k]
    def expire(self,k,s):
        with self.lock: self.expiry[k]=time.time()+s
    def delete(self,k):
        with self.lock: self.store.pop(k,None); self.expiry.pop(k,None)
_fallback=_InMemoryRedis()

def get_redis_client():
    global _redis_client, _last_redis_retry
    if _redis_client is not None and _redis_client is not _fallback: return _redis_client
    if time.time()-_last_redis_retry < 30: return _fallback
    _last_redis_retry=time.time()
    try:
        client=redis.from_url(settings.redis_url,decode_responses=True,socket_connect_timeout=1)
        client.ping(); _redis_client=client; return client
    except Exception: return _fallback

def ensure_login_allowed(key: str) -> None:
    count=int(get_redis_client().get(key) or 0)
    if count >= settings.login_rate_limit_max_attempts: raise RateLimitExceeded('Too many login attempts. Please try again later.')

def record_login_failure(key: str) -> None:
    c=get_redis_client(); count=int(c.incr(key));
    if count==1: c.expire(key,settings.login_rate_limit_window_seconds)

def clear_login_attempts(key: str) -> None: get_redis_client().delete(key)
