import React, { Component } from "react";
import styled from "styled-components";
import { Button, ButtonIcon, fallDownAnimation, fadeIn } from "./global-styles";
import GoeyFilter from "./goey-filter";
import Connections from "./connections";

const GitFlowElm = styled.div`
  margin: 0 auto;
`;

const GlobalActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 10px;
`;

const ProjectElm = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 90px 1fr;
  margin-top: 20px;
  background: linear-gradient(135deg, rgba(34, 52, 122, 1) 0%, rgba(23, 35, 82, 1) 100%);
  border-radius: 5px;
  box-shadow: 0 4px 10px #9d9d9d;
  overflow: auto;
`;

const GridColumn = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: ${(props) => `repeat(${props.count || 2}, 90px)`};
`;

const BranchHeader = styled.div`
  max-width: 90px;
  padding: 5px;
  text-align: center;
  background-color: #131d45;
  border-right: 1px solid #1b295f;
  color: #f0f0f0;
  z-index: 1;
  margin-bottom: 10px;
  animation: ${fadeIn} .5s ease-in;
`;

const BranchActions = styled.div`
  display: grid;
  grid-template-columns: ${(props) => `repeat(${props.count || 1}, 1fr)`};
  margin-top: 10px;
  justify-items: center;
  height: 24px;
`;

const BranchName = styled.h4`
  position: relative;
  font-size: .7rem;
  text-transform: uppercase;
  letter-spacing: 1.5pt;
  margin-top: 10px;
  opacity: .6;
`;

const Commits = styled.ol`
  position: relative;
  min-height: 800px;
  height: ${(props) => props.height || "500px"};
  filter: url("#goo");
  z-index: 40;
  border-right: 1px solid #1b295f;
  transition: opacity .5s;
`;

const Commit = styled.li`
  position: absolute;
  display: grid;
  align-items: center;
  justify-items: center;
  top: ${(props) => `${props.top * 45}px`};
  left: 50%;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  transform: translate(-50%, -45px);
  background-color: ${(props) => props.color || "#9d9d9d"};
  box-shadow: 0 0 20px #f0f0f0;
  border: 1px solid #fff;
  animation: ${fallDownAnimation} cubic-bezier(0.770, 0.000, 0.175, 1.000) 1s;
  animation-fill-mode: forwards;
  z-index: 40;
  transition: all .2s;

  &.merged {
    background-color: #fff;
    box-shadow: none;
    opacity: .5;
  }
`;

const Tag = styled.p`
  color: #fff;
  font-size: .7rem;
  letter-spacing: 1pt;
`;

const ConnectionsContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 30;
`;

class GitFlow extends Component {
  commitPositions = {};
  lastPathsSnapshot = "";

  state = {
    paths: [],
  };

  componentDidMount() {
    this.updateConnections();
  }

  componentDidUpdate() {
    this.updateConnections();
  }

  storeCommitPosition = (id, offset = 0, commitElm) => {
    if (!commitElm) {
      return;
    }

    this.commitPositions[id] = {
      top: commitElm.offsetTop,
      left: (offset * 90) + commitElm.offsetLeft,
    };
  };

  updateConnections = () => {
    const { commits } = this.props.project;
    const paths = commits
      .map((commit) => {
        const targetPosition = this.commitPositions[commit.id];

        return (commit.parents || []).map((parentId) => ({
          srcCommitID: parentId,
          tgtCommitID: commit.id,
          src: this.commitPositions[parentId],
          tgt: targetPosition,
        }));
      })
      .reduce((allPaths, pathGroup) => allPaths.concat(pathGroup), [])
      .filter((path) => path.src && path.tgt);

    const snapshot = JSON.stringify(paths);

    if (snapshot !== this.lastPathsSnapshot) {
      this.lastPathsSnapshot = snapshot;
      this.setState({ paths });
    }
  };

  deleteBranch = (branchID) => {
    const { commits } = this.props.project;
    const commitIdsToDelete = commits
      .filter((commit) => commit.branch === branchID)
      .map((commit) => commit.id);

    commitIdsToDelete.forEach((commitId) => {
      delete this.commitPositions[commitId];
    });

    this.props.onDeleteBranch(branchID);
  };

  renderCommitButton = (branch) => (
    <ButtonIcon onClick={this.props.onCommit.bind(this, branch.id, 0)}>C</ButtonIcon>
  );

  renderDeleteButton = (branch) => (
    <BranchActions count={1}>
      <ButtonIcon onClick={this.deleteBranch.bind(this, branch.id)}>X</ButtonIcon>
    </BranchActions>
  );

  renderDevelopBranchHeader = (branch) => (
    <BranchHeader>
      <BranchName>{branch.name}</BranchName>
      <BranchActions count={3}>
        <ButtonIcon onClick={this.props.onNewRelease}>R</ButtonIcon>
        {this.renderCommitButton(branch)}
        <ButtonIcon onClick={this.props.onNewFeature}>F</ButtonIcon>
      </BranchActions>
    </BranchHeader>
  );

  renderFeatureBranchHeader = (branch) => {
    const actionsElm = branch.merged ? (
      this.renderDeleteButton(branch)
    ) : (
      <BranchActions count={2}>
        <ButtonIcon onClick={this.props.onMerge.bind(this, branch.id, undefined)}>M</ButtonIcon>
        {this.renderCommitButton(branch)}
      </BranchActions>
    );

    return (
      <BranchHeader key={branch.id}>
        <BranchName>{branch.name}</BranchName>
        {actionsElm}
      </BranchHeader>
    );
  };

  renderReleaseBranchHeader = (branch) => {
    const actionsElm = branch.merged ? (
      this.renderDeleteButton(branch)
    ) : (
      <BranchActions count={2}>
        {this.renderCommitButton(branch)}
        <ButtonIcon onClick={this.props.onRelease.bind(this, branch.id, undefined)}>M</ButtonIcon>
      </BranchActions>
    );

    return (
      <BranchHeader key={branch.id}>
        <BranchName>{branch.name}</BranchName>
        {actionsElm}
      </BranchHeader>
    );
  };

  renderMasterBranchHeader = (branch) => (
    <BranchHeader>
      <BranchName>{branch.name}</BranchName>
      <BranchActions count={1}>
        <ButtonIcon onClick={this.props.onNewHotFix}>H</ButtonIcon>
      </BranchActions>
    </BranchHeader>
  );

  renderBranchHeaders = (params) => {
    const {
      masterBranch,
      developBranch,
      releaseBranches,
      featureBranches,
      hotFixBranches,
      noOfBranches,
    } = params;

    return (
      <GridColumn count={noOfBranches}>
        {this.renderMasterBranchHeader(masterBranch)}
        {hotFixBranches.map((branch) => this.renderReleaseBranchHeader(branch))}
        {releaseBranches.map((branch) => this.renderReleaseBranchHeader(branch))}
        {this.renderDevelopBranchHeader(developBranch)}
        {featureBranches.map((branch) => this.renderFeatureBranchHeader(branch))}
      </GridColumn>
    );
  };

  renderBranchCommits = (params) => {
    const {
      masterBranch,
      developBranch,
      releaseBranches,
      featureBranches,
      hotFixBranches,
      noOfBranches,
    } = params;

    const branches = [
      masterBranch,
      ...hotFixBranches,
      ...releaseBranches,
      developBranch,
      ...featureBranches,
    ];

    return (
      <GridColumn count={noOfBranches}>
        <ConnectionsContainer>
          <Connections paths={this.state.paths} />
        </ConnectionsContainer>
        {branches.map((branch, index) => this.renderBranchCommit(branch, index))}
      </GridColumn>
    );
  };

  renderBranchCommit = (branch, branchIndex) => {
    const { commits } = this.props.project;
    const branchCommits = commits.filter((commit) => commit.branch === branch.id);
    const isMasterBranch = branch.name === "master";

    return (
      <Commits
        className={branch.merged ? "merged" : ""}
        color={branch.color}
        key={`branch-${branch.id}`}
        height={`${branchCommits.length * 45}px`}
      >
        {branchCommits.map((commit, idx) => (
          <Commit
            className={branch.merged ? "merged" : ""}
            ref={this.storeCommitPosition.bind(this, commit.id, branchIndex)}
            key={`commit-${commit.id}`}
            color={branch.color}
            top={commit.gridIndex - 1}
          >
            {isMasterBranch ? <Tag>{`v${idx}`}</Tag> : null}
          </Commit>
        ))}
      </Commits>
    );
  };

  render() {
    const { project } = this.props;
    const { branches } = project;
    const masterBranch = branches.find((branch) => branch.name === "master");
    const hotFixBranches = branches.filter((branch) => branch.hotFixBranch);
    const developBranch = branches.find((branch) => branch.name === "develop");
    const releaseBranches = branches.filter((branch) => branch.releaseBranch);
    const featureBranches = branches.filter((branch) => branch.featureBranch);
    const noOfBranches = branches.length;
    const params = {
      masterBranch,
      hotFixBranches,
      developBranch,
      featureBranches,
      releaseBranches,
      noOfBranches,
    };

    return (
      <GitFlowElm>
        <GlobalActions>
          <Button onClick={this.props.onNewHotFix}>New Hot Fix</Button>
          <Button onClick={this.props.onNewRelease}>New Release</Button>
          <Button onClick={this.props.onNewFeature}>New Feature</Button>
        </GlobalActions>
        <ProjectElm>
          {this.renderBranchHeaders(params)}
          {this.renderBranchCommits(params)}
        </ProjectElm>
        <GoeyFilter />
      </GitFlowElm>
    );
  }
}

export default GitFlow;
