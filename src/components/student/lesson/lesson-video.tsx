"use client";

import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

interface LessonVideoProps {
  lesson: any;
}

export function LessonVideo({ lesson }: LessonVideoProps) {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const initPlayer = async () => {
      if (!lesson.videoUrl || !videoContainerRef.current) return;

      videoContainerRef.current.innerHTML = "";

      // Bikin elemen <video-js> baru
      const videoElement = document.createElement("video-js");
      videoElement.className =
        "vjs-big-play-centered vjs-theme-city w-full h-full object-cover";
      videoContainerRef.current.appendChild(videoElement);

      let srcObj: any = { src: lesson.videoUrl, type: "video/mp4" };
      if (
        lesson.videoUrl.includes("youtube.com") ||
        lesson.videoUrl.includes("youtu.be")
      ) {
        // YouTube plugin butuh global window.videojs
        if (typeof window !== "undefined") {
          (window as any).videojs = videojs;
        }
        await import("videojs-youtube");
        srcObj = { src: lesson.videoUrl, type: "video/youtube" };
      }

      const player = videojs(videoElement, {
        controls: true,
        fluid: true,
        responsive: true,
        sources: [srcObj],
        youtube: {
          ytControls: 0,
          iv_load_policy: 3,
        },
      });

      playerRef.current = player;
    };
    initPlayer();

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [lesson.videoUrl]);

  return (
    <div className="bg-card border rounded-xl p-4 md:p-6 shadow-sm">
      {lesson.videoUrl ? (
        <div
          data-vjs-player
          className="w-full aspect-video rounded-lg overflow-hidden bg-black"
        >
          <div ref={videoContainerRef} className="w-full h-full" />
        </div>
      ) : (
        <div className="w-full h-64 flex items-center justify-center text-muted-foreground bg-muted/20 rounded-xl border-2 border-dashed">
          Video belum tersedia
        </div>
      )}
    </div>
  );
}
