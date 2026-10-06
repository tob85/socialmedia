import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { Given, When, Then } = createBdd()

Given('the user opens the app', async ({ page }) => {
  await page.goto('/')
})

Given('the user opens the register page', async ({ page }) => {
  await page.goto('/register')
  await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible()
})

Given('the user opens the login page', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible()
})

Then('the welcome heading is visible', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Activities for parents and kids' })).toBeVisible()
})

When('the user types an email and password', async ({ page }) => {
  await page.getByLabel('Email').fill('ada@example.com')
  await page.getByLabel('Password').fill('correct-horse-battery')
})

Then('the email and password fields show the typed values', async ({ page }) => {
  await expect(page.getByLabel('Email')).toHaveValue('ada@example.com')
  await expect(page.getByLabel('Password')).toHaveValue('correct-horse-battery')
})
