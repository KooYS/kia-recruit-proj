import { console_dev } from '@/app/_utils/get_env';
import { prisma } from '@repo/db';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const university = searchParams.get('u');

  if (!university) {
    return Response.json(
      {
        status: 500,
        success: false,
        body: {
          message:
            '이벤트 접근이 잘못되었으니 QR을 다시 접속하여 시도해주세요.',
        },
      },
      { status: 200 }
    );
  }
  const getPrizeList = await prisma.prize.findMany({
    relationLoadStrategy: 'join',
    include: {
      user: true,
    },
    where: {
      user: {
        university: university,
      },
    },
  });

  const receivedPrizeCount = getPrizeList.reduce(
    (prev, current) => {
      return {
        ...prev,
        [current.prizeName]:
          prev[current.prizeName as '1등' | '2등' | '3등' | '4등'] + 1,
      };
    },
    {
      '1등': 0,
      '2등': 0,
      '3등': 0,
      '4등': 0,
    }
  );

  return Response.json({ data: receivedPrizeCount });
}
export async function POST(request: NextRequest) {
  const { user, prizeName, prizeIndex } = await request.json();

  const isExist = await prisma.prize.findFirst({
    relationLoadStrategy: 'join',
    include: {
      user: true,
    },
    where: {
      userId: user.id,
    },
  });

  if (isExist === null) {
    try {
      await prisma.prize.create({
        data: {
          userId: user.id,
          prizeName: prizeName,
          prizeIndex: prizeIndex,
        },
      });
      return Response.json(
        {
          status: 200,
          success: true,
          body: {
            message: '성공적으로 등록되었습니다.',
          },
        },
        { status: 200 }
      );
    } catch (error) {
      console_dev(error);
    }
  } else {
    return Response.json(
      {
        status: 403,
        success: false,
        body: {
          message: `이미 참여하신 이력이 있습니다. ${isExist.prizeName}으로 ${isExist.createdAt.toLocaleString()} 참여하였습니다.`,
        },
      },
      { status: 200 }
    );
  }
}
