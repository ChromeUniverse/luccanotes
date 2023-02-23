// styles
import mdStyles from "../styles/markdown.module.css";

// next & react
import { GetServerSideProps, type NextPage } from "next";
import { Note } from "phosphor-react";
import { memo, useCallback, useState } from "react";
import { useDebounce } from "use-debounce";

// custom components
import Button from "../../components/Button";
import PageLayout from "../../components/Layouts/Page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMarkdown } from "@fortawesome/free-brands-svg-icons";

// Markdown and code editing
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeMirror, { type BasicSetupOptions } from "@uiw/react-codemirror";
import useThemeStore, { ThemeType } from "../../stores/theme";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { EditorView, keymap, type ViewUpdate } from "@codemirror/view";
import { Extension } from "@codemirror/state";

// codemirror themes
import { tokyoNight, tokyoNightInit } from "@uiw/codemirror-theme-tokyo-night";
import {
  tokyoNightDay,
  tokyoNightDayInit,
} from "@uiw/codemirror-theme-tokyo-night-day";
import { auraInit } from "@uiw/codemirror-theme-aura";

// syntax highlighting
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  dark,
  atomDark,
  oneDark,
  oneLight,
  materialDark,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import { getServerAuthSession } from "../../server/auth";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

const markdownSample = `# Heading 1

In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available. It is also used to temporarily replace text in a process called greeking, which allows designers to consider the form of a webpage or publication, without the meaning of the text influencing the design.

In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available. It is also used to temporarily replace text in a process called greeking, which allows designers to consider the form of a webpage or publication, without the meaning of the text influencing the design.

## Heading 2

In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available. It is also used to temporarily replace text in a process called greeking, which allows designers to consider the form of a webpage or publication, without the meaning of the text influencing the design.

### Heading 3

In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available. It is also used to temporarily replace text in a process called greeking, which allows designers to consider the form of a webpage or publication, without the meaning of the text influencing the design.

#### Heading 4

\`\`\`jsx
// src/components/demo.jsx
function Demo() {
  return <div>demo</div>
}
\`\`\`

\`\`\`bash
# Not dependent on uiw.
npm install @codemirror/lang-markdown --save
npm install @codemirror/language-data --save
\`\`\`

[website URL here!](https://uiwjs.github.io/react-codemirror/)


Here's an image:
![apollo 11 saturn v](https://www.nasa.gov/sites/default/files/thumbnails/image/apollo_11_launch_-_gpn-2000-000630_1.jpg)

Here's an animated GIF:
![maxwell the cat](https://media.tenor.com/SDwGg31pp4AAAAAC/maxwell-the-cat-maxwell.gif)

In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available. It is also used to temporarily replace text in a process called greeking, which allows designers to consider the form of a webpage or publication, without the meaning of the text influencing the design.

Lorem ipsum is typically a corrupted version of De finibus bonorum et malorum, a 1st-century BC text by the Roman statesman and philosopher Cicero, with words altered, added, and removed to make it nonsensical and improper Latin.

\`\`\`go
package main
import "fmt"
func main() {
  fmt.Println("Hello, 世界")
}
\`\`\`
`;

const customDarkTheme = auraInit({
  settings: { background: "#00000000" },
});
const customLightTheme = tokyoNightDayInit({
  settings: { background: "#00000000" },
});

const editorOptions: BasicSetupOptions = {
  // lineNumbers: false,
  // foldGutter: false,
  // syntaxHighlighting: true,
};

const MarkdownPreview = ({
  editorContent,
  theme,
}: {
  editorContent: string;
  theme: ThemeType;
}) => {
  console.log("Re-rendered");

  return (
    <ReactMarkdown
      className="preview"
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, style, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={theme === "light" ? oneLight : oneDark}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {editorContent}
    </ReactMarkdown>
  );
};

const MemoedMarkdownPreview = memo(MarkdownPreview);

const NotePage: NextPage = () => {
  const [previewOpen, setPreviewOpen] = useState(true);
  const [editorContent, setEditorContent] = useState(markdownSample);
  const [debouncedEditorContent] = useDebounce(editorContent, 500);

  const { theme } = useThemeStore();
  const session = useSession().data as Session;

  const onEditorChange = useCallback(
    (value: string, viewUpdate: ViewUpdate) => {
      setEditorContent(value);
    },
    []
  );

  return (
    <PageLayout noteTitle="My First Note" session={session}>
      <div
        className={`grid w-full ${previewOpen ? "grid-cols-2" : "grid-cols-1"}`}
      >
        {/* Editor Panel */}
        <section className="bg-gray-100 dark:bg-gray-900">
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
          {/* Text editor component */}
          <CodeMirror
            className="overflow-y-clip"
            value={editorContent}
            theme={theme === "light" ? customLightTheme : customDarkTheme}
            // maxHeight="100%"
            // height="700px"
            onChange={onEditorChange}
            basicSetup={editorOptions}
            placeholder="Enter your text here..."
            extensions={[
              markdown({ base: markdownLanguage, codeLanguages: languages }),
              EditorView.lineWrapping,
            ]}
          />
        </section>
        {/* Preview Panel */}
        {previewOpen && (
          <section className="dark:bg-gray-850">
            {/* Topbar */}
            <div className="flex h-16 items-center gap-2.5 px-8 text-gray-500 dark:text-gray-400">
              <Note size={24} weight="bold" />
              <span className="font-semibold">Preview</span>
            </div>
            {/* Markdown Preview */}
            <div className="overflow-x-auto px-8">
              <MemoedMarkdownPreview
                theme={theme}
                editorContent={debouncedEditorContent}
              />
            </div>
          </section>
        )}
      </div>
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<{
  session: Session;
}> = async (context) => {
  const session = await getServerAuthSession(context);

  console.log("getServerSideProps session:", session);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Pass data to the page via props
  return { props: { session } };
};

export default NotePage;
