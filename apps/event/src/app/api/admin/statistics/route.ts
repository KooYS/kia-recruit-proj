import { prisma } from '@repo/db';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const data = await prisma.$queryRaw`
        SELECT 
            u.university,
            SUM(CASE WHEN p.prizeName = '1등' THEN 1 ELSE 0 END) as first_prize,
            SUM(CASE WHEN p.prizeName = '2등' THEN 1 ELSE 0 END) as second_prize,
            SUM(CASE WHEN p.prizeName = '3등' THEN 1 ELSE 0 END) as third_prize
        FROM User u
        LEFT JOIN Prize p ON u.id = p.userId
        GROUP BY u.university
        ORDER BY u.university ASC`;

    return Response.json(
      {
        status: 200,
        success: true,
        body: data,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        status: 500,
        success: false,
        body: null,
      },
      { status: 200 }
    );
  }
}

// export async function POST(request: NextRequest) {
//   return Response.json({ data: '' });
// }

// function safeQuery(strings: TemplateStringsArray, ...values: any[]) {
//   console.log(strings, values);
// }

// safeQuery`
// SELECT
//     u.university,
//     COUNT(DISTINCT p.prizeName) as totalPrizeNames
// FROM User u
// INNER JOIN Prize p ON u.id = p.userId
// GROUP BY u.university
// `;
