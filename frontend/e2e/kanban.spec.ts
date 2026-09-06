import { test, expect } from "@playwright/test";

test.describe("Kanban Application", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders 5 fixed columns and pre-populated cards", async ({ page }) => {
    await expect(page.getByText("Project Kanban Board")).toBeVisible();
    await expect(page.getByTestId("column-col-backlog")).toBeVisible();
    await expect(page.getByTestId("column-col-ready")).toBeVisible();
    await expect(page.getByTestId("column-col-in-progress")).toBeVisible();
    await expect(page.getByTestId("column-col-in-review")).toBeVisible();
    await expect(page.getByTestId("column-col-done")).toBeVisible();

    // Check pre-populated cards
    await expect(page.getByTestId("card-card-1")).toBeVisible();
    await expect(page.getByTestId("card-card-8")).toBeVisible();
  });

  test("renames a column inline", async ({ page }) => {
    const titleContainer = page.getByTestId("column-title-container-col-backlog");
    await titleContainer.click();

    const input = page.getByTestId("column-rename-input-col-backlog");
    await expect(input).toBeVisible();

    await input.fill("Product Ideas");
    await input.press("Enter");

    await expect(page.getByTestId("column-title-col-backlog")).toHaveText("Product Ideas");
  });

  test("adds a new card to a column", async ({ page }) => {
    const addBtn = page.getByTestId("add-card-button-col-ready");
    await addBtn.click();

    await expect(page.getByTestId("add-card-modal")).toBeVisible();
    await page.getByTestId("card-title-input").fill("Write automated e2e tests");
    await page.getByTestId("card-details-input").fill("Use Playwright to verify flows");
    await page.getByTestId("submit-card-button").click();

    await expect(page.getByTestId("add-card-modal")).not.toBeVisible();
    await expect(page.getByText("Write automated e2e tests")).toBeVisible();
    await expect(page.getByText("Use Playwright to verify flows")).toBeVisible();
  });

  test("deletes an existing card", async ({ page }) => {
    await expect(page.getByTestId("card-card-1")).toBeVisible();

    const deleteBtn = page.getByTestId("delete-card-card-1");
    await deleteBtn.click();

    await expect(page.getByTestId("card-card-1")).not.toBeVisible();
  });

  test("moves a card via drag and drop", async ({ page }) => {
    const cardHandle = page.getByTestId("card-card-3").getByLabel("Drag card handle");
    const targetColumn = page.getByTestId("column-droppable-col-backlog");

    await expect(cardHandle).toBeVisible();
    await expect(targetColumn).toBeVisible();

    const handleBox = await cardHandle.boundingBox();
    const targetBox = await targetColumn.boundingBox();

    expect(handleBox).not.toBeNull();
    expect(targetBox).not.toBeNull();

    if (handleBox && targetBox) {
      await page.mouse.move(
        handleBox.x + handleBox.width / 2,
        handleBox.y + handleBox.height / 2
      );
      await page.mouse.down();
      // Move gradually to trigger pointer sensor
      await page.mouse.move(
        handleBox.x + handleBox.width / 2 + 10,
        handleBox.y + handleBox.height / 2 + 10,
        { steps: 5 }
      );
      await page.mouse.move(
        targetBox.x + targetBox.width / 2,
        targetBox.y + targetBox.height / 2,
        { steps: 20 }
      );
      await page.waitForTimeout(200);
      await page.mouse.up();
    }

    // Verify card-3 is now inside the backlog column container
    const backlogColumn = page.getByTestId("column-col-backlog");
    await expect(backlogColumn.getByTestId("card-card-3")).toBeVisible();
  });
});
