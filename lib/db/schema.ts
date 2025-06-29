import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

export const devices = sqliteTable("devices", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull().default("disconnected"),
  sessionId: text("session_id"),
  ip: text("ip"),
  battery: integer("battery"),
  signal: integer("signal"),
  lastSeen: integer("last_seen", { mode: "timestamp" }),
  callsToday: integer("calls_today").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
})

export const callLists = sqliteTable("call_lists", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  numbers: text("numbers").notNull(), // JSON array
  originalNumbers: text("original_numbers"), // JSON array
  ddd: text("ddd"),
  status: text("status").notNull().default("paused"),
  progress: integer("progress").default(0),
  totalNumbers: integer("total_numbers").default(0),
  completedCalls: integer("completed_calls").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
})

export const callHistory = sqliteTable("call_history", {
  id: text("id").primaryKey(),
  deviceId: text("device_id").notNull(),
  listId: text("list_id").notNull(),
  phoneNumber: text("phone_number").notNull(),
  status: text("status").notNull(), // 'calling', 'completed', 'failed', 'busy'
  duration: integer("duration"), // em segundos
  timestamp: integer("timestamp", { mode: "timestamp" }).default(sql`(unixepoch())`),
})

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  deviceId: text("device_id"),
  websocketUrl: text("websocket_url"),
  status: text("status").default("active"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  lastActivity: integer("last_activity", { mode: "timestamp" }).default(sql`(unixepoch())`),
})
