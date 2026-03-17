import type { ReactNode } from 'react';

import type { DependencyInstalledExtras } from '../../../../../server/types/dependency.types';
import { Link } from '../../../../ui/Button/Link';
import { getChangelogLink } from '../../../../utils';

export const ChangelogCell = ({
  homepage,
  name,
  repository,
}: Pick<DependencyInstalledExtras, 'homepage' | 'name' | 'repository'>): ReactNode => {
  return (
    <Link
      href={getChangelogLink({ homepage, name, repository })}
      icon="file"
      target="_blank"
      title="Open release notes or changelog"
    />
  );
};
