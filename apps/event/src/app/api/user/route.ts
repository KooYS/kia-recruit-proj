import { prisma } from '@repo/db';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const university = searchParams.get('university');
  const major = searchParams.get('major');
  const username = searchParams.get('username');
  const phone = searchParams.get('phone');

  if (!university || !major || !username || !phone) {
    return Response.json(
      {
        status: 500,
        success: false,
        body: {
          message: '빠진 항목이 있습니다. 다시 작성해주세요.',
        },
      },
      { status: 200 }
    );
  }

  const isExist = await prisma.prize.findFirst({
    relationLoadStrategy: 'join',
    include: {
      user: true,
    },
    where: {
      user: { phone },
    },
  });

  if (isExist) {
    return Response.json(
      {
        status: 200,
        success: false,
        body: {
          message: `이미 ${isExist.user.username}님께서는 ${isExist.prizeName}으로 ${isExist.createdAt.toLocaleString()} 참여하였습니다.`,
        },
      },
      { status: 200 }
    );
  } else {
    return Response.json(
      {
        status: 200,
        success: true,
        body: {
          message: ``,
        },
      },
      { status: 200 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { university, major, username, phone } = await request.json();
  if (!university || !major || !username || !phone) {
    return new Response('All fields must be provided and non-null', {
      status: 400,
    });
  }
  try {
    const isExist = await prisma.user.findFirst({
      relationLoadStrategy: 'join',
      include: {
        prize: true,
      },
      where: {
        phone,
      },
    });

    if (isExist) {
      if (isExist.prize)
        return Response.json(
          {
            status: 403,
            success: false,
            body: {
              message: `이미 참여한 사용자입니다. (${phone})`,
              redirect: `/?u=${encodeURIComponent(isExist.university)}`,
              user: isExist,
            },
          },
          { status: 200 }
        );
      else {
        return Response.json(
          {
            status: 200,
            success: false,
            body: {
              message: `선물 받기는 미참여한 사용자입니다. (${phone})`,
              redirect: `/2?u=${encodeURIComponent(isExist.university)}&m=${encodeURIComponent(isExist.major)}&n=${encodeURIComponent(isExist.username)}&p=${encodeURIComponent(isExist.phone)}`,
              user: isExist,
            },
          },
          { status: 200 }
        );
      }
    }
    const user = await prisma.user.create({
      data: { university, major, username, phone },
    });
    return Response.json(
      {
        status: 200,
        success: true,
        body: {
          message: '성공적으로 등록되었습니다.',
          redirect: `/2?u=${encodeURIComponent(user.university)}&m=${encodeURIComponent(user.major)}&n=${encodeURIComponent(user.username)}&p=${encodeURIComponent(user.phone)}`,
          user,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        status: 403,
        success: false,
        body: {
          message: JSON.stringify(error),
          redirect: `/?u=${encodeURIComponent(university)}`,
        },
      },
      { status: 403 }
    );
  }
}
