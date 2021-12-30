import _CountDpwn from './count-down';
import { withInstall, WithInstallType } from '../utils/withInstall';
import { TdCountDown } from './type';

export * from './type';
export type CountDownProps = TdCountDown;

export const CountDown: WithInstallType<typeof _CountDpwn> = withInstall(_CountDpwn);
export default CountDown;
