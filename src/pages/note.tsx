import { type NextPage } from "next";
import { Download, EyeSlash, Note, NotePencil } from "phosphor-react";
import PageLayout from "../components/Layouts/Page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMarkdown } from "@fortawesome/free-brands-svg-icons";
import Button from "../components/Button";
import { useState } from "react";

const NotePage: NextPage = () => {
  const [previewOpen, setPreviewOpen] = useState(true);

  return (
    <PageLayout noteTitle="My First Note">
      {/* Editor */}
      <section className="flex-1 bg-gray-100 dark:bg-gray-900">
        {/* Topbar */}
        <div className="flex h-16 justify-between px-8 text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2.5">
            <FontAwesomeIcon className="scale-125" icon={faMarkdown} />
            <span className="font-semibold">Editor</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm">Last edited 5 min ago</span>
            <div className="flex items-center gap-0">
              <Button
                icon="note-pencil-sm"
                iconOnly
                intent="secondaryAltTransparent"
                label="Note options"
                tooltipAlignment="xCenter"
                tooltipPosition="bottom"
                size="regular"
              />
              {previewOpen ? (
                <Button
                  icon="eye-slash"
                  iconOnly
                  intent="secondaryAltTransparent"
                  label="Hide preview"
                  tooltipAlignment="xCenter"
                  tooltipPosition="bottom"
                  size="regular"
                  onClick={() => setPreviewOpen(false)}
                />
              ) : (
                <Button
                  icon="eye"
                  iconOnly
                  intent="secondaryAltTransparent"
                  label="Show preview"
                  tooltipAlignment="xCenter"
                  tooltipPosition="bottom"
                  size="regular"
                  onClick={() => setPreviewOpen(true)}
                />
              )}
              <Button
                icon="download"
                iconOnly
                intent="secondaryAltTransparent"
                label="Download"
                tooltipAlignment={previewOpen ? "xCenter" : "left"}
                tooltipPosition="bottom"
                size="regular"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Preview */}
      {previewOpen && (
        <section className="flex-1 dark:bg-gray-850">
          {/* Topbar */}
          <div className="flex h-16 items-center gap-2.5 px-8 text-gray-500 dark:text-gray-400">
            <Note size={24} weight="bold" />
            <span className="font-semibold">Preview</span>
          </div>
        </section>
      )}
    </PageLayout>
  );
};

export default NotePage;
