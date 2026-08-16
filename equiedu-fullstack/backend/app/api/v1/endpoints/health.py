from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.rate_limit import get_redis_client
router=APIRouter()
@router.get('')
def health(): return {'status':'ok'}
@router.get('/ready')
def readiness(db: Session=Depends(get_db)):
    try:
        db.execute(text('SELECT 1'))
        get_redis_client().ping() if hasattr(get_redis_client(),'ping') else get_redis_client().get('__health__')
    except Exception as exc:
        raise HTTPException(status_code=503,detail='Dependency unavailable') from exc
    return {'status':'ready','database':'ok','redis':'ok'}
