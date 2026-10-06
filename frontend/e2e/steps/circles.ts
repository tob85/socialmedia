import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { When, Then } = createBdd()

When('user navigates to {string} section', async ({ page }, name: string) => {
  if (!page.url().includes('http')) {
    await page.goto('/')
  }
  await page.getByRole('link', { name }).click()
  await expect(page.getByRole('heading', { name })).toBeVisible()
})

Then('all circles where user is a member should be listed', async ({ page }) => {
  await expect(page.getByRole('listitem')).toHaveCount(2)
  await expect(page.locator('[data-circle-name="Weekend Hangouts"]')).toBeVisible()
  await expect(page.locator('[data-circle-name="Open Study Circle"]')).toBeVisible()
})

Then('the circle owner status should highlight for owned circles', async ({ page }) => {
  const owned = page.locator('[data-role="owner"]')
  await expect(owned).toHaveAttribute('data-circle-name', 'Weekend Hangouts')
  await expect(owned.getByText('Owner', { exact: true })).toBeVisible()
})

Then('option to leave any circle \\(except owned ones\\) should appear', async ({ page }) => {
  const owned = page.locator('[data-role="owner"]')
  const member = page.locator('[data-role="member"]')
  await expect(owned.getByRole('button', { name: /Leave/ })).toHaveCount(0)
  await expect(member.getByRole('button', { name: 'Leave Open Study Circle' })).toBeVisible()
})
