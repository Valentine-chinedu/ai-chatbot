/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";

import { genSaltSync, hashSync } from "bcrypt-ts";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from '@neondatabase/serverless'
// import postgres from "postgres";

import { config } from "dotenv";
import * as schema from "./schema";

config({ path: ".env.local" });

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
const sql = neon(process.env.POSTGRES_URL!);
export const db = drizzle(sql, {schema})

export async function getUser(email: string): Promise<Array<schema.User>> {
  try {
    return await db.select().from(schema.user).where(eq(schema.user.email, email));
  } catch (error) {
    console.error("Failed to get user from database");
    throw error;
  }
}

export async function createUser(email: string, password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  try {
    return await db.insert(schema.user).values({ email, password: hash });
  } catch (error) {
    console.error("Failed to create user in database");
    throw error;
  }
}

export async function saveChat({
  id,
  messages,
  userId,
}: {
  id: string;
  messages: any;
  userId: string;
}) {
  try {
    const selectedChats = await db.select().from(schema.chat).where(eq(schema.chat.id, id));

    if (selectedChats.length > 0) {
      return await db
        .update(schema.chat)
        .set({
          messages: JSON.stringify(messages),
        })
        .where(eq(schema.chat.id, id));
    }

    return await db.insert(schema.chat).values({
      id,
      createdAt: new Date(),
      messages: JSON.stringify(messages),
      userId,
    });
  } catch (error) {
    console.error("Failed to save chat in database");
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    return await db.delete(schema.chat).where(eq(schema.chat.id, id));
  } catch (error) {
    console.error("Failed to delete chat by id from database");
    throw error;
  }
}

export async function getChatsByUserId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(schema.chat)
      .where(eq(schema.chat.userId, id))
      .orderBy(desc(schema.chat.createdAt));
  } catch (error) {
    console.error("Failed to get chats by user from database");
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(schema.chat).where(eq(schema.chat.id, id));
    return selectedChat;
  } catch (error) {
    console.error("Failed to get chat by id from database");
    throw error;
  }
}

export async function createReservation({
  id,
  userId,
  details,
}: {
  id: string;
  userId: string;
  details: any;
}) {
  return await db.insert(schema.reservation).values({
    id,
    createdAt: new Date(),
    userId,
    hasCompletedPayment: false,
    details: JSON.stringify(details),
  });
}

export async function getReservationById({ id }: { id: string }) {
  const [selectedReservation] = await db
    .select()
    .from(schema.reservation)
    .where(eq(schema.reservation.id, id));

  return selectedReservation;
}

export async function updateReservation({
  id,
  hasCompletedPayment,
}: {
  id: string;
  hasCompletedPayment: boolean;
}) {
  return await db
    .update(schema.reservation)
    .set({
      hasCompletedPayment,
    })
    .where(eq(schema.reservation.id, id));
}
