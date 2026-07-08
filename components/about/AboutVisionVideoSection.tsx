"use client";

import { useEffect, useRef, useState } from "react";
import { loadYoutubeIframeAPI, type YTPlayerInstance } from "@/lib/youtube-iframe-api";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function AboutVisionVideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const playerHostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayerInstance | null>(null);

  // ---> INSERT YOUR IBA YOUTUBE VIDEO ID HERE <---
  // If you don't have one yet, it will use the factory desktop video temporarily.
  const videoId = "Ix3MqljB6Gk"; 

  useEffect(() => {
    let cancelled = false;
    if (!playerHostRef.current) return;

    const host = playerHostRef.current;
    host.replaceChildren();

    const mount = document.createElement("div");
    mount.style.width = "100%";
    mount.style.height = "100%";
    host.appendChild(mount);

    void loadYoutubeIframeAPI().then(() => {
      if (cancelled) return;
      const YT = window.YT;
      if (!YT?.Player) return;

      new YT.Player(mount, {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          mute: 1, // Must be muted to autoplay in background
          loop: 1,
          playlist: videoId, // Required by YT API to loop a single video
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (e: { target: YTPlayerInstance }) => {
            if (cancelled) return;
            playerRef.current = e.target;
            setIsPlayerReady(true);
          },
          onStateChange: (e: { data: number }) => {
            if (cancelled) return;
            // YT.PlayerState.PLAYING is 1
            if (e.data === 1) {
              setIsPlaying(true);
            } else {
              // Re-show thumbnail if it pauses or buffers heavily
              setIsPlaying(false);
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
      setIsPlayerReady(false);
    };
  }, [videoId]);

  // Handle Play/Pause based on Intersection (Scroll Visibility)
  useEffect(() => {
    if (!isPlayerReady || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0]?.isIntersecting;
        const player = playerRef.current;
        if (!player) return;

        if (isVisible) {
          player.playVideo();
        } else {
          player.pauseVideo();
        }
      },
      // Root margin triggers playback slightly before it scrolls into view
      { threshold: 0, rootMargin: "400px 0px 400px 0px" } 
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isPlayerReady]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-x-hidden border-b border-iba-sky/10 bg-background py-16 md:py-24 lg:py-28"
      aria-label="Vidéo de présentation"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 0 0, var(--iba-sky) 1px, transparent 2px)`,
          backgroundSize: "40px 40px",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto aspect-video max-w-full min-w-0 overflow-hidden bg-white border border-iba-sky/15 shadow-[0_24px_60px_-24px_rgba(40,37,97,0.25)]">
        
        {/* 1. The Thumbnail Layer */}
        <div 
          className={cn(
            "absolute inset-0 z-20 transition-opacity duration-700 ease-in-out bg-black",
            // The thumbnail only disappears once the YouTube API fires the "PLAYING" state
            isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
        >
          {/* Using standard img to match your previous code, 
              though next/image with `priority` is recommended here */}
          <img
            src="/images/iba-video-thumbnail.jpg"
            alt="IBA Vision Video Thumbnail"
            className="h-full w-full object-cover"
          />
        </div>

        {/* 2. The Video Host Layer */}
        <div
          ref={playerHostRef}
          className="relative z-10 h-full w-full pointer-events-none [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:border-0"
        />
      </div>
    </section>
  );
}