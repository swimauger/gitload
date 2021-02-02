import { GitDatabaseOptions } from "./GitDatabase";

export interface GitBranchOptions extends GitDatabaseOptions {
    branch: string
}

export class GitBranch {
    private settings: GitBranchOptions;

    constructor(options: GitBranchOptions) {
        this.settings = options;
        this.settings.branch = this.settings.branch === 'master' ? undefined : this.settings.branch;
    }

    async getSha(path: string) {
        try {
            const response = await this.settings.octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
                owner: this.settings.owner,
                repo: this.settings.repo,
                ref: this.settings.branch,
                path
            });
    
            return response.data?.sha;
        } catch (error) {
            return undefined;
        }
    }

    async get(path: string) {
        const response = await this.settings.octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: this.settings.owner,
            repo: this.settings.repo,
            ref: this.settings.branch,
            path
        });

        return Buffer.from(response.data?.content, 'base64').toString('ascii');
    }

    async set(path: string, data: any) {
        await this.settings.octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner: this.settings.owner,
            repo: this.settings.repo,
            branch: this.settings.branch,
            message: `${new Date().toISOString()} : FILE ${path}`,
            content: Buffer.from(JSON.stringify(data)).toString('base64'),
            sha: await this.getSha(path),
            path
        });
    }

    async delete(path: string) {
        await this.settings.octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
            owner: this.settings.owner,
            repo: this.settings.repo,
            branch: this.settings.branch,
            message: `${new Date().toISOString()} : UNFILE ${path}`,
            path,
            sha: await this.getSha(path)
        })
    }
}