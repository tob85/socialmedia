import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { Given, Then } = createBdd()

Given('the user opens the app', async ({ page }) => {
  await page.goto('/')
})

Then('the welcome heading is visible', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'You did it!' })).toBeVisible()
})
