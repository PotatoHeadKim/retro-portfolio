import type { RefObject } from "react";
import type { ConsoleState } from "../hooks/useGameConsole";

export default function RetroTV({
  state,
  screenRef,
}: {
  state: ConsoleState;
  screenRef: RefObject<HTMLDivElement | null>;
}) {
  const loaded =
    state.project && state.phase !== "inserting" && state.phase !== "ejecting";
  return (
    <div className="tv">
      <div className="tv-top-line" />
      <div className="tv-bezel">
        <div
          ref={screenRef}
          className={`crt-screen ${state.phase === "booting" ? "booting" : ""}`}
        >
          <div className="crt-content">
            <span className="screen-kicker">POTATOHEADKIM</span>
            <div className="pixel-mark" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <h2>
              PROJECT
              <br />
              SYSTEM<span className="screen-cursor">_</span>
            </h2>
            <span className="screen-rule" />
            <p className="screen-status">
              {loaded ? "CARTRIDGE LOADED" : "NO CARTRIDGE"}
            </p>
            <p className="screen-prompt">
              {loaded ? "PRESS START" : "INSERT TO START"}
            </p>
            {loaded && (
              <span className="screen-loaded-title">
                {state.project?.title}
              </span>
            )}
          </div>
          <div className="crt-glass" />
        </div>
      </div>
      <div className="tv-controls" aria-hidden="true">
        <span className="tv-control-label">CHANNEL</span>
        <div className="dial dial-one" />
        <span className="tv-control-label second-label">VOLUME</span>
        <div className="dial dial-two" />
        <div className="speaker" />
        <div className="tv-power">
          <i />
          POWER
        </div>
      </div>
      <div className="tv-brand">
        POTATO<span>VISION</span>
      </div>
      <div className="tv-model">COLOR MONITOR · 1989</div>
      <div className="tv-foot foot-left" />
      <div className="tv-foot foot-right" />
    </div>
  );
}
