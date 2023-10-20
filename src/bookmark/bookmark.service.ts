import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkReq } from './req/create-bookmark.req';
import { EditBookmarkReq } from './req/edit-bookmark.req';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async createBookmark(userId: number, req: CreateBookmarkReq) {
    const bookmark = this.prisma.bookmark.create({
      data: {
        userId,
        ...req,
      },
    });

    return bookmark;
  }

  async getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    return this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }

  async editBookmark(userId: number, bookmarkId: number, req: EditBookmarkReq) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    // check if user owns the bookmark
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...req,
      },
    });
  }

  async deleteBookmark(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
