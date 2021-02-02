import { Octokit } from '@octokit/core';
import { GitBranch } from './GitBranch';

export interface GitDatabaseOptions {
    octokit: Octokit
    repo: string,
    owner: string
}

export class GitDatabase {
    private settings: GitDatabaseOptions;
    private master: GitBranch;

    public get;
    public set;
    public delete;

    constructor(options: GitDatabaseOptions) {
        this.settings = options;
        this.master = this.branch('master');
        this.get = this.master.get.bind(this.master);
        this.set = this.master.set.bind(this.master);
        this.delete = this.master.delete.bind(this.master);
    }

    branch(branchName: string) {
        return new GitBranch({ branch: branchName, ...this.settings });
    }
}