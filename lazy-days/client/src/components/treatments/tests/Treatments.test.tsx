import { screen } from '@testing-library/react';
import { renderWithQueryClient } from 'test-utils';
import { Treatments } from '../Treatments';

//! Treatments 컴포넌트 테스트 (useTreatments 쿼리 테스트)
test('renders response from query',async () => {
  renderWithQueryClient(<Treatments/>)

  const treatmentTitles = await screen.findAllByRole('heading',
  {
    name: /massage|facial|scrub/i, 
  });
  
  console.log(22, treatmentTitles);
  

  expect(treatmentTitles).toHaveLength(3);
});
