import type { FC } from 'react';
import { useState } from 'react';
import styled from 'styled-components';

import type { DependencyInstalledExtras } from '../../../../../../server/types/dependency.types';
import { useProjectStore } from '../../../../../app/ContextStore';
import { useProjectPath } from '../../../../../hooks/use-project-path';
import { Button } from '../../../../../ui/Button/Button';
import { Modal } from '../../../../../ui/Modal/Modal';

interface Props {
  dependency: DependencyInstalledExtras;
}

const Line = styled.hr`
  position: absolute;
  pointer-events: none;
  width: calc(100vw - 110px);
  left: 10px;
  margin: 0;
  margin-top: 10px;
`;

const ModalTitle = styled.h3`
  color: var(--color-text);
  margin-top: 0;
`;

const ModalText = styled.p`
  color: var(--color-text);
  line-height: 1.5;
`;

const ModalList = styled.ul`
  color: var(--color-text);
  font-size: 12px;
  line-height: 1.5;
  margin: 0 0 12px;
  padding-left: 18px;
`;

const ModalShortcut = styled.small`
  color: var(--color-muted);
  display: block;
  margin-bottom: 12px;
`;

const ActionsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

export const TableActions: FC<Props> = ({ dependency }) => {
  const projectPath = useProjectPath();
  const { dispatch, project } = useProjectStore(projectPath);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const markedForDeletion =
    !!project?.dependenciesMutate[dependency.name]?.delete;

  return (
    <>
      {markedForDeletion && <Line />}
      <Button
        disabled={project?.isBusy}
        icon={markedForDeletion ? 'x' : 'trash'}
        onClick={(): void => {
          if (markedForDeletion) {
            dispatch({
              action: 'mutateProjectDependencyCancel',
              projectPath,
              name: dependency.name,
            });
            return;
          }

          setIsDeleteOpen(true);
        }}
        title={
          markedForDeletion ? 'Cancel deletion' : 'Remove package from project'
        }
        variant="danger"
      />

      {isDeleteOpen && (
        <Modal
          onClose={(): void => {
            setIsDeleteOpen(false);
          }}
        >
          <ModalTitle>Remove dependency</ModalTitle>
          <ModalText>
            Stage <b>{dependency.name}</b> for removal from this project.
            Confirming here does not uninstall immediately.
          </ModalText>
          <ModalList>
            <li>The row stays visible until you apply the staged changes.</li>
            <li>You can still cancel the removal from the table before syncing.</li>
            <li>The actual uninstall happens only when the staged changes are applied.</li>
          </ModalList>
          <ModalShortcut>Press Escape or click outside to close this dialog.</ModalShortcut>
          <ActionsRow>
            <Button
              onClick={(): void => setIsDeleteOpen(false)}
              title="Cancel delete"
              variant="dark"
            >
              Cancel
            </Button>
            <Button
              icon="trash"
              onClick={(): void => {
                dispatch({
                  action: 'mutateProjectDependency',
                  projectPath,
                  name: dependency.name,
                  required: null,
                  delete: true,
                  type: dependency.type,
                });
                setIsDeleteOpen(false);
              }}
              title="Confirm delete"
              variant="danger"
            >
              Mark for delete
            </Button>
          </ActionsRow>
        </Modal>
      )}
    </>
  );
};
