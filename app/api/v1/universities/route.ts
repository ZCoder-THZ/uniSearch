import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const search = (searchParams.get('search') || '').trim();
    const offset = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { country: { contains: search, mode: 'insensitive' } },
          ],
        }
      : undefined;

    const universities = await prisma.universities.findMany({
      where,
      skip: offset,
      take: limit,
    });

    const total = await prisma.universities.count({ where });
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: universities,
      meta: {
        currentPage: page,
        totalPages,
        totalItems: total,
      },
    });
  } catch (error) {
    console.error('Error fetching universities:', error);

    // Ensure the payload is a valid object
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Internal Server Error', details: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
