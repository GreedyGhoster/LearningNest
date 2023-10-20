import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthReq } from '../src/auth/req';
import { CreateBookmarkReq, EditBookmarkReq } from '../src/bookmark/req';

import { EditUserReq } from '../src/user/req';

describe('App', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    pactum.request.setBaseUrl('http://localhost:3500');

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3500);

    prisma = app.get(PrismaService);

    await prisma.cleanDb();
  });

  afterAll(async () => {
    app.close();
  });

  describe('Auth', () => {
    const req: AuthReq = {
      email: 'test@example.com',
      password: 'test123',
    };

    describe('SignUp', () => {
      it('should throw if email and password is empty', () => {
        return pactum.spec().post('/signup').withBody({}).expectStatus(400);
      });

      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/signup')
          .withBody({
            password: req.password,
          })
          .expectStatus(400);
      });

      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/signup')
          .withBody({
            email: req.email,
          })
          .expectStatus(400);
      });

      it('should sign up', () => {
        return pactum.spec().post('/signup').withBody(req).expectStatus(201);
      });
    });

    describe('SignIn', () => {
      it('should throw if email and password is empty', () => {
        return pactum.spec().post('/signin').withBody({}).expectStatus(400);
      });

      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/signin')
          .withBody({
            password: req.password,
          })
          .expectStatus(400);
      });

      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/signin')
          .withBody({
            email: req.email,
          })
          .expectStatus(400);
      });

      it('should sign in', () => {
        return pactum
          .spec()
          .post('/signin')
          .withBody(req)
          .expectStatus(200)
          .stores('UserAt', 'access_token'); // Сохраняем токен в переменную UserAt
      });
    });
  });

  describe('User', () => {
    const editReq: EditUserReq = {
      email: 'user2@example.com',
      firstName: 'John',
      lastName: 'Smith',
    };

    describe('Get me', () => {
      it('should throw if Authorization is null', () => {
        return pactum.spec().get('/users/me').withHeaders({}).expectStatus(401);
      });

      it('should get me', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: `Bearer $S{UserAt}`,
          })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: `Bearer $S{UserAt}`,
          })
          .withBody(editReq)
          .expectStatus(200)
          .expectBodyContains(editReq.email)
          .expectBodyContains(editReq.firstName)
          .expectBodyContains(editReq.lastName);
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Get empty bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create bookmark', () => {
      const dto: CreateBookmarkReq = {
        title: 'First Bookmark',
        link: 'https://www.youtube.com/watch?v=d6WC5n9G_sM',
      };
      it('should create bookmark', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });
    });

    describe('Get bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get bookmark by id', () => {
      it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}');
      });
    });

    describe('Edit bookmark by id', () => {
      const dto: EditBookmarkReq = {
        title:
          'Kubernetes Course - Full Beginners Tutorial (Containerize Your Apps!)',
        description:
          'Learn how to use Kubernetes in this complete course. Kubernetes makes it possible to containerize applications and simplifies app deployment to production.',
      };
      it('should edit bookmark', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description);
      });
    });

    describe('Delete bookmark by id', () => {
      it('should delete bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204);
      });

      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
