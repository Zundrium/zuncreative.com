import fs from "fs";
import { spawn, exec } from "child_process";
import path from "path";

export class SvelteProjectCreator {
	private static readonly basePath = "/home/sem/Projects/websites/";
	private static readonly svelteBaseTemplatePath =
		"/home/sem/Projects/zuncreative/hebweb-website-base/";

	private async copyDir(
		sourcePath: string,
		destinationPath: string,
	): Promise<void> {
		return new Promise<void>((resolve) => {
			// check if both folders exist
			if (!fs.existsSync(sourcePath)) {
				throw new Error(`Source folder ${sourcePath} does not exist`);
			}
			if (!fs.existsSync(destinationPath)) {
				throw new Error(`Destination folder ${destinationPath} does not exist`);
			}

			fs.cp(
				sourcePath,
				destinationPath,
				{
					recursive: true,
				},
				() => {
					resolve();
				},
			);
		});
	}

	public runCommand(
		command: string,
		args: string[],
		projectPath: string = process.cwd(),
	): Promise<void> {
		return new Promise((resolve, reject) => {
			const process = spawn(command, args, { cwd: projectPath });

			let closed = false;
			let exited = false;

			const tryResolve = () => {
				if (closed && exited) resolve();
			};

			process.on("close", () => {
				closed = true;
				tryResolve();
			});

			process.on("exit", () => {
				exited = true;
				tryResolve();
			});

			process.on("error", (error) => {
				reject(error);
			});
		});
	}

	public async readFile(filePath: string): Promise<string> {
		return new Promise((resolve, reject) => {
			fs.readFile(filePath, "utf8", (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	}

	public async writeFile(filePath: string, content: string): Promise<void> {
		return new Promise((resolve, reject) => {
			if (content === undefined) {
				throw new Error("Content is empty, path: " + filePath);
			}
			fs.writeFile(filePath, content, "utf8", (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	public async createDir(dirPath: string): Promise<void> {
		await fs.mkdirSync(dirPath, { recursive: true });
	}

	public async gitInit(projectPath: string): Promise<void> {
		await this.runCommand("git", ["init"], projectPath);
	}

	public async copyTemplateToNewFolder(projectPath: string): Promise<void> {
		await this.createDir(projectPath);
		await this.copyDir(
			SvelteProjectCreator.svelteBaseTemplatePath,
			projectPath,
		);
		await this.runCommand("rm", ["-rf", ".git"], projectPath);
	}

	private async updateRobotsTxt(projectPath: string, websiteDomain: string) {
		const robotsTxtPath = `${projectPath}/static/robots.txt`;
		let robotsTxtContents = await this.readFile(robotsTxtPath);
		robotsTxtContents = robotsTxtContents.replace(
			/base\.zund\.cc/g,
			websiteDomain,
		);
		await this.writeFile(robotsTxtPath, robotsTxtContents);
	}

	private async createENVFile(projectPath: string, websiteDomain: string) {
		const envPath = `${projectPath}/.env`;
		const contents = await this.readFile(envPath);
		const envContents = contents.replace("base.zund.cc", websiteDomain);
		await this.writeFile(envPath, envContents);
	}

	public async create(websiteDomain: string) {
		const targetPath = path.join(SvelteProjectCreator.basePath, websiteDomain);

		await this.copyTemplateToNewFolder(targetPath);
		await this.createENVFile(targetPath, websiteDomain);
		await this.updateRobotsTxt(targetPath, websiteDomain);
		await this.gitInit(targetPath);
	}
}

async function main() {
	const args = process.argv.slice(2);
	const websiteDomain = args[0];
	const creator = new SvelteProjectCreator();
	creator.create(websiteDomain);
}
main();
