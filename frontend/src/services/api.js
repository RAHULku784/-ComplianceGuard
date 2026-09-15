const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";


// ======================================================
// DASHBOARD
// ======================================================

export const getDashboardSummary = async () => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/dashboard/summary`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch dashboard summary"
    );
  }

  return await response.json();
};


// ======================================================
// PROFILE
// ======================================================

export const getProfile = async () => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/profile`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return await response.json();
};


// ======================================================
// AUDITS
// ======================================================

export const getAudits = async () => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/audits/frontend/list`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch audits");
  }

  return await response.json();
};


export const createAudit = async (auditData) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/audits/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(auditData),
    }
  );

  if (!response.ok) {
    const errorData =
      await response.json().catch(() => null);

    console.error(
      "Create Audit Error:",
      errorData
    );

    throw new Error(
      errorData?.detail ||
        "Failed to create audit"
    );
  }

  return await response.json();
};


export const getAuditById = async (auditId) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/audits/${auditId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch audit details"
    );
  }

  return await response.json();
};


export const updateAudit = async (
  auditId,
  auditData
) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/audits/${auditId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(auditData),
    }
  );

  if (!response.ok) {
    const errorData =
      await response.json().catch(() => null);

    throw new Error(
      errorData?.detail ||
        "Failed to update audit"
    );
  }

  return await response.json();
};


// ======================================================
// COMPLIANCE RULES
// ======================================================

export const getRules = async () => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/rules/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch compliance rules"
    );
  }

  return await response.json();
};


export const getRuleById = async (ruleId) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/rules/${ruleId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch compliance rule"
    );
  }

  return await response.json();
};


export const createRule = async (ruleData) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/rules/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ruleData),
    }
  );

  if (!response.ok) {
    const errorData =
      await response.json().catch(() => null);

    throw new Error(
      errorData?.detail ||
        "Failed to create compliance rule"
    );
  }

  return await response.json();
};


export const updateRule = async (
  ruleId,
  ruleData
) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/rules/${ruleId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ruleData),
    }
  );

  if (!response.ok) {
    const errorData =
      await response.json().catch(() => null);

    throw new Error(
      errorData?.detail ||
        "Failed to update compliance rule"
    );
  }

  return await response.json();
};


// ======================================================
// COMPANIES
// ======================================================

export const getCompanies = async () => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/companies/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch companies"
    );
  }

  return await response.json();
};


// ======================================================
// USERS
// ======================================================

export const getUsers = async () => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/users/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return await response.json();
};


export const createUser = async (userData) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/users/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    }
  );

  if (!response.ok) {
    const errorData =
      await response.json().catch(() => null);

    throw new Error(
      errorData?.detail ||
        "Failed to create user"
    );
  }

  return await response.json();
};


export const getUserById = async (userId) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/users/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return await response.json();
};


export const updateUser = async (
  userId,
  userData
) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/users/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    }
  );

  if (!response.ok) {
    const errorData =
      await response.json().catch(() => null);

    throw new Error(
      errorData?.detail ||
        "Failed to update user"
    );
  }

  return await response.json();
};


export const updateUserStatus = async (
  userId,
  isActive
) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/users/${userId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        is_active: isActive,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to update user status"
    );
  }

  return await response.json();
};


// ======================================================
// REPORTS
// ======================================================

export const getComplianceReport = async () => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/reports/compliance`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch compliance report"
    );
  }

  return await response.json();
};


// ======================================================
// NOTIFICATIONS
// ======================================================

export const getNotifications = async () => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/notifications/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch notifications"
    );
  }

  return await response.json();
};
export const changePassword = async (
  currentPassword,
  newPassword
) => {
  const token =
    localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/profile/change-password`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    }
  );


  const data = await response
    .json()
    .catch(() => null);


  if (!response.ok) {
    throw new Error(
      data?.detail ||
        "Failed to change password"
    );
  }


  return data;
};
export const askComplianceAI = async (message) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `${API_BASE_URL}/ai/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: message,
      }),
    }
  );

  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        "Unable to get AI response"
    );
  }

  return data;
};


export default API_BASE_URL;