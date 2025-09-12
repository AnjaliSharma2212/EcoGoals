import toast from "react-hot-toast";
import axios from "axios";
import type { Task } from "../types";
const API = import.meta.env.VITE_API_BASE_URL;

if (!API) {
  console.error("❌ API base URL missing in environment variables!");
}

// Helper: common fetch wrapper
const handleResponse = async (res: Response) => {
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

// REGISTER
export const register = async (
  name: string,
  email: string,
  password: string,
  avatarUrl?: string
) => {
  try {
    const res = await fetch(`${API}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, avatarUrl }),
    });

    const data = await handleResponse(res);
    toast.success("✅ Successfully registered!");
    return data;
  } catch (error: any) {
    console.error(error);
    toast.error(error.message || "❌ Registration failed");
    throw error;
  }
};

// LOGIN
export const login = async (email: string, password: string) => {
  try {
    const res = await fetch(`${API}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse(res);

    if (data.token) {
      localStorage.setItem("token", data.token);
      toast.success("✅ Logged in successfully");
    }
    return data;
  } catch (error: any) {
    toast.error(error.message || "❌ Login failed");
    throw error;
  }
};

// GET PROFILE
export const getProfile = async (token: string) => {
  try {
    const res = await fetch(`${API}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return await handleResponse(res);
  } catch (error: any) {
    toast.error(error.message || "❌ Failed to load profile");
    throw error;
  }
};

// UPDATE PROFILE
export const updateProfile = async (token: string, updates: any) => {
  try {
    const res = await fetch(`${API}/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await handleResponse(res);
    toast.success("✅ Profile updated!");
    return data;
  } catch (error: any) {
    toast.error(error.message || "❌ Failed to update profile");
    throw error;
  }
};

const client = axios.create({ baseURL: API });

export async function fetchTasks(): Promise<Task[]> {
  const res = await client.get("/tasks");
  return res.data;
}

export async function createTask(payload: Partial<Task>): Promise<Task> {
  const res = await client.post("/tasks", payload);
  return res.data;
}

// Using PUT as your routes used PUT earlier — adjust to PATCH if backend expects PATCH.
export async function updateTask(
  id: string,
  updates: Partial<Task>
): Promise<Task> {
  const res = await client.put(`/tasks/${id}`, updates);
  return res.data;
}

export async function deleteTask(id: string): Promise<void> {
  await client.delete(`/tasks/${id}`);
}
