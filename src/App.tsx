import React, { FC, useState } from "react";
import ResultsPage from "./layouts/Results";
import SettingsPage from "./layouts/Settings";
import UploadPage from "./layouts/Upload";
import type { PageInfo } from "./worker/test";

export const App: FC = ({}) => {
  const [pages, setPages] = useState<PageInfo[] | null>(null);
  const [file, setFile] = useState<File | null>(null);

  if (file != null && pages != null) {
    return (
      <ResultsPage
        pages={pages}
        file={file}
        onReset={() => {
          setPages(null);
          setFile(null);
        }}
      />
    );
  }

  if (file != null) {
    return <SettingsPage onDone={setPages} filename={file.name} />;
  }

  return <UploadPage onDone={setFile} />;
};

export default App;
