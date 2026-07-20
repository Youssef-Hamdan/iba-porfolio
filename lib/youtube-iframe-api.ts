/** Loads youtube.com/iframe_api once; resolves when `YT.Player` is available. */

export type YTPlayerInstance = {
  playVideo: () => void
  pauseVideo: () => void
  stopVideo: () => void
  mute: () => void
  unMute: () => void
  setVolume: (volume: number) => void
  getCurrentTime: () => number
  getDuration: () => number
  getPlayerState: () => number
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void
  unloadModule: (module: string) => void
  setOption: (module: string, option: string, value: unknown) => void
  destroy: () => void
}

type YTNamespace = {
  Player: new (
    container: HTMLElement | string,
    options: Record<string, unknown>
  ) => unknown
}

declare global {
  interface Window {
    YT?: YTNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

const waiters: Array<() => void> = []

function drainWaiters() {
  waiters.splice(0, waiters.length).forEach((w) => w())
}

function installGlobalReadyHandlerOnce() {
  const w = window as unknown as { __ytReadyHook?: boolean }
  if (w.__ytReadyHook) return
  w.__ytReadyHook = true
  const prev = window.onYouTubeIframeAPIReady
  window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady() {
    prev?.()
    drainWaiters()
  }
}

function injectScriptOnce() {
  const w = window as unknown as { __ytScriptTag?: boolean }
  if (w.__ytScriptTag) return
  w.__ytScriptTag = true
  const tag = document.createElement("script")
  tag.src = "https://www.youtube.com/iframe_api"
  const first = document.getElementsByTagName("script")[0]
  first.parentNode!.insertBefore(tag, first)
}

export function loadYoutubeIframeAPI(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve()
  if (window.YT?.Player) return Promise.resolve()

  return new Promise((resolve) => {
    waiters.push(resolve)
    installGlobalReadyHandlerOnce()
    injectScriptOnce()
    // If the script was cached and `YT` is already there before `onYouTubeIframeAPIReady` runs again
    queueMicrotask(() => {
      if (window.YT?.Player) drainWaiters()
    })
  })
}
