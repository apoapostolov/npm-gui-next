import type { FC } from 'react';
import { useContext } from 'react';
import styled from 'styled-components';

import { ContextStore } from '../../app/ContextStore';
import { useFastDependencies } from '../../hooks/use-fast-dependencies';
import { useProjectPath } from '../../hooks/use-project-path';
import { Loader } from '../../ui/Loader';
import { Dependencies } from './Dependencies/Dependencies';
import { ProjectJobs } from './ProjectJobs/ProjectJobs';
import { useProject } from './use-project';

const ProjectShell = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
`;

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  padding: 7px 15px 0;
  flex-direction: column;
  overflow: hidden;
`;

const WrapperCenter = styled.div`
  display: flex;
  flex: 1;
  padding: 7px 15px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Text = styled.p`
  text-align: center;
  max-width: 200px;
`;

const getProjectLabel = (projectPath: string): string => {
  if (projectPath === 'global') {
    return 'global';
  }

  try {
    return window.atob(projectPath);
  } catch {
    return projectPath;
  }
};

export const Project: FC = () => {
  const projectPath = useProjectPath();
  const { dispatch } = useContext(ContextStore);
  const { projectExists } = useProject(projectPath);
  const isGlobal = projectPath === 'global';
  const projectReady = isGlobal || projectExists;

  // request for package.json
  const { isError, isFetched } = useFastDependencies(projectPath, () => {
    if (!projectExists) {
      dispatch({ action: 'addProject', projectPath });
    }
  });

  // invalid project
  if (isError) {
    return (
      <WrapperCenter>
        <b>Invalid project</b>({getProjectLabel(projectPath)})
        <Text>
          Use <b>Open</b> button in top right corner to navigate to project with
          &nbsp;
          <b>package.json</b>
        </Text>
      </WrapperCenter>
    );
  }

  // loading
  if (!isFetched || !projectReady) {
    return (
      <WrapperCenter>
        <Loader />
        Verifying
      </WrapperCenter>
    );
  }

  // all good
  return (
    <ProjectShell>
      <Wrapper>
        <Dependencies projectPath={projectPath} />
      </Wrapper>
      <ProjectJobs projectPath={projectPath} />
    </ProjectShell>
  );
};
