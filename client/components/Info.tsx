import type { FC } from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { getApiPath } from '../service/utils';

const InfoWrapper = styled.div`
  min-height: 45px;
  max-height: 45px;
  background: var(--color-chrome);
  color: var(--color-chrome-text);
  padding: 5px 15px;
`;

export const Info: FC = () => {
  const [content, setContent] = useState('');

  const load = async (): Promise<void> => {
    const response = await fetch(
      getApiPath(`/api/info/${window.localStorage.getItem('npm-gui-id')}`),
    );
    setContent(await response.text());
  };

  useEffect(() => {
    if (window.localStorage.getItem('npm-gui-id') !== 'developer') {
      load();
    }
  }, []);

  if (!content) {
    return null;
  }

  return (
    <InfoWrapper>
      <div
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          // eslint-disable-next-line @typescript-eslint/naming-convention
          __html: content,
        }}
      />
    </InfoWrapper>
  );
};
