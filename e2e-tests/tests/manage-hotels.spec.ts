import { test, expect } from "@playwright/test"
import path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const UI_URL = "http://localhost:5173/"





//Sign in before executing another test
test.beforeEach(async({ page })=> {
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
})


test("should allow user to add a hotel", async ({ page }) => {
    //Go to add hotel page
    await page.goto(`${UI_URL}add-hotel`)

    //Hotel Details (Text Input)
    await page.locator('[name="name"]').fill("Test Hotel");
    await page.locator('[name="city"]').fill("Test City");
    await page.locator('[name="country"]').fill("Test Country");
    await page.locator('[name="description"]').fill("This is a description for the test hotel");
    await page.locator('[name="pricePerNight"]').fill("100");

    //Star rating of 3
    await page.selectOption('select[name="starRating"]', "3")

    //Select Budget type for hotel type (Radio button)
    await page.getByText("Budget").click();

    //Hotel Facilities (Checkbox)
    await page.getByLabel("Free Wifi").check();
    await page.getByLabel("Parking").check();

    //Adult and Child count
    await page.locator('[name="adultCount"]').fill("2")
    await page.locator('[name="childCount"]').fill("4")

    //Upload images
    await page.setInputFiles('[name="imageFiles"]', [
        path.join(__dirname, "files", "sample_hotel_image_1.jpg"),
        path.join(__dirname, "files", "sample_hotel_image_2.jpg")
    ]);

    //Click on save button
    await page.getByRole('button', { name : "Save"}).click();
    
    //Assert that Hotel Saved toast appears
    await expect(page.getByText("Hotel Saved!")).toBeVisible();
    
})