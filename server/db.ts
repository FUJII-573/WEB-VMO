import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, employees, InsertEmployee, requisitions, InsertRequisition } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Employees management
export async function getAllEmployees() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get employees: database not available");
    return [];
  }

  try {
    const result = await db.select().from(employees);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get employees:", error);
    return [];
  }
}

export async function addEmployee(name: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot add employee: database not available");
    throw new Error("Database not available");
  }

  try {
    const result = await db.insert(employees).values({ name });
    await syncEmployeesToGoogleSheets();
    return result;
  } catch (error) {
    console.error("[Database] Failed to add employee:", error);
    throw error;
  }
}

export async function deleteEmployee(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete employee: database not available");
    throw new Error("Database not available");
  }

  try {
    const result = await db.delete(employees).where(eq(employees.id, id));
    await syncEmployeesToGoogleSheets();
    return result;
  } catch (error) {
    console.error("[Database] Failed to delete employee:", error);
    throw error;
  }
}

export async function syncEmployeesToGoogleSheets() {
  try {
    const db = await getDb();
    if (!db) {
      console.warn("[Database] Cannot sync employees: database not available");
      return;
    }

    const employeeList = await db.select().from(employees);
    const names = employeeList.map(e => e.name);

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbyiDOq89bHfEiip0TZS08RnqBvAn71XKvthICWiUbBMtCB9_TOD85MTVV38Bv7J1PpQUA/exec",
      {
        method: "POST",
        mode: "no-cors",
        body: new URLSearchParams({
          action: "updateEmployees",
          employees: JSON.stringify(names),
        }),
      }
    );

    console.log("[Database] Synced employees to Google Sheets");
  } catch (error) {
    console.error("[Database] Failed to sync employees to Google Sheets:", error);
  }
}

// Requisitions management
export async function createRequisition(data: InsertRequisition) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create requisition: database not available");
    throw new Error("Database not available");
  }

  try {
    const result = await db.insert(requisitions).values(data);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create requisition:", error);
    throw error;
  }
}

export async function getRequisitions(limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get requisitions: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(requisitions)
      .orderBy(desc(requisitions.createdAt))
      .limit(limit)
      .offset(offset);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get requisitions:", error);
    return [];
  }
}

export async function getRequisitionById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get requisition: database not available");
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(requisitions)
      .where(eq(requisitions.id, id))
      .limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get requisition:", error);
    return undefined;
  }
}

export async function updateRequisitionStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update requisition: database not available");
    throw new Error("Database not available");
  }

  try {
    const result = await db
      .update(requisitions)
      .set({ status: status as any })
      .where(eq(requisitions.id, id));
    return result;
  } catch (error) {
    console.error("[Database] Failed to update requisition:", error);
    throw error;
  }
}
