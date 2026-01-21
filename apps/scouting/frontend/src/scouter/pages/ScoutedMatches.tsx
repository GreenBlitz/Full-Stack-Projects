// בס"ד

import type { FC } from "react";
import { QRCodeSVG } from "qrcode.react";

export const ScoutedMatches: FC = () => {
  return <QRCodeSVG value="Gurt: Yo" size={256} />;
};
