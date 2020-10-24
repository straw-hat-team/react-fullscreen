import fscreen from 'fscreen';
import * as React from 'react';

export function useFullscreen(target: React.MutableRefObject<HTMLElement>) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  function closeOtherFullscreen() {
    // If there's another element currently full screen, exit first
    if (fscreen.fullscreenElement && fscreen.fullscreenElement !== target.current) {
      fscreen.exitFullscreen();
    }
  }

  function closeFullscreen() {
    /**
     * There is a potential race condition, so better to be safe. We can't call
     * document `document.exitFullscreen()` if there is not current fullscreen
     * element active. That is why the extra checking.
     *
     * Error: Uncaught (in promise) TypeError: Document not active
     */
    if (isFullscreen && fscreen.fullscreenElement && fscreen.fullscreenElement === target.current) {
      fscreen.exitFullscreen();
    }
  }

  function openFullscreen() {
    closeOtherFullscreen();

    if (target.current) {
      fscreen.requestFullscreen(target.current);
    }
  }

  function setFullscreen(state: boolean) {
    return state ? openFullscreen() : closeFullscreen();
  }

  function toggleFullscreen() {
    setFullscreen(!isFullscreen);
  }

  React.useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(fscreen.fullscreenElement === target.current);
    }

    fscreen.addEventListener('fullscreenchange', onFullscreenChange, false);

    return () => {
      fscreen.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, [target]);

  return {
    isFullscreen,
    setFullscreen,
    toggleFullscreen,
  };
}
