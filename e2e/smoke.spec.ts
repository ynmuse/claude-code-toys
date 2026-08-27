import { expect, test } from "@playwright/test";

test("첫 화면이 열리고 캠핑장 목록과 필터가 보인다", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("강아지 동반 캠핑");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("강아지 동반 캠핑");
  await expect(page.getByText("지역", { exact: true })).toBeVisible();
  await expect(page.getByText("시설", { exact: true })).toBeVisible();
});

test("캠핑장 카드를 누르면 상세로 이동하고, 목록으로 돌아오면 필터가 유지된다", async ({ page }) => {
  await page.goto("/");

  // 지역 필터를 하나 고른 뒤 카드를 눌러 상세로 이동한다.
  await page.getByRole("button", { name: "경기" }).click();
  await expect(page).toHaveURL(/region=%EA%B2%BD%EA%B8%B0|region=경기/);

  const firstCard = page.locator("a[href^='/campsites/']").first();
  const campsiteName = await firstCard.locator("[data-slot='card-title']").first().innerText();
  await firstCard.click();

  await expect(page).toHaveURL(/\/campsites\/.+/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(campsiteName);
  await expect(page.getByText("반려견 크기")).toBeVisible();
  await expect(page.getByText("이 정보의 출처")).toBeVisible();

  await page.getByRole("button", { name: "목록으로" }).click();
  await expect(page).toHaveURL(/region=%EA%B2%BD%EA%B8%B0|region=경기/);
});

test("조건에 맞는 캠핑장이 없으면 안내와 초기화 버튼이 보인다", async ({ page }) => {
  // 실제 데이터에 없는 지역명을 URL에 강제로 걸어 빈 상태를 안정적으로 재현한다.
  await page.goto("/?region=제주");

  await expect(page.getByText("이 조건에 맞는 캠핑장이 아직 없습니다")).toBeVisible();
  await page.getByRole("button", { name: "조건 지우기" }).last().click();
  await expect(page).toHaveURL("/");
});
