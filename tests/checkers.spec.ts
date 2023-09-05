import { test, expect } from '@playwright/test'
import { CheckersPage } from '../pages/CheckersPage'

test.describe("Checkers", () => {
  let checkersPage: CheckersPage
  
  test.beforeEach(async ({ page }) => {
    checkersPage = new CheckersPage(page)
    await checkersPage.visit()
  })

  test("verify that the site is up", async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Checkers/)
    
    const h1Header = checkersPage.getH1Header()
    await expect(h1Header).toBeVisible()
    await expect(h1Header).toHaveText("Checkers")

    const message = checkersPage.getMessage()
    await expect(message).toHaveText("Select an orange piece to move.")
  })

  test("verify making five moves and restarting the game", async () => {
    const message = checkersPage.getMessage()
    await expect(message).toHaveText("Select an orange piece to move.")

    // Move 1
    let originalGrid = checkersPage.getGridAt(0, 2)
    let targetGrid = checkersPage.getGridAt(1, 3)
    await expect(originalGrid).toHaveAttribute("src", "you1.gif")
    await originalGrid.click()
    await expect(originalGrid).toHaveAttribute("src", "you2.gif")
    await targetGrid.click()
    await expect(targetGrid).toHaveAttribute("src", "you1.gif")
    await expect(originalGrid).toHaveAttribute("src", /gray\.gif$/)
    await expect(message).toHaveText("Make a move.")

    // Opponent's move 1
    originalGrid = checkersPage.getGridAt(1, 5)
    targetGrid = checkersPage.getGridAt(2, 4)
    await expect(targetGrid).toHaveAttribute("src", "me1.gif")
    await expect(originalGrid).toHaveAttribute("src", /gray\.gif$/)
    await expect(message).toHaveText("Make a move.")

    // Move 2
    originalGrid = checkersPage.getGridAt(1, 1)
    targetGrid = checkersPage.getGridAt(0, 2)
    await expect(originalGrid).toHaveAttribute("src", "you1.gif")
    await originalGrid.click()
    await expect(originalGrid).toHaveAttribute("src", "you2.gif")
    await targetGrid.click()
    await expect(targetGrid).toHaveAttribute("src", "you1.gif")
    await expect(originalGrid).toHaveAttribute("src", /gray\.gif$/)
    await expect(message).toHaveText("Make a move.")

    // Opponent's move 2
    originalGrid = checkersPage.getGridAt(3, 5)
    targetGrid = checkersPage.getGridAt(4, 4)
    await expect(targetGrid).toHaveAttribute("src", "me1.gif")
    await expect(message).toHaveText("Make a move.")

    // Move 3 (take oppoent's piece)
    originalGrid = checkersPage.getGridAt(1, 3)
    targetGrid = checkersPage.getGridAt(3, 5)
    let oppoentPiece = checkersPage.getGridAt(2, 4)
    await expect(oppoentPiece).toHaveAttribute("src", "me1.gif")
    await expect(originalGrid).toHaveAttribute("src", "you1.gif")
    await originalGrid.click()
    await expect(originalGrid).toHaveAttribute("src", "you2.gif")
    await targetGrid.click()
    // Opponent's move 3 (take player's piece on target grid)
    await expect(targetGrid).toHaveAttribute("src", /gray\.gif$/)
    await expect(originalGrid).toHaveAttribute("src", /gray\.gif$/)
    await expect(oppoentPiece).toHaveAttribute("src", "me1.gif")
    await expect(message).toHaveText("Make a move.")

    // Move 4
    originalGrid = checkersPage.getGridAt(4, 2)
    targetGrid = checkersPage.getGridAt(5, 3)
    await expect(originalGrid).toHaveAttribute("src", "you1.gif")
    await originalGrid.click()
    await expect(originalGrid).toHaveAttribute("src", "you2.gif")
    await targetGrid.click()
    await expect(targetGrid).toHaveAttribute("src", "you1.gif")
    await expect(originalGrid).toHaveAttribute("src", /gray\.gif$/)
    await expect(message).toHaveText("Make a move.")

    // Opponent's move 4
    originalGrid = checkersPage.getGridAt(2, 4)
    targetGrid = checkersPage.getGridAt(3, 3)
    await expect(targetGrid).toHaveAttribute("src", "me1.gif")
    await expect(originalGrid).toHaveAttribute("src", /gray\.gif$/)
    await expect(message).toHaveText("Make a move.")

    // Move 5
    originalGrid = checkersPage.getGridAt(5, 3)
    targetGrid = checkersPage.getGridAt(3, 5)
    oppoentPiece = checkersPage.getGridAt(4, 4)
    await expect(oppoentPiece).toHaveAttribute("src", "me1.gif")
    await expect(originalGrid).toHaveAttribute("src", "you1.gif")
    await originalGrid.click()
    await expect(originalGrid).toHaveAttribute("src", "you2.gif")
    await targetGrid.click()
    await expect(targetGrid).toHaveAttribute("src", "you1.gif")
    await expect(originalGrid).toHaveAttribute("src", /gray\.gif$/)
    await expect(oppoentPiece).toHaveAttribute("src", /gray\.gif$/)

    await checkersPage.restartGame()
    await expect(message).toHaveText("Select an orange piece to move.")
  })

  test("verify that clicking on the wrong grid prevents from making a move", async () => {
    const message = checkersPage.getMessage()
    await expect(message).toHaveText("Select an orange piece to move.")
    
    // Get all non movable pieces (grids)
    const nonMovablePieces = checkersPage.getNonMovablePieces()
    const nonMovablePiecesCount = await nonMovablePieces.count()

    for (let i = 0; i < nonMovablePiecesCount; i++) {
      // Use nth() to select current piece
      const piece = nonMovablePieces.nth(i)
      await piece.click()
      await expect(message).toHaveText("Click on your orange piece, then click where you want to move it.")
    }
  })

  test("verify that invalid diagonal move is prevented", async () => {
    const message = checkersPage.getMessage()
    await expect(message).toHaveText("Select an orange piece to move.")

    // Invalid diagonal move
    let originalGrid = checkersPage.getGridAt(4, 2)
    let targetGrid = checkersPage.getGridAt(7, 3)
    await expect(originalGrid).toHaveAttribute("src", "you1.gif")
    await originalGrid.click()
    await expect(originalGrid).toHaveAttribute("src", "you2.gif")

    // Repeat 5 times
    for (let i = 0; i < 4; i++) {
      await targetGrid.click()
      await expect(originalGrid).toHaveAttribute("src", "you2.gif")
      // --BUG: every 2nd click displays "Please wait."
      await expect(message).toHaveText("This is an invalid move.")
    }
  })

  test("verify that invalid vertical move is prevented", async () => {
    const message = checkersPage.getMessage()
    await expect(message).toHaveText("Select an orange piece to move.")

    // Invalid vertical move
    let originalGrid = checkersPage.getGridAt(4, 2)
    let targetGrid = checkersPage.getGridAt(4, 4)
    await expect(originalGrid).toHaveAttribute("src", "you1.gif")
    await originalGrid.click()
    await expect(originalGrid).toHaveAttribute("src", "you2.gif")

    // Repeat 5 times
    for (let i = 0; i < 4; i++) {
      await targetGrid.click()
      await expect(originalGrid).toHaveAttribute("src", "you2.gif")
      // --BUG: every 2nd click displays "Please wait."
      await expect(message).toHaveText("Move diagonally only.")
    }
  })
})
