import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { chatGPTRequest } from './chatpgtService'; // Adjust path as needed

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const prisma = new PrismaClient();

  try {
    // Validate that the slug parameter exists
    if (!params?.slug) {
      return NextResponse.json(
        { error: 'Missing slug parameter' },
        { status: 400 }
      );
    }

    // Find the university by slug
    const university = await prisma.universities.findFirst({
      where: {
        name: await params.slug,
      },
    });

    // If no university is found, return a 404 response
    if (!university) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      );
    }

    // Use ChatGPT to generate additional information
    const chatGPTResponse = await chatGPTRequest({
      instructions: `Provide a detailed description of the university: ${university.name}`,
      additionalContext: `Location: ${university.country},`,
    });

    // Return the university with the additional information
    return NextResponse.json({
      university,
      additionalInfo: chatGPTResponse,
    });
  } catch (error) {
    console.error('Error fetching university:', error);

    // Return a 500 response for server errors
    return NextResponse.json(
      { error: 'An error occurred while fetching the university' },
      { status: 500 }
    );
  } finally {
    // Close the Prisma Client connection
    await prisma.$disconnect();
  }
}
