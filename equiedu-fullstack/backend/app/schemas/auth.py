from pydantic import BaseModel, EmailStr, Field, field_validator

def validate_username(value: str) -> str:
    allowed=set('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-')
    if not set(value) <= allowed: raise ValueError('Username may contain only letters, digits, underscore, and hyphen')
    return value
class RegisterRequest(BaseModel):
    email: EmailStr
    username: str = Field(min_length=3,max_length=30)
    password: str = Field(min_length=12,max_length=128)
    _clean=field_validator('username')(validate_username)
class LoginRequest(BaseModel):
    identifier: str = Field(min_length=1,max_length=255)
    password: str = Field(min_length=1,max_length=128)
class RefreshRequest(BaseModel): refresh_token: str = Field(min_length=1,max_length=4096)
class ForgotPasswordRequest(BaseModel): email: EmailStr
class ResetPasswordConfirmRequest(BaseModel):
    reset_token: str = Field(min_length=1,max_length=4096)
    new_password: str = Field(min_length=12,max_length=128)
