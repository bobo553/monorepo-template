import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = join(scriptDirectory, "..", "..");
const failures = [];

const readJson = (filePath) => JSON.parse(readFileSync(filePath, "utf8"));

const featureStatePath = join(repositoryRoot, "feature_list.json");
const featureState = readJson(featureStatePath);
const features = Array.isArray(featureState.features) ? featureState.features : [];
const featureIds = new Set(features.map((feature) => feature.id));
const inProgressFeatures = features.filter((feature) => feature.status === "in-progress");

if (featureState.schemaVersion !== 1) failures.push("feature_list.json schemaVersion 必须为 1");
if (featureIds.size !== features.length) failures.push("feature id 必须全仓唯一");
if (inProgressFeatures.length > 1) failures.push("同一时间只允许一个 in-progress 功能");

if (featureState.activeFeature === null && inProgressFeatures.length !== 0) {
    failures.push("activeFeature 为空时不能存在 in-progress 功能");
}

if (featureState.activeFeature !== null) {
    const activeFeature = features.find((feature) => feature.id === featureState.activeFeature);
    if (!activeFeature || activeFeature.status !== "in-progress") {
        failures.push("activeFeature 必须指向唯一的 in-progress 功能");
    }
}

for (const feature of features) {
    if (!feature.id || !feature.title || !feature.scope) failures.push("每个功能必须包含 id、title 和 scope");
    if (!Array.isArray(feature.acceptanceCriteria) || feature.acceptanceCriteria.length === 0) {
        failures.push(`${feature.id ?? "未知功能"} 必须包含验收条件`);
    }
    for (const dependency of feature.dependencies ?? []) {
        if (!featureIds.has(dependency)) failures.push(`${feature.id} 引用了不存在的依赖 ${dependency}`);
    }
    if (feature.status === "done") {
        const verification = feature.verification ?? [];
        if (verification.length === 0 || verification.some((item) => item.status !== "passed")) {
            failures.push(`${feature.id} 标记为 done 前必须记录全部通过的验证证据`);
        }
    }
}

const workspacePackagePaths = [];
const collectPackages = (directory, remainingDepth) => {
    if (!existsSync(directory) || remainingDepth < 0) return;
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
        if (!entry.isDirectory() || ["node_modules", ".git", ".next", "dist", "coverage"].includes(entry.name))
            continue;
        const childDirectory = join(directory, entry.name);
        const packagePath = join(childDirectory, "package.json");
        if (existsSync(packagePath)) workspacePackagePaths.push(packagePath);
        collectPackages(childDirectory, remainingDepth - 1);
    }
};

collectPackages(join(repositoryRoot, "apps"), 2);
collectPackages(join(repositoryRoot, "packages"), 2);

const progressHeadings = [
    "# Progress",
    "## Current State",
    "## Completed",
    "## Verification",
    "## Risks and Next Steps",
];
for (const packagePath of workspacePackagePaths) {
    const workspaceDirectory = dirname(packagePath);
    const progressPath = join(workspaceDirectory, "progress.md");
    if (!existsSync(progressPath)) {
        failures.push(`${relative(repositoryRoot, workspaceDirectory)} 缺少 progress.md`);
        continue;
    }
    const progress = readFileSync(progressPath, "utf8");
    for (const heading of progressHeadings) {
        if (!progress.includes(heading)) failures.push(`${relative(repositoryRoot, progressPath)} 缺少章节 ${heading}`);
    }
}

const handoffPath = join(repositoryRoot, "session-handoff.md");
if (!existsSync(handoffPath)) failures.push("缺少 session-handoff.md");

if (failures.length > 0) {
    console.error("Harness validation failed:\n" + failures.map((failure) => `- ${failure}`).join("\n"));
    process.exit(1);
}

console.log(`Harness validation passed: ${features.length} feature(s), ${workspacePackagePaths.length} workspace(s).`);
