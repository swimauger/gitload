import { Octokit } from '@octokit/core';
import { GitDatabase } from './GitDatabase';

export interface GitStoreOptions {
    owner: string,
    repo: string,
    private?: boolean,
    token: string
}

export class GitStore {
    static async initDatabase(options: GitStoreOptions) {
        const octokit = new Octokit({ auth: options.token });

        try {
            await octokit.request('POST /user/repos', {
                name: options.repo,
                private: options.private === undefined ? true : options.private
            });
        } catch (error) {
            if (error.status !== 422) {
                throw error;
            }
        }

        return new GitDatabase({
            octokit,
            owner: options.owner,
            repo: options.repo
        });
    }

    static async deleteDatabase(options: GitStoreOptions) {
        const octokit = new Octokit({ auth: options.token });

        try {
            await octokit.request('DELETE /repos/{owner}/{repo}', {
                owner: options.owner,
                repo: options.repo
            });
        } catch (error) {
            if (error.status !== 422) {
                throw error;
            }
        }
    }
}