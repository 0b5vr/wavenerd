import { headerIconCls } from './headerIconCls';
import IconGitHub from '~icons/mdi/github';

export function HeaderIconGitHub() {
  return (
    <a
      className="block h-8 text-header-fg"
      href="https://github.com/0b5vr/wavenerd/"
      target="_blank"
      rel="noreferrer"
      data-stalker="See the source @ GitHub"
    >
      <IconGitHub className={headerIconCls} />
    </a>
  );
}
