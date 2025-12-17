"""
Role-Based Access Control (RBAC) middleware
"""

from fastapi import HTTPException, status, Depends
from typing import List

from app.models.user import UserRole
from app.utils.security import get_current_user


def require_roles(allowed_roles: List[UserRole]):
    """
    Dependency that checks if the current user has one of the allowed roles.
    
    Usage:
        @router.get("/admin-only")
        async def admin_route(user = Depends(require_roles([UserRole.ADMIN]))):
            return {"message": "Admin access granted"}
    """
    async def role_checker(current_user: dict = Depends(get_current_user)):
        user_role = current_user.get("role", "user")
        
        # Convert string roles to enum for comparison
        allowed_role_values = [role.value for role in allowed_roles]
        
        if user_role not in allowed_role_values:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {', '.join(allowed_role_values)}"
            )
        
        return current_user
    
    return role_checker


def require_admin():
    """Require admin role"""
    return require_roles([UserRole.ADMIN])


def require_manager():
    """Require manager or admin role"""
    return require_roles([UserRole.ADMIN, UserRole.MANAGER])


def require_professional():
    """Require professional, manager, or admin role"""
    return require_roles([UserRole.ADMIN, UserRole.MANAGER, UserRole.PROFESSIONAL])


def require_shopkeeper():
    """Require shopkeeper, manager, or admin role"""
    return require_roles([UserRole.ADMIN, UserRole.MANAGER, UserRole.SHOPKEEPER])


def require_verified():
    """Require user to be verified"""
    async def verified_checker(current_user: dict = Depends(get_current_user)):
        if not current_user.get("is_verified", False):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account verification required"
            )
        return current_user
    
    return verified_checker


def require_email_verified():
    """Require user email to be verified"""
    async def email_verified_checker(current_user: dict = Depends(get_current_user)):
        if not current_user.get("email_verified", False):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Email verification required"
            )
        return current_user
    
    return email_verified_checker


def require_phone_verified():
    """Require user phone to be verified"""
    async def phone_verified_checker(current_user: dict = Depends(get_current_user)):
        if not current_user.get("phone_verified", False):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Phone verification required"
            )
        return current_user
    
    return phone_verified_checker


class RolePermissions:
    """
    Define permissions for each role.
    
    Usage:
        permissions = RolePermissions()
        if permissions.can_manage_users(user_role):
            # allow action
    """
    
    ADMIN_PERMISSIONS = {
        "manage_users",
        "manage_roles",
        "view_all_data",
        "manage_settings",
        "manage_shops",
        "manage_professionals",
        "manage_orders",
        "view_reports",
        "manage_vacancies",
    }
    
    MANAGER_PERMISSIONS = {
        "view_all_data",
        "manage_shops",
        "manage_professionals",
        "manage_orders",
        "view_reports",
        "verify_users",
    }
    
    SHOPKEEPER_PERMISSIONS = {
        "manage_own_shop",
        "manage_own_products",
        "manage_own_orders",
        "view_own_reports",
        "create_vacancies",
    }
    
    PROFESSIONAL_PERMISSIONS = {
        "manage_own_profile",
        "manage_bookings",
        "view_own_earnings",
        "apply_vacancies",
    }
    
    USER_PERMISSIONS = {
        "view_products",
        "create_orders",
        "book_services",
        "manage_own_profile",
    }
    
    @classmethod
    def get_permissions(cls, role: str) -> set:
        """Get permissions for a role"""
        permission_map = {
            "admin": cls.ADMIN_PERMISSIONS,
            "manager": cls.MANAGER_PERMISSIONS,
            "shopkeeper": cls.SHOPKEEPER_PERMISSIONS,
            "professional": cls.PROFESSIONAL_PERMISSIONS,
            "user": cls.USER_PERMISSIONS,
        }
        return permission_map.get(role, cls.USER_PERMISSIONS)
    
    @classmethod
    def has_permission(cls, role: str, permission: str) -> bool:
        """Check if a role has a specific permission"""
        permissions = cls.get_permissions(role)
        return permission in permissions
    
    @classmethod
    def can_manage_users(cls, role: str) -> bool:
        return cls.has_permission(role, "manage_users")
    
    @classmethod
    def can_manage_roles(cls, role: str) -> bool:
        return cls.has_permission(role, "manage_roles")
    
    @classmethod
    def can_view_reports(cls, role: str) -> bool:
        return cls.has_permission(role, "view_reports") or cls.has_permission(role, "view_own_reports")


def check_permission(permission: str):
    """
    Dependency that checks if user has specific permission.
    
    Usage:
        @router.get("/reports")
        async def view_reports(user = Depends(check_permission("view_reports"))):
            return {"data": "reports"}
    """
    async def permission_checker(current_user: dict = Depends(get_current_user)):
        user_role = current_user.get("role", "user")
        
        if not RolePermissions.has_permission(user_role, permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied: {permission}"
            )
        
        return current_user
    
    return permission_checker
