// This file extends the global Jest namespace with additional matchers from @testing-library/jest-dom
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace?: boolean }): R;
      toHaveAttribute(attr: string, value?: string | number | boolean | RegExp | null): R;
      toHaveClass(...classNames: string[]): R;
      toHaveAttribute(attr: string, value?: string | number | boolean | null): R;
      toHaveValue(value: string | string[] | number): R;
      toHaveAttribute(attr: string, value?: string | number | boolean | null): R;
      toBeChecked(): R;
    }
  }
}
