import React, { FC, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import ResultsPage from "./layouts/Results";
import SettingsPage from "./layouts/Settings";
import UploadPage from "./layouts/Upload";
import type { PageInfo } from "./worker/test";

export const App: FC = ({}) => {
  const [PageInfos, setPageInfos] = useState<PageInfo[] | null>(null);
  const [file, setFile] = useState<File | null>(null);

  if (file != null && PageInfos != null) {
    return <ResultsPage PageInfos={PageInfos} file={file} />;
  }

  if (file != null) {
    return <SettingsPage onDone={setPageInfos} filename={file.name} />;
  }

  return <UploadPage onDone={setFile} />;
};

export default App;
