import { test, expect } from '@playwright/test'

test('login → crear transacción → se ve en la lista y actualiza el balance', async ({
  page,
}) => {
  await page.goto('/')

  await page.getByLabel('Usuario').fill('demo')
  await page.getByLabel('Contraseña').fill('demo1234')
  await page.getByRole('button', { name: 'Ingresar' }).click()

  await expect(page.getByRole('heading', { name: /FinTrack/ })).toBeVisible()

  await page.getByPlaceholder('Descripción').fill('Sueldo')
  await page.getByPlaceholder('Monto').fill('50000')
  await page.getByRole('combobox').first().selectOption('income')
  await page.getByRole('button', { name: 'Agregar' }).click()

  await expect(page.getByTestId('tx-list')).toContainText('Sueldo')

  await expect(page.getByTestId('balance')).toContainText('50.000')
})
