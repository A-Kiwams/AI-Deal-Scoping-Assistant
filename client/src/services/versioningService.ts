import type {
  AnalysisProvider,
  OutputFreshness,
  OutputVersion,
  ScopingSession,
  VersionedOutputArea,
} from "../types";

function getNextVersionNumber(
  versions: OutputVersion[],
  outputArea: VersionedOutputArea
): number {
  const areaVersions = versions.filter(
    (version) => version.outputArea === outputArea
  );

  if (areaVersions.length === 0) {
    return 1;
  }

  return Math.max(
    ...areaVersions.map((version) => version.versionNumber)
  ) + 1;
}

export function createOutputVersion(
  existingVersions: OutputVersion[],
  outputArea: VersionedOutputArea,
  title: string,
  snapshot: unknown,
  provider: AnalysisProvider,
  changeId?: string
): OutputVersion {
  const nextVersion = getNextVersionNumber(
    existingVersions,
    outputArea
  );

  const updatedVersions = existingVersions.map((version) => {
    if (version.outputArea === outputArea) {
      return {
        ...version,
        isCurrent: false,
      };
    }

    return version;
  });

  // This array is intentionally not returned here.
  // The store will handle preserving existing versions.
  void updatedVersions;

  return {
    id: crypto.randomUUID(),
    outputArea,
    versionNumber: nextVersion,
    title,
    snapshot,
    createdAt: new Date().toISOString(),
    createdBy: provider,
    basedOnChangeId: changeId,
    isCurrent: true,
  };
}