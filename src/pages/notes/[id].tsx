// next & react
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { Note } from "phosphor-react";
import { memo, useCallback, useEffect, useState } from "react";
import { useDebounce, useDebouncedCallback } from "use-debounce";

// custom components
import PageLayout from "../../components/Layouts/Page";
import NoteOptionsModal from "../../components/Modals/NoteOptions";
import Button from "../../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMarkdown } from "@fortawesome/free-brands-svg-icons";

// Markdown and code editing
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeMirror, { type BasicSetupOptions } from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { EditorView, keymap, type ViewUpdate } from "@codemirror/view";
import { Extension } from "@codemirror/state";

// codemirror themes
import { tokyoNightDayInit } from "@uiw/codemirror-theme-tokyo-night-day";
import { auraInit } from "@uiw/codemirror-theme-aura";

// syntax highlighting
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/cjs/styles/prism";

// nextauth
import { getServerAuthSession } from "../../server/auth";
import { type Session } from "next-auth";
import { useSession } from "next-auth/react";

// other
import useThemeStore, { type ThemeType } from "../../stores/theme";
import { api } from "../../utils/api";
import { prisma } from "../../server/db";
import { type NoteWithTags } from "../..";
import { z } from "zod";
import { formatDate } from "../../utils/dates";
import DMP from "diff-match-patch";
import Navbar from "../../components/Navbar";

// editor customization
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

const NotePage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  // zustand store
  const { theme } = useThemeStore();

  // nextAuth
  const session = useSession().data as Session;

  // trpc
  const noteQuery = api.notes.getSingle.useQuery({ id: props.noteId });
  const noteContentMutation = api.notes.updateContent.useMutation();
  const tagsQuery = api.tags.getAll.useQuery();
  const note = noteQuery.data;
  const tags = tagsQuery.data;
  const utils = api.useContext();

  // diff-match-patch
  const dmp = new DMP.diff_match_patch();

  // editor state
  const [prevEditorContent, setPrevEditorContent] = useState(props.content);
  const [editorContent, setEditorContent] = useState(props.content);
  const [debouncedEditorContent] = useDebounce(editorContent, 500);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // auto-saving with input debouncing
  const debouncedAutoSave = useDebouncedCallback(() => {
    console.log("Auto-save fired!");
    saveNote();
  }, 2000);

  // editor state update
  const onEditorChange = useCallback(
    (value: string, viewUpdate: ViewUpdate) => {
      setEditorContent(value);
      debouncedAutoSave();
    },
    []
  );

  // note saving function
  const saveNote = useCallback(() => {
    if (!note || !tags) return;
    const patches = dmp.patch_make(prevEditorContent, editorContent);
    noteContentMutation.mutate(
      { id: props.noteId, patches },
      {
        onSuccess: (updatedNote, variables, context) => {
          void utils.notes.getSingle.invalidate({ id: variables.id });
          setPrevEditorContent(editorContent);
        },
      }
    );
  }, [
    dmp,
    editorContent,
    note,
    noteContentMutation,
    prevEditorContent,
    props.noteId,
    tags,
    utils.notes.getSingle,
  ]);

  // shortcut handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        console.log("Shortcut hit!!", noteContentMutation.isLoading);
        if (noteContentMutation.isLoading) {
          return console.log("Already saving...");
        }
        // console.log("Got here!");

        saveNote();
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [noteContentMutation.isLoading, saveNote]);

  if (!note || !tags) return <div>Loading...</div>;

  return (
    <div className="flex h-screen flex-col">
      <Navbar noteTitle={note.title} session={session} />
      <div
        // className={`grid h-[80%] ${
        //   previewOpen ? "grid-cols-2" : "grid-cols-1"
        // }`}
        className="flex h-full overflow-clip"
      >
        {/* Editor Panel */}
        <section className="flex h-full flex-1 flex-col overflow-clip bg-gray-100 dark:bg-gray-900">
          <div className="flex h-16 flex-shrink-0 justify-between px-8 text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2.5">
              <FontAwesomeIcon className="scale-125" icon={faMarkdown} />
              <span className="font-semibold">Editor</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm">
                Last edited {formatDate(note.lastUpdated)}
              </span>
              <div className="flex items-center gap-0">
                <Button
                  icon="floppy"
                  iconOnly
                  intent="secondaryAltTransparent"
                  label={
                    noteContentMutation.isLoading ? "Saving..." : "Save note"
                  }
                  tooltipAlignment="xCenter"
                  tooltipPosition="bottom"
                  size="regular"
                  onClick={() => saveNote()}
                  loading={noteContentMutation.isLoading}
                />
                <Button
                  icon="note-pencil-sm"
                  iconOnly
                  intent="secondaryAltTransparent"
                  label="Note options"
                  tooltipAlignment="xCenter"
                  tooltipPosition="bottom"
                  size="regular"
                  onClick={() => setModalOpen(true)}
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

          <CodeMirror
            className="h-full overflow-auto"
            value={editorContent}
            theme={theme === "light" ? customLightTheme : customDarkTheme}
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
        {/* {previewOpen && ( */}
        <section className="flex h-full flex-1 flex-col overflow-auto bg-gray-50 dark:bg-gray-850">
          {/* Topbar */}
          <div className="flex h-16 flex-shrink-0 items-center gap-2.5 px-8 text-gray-500 dark:text-gray-400">
            <Note size={24} weight="bold" />
            <span className="font-semibold">Preview</span>
          </div>
          {/* Markdown Preview */}
          <div className="overflow-auto px-8">
            <MemoedMarkdownPreview
              theme={theme}
              editorContent={debouncedEditorContent}
            />
          </div>
        </section>
        {/* )} */}
      </div>

      {/* Modal */}
      {modalOpen && (
        <NoteOptionsModal
          open={modalOpen}
          onClose={setModalOpen}
          note={note}
          tags={tags}
        />
      )}
    </div>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // check if user is logged in
  const session = await getServerAuthSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // parse note ID
  const noteIdParser = z.string().safeParse(context.query.id);
  if (!noteIdParser.success) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  // check if this note actually exists
  const note = await prisma.note.findUnique({
    where: { id: noteIdParser.data },
    select: { id: true, userId: true, content: true },
  });

  if (!note) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  // check that user owns this note
  if (note.userId !== session.user.id) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  // Pass data to the page via props
  return { props: { session, noteId: note.id, content: note.content } };
};

export default NotePage;
