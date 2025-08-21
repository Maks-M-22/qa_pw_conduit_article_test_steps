import { test } from '@playwright/test';
import { SignUpPage } from '../../src/pages/SignUpPage';
import { HomePage } from '../../src/pages/HomePage';
import { CreateArticlePage } from '../../src/pages/CreateArticlePage';
import { ArticlePage } from '../../src/pages/articlePage';
import { faker } from '@faker-js/faker';

test.describe('Create an article without some fields test', () => {
  let homePage;
  let createArticlePage;
  let articlePage;
  let article;

  test.beforeEach(async ({ page }) => {
    const signUpPage = new SignUpPage(page);
    homePage = new HomePage(page);
    createArticlePage = new CreateArticlePage(page);
    articlePage = new ArticlePage(page);

    const user = {
      username: `${faker.person.firstName()}_${faker.person.lastName()}`,
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    article = {
      title: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      body: faker.lorem.paragraphs(3),
      tags: faker.lorem.words(3).split(' '),
    };

    await signUpPage.open();
    await signUpPage.fillUsernameField(user.username);
    await signUpPage.fillEmailField(user.email);
    await signUpPage.fillPasswordField(user.password);
    await signUpPage.clickSignUpButton();
    await homePage.assertYourFeedTabIsVisible();
  });

  test('Create an article without required fields', async () => {
    await homePage.clickNewArticleLink();

    await createArticlePage.clickPublishArticleButton();
    await createArticlePage.assertErrorMessageContainsText(
      'Article title cannot be empty',
    );
  });

  test('create an article without article description', async () => {
    await homePage.clickNewArticleLink();

    await createArticlePage.fillTitleField(article.title);
    await createArticlePage.fillBodyField(article.body);
    await createArticlePage.fillTagsField(article.tags);
    await createArticlePage.clickPublishArticleButton();

    await createArticlePage.assertErrorMessageContainsText(
      'Article description cannot be empty',
    );
  });

  test('create an article without article body', async () => {
    await homePage.clickNewArticleLink();

    await createArticlePage.fillTitleField(article.title);
    await createArticlePage.fillDescriptionField(article.description);
    await createArticlePage.fillTagsField(article.tags);
    await createArticlePage.clickPublishArticleButton();

    await createArticlePage.assertErrorMessageContainsText(
      'Article body cannot be empty',
    );
  });

  test('create an article without article tags', async () => {
    await homePage.clickNewArticleLink();

    await createArticlePage.fillTitleField(article.title);
    await createArticlePage.fillDescriptionField(article.description);
    await createArticlePage.fillBodyField(article.body);
    await createArticlePage.clickPublishArticleButton();

    await articlePage.assertArticleTitle(article.title);
  });
});
