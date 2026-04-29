import React, { Component } from "react";
import styled from "styled-components";
import GitFlow from "./gitflow";
import shortid from "shortid";

const DEVELOP = "develop";
const MASTER = "master";

const masterID = shortid.generate();
const developID = shortid.generate();

const seedData = () => {
  const commits = [
    {
      id: shortid.generate(),
      branch: masterID,
      gridIndex: 1,
      parents: null,
    },
    {
      id: shortid.generate(),
      branch: developID,
      gridIndex: 1,
      parents: null,
    },
  ];

  return {
    branches: [
      {
        name: MASTER,
        id: masterID,
        canCommit: false,
        color: "#E040FB",
      },
      {
        name: DEVELOP,
        id: developID,
        canCommit: true,
        color: "#FF8A65",
      },
    ],
    commits,
  };
};

const AppElm = styled.main`
  text-align: center;
  padding: 10px;
`;

class App extends Component {
  state = {
    project: seedData(),
  };

  handleCommit = (branchID, mergeGridIndex = 0) => {
    const { project } = this.state;
    const commits = [...project.commits];
    const branchCommits = commits.filter((commit) => commit.branch === branchID);
    const lastCommit = branchCommits[branchCommits.length - 1];

    commits.push({
      id: shortid.generate(),
      branch: branchID,
      gridIndex: lastCommit.gridIndex + mergeGridIndex + 1,
      parents: [lastCommit.id],
    });

    this.setState({
      project: {
        ...project,
        commits,
      },
    });
  };

  handleNewFeature = () => {
    const { project } = this.state;
    const branches = [...project.branches];
    const commits = [...project.commits];
    const featureBranches = branches.filter((branch) => branch.featureBranch);
    const featureBranchName = "feature " + ((featureBranches || []).length + 1);
    const developCommits = commits.filter((commit) => commit.branch === developID);
    const lastDevelopCommit = developCommits[developCommits.length - 1];
    const featureOffset = lastDevelopCommit.gridIndex + 1;
    const newBranch = {
      id: shortid.generate(),
      name: featureBranchName,
      featureBranch: true,
      canCommit: true,
      color: "#64B5F6",
    };
    const newCommit = {
      id: shortid.generate(),
      branch: newBranch.id,
      gridIndex: featureOffset,
      parents: [lastDevelopCommit.id],
    };

    commits.push(newCommit);
    branches.push(newBranch);

    this.setState({
      project: {
        branches,
        commits,
      },
    });
  };

  handleNewHotFix = () => {
    const { project } = this.state;
    const branches = [...project.branches];
    const commits = [...project.commits];
    const hotFixBranches = branches.filter((branch) => branch.hotFixBranch);
    const hotFixBranchName = "hot " + ((hotFixBranches || []).length + 1);
    const masterCommits = commits.filter((commit) => commit.branch === masterID);
    const lastMasterCommit = masterCommits[masterCommits.length - 1];
    const hotFixOffset = lastMasterCommit.gridIndex + 1;

    const newBranch = {
      id: shortid.generate(),
      name: hotFixBranchName,
      hotFixBranch: true,
      canCommit: true,
      color: "#ff1744",
    };
    const newCommit = {
      id: shortid.generate(),
      branch: newBranch.id,
      gridIndex: hotFixOffset,
      parents: [lastMasterCommit.id],
    };

    commits.push(newCommit);
    branches.push(newBranch);

    this.setState({
      project: {
        branches,
        commits,
      },
    });
  };

  handleNewRelease = () => {
    const { project } = this.state;
    const branches = [...project.branches];
    const commits = [...project.commits];
    const releaseBranches = branches.filter((branch) => branch.releaseBranch);
    const releaseBranchName = "release " + ((releaseBranches || []).length + 1);
    const developCommits = commits.filter((commit) => commit.branch === developID);
    const lastDevelopCommit = developCommits[developCommits.length - 1];
    const releaseOffset = lastDevelopCommit.gridIndex + 1;
    const newBranch = {
      id: shortid.generate(),
      name: releaseBranchName,
      releaseBranch: true,
      canCommit: true,
      color: "#B2FF59",
    };
    const newCommit = {
      id: shortid.generate(),
      branch: newBranch.id,
      gridIndex: releaseOffset,
      parents: [lastDevelopCommit.id],
    };

    commits.push(newCommit);
    branches.push(newBranch);

    this.setState({
      project: {
        branches,
        commits,
      },
    });
  };

  handleRelease = (sourceBranchID) => {
    const { project } = this.state;
    const branches = [...project.branches];
    const commits = [...project.commits];
    const sourceBranch = branches.find((branch) => branch.id === sourceBranchID);
    const sourceCommits = commits.filter((commit) => commit.branch === sourceBranchID);

    const masterCommits = commits.filter((commit) => commit.branch === masterID);
    const developCommits = commits.filter((commit) => commit.branch === developID);
    const lastSourceCommit = sourceCommits[sourceCommits.length - 1];
    const lastMasterCommit = masterCommits[masterCommits.length - 1];
    const lastDevelopCommit = developCommits[developCommits.length - 1];

    const masterMergeCommit = {
      id: shortid.generate(),
      branch: masterID,
      gridIndex: Math.max(lastSourceCommit.gridIndex, lastMasterCommit.gridIndex) + 1,
      parents: [lastMasterCommit.id, lastSourceCommit.id],
    };

    const developMergeCommit = {
      id: shortid.generate(),
      branch: developID,
      gridIndex: Math.max(lastSourceCommit.gridIndex, lastDevelopCommit.gridIndex) + 1,
      parents: [lastDevelopCommit.id, lastSourceCommit.id],
    };

    commits.push(masterMergeCommit, developMergeCommit);
    sourceBranch.merged = true;

    this.setState({
      project: {
        branches,
        commits,
      },
    });
  };

  handleMerge = (sourceBranchID, targetBranchID = developID) => {
    const { project } = this.state;
    const branches = [...project.branches];
    const commits = [...project.commits];

    const sourceBranch = branches.find((branch) => branch.id === sourceBranchID);
    const sourceCommits = commits.filter((commit) => commit.branch === sourceBranchID);
    const targetCommits = commits.filter((commit) => commit.branch === targetBranchID);

    const lastSourceCommit = sourceCommits[sourceCommits.length - 1];
    const lastTargetCommit = targetCommits[targetCommits.length - 1];

    const mergeCommit = {
      id: shortid.generate(),
      branch: targetBranchID,
      gridIndex: Math.max(lastSourceCommit.gridIndex, lastTargetCommit.gridIndex) + 1,
      parents: [lastSourceCommit.id, lastTargetCommit.id],
    };

    commits.push(mergeCommit);
    sourceBranch.merged = true;

    this.setState({
      project: {
        branches,
        commits,
      },
    });
  };

  handleDeleteBranch = (branchID) => {
    const { project } = this.state;
    let branches = [...project.branches];
    let commits = [...project.commits];

    const commitsToDelete = commits.filter((commit) => commit.branch === branchID);
    const lastCommit = commitsToDelete[commitsToDelete.length - 1];

    commits = commits.map((commit) => {
      if (!commit.parents) {
        return commit;
      }

      return {
        ...commit,
        parents: commit.parents.filter((parentID) => parentID !== lastCommit.id),
      };
    });

    branches = branches.filter((branch) => branch.id !== branchID);
    commits = commits.filter((commit) => commit.branch !== branchID);

    this.setState({
      project: {
        branches,
        commits,
      },
    });
  };

  render() {
    return (
      <AppElm>
        <GitFlow
          project={this.state.project}
          onMerge={this.handleMerge}
          onRelease={this.handleRelease}
          onCommit={this.handleCommit}
          onNewFeature={this.handleNewFeature}
          onNewRelease={this.handleNewRelease}
          onDeleteBranch={this.handleDeleteBranch}
          onNewHotFix={this.handleNewHotFix}
        />
      </AppElm>
    );
  }
}

export default App;
