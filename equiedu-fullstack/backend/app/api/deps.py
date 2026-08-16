import hashlib
import ipaddress

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.tokens import decode_access_token
from app.db.session import get_db
from app.repositories.session_repository import SessionRepository
from app.repositories.user_repository import UserRepository

bearer_scheme = HTTPBearer(auto_error=False)

def _trusted_proxy(host: str) -> bool:
    try:
        ip = ipaddress.ip_address(host)
        return any(ip in ipaddress.ip_network(net) for net in settings.trusted_proxy_cidrs)
    except ValueError:
        return False

def get_request_meta(request: Request) -> dict[str, str]:
    peer = request.client.host if request.client else 'unknown'
    forwarded = request.headers.get('x-forwarded-for')
    ip = forwarded.split(',')[0].strip() if forwarded and _trusted_proxy(peer) else peer
    ip = ip[:64]
    ua = request.headers.get('user-agent', 'unknown')[:512]
    device_id = request.headers.get('x-device-id')
    if device_id:
        device_id = device_id.strip()[:128]
    else:
        device_id = hashlib.sha256(f"{ip}|{ua}".encode()).hexdigest()[:32]
    return {'ip_address': ip, 'user_agent': ua, 'device_id': device_id}

def get_current_user(request: Request, credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme), db: Session = Depends(get_db)):
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Missing bearer token')
    payload = decode_access_token(credentials.credentials)
    user = UserRepository(db).get_by_id(int(payload.sub))
    session = SessionRepository(db).get_by_id(payload.sid)
    if user is None or not user.is_active or session is None or session.user_id != int(payload.sub) or session.revoked_at is not None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid, inactive, or revoked session')
    meta = get_request_meta(request)
    SessionRepository(db).touch(session, ip_address=meta['ip_address'], user_agent=meta['user_agent'])
    db.commit()
    return user
