function LoadingNoteCard() {
  return (
    <div className="flex h-[160px] items-start justify-between rounded-lg border-2 border-transparent bg-gray-50 px-5 py-6 dark:bg-gray-850 md:px-7">
      {/* Fake Text content */}
      <div className="flex flex-col">
        {/* Fake Title */}
        <div className="mt-1 h-7 w-60 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"></div>
        {/* Fake timestamp */}
        <div className="mt-3 mb-3 h-5 w-40 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        {/* Fake tags */}
        <div className="flex h-8 items-center gap-3">
          {/* Fake tag */}
          <div className="h-full w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-full w-28 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-5 w-20 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div></div>
      </div>
      {/* Fake Buttons */}
      <div className="mt-0 flex flex-col items-center gap-1 transition-all">
        <div className="h-10 w-10 animate-pulse rounded-lg border-2 border-transparent bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-10 w-10 animate-pulse rounded-lg border-2 border-transparent bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  );
}

export default LoadingNoteCard;
