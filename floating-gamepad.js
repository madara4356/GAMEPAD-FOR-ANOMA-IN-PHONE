(() => {
    if (document.getElementById('floating-gamepad')) return;

    const gamepad = document.createElement('div');
    gamepad.id = 'floating-gamepad';
    Object.assign(gamepad.style, {
        position: 'fixed',
        bottom: '20px',
        left: '0',
        right: '0',
        display: 'flex',
        justifyContent: 'space-between',
        zIndex: '999999',
        pointerEvents: 'auto',
        userSelect: 'none',
        padding: '0 20px',
    });

    const makeButton = (label, key) => {
        const btn = document.createElement('button');
        btn.textContent = label;
        Object.assign(btn.style, {
            fontSize: '28px',
            padding: '24px',
            margin: '10px',
            borderRadius: '16px',
            border: 'none',
            background: '#fff',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            minWidth: '72px',
            touchAction: 'none',
        });

        let isHolding = false;
        let holdInterval;

        const dispatchKeyEvent = (type) => {
            const event = new KeyboardEvent(type, {
                key: key,
                code: key,
                bubbles: true,
                cancelable: true,
            });
            window.dispatchEvent(event);
        };

        const startHold = () => {
            if (isHolding) return;
            isHolding = true;
            dispatchKeyEvent('keydown');
            holdInterval = setInterval(() => dispatchKeyEvent('keydown'), 100);
        };

        const stopHold = () => {
            if (!isHolding) return;
            isHolding = false;
            clearInterval(holdInterval);
            dispatchKeyEvent('keyup');
        };

        btn.addEventListener('mousedown', startHold);
        btn.addEventListener('mouseup', stopHold);
        btn.addEventListener('mouseleave', stopHold);

        btn.addEventListener('touchstart', e => {
            e.preventDefault();
            startHold();
        }, { passive: false });

        btn.addEventListener('touchend', e => {
            e.preventDefault();
            stopHold();
        });

        return btn;
    };

    const leftPanel = document.createElement('div');
    Object.assign(leftPanel.style, {
        display: 'flex',
        flexDirection: 'column',
    });

    leftPanel.appendChild(makeButton('␣', ' '));
    leftPanel.appendChild(makeButton('⏎', 'Enter'));

    const rightPanel = document.createElement('div');
    Object.assign(rightPanel.style, {
        display: 'grid',
        gridTemplateAreas: `
            ".    up    ."
            "left none right"
            ".   down   ."
        `,
        gap: '10px',
    });

    const arrows = [
        { area: 'up', label: '↑', key: 'ArrowUp' },
        { area: 'left', label: '←', key: 'ArrowLeft' },
        { area: 'right', label: '→', key: 'ArrowRight' },
        { area: 'down', label: '↓', key: 'ArrowDown' },
    ];

    arrows.forEach(({ area, label, key }) => {
        const btn = makeButton(label, key);
        btn.style.gridArea = area;
        rightPanel.appendChild(btn);
    });

    gamepad.appendChild(leftPanel);
    gamepad.appendChild(rightPanel);
    document.body.appendChild(gamepad);

    console.log('✅ Floating Gamepad loaded');
})();
