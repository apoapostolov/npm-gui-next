import type { FC, ReactNode } from 'react';
import styled from 'styled-components';

import { useSettings } from '../../../hooks/use-settings';
import { Button } from '../../../ui/Button/Button';
import { useToggle } from '../../../ui/hooks/use-toggle';
import { Icon } from '../../../ui/Icon/Icon';
import { Modal } from '../../../ui/Modal/Modal';

const Panel = styled.div`
  min-width: 280px;
  color: var(--color-text);
`;

const Heading = styled.div`
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Row = styled.label`
  display: block;
  font-size: 12px;
  margin-bottom: 10px;
`;

const Checkbox = styled.input`
  display: inline-block;
  width: auto;
  height: auto;
  margin-right: 8px;
`;

const Hint = styled.small`
  color: var(--color-muted);
  display: block;
  line-height: 1.4;
  margin-top: 4px;
`;

const SettingsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ThemePill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: transparent;

  html[data-theme='light'] & {
    border-color: transparent;
  }
`;

const ThemeButton = styled.button<{ $active: boolean }>`
  appearance: none;
  border: 0;
  border-radius: 999px;
  background: ${({ $active }) =>
    $active ? 'var(--color-hover-strong)' : 'transparent'};
  color: ${({ $active }) =>
    $active ? 'var(--color-text)' : 'var(--color-muted)'};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  transition: background-color 150ms ease, color 150ms ease;

  &:hover {
    background: var(--color-hover);
    color: var(--color-text);
  }
`;

export const Settings: FC = () => {
  const {
    settings,
    setOpenGlobalOnInvalidStart,
    setUseCurrentNpmForGlobalMutations,
    setTheme,
  } = useSettings();
  const { isOpen, onClose, onToggleIsOpen } = useToggle();

  return (
    <SettingsRow>
      <Button
        onClick={onToggleIsOpen}
        title="Open npm-gui-next settings"
        variant="dark"
      >
        Settings
      </Button>

      {isOpen && (
        <Modal onClose={onClose}>
          <Panel>
            <Heading>npm-gui-next settings</Heading>

            <Row>
              <Checkbox
                checked={settings.openGlobalOnInvalidStart}
                onChange={(event): void =>
                  setOpenGlobalOnInvalidStart(event.currentTarget.checked)
                }
                type="checkbox"
              />
              Open global packages when the startup directory is not a Node project
              <Hint>
                When enabled, the app stays on the global packages screen instead
                of opening an invalid project route from the current directory.
              </Hint>
            </Row>

            <Row>
              <Checkbox
                checked={settings.useCurrentNpmForGlobalMutations}
                onChange={(event): void =>
                  setUseCurrentNpmForGlobalMutations(
                    event.currentTarget.checked,
                  )
                }
                type="checkbox"
              />
              Use current npm on PATH for global installs and deletes
              <Hint>
                When enabled, global package changes use the same npm as the old
                npm-gui. Turn this off to target the npm installation that owns
                the selected package.
              </Hint>
            </Row>
          </Panel>
        </Modal>
      )}

      <ThemePill>
        <ThemeButton
          $active={settings.theme === 'light'}
          onClick={(): void => setTheme('light')}
          title="Light mode"
          type="button"
        >
          <Icon glyph="sun" />
        </ThemeButton>
        <ThemeButton
          $active={settings.theme === 'dark'}
          onClick={(): void => setTheme('dark')}
          title="Dark mode"
          type="button"
        >
          <Icon glyph="moon" />
        </ThemeButton>
        <ThemeButton
          $active={settings.theme === 'system'}
          onClick={(): void => setTheme('system')}
          title="System mode"
          type="button"
        >
          <Icon glyph="monitor" />
        </ThemeButton>
      </ThemePill>
    </SettingsRow>
  );
};
