import type { ReactNode } from 'react';

import type { DependencyInstalledExtras } from '../../../../../server/types/dependency.types';
import { ScoreBadge } from '../../../../ui/ScoreBadge/ScoreBadge';

export const ScoreCell = ({
  score,
  name,
}: DependencyInstalledExtras): ReactNode => {
  if (typeof score !== 'number') {
    return null;
  }

  return (
    <ScoreBadge
      href={`https://npms.io/package/${name}`}
      score={score}
      target="_blank"
      title="Visit npms.io package details"
    >
      {score}%
    </ScoreBadge>
  );
};
