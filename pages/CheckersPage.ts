import { Locator, Page } from "@playwright/test"

export class CheckersPage {
  readonly page: Page
  readonly h1Header: Locator
  readonly message: Locator
  readonly restartButton: Locator

  constructor(page: Page) {
    this.page = page
    this.h1Header = page.locator("h1:has-text('Checkers')")
    this.message = page.locator("#message")
    this.restartButton = page.getByText("Restart...")
  }

  getGridAt(x: number, y: number) {
    return this.page.locator(`img[onclick="didClick(${x}, ${y})"]`)
  }

  getH1Header() {
    return this.h1Header
  }

  getMessage() {
    return this.message
  }

  getNonMovablePieces() {
    return this.page.locator(`img:not([src='you1.gif'])[onclick]`)
  }
  
  async movePieceTo(x: number, y: number) {
    const target = this.page.locator(`img[onclick="didClick(${x}, ${y})"]`)
    await target.click()
  }

  async restartGame() {
    await this.restartButton.click()
  }
  
  async selectPiece(x: number, y: number) {
    const piece = this.page.locator(`img[onclick="didClick(${x}, ${y})"]`)
    await piece.click()
  }

  async visit() {
    await this.page.goto("https://www.gamesforthebrain.com/game/checkers/")
  }
}
