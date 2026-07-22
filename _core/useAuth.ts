// ไฟล์จำลองระบบ Login เพื่อให้โปรเจกต์รันได้
export function useAuth() {
  return {
    user: { id: 1, name: "Admin", email: "admin@example.com" },
    isLoading: false,
    login: async () => {},
    logout: async () => {},
  };
}
