import { PrismaClient } from "@prisma/client/extension";
import { getMappedPlayer, upsertPlayer } from "../app/lib/mappers";

const prisma = new PrismaClient();

