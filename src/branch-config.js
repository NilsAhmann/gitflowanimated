export const BRANCH_TYPES = {
  MASTER: "master",
  DEVELOP: "develop",
  FEATURE: "feature",
  RELEASE: "release",
  HOTFIX: "hotfix",
};

export const BRANCH_CONFIG = {
  [BRANCH_TYPES.MASTER]: {
    label: "main",
    color: "#E040FB",
  },
  [BRANCH_TYPES.DEVELOP]: {
    label: "develop",
    color: "#FF8A65",
  },
  [BRANCH_TYPES.FEATURE]: {
    color: "#64B5F6",
    createLabel: (index) => `feature ${index}`,
  },
  [BRANCH_TYPES.RELEASE]: {
    color: "#B2FF59",
    createLabel: (index) => `release ${index}`,
  },
  [BRANCH_TYPES.HOTFIX]: {
    color: "#ff1744",
    createLabel: (index) => `hot ${index}`,
  },
};

export const createBranchLabel = (branchType, index) => {
  const branch = BRANCH_CONFIG[branchType];

  if (branch.createLabel) {
    return branch.createLabel(index);
  }

  return branch.label;
};
