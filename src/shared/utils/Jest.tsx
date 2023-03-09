import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { SharedDataProvider } from 'shared/context/sharedDataProvider';

export const renderWithRouterAndContext = (children: ReactNode) => {
  return render(<SharedDataProvider>{children}</SharedDataProvider>, { wrapper: BrowserRouter });
};
