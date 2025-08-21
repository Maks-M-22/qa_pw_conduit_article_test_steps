import { expect, test } from '@playwright/test';

export class ArticlePage {
  constructor(page) {
    this.page = page;
    this.articleTitle = page.locator('h1');
  }

  async assertArticleTitle(headText) {
    await test.step(`Assert the article title is visible`, async () => {
      await expect(this.articleTitle).toHaveText(headText);
    });
  }
}
