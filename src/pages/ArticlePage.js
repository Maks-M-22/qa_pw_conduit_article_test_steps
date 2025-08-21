import { expect, test } from '@playwright/test';

export class ArticlePage {
  constructor(page) {
    this.page = page;
    this.articleTitle = page.locator('h1');
    this.articleBody = page.locator('.article-content');
    this.articleTags = page.locator('.tag-list');
  }

  async assertArticleTitle(title) {
    await test.step(`Assert the article title is visible`, async () => {
      await expect(this.articleTitle).toHaveText(title);
    });
  }

  async assertArticleBody() {
    await test.step(`Assert the article body is visible`, async () => {
      await expect(this.articleBody).toBeVisible();
    });
  }

  async assertArticleTags() {
    await test.step(`Assert the article tags are visible`, async () => {
      await expect(this.articleTags).toBeVisible();
    });
  }
}
