import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkService } from './bookmark.service';

describe('Bookmark', () => {
  let provider: BookmarkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookmarkService],
    }).compile();

    provider = module.get<BookmarkService>(BookmarkService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
