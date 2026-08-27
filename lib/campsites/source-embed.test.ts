import { describe, expect, it } from "vitest";

import { getCampsiteThumbnailUrl, getSourceEmbedUrl } from "@/lib/campsites/source-embed";

describe("getSourceEmbedUrl", () => {
  it("유튜브 watch 링크를 embed 주소로 바꾼다", () => {
    expect(
      getSourceEmbedUrl({ platform: "youtube", title: "", channel: null, url: "https://www.youtube.com/watch?v=OT3Tyb0qeaY" }),
    ).toBe("https://www.youtube.com/embed/OT3Tyb0qeaY");
  });

  it("유튜브 단축 링크(youtu.be)도 embed 주소로 바꾼다", () => {
    expect(
      getSourceEmbedUrl({ platform: "youtube", title: "", channel: null, url: "https://youtu.be/OT3Tyb0qeaY" }),
    ).toBe("https://www.youtube.com/embed/OT3Tyb0qeaY");
  });

  it("인스타그램 게시물 링크를 embed 주소로 바꾼다", () => {
    expect(
      getSourceEmbedUrl({ platform: "instagram", title: "", channel: null, url: "https://www.instagram.com/p/DX_iAPnxiEM/" }),
    ).toBe("https://www.instagram.com/p/DX_iAPnxiEM/embed");
  });

  it("인스타그램 릴스 링크도 embed 주소로 바꾼다", () => {
    expect(
      getSourceEmbedUrl({ platform: "instagram", title: "", channel: null, url: "https://www.instagram.com/reel/DX_iAPnxiEM/" }),
    ).toBe("https://www.instagram.com/reel/DX_iAPnxiEM/embed");
  });

  it("web 출처는 원본이 아니라 대체 링크라 다루지 않는다", () => {
    expect(
      getSourceEmbedUrl({ platform: "web", title: "", channel: null, url: "https://example.com/camp" }),
    ).toBeNull();
  });

  it("예상한 URL 패턴이 아니면 null을 돌려준다", () => {
    expect(
      getSourceEmbedUrl({ platform: "youtube", title: "", channel: null, url: "https://www.youtube.com/" }),
    ).toBeNull();
  });
});

describe("getCampsiteThumbnailUrl", () => {
  it("유튜브 출처는 영상 썸네일 주소를 돌려준다", () => {
    expect(
      getCampsiteThumbnailUrl({ platform: "youtube", title: "", channel: null, url: "https://www.youtube.com/watch?v=OT3Tyb0qeaY" }),
    ).toBe("https://img.youtube.com/vi/OT3Tyb0qeaY/hqdefault.jpg");
  });

  it("인스타그램 출처는 null을 돌려준다", () => {
    expect(
      getCampsiteThumbnailUrl({ platform: "instagram", title: "", channel: null, url: "https://www.instagram.com/p/DX_iAPnxiEM/" }),
    ).toBeNull();
  });

  it("web 출처는 null을 돌려준다", () => {
    expect(
      getCampsiteThumbnailUrl({ platform: "web", title: "", channel: null, url: "https://example.com/camp" }),
    ).toBeNull();
  });
});
