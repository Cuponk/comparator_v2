import { PrismaClient } from "@/app/generated/prisma/client";
import { getMappedJudge, getMappedOhtani } from "../lib/mappers";

const prisma = new PrismaClient();