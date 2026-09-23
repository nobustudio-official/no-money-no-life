/* =========================================================
   battle-effect.js
   戦闘エフェクト共通エンジン

   役割：
   ・攻撃エフェクト画像の生成
   ・攻撃者→対象の座標計算
   ・projectile / bottomRise / topDrop / burst / slash / beam
   ・命中時のリアクション
   ・将来のエフェクト追加に対応

   ※ 現時点では既存の戦闘処理へ接続しません。
========================================================= */

(function () {

    "use strict";

    const MOTION_DEFAULTS = {
        duration: 500,
        size: 140
    };


    function wait(ms) {

        return new Promise(function (resolve) {

            setTimeout(resolve, ms);

        });

    }


    function getCenter(element) {

        const rect =
            element.getBoundingClientRect();

        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };

    }


    function createEffectElement(effect) {

        const element =
            document.createElement("img");

        element.className =
            "battle-effect";

        element.src =
            effect.image;

        element.alt =
            "";

        element.draggable =
            false;

        element.style.width =
            `${effect.size}px`;

        element.style.position =
            "fixed";

        element.style.pointerEvents =
            "none";

        element.style.zIndex =
            "30000";

        return element;

    }


    function removeEffect(element) {

        if (element && element.parentNode) {

            element.remove();

        }

    }


    async function playProjectile(
        element,
        attacker,
        target,
        duration
    ) {

        const start =
            getCenter(attacker);

        const end =
            getCenter(target);

        const startX =
            start.x -
            element.offsetWidth / 2;

        const startY =
            start.y -
            element.offsetHeight / 2;

        const endX =
            end.x -
            element.offsetWidth / 2;

        const endY =
            end.y -
            element.offsetHeight / 2;

        element.style.left =
            `${startX}px`;

        element.style.top =
            `${startY}px`;

        await wait(20);

        element.animate(
            [
                {
                    transform:
                        "translate(0, 0) scale(.7)",
                    opacity:
                        0
                },
                {
                    transform:
                        "translate(0, 0) scale(1)",
                    opacity:
                        1
                },
                {
                    transform:
                        `translate(${endX - startX}px, ${endY - startY}px) scale(1.1)`,
                    opacity:
                        1
                }
            ],
            {
                duration,
                easing: "cubic-bezier(.2,.8,.2,1)",
                fill: "forwards"
            }
        );

        await wait(duration);

    }


    async function playBottomRise(
        element,
        target,
        duration
    ) {

        const center =
            getCenter(target);

        element.style.left =
            `${center.x - element.offsetWidth / 2}px`;

        element.style.top =
            `${center.y + target.getBoundingClientRect().height / 2}px`;

        element.animate(
            [
                {
                    transform:
                        "translateY(120px) scale(.7)",
                    opacity:
                        0
                },
                {
                    transform:
                        "translateY(0) scale(1)",
                    opacity:
                        1
                },
                {
                    transform:
                        "translateY(-20px) scale(1.1)",
                    opacity:
                        1
                }
            ],
            {
                duration,
                easing: "cubic-bezier(.15,.8,.25,1)",
                fill: "forwards"
            }
        );

        await wait(duration);

    }


    async function playTopDrop(
        element,
        target,
        duration
    ) {

        const center =
            getCenter(target);

        element.style.left =
            `${center.x - element.offsetWidth / 2}px`;

        element.style.top =
            `${center.y - 220}px`;

        element.animate(
            [
                {
                    transform:
                        "translateY(-80px) scale(.7)",
                    opacity:
                        0
                },
                {
                    transform:
                        "translateY(0) scale(1)",
                    opacity:
                        1
                },
                {
                    transform:
                        "translateY(20px) scale(1.1)",
                    opacity:
                        1
                }
            ],
            {
                duration,
                easing: "cubic-bezier(.15,.8,.25,1)",
                fill: "forwards"
            }
        );

        await wait(duration);

    }


    async function playBurst(
        element,
        target,
        duration
    ) {

        const center =
            getCenter(target);

        element.style.left =
            `${center.x - element.offsetWidth / 2}px`;

        element.style.top =
            `${center.y - element.offsetHeight / 2}px`;

        element.animate(
            [
                {
                    transform:
                        "scale(.15)",
                    opacity:
                        0
                },
                {
                    transform:
                        "scale(1)",
                    opacity:
                        1
                },
                {
                    transform:
                        "scale(1.35)",
                    opacity:
                        0
                }
            ],
            {
                duration,
                easing: "ease-out",
                fill: "forwards"
            }
        );

        await wait(duration);

    }


    async function playSlash(
        element,
        attacker,
        target,
        duration
    ) {

        const start =
            getCenter(attacker);

        const end =
            getCenter(target);

        const angle =
            Math.atan2(
                end.y - start.y,
                end.x - start.x
            ) *
            180 /
            Math.PI;

        element.style.left =
            `${end.x - element.offsetWidth / 2}px`;

        element.style.top =
            `${end.y - element.offsetHeight / 2}px`;

        element.animate(
            [
                {
                    transform:
                        `rotate(${angle - 35}deg) scaleX(.2)`,
                    opacity:
                        0
                },
                {
                    transform:
                        `rotate(${angle}deg) scaleX(1.1)`,
                    opacity:
                        1
                },
                {
                    transform:
                        `rotate(${angle + 20}deg) scaleX(1.2)`,
                    opacity:
                        0
                }
            ],
            {
                duration,
                easing: "ease-out",
                fill: "forwards"
            }
        );

        await wait(duration);

    }


    async function playBeam(
        element,
        attacker,
        target,
        duration
    ) {

        const start =
            getCenter(attacker);

        const end =
            getCenter(target);

        const dx =
            end.x - start.x;

        const dy =
            end.y - start.y;

        const length =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        const angle =
            Math.atan2(dy, dx) *
            180 /
            Math.PI;

        element.style.left =
            `${start.x}px`;

        element.style.top =
            `${start.y - element.offsetHeight / 2}px`;

        element.style.width =
            `${length}px`;

        element.style.transformOrigin =
            "left center";

        element.animate(
            [
                {
                    transform:
                        `rotate(${angle}deg) scaleX(0)`,
                    opacity:
                        0
                },
                {
                    transform:
                        `rotate(${angle}deg) scaleX(1)`,
                    opacity:
                        1
                },
                {
                    transform:
                        `rotate(${angle}deg) scaleX(1)`,
                    opacity:
                        0
                }
            ],
            {
                duration,
                easing: "ease-out",
                fill: "forwards"
            }
        );

        await wait(duration);

    }


    async function playDamageReaction(
        target
    ) {

        if (!target) {
            return;
        }

        target.classList.add(
            "battle-damage-shake"
        );

        await wait(180);

        target.classList.remove(
            "battle-damage-shake"
        );

    }


    async function playHitEffect(
        target,
        effect
    ) {

        if (!effect || !effect.hitImage) {
            return;
        }

        const hit =
            createEffectElement({
                image:
                    effect.hitImage,
                size:
                    effect.hitSize ||
                    effect.size ||
                    MOTION_DEFAULTS.size
            });

        document.body.appendChild(hit);

        const center =
            getCenter(target);

        hit.style.left =
            `${center.x - hit.offsetWidth / 2}px`;

        hit.style.top =
            `${center.y - hit.offsetHeight / 2}px`;

        hit.animate(
            [
                {
                    transform:
                        "scale(.4)",
                    opacity:
                        0
                },
                {
                    transform:
                        "scale(1)",
                    opacity:
                        1
                },
                {
                    transform:
                        "scale(1.25)",
                    opacity:
                        0
                }
            ],
            {
                duration:
                    effect.hitDuration ||
                    250,
                easing:
                    "ease-out",
                fill:
                    "forwards"
            }
        );

        await wait(
            effect.hitDuration ||
            250
        );

        removeEffect(hit);

    }


    async function play(options) {

        if (!options) {
            return;
        }

        const attacker =
            options.attacker;

        const target =
            options.target;

        const effect =
            options.effect;

        if (!target || !effect || !effect.image) {
            return;
        }

        const config = {
            ...MOTION_DEFAULTS,
            ...effect
        };

        const element =
            createEffectElement(config);

        document.body.appendChild(
            element
        );

        try {

            switch (config.motion) {

                case "bottomRise":
                    await playBottomRise(
                        element,
                        target,
                        config.duration
                    );
                    break;

                case "topDrop":
                    await playTopDrop(
                        element,
                        target,
                        config.duration
                    );
                    break;

                case "burst":
                    await playBurst(
                        element,
                        target,
                        config.duration
                    );
                    break;

                case "slash":
                    await playSlash(
                        element,
                        attacker,
                        target,
                        config.duration
                    );
                    break;

                case "beam":
                    await playBeam(
                        element,
                        attacker,
                        target,
                        config.duration
                    );
                    break;

                case "projectile":
                default:
                    await playProjectile(
                        element,
                        attacker,
                        target,
                        config.duration
                    );
                    break;

            }

        } finally {

            removeEffect(element);

        }

        await playHitEffect(
            target,
            config
        );

        if (
            config.reaction !== false
        ) {

            await playDamageReaction(
                target
            );

        }

    }


    window.BattleEffect = {
        play,
        playDamageReaction
    };

})();
