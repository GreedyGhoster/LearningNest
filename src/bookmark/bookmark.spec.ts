import { Test, TestingModule } from '@nestjs/testing';
import { Bookmark } from './bookmark.service';

describe('Bookmark', () => {
  let provider: Bookmark;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Bookmark],
    }).compile();

    provider = module.get<Bookmark>(Bookmark);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
