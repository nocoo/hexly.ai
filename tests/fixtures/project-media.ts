import type { ProjectScreenshot, ProjectVideo } from "../../src/model/project";

// Test-only metadata. These URLs are intercepted by browser tests, never published.
export const videoFixture: ProjectVideo = {
	id: "introduction",
	title: { en: "Playback sample", zh: "播放示例" },
	src: "https://media.hexly.ai/test/introduction.webm",
	poster: "/test-media/poster.svg",
	durationSeconds: 3,
	language: "en",
	version: "test-1",
	sha256: "a".repeat(64),
	source: "Test-only canvas recording",
	captions: [
		{
			src: "https://media.hexly.ai/test/en.vtt",
			language: "en",
			label: "English",
		},
		{
			src: "https://media.hexly.ai/test/zh.vtt",
			language: "zh-CN",
			label: "中文",
		},
	],
};

export const screenshotFixture: ProjectScreenshot = {
	id: "interface",
	src: "/test-media/poster.svg",
	alt: { en: "Test interface", zh: "测试界面" },
	width: 960,
	height: 540,
};
