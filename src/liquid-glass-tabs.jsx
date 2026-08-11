import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import LiquidGlass from 'liquid-glass-react';

const HOME_GAP = 4;
const GLASS_Z = 110;
const STICKY_TOP = 8;
const GLASS_PADDING = '4px';

const GLASS_PROPS = {
  elasticity: 0,
  displacementScale: 100,
  blurAmount: 0.5,
  saturation: 140,
  aberrationIntensity: 2,
  cornerRadius: 9999,
  overLight: false,
  mode: 'standard',
};

const PANEL_GLASS_PROPS = {
  elasticity: 0,
  displacementScale: 44,
  blurAmount: 0.62,
  saturation: 132,
  aberrationIntensity: 0,
  cornerRadius: 32,
  overLight: true,
  mode: 'standard',
};

const PANEL_GLASS_PADDING = '6px';

const BACKDROP_GLASS_PROPS = {
  elasticity: 0,
  displacementScale: 36,
  blurAmount: 0.88,
  saturation: 128,
  aberrationIntensity: 0,
  cornerRadius: 0,
  overLight: true,
  mode: 'standard',
};

const PORTAL_STYLE = {
  position: 'fixed',
  transition: 'none',
  willChange: 'top, left',
};

function HomeLink() {
  return (
    <a href="index.html" className="m3-home-glass-btn" aria-label="All projects">
      <span className="material-symbols-rounded google-symbols notranslate" aria-hidden="true">
        home
      </span>
    </a>
  );
}

function applyPortalBox(rootEl, box) {
  if (!rootEl || !box) return;
  rootEl.style.top = `${box.centerY}px`;
  rootEl.style.left = `${box.centerX}px`;
  rootEl.style.width = `${box.width}px`;
}

function GlassShell({
  className,
  stuck,
  box,
  shellClassName,
  shellProps,
  children,
  mouseContainer,
  glassProps,
  padding,
}) {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    containerRef.current =
      mouseContainer ||
      document.querySelector('.case-study.cs-m3-docs') ||
      document.body;
  }, [mouseContainer]);

  const shell = (
    <div
      className={`m3-glass-shell-wrap${stuck ? ' is-portal' : ''} ${shellClassName || ''}`.trim()}
      {...shellProps}
    >
      <LiquidGlass
        mouseContainer={containerRef}
        padding={padding || GLASS_PADDING}
        className={className}
        style={
          stuck && box
            ? {
                ...PORTAL_STYLE,
                top: box.centerY,
                left: box.centerX,
                width: box.width,
                zIndex: GLASS_Z,
              }
            : {
                position: 'relative',
                top: 'auto',
                left: 'auto',
                transform: 'none',
                width: 'auto',
                transition: 'none',
              }
        }
        {...(glassProps || GLASS_PROPS)}
      >
        {children}
      </LiquidGlass>
    </div>
  );

  if (stuck && box) {
    return createPortal(shell, document.body);
  }

  return shell;
}

function measureHome() {
  const home =
    document.querySelector('.m3-home-glass-shell .liquid-glass-react-home .glass') ||
    document.querySelector('.m3-home-glass-shell .liquid-glass-react-home');
  if (!home) return null;
  const rect = home.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return null;
  return {
    width: rect.width,
    height: rect.height,
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2,
  };
}

function measureTrack() {
  const track =
    document.querySelector('.m3-tabs-glass-shell .liquid-glass-react-track .glass') ||
    document.querySelector('.m3-tabs-glass-shell .liquid-glass-react-track');
  if (!track) return null;
  const rect = track.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return null;
  return {
    width: rect.width,
    height: rect.height,
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2,
  };
}

function rowBoxes(cachedHome, cachedTrack) {
  const row = document.querySelector('.m3-docs-tab-row');
  if (!row || !cachedHome || !cachedTrack) {
    return { home: cachedHome, track: cachedTrack };
  }

  const rowRect = row.getBoundingClientRect();
  const centerY = rowRect.top + rowRect.height / 2;
  const trackLeft = rowRect.left + cachedHome.width + HOME_GAP;

  return {
    home: {
      width: cachedHome.width,
      height: cachedHome.height,
      centerX: rowRect.left + cachedHome.width / 2,
      centerY,
    },
    track: {
      width: cachedTrack.width,
      height: cachedTrack.height,
      centerX: trackLeft + cachedTrack.width / 2,
      centerY,
    },
  };
}

function TabsMount({ tabsEl, active }) {
  const ref = useCallback(
    (node) => {
      if (!node || !active) return;
      if (tabsEl.parentNode !== node) {
        node.replaceChildren(tabsEl);
      }
    },
    [tabsEl, active]
  );

  if (!active) return null;
  return <div ref={ref} className="tabbed-navigation-inner tabbed-navigation-inner--tabs" />;
}

function TabRowGlass({ tabsEl }) {
  const cachedHomeRef = useRef(null);
  const cachedTrackRef = useRef(null);
  const portaledRef = useRef(false);
  const stuckRef = useRef(false);
  const [portaled, setPortaled] = useState(false);
  const [layoutBoxes, setLayoutBoxes] = useState(null);

  useLayoutEffect(() => {
    if (portaledRef.current) return;
    const home = measureHome();
    const track = measureTrack();
    if (home && track) {
      cachedHomeRef.current = home;
      cachedTrackRef.current = track;
      const boxes = rowBoxes(home, track);
      setLayoutBoxes(boxes);
      portaledRef.current = true;
      setPortaled(true);
    }
  });

  useEffect(() => {
    const bar = document.querySelector('.m3-docs-tabs-bar');
    if (!bar) return;

    let ticking = false;
    function update() {
      const stuck = bar.getBoundingClientRect().top <= STICKY_TOP + 0.5;

      if (stuck !== stuckRef.current) {
        stuckRef.current = stuck;
        if (typeof window.refreshArticleTabScrollSpy === 'function') {
          window.refreshArticleTabScrollSpy();
        }
      }

      bar.classList.toggle('is-stuck', stuck);

      if (portaledRef.current && cachedHomeRef.current && cachedTrackRef.current) {
        const boxes = rowBoxes(cachedHomeRef.current, cachedTrackRef.current);
        const homeEl = document.querySelector(
          '.m3-home-glass-shell.is-portal .liquid-glass-react-home'
        );
        const trackEl = document.querySelector(
          '.m3-tabs-glass-shell.is-portal .liquid-glass-react-track'
        );
        applyPortalBox(homeEl, boxes.home);
        applyPortalBox(trackEl, boxes.track);
      } else if (!portaledRef.current) {
        const home = measureHome();
        const track = measureTrack();
        if (home) cachedHomeRef.current = home;
        if (track) cachedTrackRef.current = track;
      }

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useLayoutEffect(() => {
    const mount = document.querySelector('.m3-tabs-glass-shell .tabbed-navigation-inner--tabs');
    if (mount && tabsEl.parentNode !== mount) {
      mount.replaceChildren(tabsEl);
    }
  }, [portaled, tabsEl]);

  const homeShell = (
    <GlassShell
      className="liquid-glass-react-home"
      shellClassName="m3-home-glass-shell"
      stuck={portaled}
      box={portaled ? layoutBoxes?.home : null}
    >
      <HomeLink />
    </GlassShell>
  );

  const trackShell = (
    <GlassShell
      className="liquid-glass-react-track"
      shellClassName="m3-tabs-glass-shell tabbed-navigation liquid-glass-track"
      shellProps={{ role: 'tablist' }}
      stuck={portaled}
      box={portaled ? layoutBoxes?.track : null}
    >
      <TabsMount tabsEl={tabsEl} active />
    </GlassShell>
  );

  return (
    <div className="m3-docs-tab-row">
      {portaled && layoutBoxes?.home ? (
        <div
          className="liquid-glass-layout-spacer m3-home-glass-spacer"
          style={{
            width: layoutBoxes.home.width,
            height: layoutBoxes.home.height,
            flexShrink: 0,
          }}
          aria-hidden="true"
        />
      ) : (
        homeShell
      )}

      {portaled && layoutBoxes?.track ? (
        <div
          className="liquid-glass-layout-spacer m3-tabs-glass-spacer"
          style={{
            width: layoutBoxes.track.width,
            height: layoutBoxes.track.height,
            flexShrink: 0,
          }}
          aria-hidden="true"
        />
      ) : (
        trackShell
      )}

      {portaled && layoutBoxes?.home ? homeShell : null}
      {portaled && layoutBoxes?.track ? trackShell : null}
    </div>
  );
}

function initLiquidGlassTabs() {
  try {
    const container = document.querySelector('.m3-docs-tabs-bar .navigation-container');
    const track = container?.querySelector('.tabbed-navigation');
    if (!container || !track || container.dataset.lgReact === '1') return;

    const tabsEl = document.createElement('div');
    while (track.firstChild) {
      tabsEl.appendChild(track.firstChild);
    }

    container.dataset.lgReact = '1';
    container.innerHTML = '';

    createRoot(container).render(<TabRowGlass tabsEl={tabsEl} />);

    requestAnimationFrame(function () {
      if (typeof window.refreshArticleTabScrollSpy === 'function') {
        window.refreshArticleTabScrollSpy();
      }
    });
  } catch (err) {
    console.error('[liquid-glass-tabs] init failed:', err);
  }
}

function PasswordPanelHost({ panelEl }) {
  const ref = useCallback(
    (node) => {
      if (!node || !panelEl) return;
      if (panelEl.parentNode !== node) {
        node.appendChild(panelEl);
      }
    },
    [panelEl]
  );

  return <div ref={ref} className="pw-panel-inner-host" />;
}

function PasswordPanelGlass({ panelEl }) {
  const [mouseContainer, setMouseContainer] = useState(null);

  useLayoutEffect(() => {
    setMouseContainer(document.querySelector('#pw-overlay') || document.body);
  }, []);

  if (!mouseContainer) return null;

  return (
    <GlassShell
      className="liquid-glass-react-pw-panel"
      shellClassName="pw-password-glass-shell"
      shellProps={{ role: 'presentation' }}
      mouseContainer={mouseContainer}
      glassProps={PANEL_GLASS_PROPS}
      padding={PANEL_GLASS_PADDING}
    >
      <PasswordPanelHost panelEl={panelEl} />
    </GlassShell>
  );
}

function PasswordBackdropGlass() {
  const [mouseContainer, setMouseContainer] = useState(null);

  useLayoutEffect(() => {
    setMouseContainer(document.querySelector('#pw-overlay') || document.body);
  }, []);

  if (!mouseContainer) return null;

  return (
    <GlassShell
      className="liquid-glass-react-pw-backdrop"
      shellClassName="pw-backdrop-glass-shell"
      shellProps={{ role: 'presentation' }}
      mouseContainer={mouseContainer}
      glassProps={BACKDROP_GLASS_PROPS}
      padding="0"
    >
      <div className="pw-backdrop-glass-fill" aria-hidden="true" />
    </GlassShell>
  );
}

function initLiquidGlassBackdrop() {
  try {
    const mount = document.querySelector('#pw-glass-backdrop-mount');
    if (!mount || mount.dataset.lgPwBackdrop === '1') return;

    mount.dataset.lgPwBackdrop = '1';
    createRoot(mount).render(<PasswordBackdropGlass />);
  } catch (err) {
    console.error('[liquid-glass-pw-backdrop] init failed:', err);
  }
}

/* Password wall uses the static soft card in auth.js — liquid-glass remount
   caused a late width jump (~1s after open). Keep this as a no-op for callers. */
function initLiquidGlassPassword() {
  return;
}

function initAll() {
  initLiquidGlassTabs();
}

window.initLiquidGlassPassword = initLiquidGlassPassword;
window.focusPwInput = function () {
  var input = document.getElementById('pw-input');
  if (!input) return;
  try {
    input.focus({ preventScroll: true });
  } catch (e) {
    input.focus();
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}
