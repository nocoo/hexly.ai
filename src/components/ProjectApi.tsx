import { useEffect, useState } from "react";
import type { Locale, Project } from "../model/project";
import {
	type ProjectApi as ApiResult,
	projectApiPath,
	projectApiPrompt,
} from "../model/project-api";
import { siteOrigin } from "../model/routes";
import { CopyButton } from "./CopyButton";
import "../styles/project-api.css";

export function ProjectApi({
	project,
	locale,
}: {
	project: Project;
	locale: Locale;
}) {
	const [result, setResult] = useState<ApiResult>();
	const [failed, setFailed] = useState(false);
	const [attempt, setAttempt] = useState(0);
	const path = projectApiPath(project);
	const endpoint = `${siteOrigin}${path}`;
	const prompt = projectApiPrompt(project, locale);
	const zh = locale === "zh";
	useEffect(() => {
		const controller = new AbortController();
		setFailed(false);
		setResult(undefined);
		void fetch(path, {
			signal: controller.signal,
			cache: attempt > 0 ? "reload" : "default",
		})
			.then(async (response) => {
				if (!response.ok) throw new Error(`HTTP ${response.status}`);
				const data: ApiResult = await response.json();
				if (
					data.schemaVersion !== 1 ||
					data.repo.toLowerCase() !== project.repo.toLowerCase() ||
					data.github.toLowerCase() !== project.repository.toLowerCase()
				)
					throw new Error("Unexpected project response");
				if (!controller.signal.aborted) setResult(data);
			})
			.catch(() => {
				if (!controller.signal.aborted) setFailed(true);
			});
		return () => controller.abort();
	}, [path, project.repo, project.repository, attempt]);
	return (
		<section
			id="api"
			className="project-api"
			aria-labelledby="project-api-title"
		>
			<div className="detail-section-heading">
				<div>
					<h2 id="project-api-title">{zh ? "API 集成" : "API integration"}</h2>
					<p>
						{zh
							? "用 GitHub 用户名与仓库名连接项目资料及 Logo。单项目查询，无需密钥，缓存一小时。"
							: "Connect project details and logos by GitHub owner/repository. One project per request, no key, cached for one hour."}
					</p>
				</div>
				<CopyButton
					text={prompt}
					locale={locale}
					label={zh ? "复制集成 Prompt" : "Copy integration prompt"}
				/>
			</div>
			<div className="api-request">
				<code>
					GET{" "}
					<a href={path} target="_blank" rel="noreferrer">
						{endpoint}
					</a>
				</code>
				<CopyButton
					text={`curl --fail '${endpoint}'`}
					locale={locale}
					label={zh ? "复制请求" : "Copy request"}
				/>
			</div>
			{!result && (
				<p role="status">
					{failed
						? zh
							? "API 暂时不可用，请重试。"
							: "The API is temporarily unavailable. Please retry."
						: zh
							? "正在请求项目 API…"
							: "Requesting the project API…"}
				</p>
			)}
			{failed && (
				<button
					type="button"
					className="button button-secondary"
					onClick={() => setAttempt(attempt + 1)}
				>
					{zh ? "重试" : "Retry"}
				</button>
			)}
			{result && (
				<>
					<section
						className="api-preview"
						aria-label={zh ? "API 返回预览" : "API response preview"}
					>
						<img src={result.icons.small} width={48} height={48} alt="" />
						<div>
							<strong>{result.title}</strong>
							<p>{result.description[locale]}</p>
							<a href={result.github} target="_blank" rel="noreferrer">
								{result.github}
							</a>
						</div>
					</section>
					<details className="api-logos">
						<summary>
							{zh ? "Logo 尺寸与用途" : "Logo sizes and usage"} ·{" "}
							{result.logos.length}
						</summary>
						<p>
							{zh
								? "透明原标用于导航、侧栏和 favicon；带背景素材用于 README、卡片和宣传展示。Hexly 宣发图不自动替代产品原标。“保留原底”不保证透明。"
								: "Transparent project marks suit navigation, sidebars and favicons. Background artwork suits READMEs, cards and promotional displays. Campaign artwork does not automatically replace the product identity. Original backgrounds are not guaranteed transparent."}
						</p>
						<div className="api-logo-grid">
							{result.logos.map((logo) => (
								<a
									key={logo.id}
									href={logo.url}
									target="_blank"
									rel="noreferrer"
									className="api-logo-variant"
								>
									<img
										src={logo.url}
										width={64}
										height={64}
										alt={`${result.title} ${logo.id}`}
										loading="lazy"
									/>
									<span>
										<strong>
											{logo.width} × {logo.height} · {logo.format.toUpperCase()}
										</strong>
										<span>
											{logo.background === "transparent"
												? zh
													? "透明"
													: "Transparent"
												: logo.background === "opaque"
													? zh
														? "带背景"
														: "Opaque"
													: zh
														? "保留原底"
														: "Original background"}{" "}
											· {logo.theme}
										</span>
										<span>
											{logo.role === "project-identity"
												? zh
													? "产品原标"
													: "Project identity"
												: zh
													? "Hexly 宣发"
													: "Hexly campaign"}
										</span>
									</span>
								</a>
							))}
						</div>
					</details>
					<details>
						<summary>{zh ? "查看 JSON 返回" : "View JSON response"}</summary>
						<textarea
							className="agent-instructions"
							readOnly
							rows={14}
							aria-label={zh ? "JSON 返回内容" : "JSON response content"}
							value={JSON.stringify(result, null, 2)}
						/>
					</details>
				</>
			)}
			<details>
				<summary>{zh ? "阅读集成 Prompt" : "Read integration prompt"}</summary>
				<textarea
					className="agent-instructions"
					lang="en"
					readOnly
					rows={14}
					aria-label={zh ? "集成 Prompt 内容" : "Integration prompt content"}
					value={prompt}
				/>
			</details>
		</section>
	);
}
