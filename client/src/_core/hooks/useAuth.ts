export function useAuth() {
  return {
    user: { id: 1, name: "Admin", email: "admin@example.com" },
    isLoading: false,
    login: async () => {},
    logout: async () => {},
  };
}
