from fastapi import Depends, HTTPException, status

from app.auth.security import oauth2_scheme
from app.auth.jwt_handler import verify_access_token


def get_current_user(token: str = Depends(oauth2_scheme)):

    payload = verify_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    return payload