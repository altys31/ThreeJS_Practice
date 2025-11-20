import ClickSpark from "../../components/clickSpark/ClickSpark";
import { Dom } from "./Dom";

export const Practice12 = ({ isDebug }: { isDebug: boolean }) => {
  return (
    <ClickSpark>
      <Dom isDebug={isDebug} />
    </ClickSpark>
  );
};
