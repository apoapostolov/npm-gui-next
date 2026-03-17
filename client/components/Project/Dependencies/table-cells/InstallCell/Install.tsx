import type { FC } from 'react';
import styled from 'styled-components';

import type { DependencyInstalledExtras } from '../../../../../../server/types/dependency.types';
import { useProjectStore } from '../../../../../app/ContextStore';
import { useProjectPath } from '../../../../../hooks/use-project-path';
import { Button } from '../../../../../ui/Button/Button';

const InstallValue = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 24px;
`;

const CancelButton = styled(Button)`
  min-height: 24px;
  min-width: 24px;
  width: 24px;
  margin-right: 0;
`;

interface Props {
  dependency: DependencyInstalledExtras;
}

export const Install: FC<Props> = ({ dependency }) => {
  const projectPath = useProjectPath();
  const { project, dispatch } = useProjectStore(projectPath);

  const v = project?.dependenciesMutate[dependency.name]?.required;

  return (
    <InstallValue>
      {v}
      {v && (
        <CancelButton
          disabled={project.isBusy}
          icon="x"
          onClick={(): void =>
            dispatch({
              action: 'mutateProjectDependencyCancel',
              projectPath,
              name: dependency.name,
            })
          }
          title="Cancel change"
          variant="danger"
        />
      )}
    </InstallValue>
  );
};
