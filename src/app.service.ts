import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreatePasteDto } from './dto/Paste.dto';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) { }
  getHello(): string {
    return 'Hello World!';
  }

  async getNow(req: Request) {
    if (process.env.TEST_MODE === '1') {
      const header = req.headers['x-test-now-ms']
      if (header) {
        const ms = Number(header)
        if (!Number.isNaN(ms)) {
          return new Date(ms)
        }
      }
    }
    return new Date()
  }

  async create(dto: CreatePasteDto) {
    const expiresAt = dto.ttl_seconds
      ? new Date(Date.now() + dto.ttl_seconds * 1000)
      : null

    const paste = await this.prisma.paste.create({
      data: {
        content: dto.content,
        expiresAt,
        maxViews: dto.max_views ?? null,
      },
    })

    return paste
  }

  async fetchById(id: string, req: Request) {
    const now = await this.getNow(req)

    return this.prisma.$transaction(async (tx) => {
      const paste = await tx.paste.findUnique({ where: { id } })

      if (!paste) throw new NotFoundException()

      // Expiry check
      if (paste.expiresAt && paste.expiresAt <= now) {
        throw new NotFoundException("Post content has expired")
      }

      // View limit check
      if (
        paste.maxViews !== null &&
        paste.viewCount >= paste.maxViews
      ) {
        throw new NotFoundException("Post content has reached its view limit")
      }

      // Increment view count atomically
      const updated = await tx.paste.update({
        where: {
          id,
        },
        data: {
          viewCount: { increment: 1 },
        },
      })

      const remainingViews =
        updated.maxViews !== null
          ? Math.max(updated.maxViews - updated.viewCount, 0)
          : null

      return {
        content: updated.content,
        remaining_views: remainingViews,
        expires_at: updated.expiresAt,
      }
    })
  }


}
