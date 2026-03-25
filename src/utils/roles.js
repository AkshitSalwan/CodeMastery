export const normalizeRole = (role) => {
  const value = String(role || "").trim().toLowerCase();

  if (!value || value === "user") {
    return "learner";
  }

  if (value === "recruiter") {
    return "interviewer";
  }

  return value;
};

const getAdminEmailAllowlist = () =>
  String(import.meta.env.VITE_ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

export const isAdminEmail = (email) =>
  getAdminEmailAllowlist().includes(String(email || '').trim().toLowerCase());

export const getAdminAllowlist = () => getAdminEmailAllowlist();

export const isLearnerRole = (role) => normalizeRole(role) === "learner";

export const isInterviewerRole = (role) => normalizeRole(role) === "interviewer";

export const isAdminRole = (role) => normalizeRole(role) === "admin";

export const hasAllowedRole = (role, allowedRoles = []) =>
  allowedRoles.map(normalizeRole).includes(normalizeRole(role));

export const getRoleLabel = (role) => {
  switch (normalizeRole(role)) {
    case "admin":
      return "Admin";
    case "interviewer":
      return "Interviewer";
    default:
      return "Learner";
  }
};
