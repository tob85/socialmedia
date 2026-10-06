import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { Given, When, Then } = createBdd()

Given('user opens the circle {string}', async ({ page }, name: string) => {
  if (!page.url().includes('http')) {
    await page.goto('/')
  }
  await page.getByRole('link', { name: 'My Circles' }).click()
  await page.getByRole('link', { name }).click()
  await expect(page.getByRole('heading', { name })).toBeVisible()
})

When('user writes and submits a post with content {string}', async ({ page }, content: string) => {
  await page.getByLabel('Post').fill(content)
  await page.getByRole('button', { name: 'Post' }).click()
})

Then('the post {string} should appear in the feed', async ({ page }, content: string) => {
  await expect(page.locator(`[data-post-content="${content}"]`)).toBeVisible()
  await expect(page.getByText(content, { exact: true })).toBeVisible()
})
