import { test, expect } from "@playwright/test"


const UI_URL = "http://localhost:5173/"


test('should allow the user to sign in', async ({ page }) => {
  await page.goto(UI_URL);

  // get sign in button
  await page.getByRole("link", {name: "Sign In"}).click();

  //Assert that we are on sign in page
  await expect(page.getByRole("heading", { name: "Sign In"})).toBeVisible();

  //Find element email on the sign in form and fill it
  await page.locator("[name=email]").fill("1@11.com");

  //Find element password on the sign in form and fill it
  await page.locator("[name=password]").fill("password123");

  //Click login button
  await page.getByRole("button", { name : "Login"}).click();

  //Assert that user has sign in successfully (Successful toast message display and header links change)
  //Successful sign in message
  await expect(page.getByText("Sign in Successful")).toBeVisible();

  //Header links
  await expect(page.getByRole("link", {name : "My Bookings"})).toBeVisible();
  await expect(page.getByRole("link", {name : "My Hotels"})).toBeVisible();
  await expect(page.getByRole("button", {name : "Sign Out"})).toBeVisible();
});

test("should allow user to register" , async( { page } ) => {
  //Random email test
  const testEmail = `test_register_${Math.floor(Math.random() * 90000) + 10000}@test.com`

  await page.goto(UI_URL);

  // get sign in button
  await page.getByRole("link", {name: "Sign In"}).click();

  //Assert that we are on sign in page
  await expect(page.getByRole("heading", { name: "Sign In"})).toBeVisible();

  //Click on create an account link
  await page.getByRole("link", { name : "Create an account here"}).click();

  //Assert that we are on register page by checking Create an account header visibility
  await expect(page.getByRole("heading", { name : "Create an Account"})).toBeVisible();

  //Fill form
  await page.locator("[name=firstName]").fill("test_firstName")
  await page.locator("[name=lastName]").fill("test_lastName")
  await page.locator("[name=email]").fill(testEmail)
  await page.locator("[name=password]").fill("password123")
  await page.locator("[name=confirmPassword]").fill("password123")

  //Click on register button
  await page.getByRole("button" , {name : "Create Account"}).click();

  //Assert that user has registered successfully (Successful toast message display and header links change)
  //Successful REGISTER message
  await expect(page.getByText("Registration Sucessful!")).toBeVisible();

  //Header links
  await expect(page.getByRole("link", {name : "My Bookings"})).toBeVisible();
  await expect(page.getByRole("link", {name : "My Hotels"})).toBeVisible();
  await expect(page.getByRole("button", {name : "Sign Out"})).toBeVisible();
})

