import { test } from "../../_fixtures/fixtures";
import { generateNewArticleData } from "../../../src/common/testData/generateNewArticleData";
import { signUpUser } from "../../../src/ui/actions/auth/signUpUser";
import { createArticle } from "../../../src/ui/actions/articles/createArticle";

const testParameters = [
    { tagsNumber: 1, testNameEnding: 'one tag' },
    { tagsNumber: 2, testNameEnding: 'two tags' },
    { tagsNumber: 5, testNameEnding: 'five tags' },
];

let article;

testParameters.forEach(({ tagsNumber, testNameEnding }) => {
    test.describe('Edit article with tags', () => {
        test.beforeEach(async ({ page, user, homePage, createArticlePage, logger }) => {
            article = generateNewArticleData(logger, tagsNumber);
            await signUpUser(page, user);
            await homePage.clickNewArticleLink();
            await createArticle(page, createArticlePage, article);
        })

        test(`Edit an artile with ${testNameEnding}`, async ({
            createArticlePage,
            editArticlePage,
            viewArticlePage,
            logger,
        }) => {
            const article = generateNewArticleData(logger, tagsNumber);

            await viewArticlePage.clickEditArticleButton();

            await createArticlePage.fillTagsField(article.tags);
            await editArticlePage.clickPublishArticleButton();

            await viewArticlePage.assertArticleTagsAreVisible(article.tags);
        })

        test(`User can remove all tags from article with ${testNameEnding}`, async ({
            editArticlePage,
            viewArticlePage,
        }) => {

            await viewArticlePage.clickEditArticleButton();

            await editArticlePage.removeAllTags();
            await editArticlePage.clickPublishArticleButton();

            await viewArticlePage.assertArticleTagsAreNotVisible();
        });
    })
})