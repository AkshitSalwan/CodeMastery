// Role-Based Access Control Middleware
const ROLES = {
  LEARNER: 'learner',
  INTERVIEWER: 'interviewer',
  ADMIN: 'admin'
};

// Role hierarchy for permission checks
const ROLE_HIERARCHY = {
  admin: 3,
  interviewer: 2,
  learner: 1
};

// Check if user has required role
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.dbUser) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userRole = req.dbUser.role;
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: `Required role: ${allowedRoles.join(' or ')}` 
      });
    }

    next();
  };
};

// Check if user has minimum role level
export const requireMinRole = (minRole) => {
  return (req, res, next) => {
    if (!req.dbUser) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userLevel = ROLE_HIERARCHY[req.dbUser.role] || 0;
    const requiredLevel = ROLE_HIERARCHY[minRole] || 0;

    if (userLevel < requiredLevel) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: `Insufficient permissions` 
      });
    }

    next();
  };
};

// Check if user owns the resource or is admin
export const requireOwnershipOrAdmin = (getResourceUserId) => {
  return async (req, res, next) => {
    if (!req.dbUser) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Admin can access anything
    if (req.dbUser.role === ROLES.ADMIN) {
      return next();
    }

    try {
      const resourceUserId = await getResourceUserId(req);
      
      if (req.dbUser.id !== resourceUserId) {
        return res.status(403).json({ 
          error: 'Access denied',
          message: 'You do not have permission to access this resource' 
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: 'Error checking permissions' });
    }
  };
};

// Permission definitions
const PERMISSIONS = {
  // Topic permissions
  'topic:create': [ROLES.ADMIN],
  'topic:update': [ROLES.ADMIN],
  'topic:delete': [ROLES.ADMIN],
  
  // Problem permissions
  'problem:create': [ROLES.ADMIN, ROLES.INTERVIEWER],
  'problem:update': [ROLES.ADMIN, ROLES.INTERVIEWER],
  'problem:delete': [ROLES.ADMIN],
  
  // Contest permissions
  'contest:create': [ROLES.ADMIN, ROLES.INTERVIEWER],
  'contest:update': [ROLES.ADMIN, ROLES.INTERVIEWER],
  'contest:delete': [ROLES.ADMIN, ROLES.INTERVIEWER],
  'contest:view_candidates': [ROLES.ADMIN, ROLES.INTERVIEWER],
  'contest:shortlist': [ROLES.ADMIN, ROLES.INTERVIEWER],
  
  // User management permissions
  'user:view_all': [ROLES.ADMIN],
  'user:update_role': [ROLES.ADMIN],
  'user:delete': [ROLES.ADMIN],
  
  // Badge permissions
  'badge:create': [ROLES.ADMIN],
  'badge:assign': [ROLES.ADMIN],
  
  // Analytics permissions
  'analytics:view': [ROLES.ADMIN, ROLES.INTERVIEWER],
  'analytics:platform': [ROLES.ADMIN]
};

// Check specific permission
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.dbUser) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const allowedRoles = PERMISSIONS[permission];
    
    if (!allowedRoles) {
      return res.status(500).json({ error: 'Invalid permission check' });
    }

    if (!allowedRoles.includes(req.dbUser.role)) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: `You do not have permission: ${permission}` 
      });
    }

    next();
  };
};

// Admin only middleware
export const adminOnly = requireRole(ROLES.ADMIN);

// Interviewer or Admin middleware
export const interviewerOrAdmin = requireRole(ROLES.INTERVIEWER, ROLES.ADMIN);

export { ROLES, ROLE_HIERARCHY, PERMISSIONS };
export default {
  requireRole,
  requireMinRole,
  requireOwnershipOrAdmin,
  requirePermission,
  adminOnly,
  interviewerOrAdmin,
  ROLES,
  ROLE_HIERARCHY,
  PERMISSIONS
};
