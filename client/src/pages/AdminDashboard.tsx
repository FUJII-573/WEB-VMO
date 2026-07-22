import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch employees list
  const { data: employees = [], refetch: refetchEmployees } = trpc.employees.list.useQuery();

  // Add employee mutation
  const addEmployeeMutation = trpc.employees.add.useMutation({
    onSuccess: () => {
      setNewEmployeeName("");
      refetchEmployees();
    },
    onError: (error) => {
      alert(`Error adding employee: ${error.message}`);
    },
  });

  // Delete employee mutation
  const deleteEmployeeMutation = trpc.employees.delete.useMutation({
    onSuccess: () => {
      refetchEmployees();
    },
    onError: (error) => {
      alert(`Error deleting employee: ${error.message}`);
    },
  });

  const handleAddEmployee = async () => {
    if (!newEmployeeName.trim()) {
      alert("Please enter an employee name");
      return;
    }

    setLoading(true);
    try {
      await addEmployeeMutation.mutateAsync({ name: newEmployeeName });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (!confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    setLoading(true);
    try {
      await deleteEmployeeMutation.mutateAsync({ id });
    } finally {
      setLoading(false);
    }
  };

  // Check if user is admin
  if (!user || user.role !== "admin") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--background)",
          color: "var(--foreground)",
          fontSize: "18px",
        }}
      >
        You do not have permission to access this page
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "auto",
        padding: "20px",
        background: "var(--background)",
        color: "var(--foreground)",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginTop: 0, color: "#0d47a1" }}>Admin Dashboard</h1>
      <p>Manage employee list for the requisition system</p>

      {/* Add Employee Section */}
      <Card
        style={{
          padding: "20px",
          marginBottom: "20px",
          background: theme === "dark" ? "#1e1e1e" : "#fff",
          border: "1px solid #ddd",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Add New Employee</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <Input
            type="text"
            placeholder="Enter employee name"
            value={newEmployeeName}
            onChange={(e) => setNewEmployeeName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddEmployee();
              }
            }}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              background: theme === "dark" ? "#333" : "#fff",
              color: theme === "dark" ? "#fff" : "#333",
            }}
          />
          <Button
            onClick={handleAddEmployee}
            disabled={loading || addEmployeeMutation.isPending}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 16px",
              background: "#0d47a1",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.1s ease-out",
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(0.95)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1)";
            }}
          >
            <Plus size={18} />
            Add
          </Button>
        </div>
      </Card>

      {/* Employees List */}
      <Card
        style={{
          padding: "20px",
          background: theme === "dark" ? "#1e1e1e" : "#fff",
          border: "1px solid #ddd",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Employees ({employees.length})</h2>
        {employees.length === 0 ? (
          <p style={{ color: "#999" }}>No employees yet. Add one to get started.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {employees.map((employee: any) => (
              <div
                key={employee.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px",
                  background: theme === "dark" ? "#2a2a2a" : "#f9f9f9",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                }}
              >
                <div>
                  <div style={{ fontWeight: "600" }}>{employee.name}</div>
                  <div style={{ fontSize: "12px", color: "#999" }}>
                    Added: {new Date(employee.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <Button
                  onClick={() => handleDeleteEmployee(employee.id)}
                  disabled={loading || deleteEmployeeMutation.isPending}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 12px",
                    background: "#e53935",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.1s ease-out",
                  }}
                  onMouseDown={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "scale(0.95)";
                  }}
                  onMouseUp={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "scale(1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "scale(1)";
                  }}
                >
                  <Trash2 size={16} />
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
