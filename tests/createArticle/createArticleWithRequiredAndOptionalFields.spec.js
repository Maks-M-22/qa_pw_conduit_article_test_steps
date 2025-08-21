import { expect, test } from '@playwright/test';
import { SignUpPage } from '../../src/pages/SignUpPage';
import { HomePage } from '../../src/pages/HomePage';
import { CreateArticlePage } from '../../src/pages/CreateArticlePage';
//import { ArticlePage } from '../../src/pages/articlePage';
import { faker } from '@faker-js/faker';

let homePage;
let createArticlePage;
let article;

test.beforeEach(async ({ page }) => {
  const signUpPage = new SignUpPage(page);
  homePage = new HomePage(page);
  createArticlePage = new CreateArticlePage(page);
  //articlePage = new ArticlePage(page);

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

test('Create an article with required and optional fields', async ({
  page,
}) => {
  const responsePromise = page.waitForResponse(
    response =>
      response.url().includes('https://conduit.mate.academy/api/articles') &&
      response.status() === 200,
  );
  await homePage.clickNewArticleLink();

  await createArticlePage.fillTitleField(article.title);
  await createArticlePage.fillDescriptionField(article.description);
  await createArticlePage.fillBodyField(article.body);
  await createArticlePage.fillTagsField(article.tags.join(', '));
  await createArticlePage.clickPublishArticleButton();

  const response = await responsePromise;
  const responseBody = await response.json();
  const slug = responseBody.article.slug;

  await expect(page).toHaveURL(new RegExp(`.*article/${slug}`));
});
