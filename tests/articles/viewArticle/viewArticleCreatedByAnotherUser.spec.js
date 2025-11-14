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

  let article1, article2;
  let user1, user2, user3;

  test.beforeEach(async ({ pages, users, logger }) => {
    [user1, user2, user3] = users;

    // User1 sign up and create article1
    await signUpUser(pages[0], user1, 1);
    article1 = generateNewArticleData(logger, 1);
    await createArticle(pages[0], article1, 1);

    // User2 sign up and create article2
    await signUpUser(pages[1], user2, 2);
    article2 = generateNewArticleData(logger, 1);
    await createArticle(pages[1], article2, 2);

    // User3 sign up (no article)
    await signUpUser(pages[2], user3, 3);
  });

  test('User can see articles from two other users', async ({ pages }) => {
    const homePage = new HomePage(pages[2], 3);
    await homePage.open();
    // Перевіряємо, що обидві статті видимі у feed
    await expect(pages[2].getByText(article1.title)).toBeVisible();
    await expect(pages[2].getByText(article2.title)).toBeVisible();
  });
});