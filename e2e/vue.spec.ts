import { test, expect } from '@playwright/test'
import { getDummyResume } from '../src/utils/dummyResume'

// See here how to get started:
// https://playwright.dev/docs/intro
const RESUME_DATA_KEY = 'resumeData';

test('shows resume preview and general form fields', async ({ page }) => {
    await page.addInitScript((resume) => {
        localStorage.setItem(RESUME_DATA_KEY, resume)
    }, JSON.stringify(getDummyResume()))
    await page.goto('/')

    // Resume preview should render when resume data is available
    await expect(page.locator('.resume-preview')).toBeVisible()

    // General tab should contain the required name fields
    await expect(page.locator('input#firstName')).toBeVisible()
    await expect(page.locator('input#lastName')).toBeVisible()
})
