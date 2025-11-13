import { test } from '../../_fixtures/fixtures';
import { ViewArticlePage } from '../../../src/ui/pages/article/ViewArticlePage';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { HomePage } from '../../../src/ui/pages/HomePage';

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
    const article1 = generateNewArticleData(users[0].username);
    const article2 = generateNewArticleData(users[1].username);

    await pages[0].goto('/editor');

    await pages[1].goto('/editor');

    const homePage = new HomePage(pages[2]);
    await homePage.open();

    await homePage.assertArticleIsVisible(article1.title);
    await homePage.assertArticleIsVisible(article2.title);
  });
});