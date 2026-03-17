import type { FC } from 'react';
import styled from 'styled-components';

import { Button } from '../../ui/Button/Button';
import { Icon } from '../../ui/Icon/Icon';
import { Explorer } from './components/Explorer';
import { Settings } from './components/Settings';
import { useHeader } from './use-header';

export interface HeaderButton {
  text: string;
  routeName: string;
  icon: string;
}

const Nav = styled.nav`
  background: var(--color-chrome);
  min-height: 35px;
  max-height: 35px;
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  justify-content: space-between;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Title = styled.h1`
  color: var(--color-chrome-text);
  font-size: 1em;
  font-weight: 400;
  margin: 0 15px 0 0;
`;

const ProjectChip = styled.div<{ $active: boolean }>`
  background: ${({ $active }) =>
    $active ? 'var(--color-info)' : 'var(--color-chrome)'};
  border-radius: 6px;
  color: var(--color-chrome-text);
  display: inline-flex;
  align-items: stretch;
  overflow: hidden;
`;

const ProjectChipButton = styled.button`
  appearance: none;
  background: transparent;
  border: 0;
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font: inherit;
  font-size: 11px;
  font-weight: 500;
  min-height: 28px;
  padding: 0 10px;
  white-space: nowrap;
`;

const ProjectChipClose = styled.button`
  appearance: none;
  background: transparent;
  border: 0;
  border-left: 1px solid rgba(255, 255, 255, 0.18);
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
`;

export const Header: FC = () => {
  const {
    globalButtonLabel,
    globalButtonProject,
    hasLocalProject,
    projectPathEncoded,
    projects,
    handleRemoveProject,
    navigateToProject,
  } = useHeader();

  return (
    <Nav>
      <LeftSection>
        <Title>npm-gui-next</Title>
        <Button
          icon="globe"
          disabled={projectPathEncoded === 'global' && !hasLocalProject}
          onClick={(): void => navigateToProject(globalButtonProject)}
          soft
          title={
            projectPathEncoded === 'global'
              ? 'Show current local project'
              : 'Show global packages'
          }
          variant={projectPathEncoded === 'global' ? 'info' : 'dark'}
        >
          {globalButtonLabel}
        </Button>
      </LeftSection>

      <RightSection>
        {projects
          .filter(({ path }) => path !== 'global')
          .map(({ path }) => (
            <ProjectChip $active={path === projectPathEncoded} key={path}>
              <ProjectChipButton
                onClick={(): void => navigateToProject(path)}
                title={window.atob(path)}
                type="button"
              >
                <Icon glyph="code" />
                {window.atob(path).split('/').reverse()[0]}
              </ProjectChipButton>
              <ProjectChipClose
                onClick={(): void => handleRemoveProject(path)}
                title="Remove"
                type="button"
              >
                <Icon glyph="x" />
              </ProjectChipClose>
            </ProjectChip>
          ))}

        <Explorer />
        <Settings />
      </RightSection>
    </Nav>
  );
};
