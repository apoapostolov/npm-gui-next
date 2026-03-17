import type { CSSProperties, SVGAttributes } from 'react';
import type { IconType } from 'react-icons';
import {
  FaArrowRightLong,
  FaCaretDown,
  FaCaretRight,
  FaCaretUp,
  FaCheck,
  FaCloudArrowDown,
  FaCode,
  FaCodeFork,
  FaDesktop,
  FaDownload,
  FaFile,
  FaFolder,
  FaGlobe,
  FaHouse,
  FaMoon,
  FaRotateRight,
  FaSun,
  FaTrash,
  FaXmark,
} from 'react-icons/fa6';

const icons = {
  'arrow-thick-right': FaArrowRightLong,
  'caret-bottom': FaCaretDown,
  'caret-right': FaCaretRight,
  'caret-top': FaCaretUp,
  check: FaCheck,
  'cloud-download': FaCloudArrowDown,
  code: FaCode,
  'data-transfer-download': FaDownload,
  file: FaFile,
  folder: FaFolder,
  fork: FaCodeFork,
  globe: FaGlobe,
  home: FaHouse,
  moon: FaMoon,
  monitor: FaDesktop,
  reload: FaRotateRight,
  sun: FaSun,
  trash: FaTrash,
  x: FaXmark,
};

export interface Props extends SVGAttributes<SVGElement> {
  glyph: keyof typeof icons;
}

const iconStyle: CSSProperties = {
  display: 'block',
};

export const Icon = ({ glyph, ...props }: Props) => {
  const SvgIcon: IconType = icons[glyph];

  return <SvgIcon aria-hidden focusable="false" style={iconStyle} {...props} />;
};
