import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { CreatePasteDto } from './dto/Paste.dto';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly prisma: PrismaService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/api/pastes')
  async create(@Body() dto: CreatePasteDto) {
    const paste = await this.appService.create(dto)

    return {
      id: paste.id,
      url: `${process.env.APP_URL}/p/${paste.id}`,
    }
  }

  @Get('/api/pastes/:id')
  async fetch(@Param('id') id: string, @Req() req: Request) {
    return this.appService.fetchById(id, req)
  }

  @Get('/api/healthz')
  async health() {
    await this.prisma.$queryRaw`SELECT 1`
    return { ok: true }
  }
}
