import { test, expect } from "@playwright/test"


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


//Test that expects Dublin Getaways hotel to be displayed on search page
test("Should show hotel search results", async ( { page }) => {
    await page.goto(UI_URL);

    await page.getByPlaceholder("Where are you going?").fill("Dublin");

    await page.getByRole("button", {name : "Search"}).click();

    await expect(page.getByText("Hotels found in Dublin")).toBeVisible();
    await expect(page.getByText("Dublin Getaways")).toBeVisible();

});

test("should show hotel detail", async ( { page }) => {
    await page.goto(UI_URL);

    await page.getByPlaceholder("Where are you going?").fill("Dublin");
    await page.getByRole("button", {name : "Search"}).click();  
    
    //Click to go to view details page
    await page.getByText("Dublin Getaways").click();
    //Assure url has '/detail/9480503943' using a regex
    await expect(page).toHaveURL(/detail/);

    //As we're signed in make sure that the button has text Book Now
    await expect(page.getByRole("button", {name: "Book now"})).toBeVisible();

})