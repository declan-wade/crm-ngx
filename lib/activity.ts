import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth/server";
import { Prisma, type ActivityAction } from "@prisma/client";

// Resolves Neon Auth login names for a set of user ids. Activities store the
// neon_auth."user".id of the actor (see the Activity model), which is a separate
// schema from the Prisma models, so names are looked up here rather than joined.
async function namesByUserId(
  userIds: (string | null)[]
): Promise<Map<string, string>> {
  const ids = [...new Set(userIds.filter((id): id is string => Boolean(id)))];
  if (ids.length === 0) return new Map();
  const rows = await prisma.$queryRaw<{ id: string; name: string }[]>(
    Prisma.sql`SELECT id, name FROM neon_auth."user" WHERE id IN (${Prisma.join(
      ids
    )})`
  );
  return new Map(rows.map((r) => [r.id, r.name]));
}

// Fetches an entity's audit trail as plain, client-serializable objects.
export async function getActivities(entityType: string, entityId: string) {
  const activities = await prisma.activity.findMany({
    where: { entityType, entityId },
    orderBy: { createdAt: "desc" },
  });
  const names = await namesByUserId(activities.map((a) => a.userId));
  return activities.map((a) => ({
    id: a.id,
    action: a.action,
    summary: a.summary,
    userName: a.userId ? names.get(a.userId) ?? null : null,
    createdAt: a.createdAt,
  }));
}

// The most recent audit-trail entries across all entities, for the Activity page.
export async function getRecentActivities(limit = 100) {
  const activities = await prisma.activity.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  const names = await namesByUserId(activities.map((a) => a.userId));
  return activities.map((a) => ({
    id: a.id,
    entityType: a.entityType,
    entityId: a.entityId,
    action: a.action,
    summary: a.summary,
    userName: a.userId ? names.get(a.userId) ?? null : null,
    createdAt: a.createdAt,
  }));
}

// Records an audit-trail entry. By default the entry is attributed to the
// currently signed-in Neon Auth user; pass `userId` explicitly to attribute it
// to someone else, or `userId: null` to force a "System" entry (e.g. cron jobs).
export async function logActivity(params: {
  entityType: string;
  entityId: string;
  action: ActivityAction;
  summary?: string;
  userId?: string | null;
}) {
  const userId =
    params.userId !== undefined ? params.userId : await getCurrentUserId();

  await prisma.activity.create({
    data: {
      entityType: params.entityType,
      entityId: params.entityId,
      action: params.action,
      summary: params.summary ?? null,
      userId: userId ?? null,
    },
  });
}
