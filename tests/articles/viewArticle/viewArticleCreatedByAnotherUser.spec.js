import { test } from '../../_fixtures/fixtures';
import { ViewArticlePage } from '../../../src/ui/pages/article/ViewArticlePage';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { HomePage } from '../../../src/ui/pages/HomePage';
import { generateNewUserData } from '../../../src/common/testData/generateNewUserData';

test.use({ contextsNumber: 2, usersNumber: 2 });

test.beforeEach(async ({ pages, users, articleWithoutTags }) => {
  await signUpUser(pages[0], users[0], 1);
  await signUpUser(pages[1], users[1], 2);
  await createArticle(pages[0], articleWithoutTags, 1);
});

test('View an article created by another user', async ({
  articleWithoutTags,
  pages,
  users,
}) => {
  const viewArticlePage = new ViewArticlePage(pages[1], 2);

  await viewArticlePage.open(articleWithoutTags.url);

  await viewArticlePage.assertArticleTitleIsVisible(articleWithoutTags.title);
  await viewArticlePage.assertArticleTextIsVisible(articleWithoutTags.text);
  await viewArticlePage.assertArticleAuthorNameIsVisible(users[0].username);
});

test.describe('Feed: articles from two users', () => {
  test.use({ usersNumber: 3, contextsNumber: 3 });

  test('User can see articles from two other users', async ({ pages, users }) => {
    const createArticlePage1 = new CreateArticlePage(pages[0]);
    await createArticlePage1.open();
    await createArticlePage1.createArticle(articleWithoutTags);

    const createArticlePage2 = new CreateArticlePage(pages[1]);
    await createArticlePage2.open();
    await createArticlePage2.createArticle(articleWithoutTags);

    const homePage = new HomePage(pages[2]);
    await homePage.open();
    await homePage.assertArticleIsVisible(articleWithoutTags.title);
  });
});