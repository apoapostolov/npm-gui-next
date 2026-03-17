/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FC } from 'react';
import styled from 'styled-components';

import { useProjectsJobs, useProjectStore } from '../../../app/ContextStore';
import { JobItem } from './JobItem';

const TaskQueueWrapper = styled.div`
  background: var(--color-chrome);
  margin: 0;
  padding: 0 15px;
  height: 38px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
  overflow: hidden;
  line-height: 1;
`;

const JobsList = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
`;

const FooterNote = styled.small`
  color: var(--color-chrome-text);
  font-size: 10px;
  line-height: 1;
  flex: 0 0 auto;
  margin-left: auto;
  white-space: nowrap;
`;

const FooterLink = styled.a`
  color: var(--color-chrome-text);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

interface Props {
  projectPath: string;
}

export const ProjectJobs: FC<Props> = ({ projectPath }) => {
  const { project } = useProjectStore(projectPath);
  const { removeJob } = useProjectsJobs(projectPath);
  const jobs = project?.jobs.slice(-5) ?? [];

  return (
    <TaskQueueWrapper>
      <JobsList>
        {jobs.map((job) => (
          <JobItem
            description={job.description}
            key={job.id}
            onRemove={(): void => removeJob(job.id)}
            status={job.status}
          />
        ))}
      </JobsList>
      <FooterNote>
        npm-gui-next, maintained by Apostol Apostolov.{' '}
        <FooterLink
          href="https://github.com/apoapostolov/npm-gui-next"
          rel="noreferrer"
          target="_blank"
        >
          GitHub repository
        </FooterLink>
      </FooterNote>
    </TaskQueueWrapper>
  );
};
